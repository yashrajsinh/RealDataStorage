import { View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
//realM
import Realm from 'realm';
//model
import { Contact } from '../model/Contact';
//db
import { getRealm } from '../db/realm';
//components
import ContactCard from '../components/ContactCard/ContactCard';
import InputContact from '../components/InputContactCard/InputContact';
//data func
import { fetchContact } from '../data/ContactsData';
import FloatingButton from '../components/FloatingButton/FloatingButton';

type Props = {};

const HomeScreen = (props: Props) => {
  //contact obj
  const [contacts, setContacts] = useState<Contact[]>([]);
  //useState to show and hide add model
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    let realm: Realm;
    let data: Realm.Results<Contact>;

    const loadData = async () => {
      try {
        realm = await getRealm();

        // seed / insert initial data
        fetchContact(realm);

        // get data
        data = realm.objects<Contact>('Contact');

        setContacts([...data]);
      } catch (e) {
        console.debug(e);
      }

      //  live updates
      data.addListener(() => {
        setContacts([...data]);
      });
    };

    loadData();

    return () => {
      //  cleanup listener
      if (data) {
        data.removeAllListeners();
      }

      // close realm
      if (realm) {
        realm.close();
      }
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={contacts}
        keyExtractor={item => item._id.toHexString()}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onPress={contact => console.log('Open', contact)}
            onCallPress={contact => console.log('Call', contact)}
          />
        )}
      />
      {showInput && (
        <InputContact
          onAdd={() => {
            console.debug('add');
            setShowInput(!showInput);
          }}
          onCancel={() => {
            setShowInput(false);
          }}
        />
      )}
      <FloatingButton onPress={() => setShowInput(!showInput)} />
    </View>
  );
};

export default HomeScreen;
