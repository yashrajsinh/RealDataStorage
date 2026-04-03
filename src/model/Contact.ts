import Realm from 'realm';

export class Contact extends Realm.Object<Contact> {
  _id!: Realm.BSON.ObjectId;
  profileImageUrl!: string;
  deviceContactId?: string; // for local device storage
  firstName!: string;
  lastName!: string;
  phone!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Contact',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      deviceContactId: 'string?',
      profileImageUrl: 'string',
      firstName: 'string',
      lastName: 'string',
      phone: 'string',
    },
  };
}
