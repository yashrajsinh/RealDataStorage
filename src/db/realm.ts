import Realm from 'realm';
import { Contact } from '../model/Contact';

export const getRealm = async () => {
  return await Realm.open({
    schema: [Contact],
    deleteRealmIfMigrationNeeded: true,
  });
};
