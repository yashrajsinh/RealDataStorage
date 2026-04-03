import Contacts from 'react-native-contacts';
import { Contact } from '../model/Contact';
import Realm from 'realm';
//BSON reference
import { BSON } from 'realm';

//helper
const normalizePhone = (phone: string) => {
  return phone.replace(/\D/g, '');
};

export const getDeviceContacts = async (realm: Realm) => {
  try {
    const deviceContacts = await Contacts.getAll();

    const deviceMap = new Map();

    deviceContacts.forEach(contact => {
      const rawPhone = contact.phoneNumbers[0]?.number;
      if (!rawPhone) return;

      const phone = normalizePhone(rawPhone);

      deviceMap.set(phone, {
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
      const realmContacts = realm.objects<Contact>('Contact');

      // DELETE
      realmContacts.forEach(rc => {
        const normalized = normalizePhone(rc.phone);
        if (!deviceMap.has(normalized)) {
          realm.delete(rc);
        }
      });

      // ADD + UPDATE
      deviceMap.forEach(dc => {
        const existing = realm
          .objects<Contact>('Contact')
          .filtered('phone == $0', dc.phone)[0];

        if (existing) {
          existing.firstName = dc.firstName;
          existing.lastName = dc.lastName;

          if (!existing.profileImageUrl) {
            existing.profileImageUrl = dc.profileImageUrl;
          }
        } else {
          const random = Math.floor(Math.random() * 100);
          const fallbackAvatar = `https://randomuser.me/api/portraits/men/${random}.jpg`;

          realm.create<Contact>('Contact', {
            _id: new BSON.ObjectId(),
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

//function to add contacts to local device contacts
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
  return await Contacts.addContact(newContact);
};
