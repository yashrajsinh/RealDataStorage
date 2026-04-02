import { View, FlatList, Alert, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
//realM
import Realm from 'realm';
//model
import { Contact } from '../model/Contact';
//db
import { addContact, deleteContact, getRealm, editContact } from '../db/realm';
//components
import ContactCard from '../components/ContactCard/ContactCard';
import InputContact from '../components/InputContactCard/InputContact';
import FloatingButton from '../components/FloatingButton/FloatingButton';
//data func
import { fetchContact } from '../data/ContactsData';
//Edit component
import EditModal from '../components/EditModel/EditModel';
//Toast
import Toast from 'react-native-toast-message';
//BSON reference
import { BSON } from 'realm';

type Props = {};

const HomeScreen = (props: Props) => {
  //contact obj
  const [contacts, setContacts] = useState<Contact[]>([]);
  //useState to show and hide add model
  const [showInput, setShowInput] = useState(false);
  //useState to show and hide Edit model
  const [showEditModel, setShowEditModel] = useState(false);
  //RealM state
  const [realmInstance, setRealmInstance] = useState<Realm | null>(null);
  //edit fields
  const [selectedContactId, setSelectedContactId] =
    useState<BSON.ObjectId | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    let realm: Realm;
    let data: Realm.Results<Contact>;

    const loadData = async () => {
      try {
        realm = await getRealm();
        // seed / insert initial data
        fetchContact(realm);
        //setting RealM instance for state
        setRealmInstance(realm);

        // get data
        data = realm.objects<Contact>('Contact');

        setContacts([...data]);
        showToast('success', 'Data sync sucessfully');
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

  function showToast(type: string, message: string) {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
  }

  //function to handle delete
  function handleDelete(index: number) {
    Alert.alert('Delete Contact', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Optimistic UI update first
          setContacts(prev => prev.filter((_, i) => i !== index));

          // DB delete after render
          setTimeout(() => {
            const targetId = contacts[index]?._id;
            if (realmInstance && targetId) {
              deleteContact(realmInstance, targetId);
            }
          }, 100);
          showToast('success', 'Deleted');
        },
      },
    ]);
  }

  //function to hanlde edit
  function handleEdit(contact: Contact) {
    setShowEditModel(!showEditModel);
    setSelectedContactId(contact._id);
    setFirstName(contact.firstName);
    setLastName(contact.lastName);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
      </View>
      <FlatList
        data={contacts}
        extraData={contacts}
        keyExtractor={item => item._id.toHexString()}
        renderItem={({ item, index }) => {
          if (!item.isValid()) return null; //return if delete
          return (
            <ContactCard
              contact={item}
              onPress={() => handleEdit(item)}
              onDelete={() => handleDelete(index)}
            />
          );
        }}
      />
      {showEditModel && (
        <EditModal
          visible={showEditModel}
          onCancel={() => setShowEditModel(!showEditModel)}
          firstName={firstName}
          lastName={lastName}
          onChangeFirstName={setFirstName}
          onChangeLastName={setLastName}
          onUpdate={() => {
            if (!realmInstance || !selectedContactId) return;
            editContact(realmInstance, selectedContactId, {
              firstName,
              lastName,
            });
            showToast('success', 'Updated');
            setShowEditModel(false);
          }}
        />
      )}
      {showInput && (
        <InputContact
          onAdd={data => {
            if (realmInstance) {
              addContact(realmInstance, data);
              showToast('success', 'Added ' + data.firstName);
            }
            setShowInput(!showInput);
          }}
          onCancel={() => {
            setShowInput(false);
          }}
        />
      )}
      <FloatingButton onPress={() => setShowInput(!showInput)} />
      <Toast />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F2F2F7',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
});
