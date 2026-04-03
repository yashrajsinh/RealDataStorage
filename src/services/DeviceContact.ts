import Contacts from 'react-native-contacts';
import { addContact } from '../db/realm';
import Realm from 'realm';

export const getDeviceContacts = async (realm: Realm) => {
  const permission = await Contacts.requestPermission();

  if (permission != 'authorized') return;

  const deviceContacts = await Contacts.getAll();

  deviceContacts.forEach(contact => {
    const firstName = contact.givenName || '';
    const lastName = contact.familyName || '';
    const phone = contact.phoneNumbers[0]?.number || '';
    //dont add exiting contact again (avoids duplicates)
    const existing = realm.objects('Contact').filtered('phone == $0', phone);
    if (existing.length === 0) {
      addContact(realm, { firstName, lastName, phone });
    }
  });

  return [];
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
