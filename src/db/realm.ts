import Realm from 'realm';
import { Contact } from '../model/Contact';
//BSON reference
import { BSON } from 'realm';

//func to assign schema
export const getRealm = async () => {
  return await Realm.open({
    schema: [Contact],
    deleteRealmIfMigrationNeeded: true,
  });
};

//function to enter new contact in db
type ContactInput = {
  firstName: string;
  lastName: string;
  phone: string;
};
export const addContact = (realM: Realm, data: ContactInput) => {
  //radnom image genrator
  const random = Math.floor(Math.random() * 100);
  const avatar = `https://randomuser.me/api/portraits/men/${random}.jpg`;
  //write it in DB
  realM.write(() => {
    realM.create('Contact', {
      _id: new BSON.ObjectId(),
      profileImageUrl: avatar,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });
  });
};
//delete function
export const deleteContact = (realM: Realm, contactId: BSON.ObjectId) => {
  realM.write(() => {
    const contact = realM.objectForPrimaryKey('Contact', contactId);
    //if contact exists delete
    if (contact) {
      realM.delete(contact);
    }
  });
};

//edit function to edit the field
type UpdateContactInput = {
  firstName?: string;
  lastName?: string;
};
export const editContact = (
  realM: Realm,
  id: BSON.ObjectId,
  data: UpdateContactInput,
) => {
  realM.write(() => {
    const contact = realM.objectForPrimaryKey('Contact', id);
    if (!contact) return;
    //update only fields thats passed
    if (data.firstName !== undefined) {
      contact.firstName = data.firstName;
    }
    if (data.lastName !== undefined) {
      contact.lastName = data.lastName;
    }
  });
};
