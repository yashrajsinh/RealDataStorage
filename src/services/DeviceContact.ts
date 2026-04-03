import Contacts from 'react-native-contacts';
import { Contact } from '../model/Contact';
import Realm, { BSON } from 'realm';

const normalizePhone = (phone: string) => {
  return phone.replace(/\D/g, '');
};

export const getDeviceContacts = async (realm: Realm) => {
  try {
    const deviceContacts = await Contacts.getAll();

    const deviceMap = new Map<
      string,
      {
        deviceContactId: string;
        firstName: string;
        lastName: string;
        phone: string;
        profileImageUrl: string;
      }
    >();

    // =====================
    // BUILD DEVICE MAP (KEY = recordID)
    // =====================
    deviceContacts.forEach(contact => {
      if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) return;

      const rawPhone = contact.phoneNumbers[0].number;
      if (!rawPhone) return;

      const phone = normalizePhone(rawPhone);

      deviceMap.set(contact.recordID, {
        deviceContactId: contact.recordID,
        firstName: contact.givenName || '',
        lastName: contact.familyName || '',
        phone,
        profileImageUrl:
          contact.hasThumbnail && contact.thumbnailPath
            ? contact.thumbnailPath
            : '',
      });
    });

    realm.write(() => {
      const realmContacts = [...realm.objects<Contact>('Contact')];

      // =====================
      // DELETE (SAFE)
      // =====================
      const toDelete: Contact[] = [];

      realmContacts.forEach(rc => {
        if (!rc.isValid()) return;

        if (rc.deviceContactId) {
          if (!deviceMap.has(rc.deviceContactId)) {
            toDelete.push(rc);
          }
        } else {
          // fallback for old local contacts (no device ID)
          const normalized = normalizePhone(rc.phone);

          const exists = Array.from(deviceMap.values()).some(
            dc => dc.phone === normalized,
          );

          if (!exists) {
            toDelete.push(rc);
          }
        }
      });

      toDelete.forEach(item => {
        if (item.isValid()) {
          realm.delete(item);
        }
      });

      // =====================
      // ADD + UPDATE
      // =====================
      deviceMap.forEach(dc => {
        const existing =
          realm
            .objects<Contact>('Contact')
            .filtered('deviceContactId == $0', dc.deviceContactId)[0] ||
          realm
            .objects<Contact>('Contact')
            .filtered('phone == $0', dc.phone)[0];

        if (existing && existing.isValid()) {
          // UPDATE ALL FIELDS
          existing.firstName = dc.firstName;
          existing.lastName = dc.lastName;

          if (existing.phone !== dc.phone) {
            existing.phone = dc.phone; // phone number
          }

          if (!existing.deviceContactId) {
            existing.deviceContactId = dc.deviceContactId;
          }

          if (!existing.profileImageUrl && dc.profileImageUrl) {
            existing.profileImageUrl = dc.profileImageUrl;
          }
        } else {
          const random = Math.floor(Math.random() * 70);
          const fallbackAvatar = `https://i.pravatar.cc/200?img=${random}`;

          realm.create<Contact>('Contact', {
            _id: new BSON.ObjectId(),
            deviceContactId: dc.deviceContactId,
            firstName: dc.firstName,
            lastName: dc.lastName,
            phone: dc.phone,
            profileImageUrl: dc.profileImageUrl || fallbackAvatar,
          });
        }
      });
    });
  } catch (error) {
    console.log('Error fetching device contacts:', error);
  }
};

// =====================
// ADD TO DEVICE
// =====================
export const addToDeviceContacts = async ({
  firstName,
  lastName,
  phone,
}: {
  firstName: string;
  lastName: string;
  phone: string;
}) => {
  const newContact = {
    givenName: firstName,
    familyName: lastName,
    phoneNumbers: [
      {
        label: 'mobile',
        number: phone,
      },
    ],
  };

  return await Contacts.addContact(newContact); // returns recordID
};
