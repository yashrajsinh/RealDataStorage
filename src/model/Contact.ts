import Realm from 'realm';

export class Contact extends Realm.Object<Contact> {
  _id!: Realm.BSON.ObjectId;
  profileImageUrl!: string;
  firstName!: string;
  lastName!: string;
  phone!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Contact',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      profileImageUrl: 'string',
      firstName: 'string',
      lastName: 'string',
      phone: 'string',
    },
  };
}
