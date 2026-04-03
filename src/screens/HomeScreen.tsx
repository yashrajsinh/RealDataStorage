import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';

// Realm
import Realm, { BSON } from 'realm';

// Model
import { Contact } from '../model/Contact';

// DB
import { addContact, deleteContact, getRealm, editContact } from '../db/realm';

// Components
import ContactCard from '../components/ContactCard/ContactCard';
import InputContact from '../components/InputContactCard/InputContact';
import FloatingButton from '../components/FloatingButton/FloatingButton';
import EditModal from '../components/EditModel/EditModel';

// Data
import { fetchContact } from '../data/ContactsData';

// Services
import {
  getDeviceContacts,
  addToDeviceContacts,
} from '../services/DeviceContact';

// Toast
import Toast from 'react-native-toast-message';

// Contacts (iOS permission)
import Contacts from 'react-native-contacts';

const HomeScreen = () => {
  //loading state
  const [loading, setLoading] = useState(true);
  //setting contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  //state for adding new value
  const [showInput, setShowInput] = useState(false);
  //state for editing a model
  const [showEditModel, setShowEditModel] = useState(false);
  //instance to hold realM
  const [realmInstance, setRealmInstance] = useState<Realm | null>(null);

  const [selectedContactId, setSelectedContactId] =
    useState<BSON.ObjectId | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    let realm: Realm;
    let data: Realm.Results<Contact>;

    const loadData = async () => {
      setLoading(true);
      try {
        realm = await getRealm();

        fetchContact(realm);
        setRealmInstance(realm);

        await getDeviceContacts(realm);

        data = realm.objects<Contact>('Contact');

        setContacts([...data]);

        data.addListener(() => {
          setContacts([...data]);
        });

        showToast('success', 'Contacts synced');
      } catch (e) {
        console.debug(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      if (data) data.removeAllListeners();
      if (realm) realm.close();
    };
  }, []);

  const showToast = (type: string, message: string) => {
    Toast.show({
      type,
      text1: message,
      position: 'bottom',
    });
  };

  const handleDelete = (index: number) => {
    Alert.alert('Delete Contact', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setContacts(prev => prev.filter((_, i) => i !== index));

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
  };

  const handleEdit = (contact: Contact) => {
    setShowEditModel(true);
    setSelectedContactId(contact._id);
    setFirstName(contact.firstName);
    setLastName(contact.lastName);
  };

  // Loading UI
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading contacts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={item => item._id.toHexString()}
        renderItem={({ item, index }) => {
          if (!item.isValid()) return null;
          return (
            <ContactCard
              contact={item}
              onPress={() => handleEdit(item)}
              onDelete={() => handleDelete(index)}
            />
          );
        }}
      />

      {/* Edit Modal */}
      {showEditModel && (
        <EditModal
          visible={showEditModel}
          onCancel={() => setShowEditModel(false)}
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

      {/* Add Contact */}
      {showInput && (
        <InputContact
          onAdd={async data => {
            if (!realmInstance) return;

            // 1. Save to Realm
            addContact(realmInstance, data);

            let hasPermission = false;

            // 2. Permissions
            if (Platform.OS === 'android') {
              const permission = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
              ]);

              hasPermission =
                permission['android.permission.READ_CONTACTS'] ===
                  PermissionsAndroid.RESULTS.GRANTED &&
                permission['android.permission.WRITE_CONTACTS'] ===
                  PermissionsAndroid.RESULTS.GRANTED;
            } else {
              const permission = await Contacts.requestPermission();
              hasPermission = permission === 'authorized';
            }

            if (!hasPermission) {
              showToast('error', 'Saved locally, but no permission for device');
              setShowInput(false);
              return;
            }

            // 3. Save to device
            try {
              await addToDeviceContacts(data);
              showToast('success', 'Saved to phone contacts');
            } catch (e) {
              showToast('error', 'Saved locally, but failed on device');
            }

            setShowInput(false);
          }}
          onCancel={() => setShowInput(false)}
        />
      )}

      <FloatingButton onPress={() => setShowInput(true)} />
      <Toast />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
});
