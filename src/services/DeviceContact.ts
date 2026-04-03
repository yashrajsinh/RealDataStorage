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
    addContact(realm, { firstName, lastName, phone });
  });

  return [];
};
