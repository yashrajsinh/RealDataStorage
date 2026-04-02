import Realm from 'realm';
import { Contact } from '../model/Contact';
type ContactInput = {
  firstName: string;
  lastName: string;
  phone: string;
};

//BSON reference
import { BSON } from 'realm';

export const getRealm = async () => {
  return await Realm.open({
    schema: [Contact],
    deleteRealmIfMigrationNeeded: true,
  });
};
//function to enter new contact in db
export const addContact = (realM: Realm, data: ContactInput) => {
  //radnom image genrator
  const randomImage = `https://i.pravatar.cc/200?img=${Math.floor(
    Math.random() * 70,
  )}`;
  //write it in DB
  realM.write(() => {
    realM.create('Contact', {
      _id: new BSON.ObjectId(),
      profileImageUrl: randomImage,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });
  });
};
