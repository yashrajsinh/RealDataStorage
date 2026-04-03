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

import Realm, { BSON } from 'realm';
import { Contact } from '../model/Contact';
import { addContact, deleteContact, getRealm, editContact } from '../db/realm';

import ContactCard from '../components/ContactCard/ContactCard';
import InputContact from '../components/InputContactCard/InputContact';
import FloatingButton from '../components/FloatingButton/FloatingButton';
import EditModal from '../components/EditModel/EditModel';

import {
  getDeviceContacts,
  addToDeviceContacts,
} from '../services/DeviceContact';

import Toast from 'react-native-toast-message';
import Contacts from 'react-native-contacts';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);
  const [realmInstance, setRealmInstance] = useState<Realm | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedContactId, setSelectedContactId] =
    useState<BSON.ObjectId | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const showToast = (type: string, message: string) => {
    Toast.show({
      type,
      text1: message,
      position: 'bottom',
    });
  };

  useEffect(() => {
    let realm: Realm;
    let data: Realm.Results<Contact>;

    const loadData = async () => {
      setLoading(true);
      try {
        realm = await getRealm();

        setRealmInstance(realm);

        // PERMISSION FIX (ANDROID CRASH FIX)
        let hasPermission = false;

        if (Platform.OS === 'android') {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          );
          hasPermission = permission === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const permission = await Contacts.requestPermission();
          hasPermission = permission === 'authorized';
        }

        if (hasPermission) {
          await getDeviceContacts(realm);
          showToast('success', 'Contacts synced');
        } else {
          showToast('error', 'No permission to read contacts');
        }

        data = realm.objects<Contact>('Contact');
        setContacts([...data]);

        data.addListener(() => {
          setContacts([...data]);
        });
      } catch (e) {
        console.debug(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      try {
        data?.removeAllListeners();
        realm?.close();
      } catch (e) {}
    };
  }, []);

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

  const handleRefresh = async () => {
    if (!realmInstance) return;

    setRefreshing(true);
    try {
      await getDeviceContacts(realmInstance);
      showToast('success', 'Contacts refreshed');
    } catch {
      showToast('error', 'Refresh failed');
    } finally {
      setRefreshing(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setShowEditModel(true);
    setSelectedContactId(contact._id);
    setFirstName(contact.firstName);
    setLastName(contact.lastName);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading contacts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>

      <FlatList
        data={contacts}
        refreshing={refreshing}
        onRefresh={handleRefresh}
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

      {showInput && (
        <InputContact
          onAdd={async data => {
            if (!realmInstance) return;

            addContact(realmInstance, data);

            let hasPermission = false;

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
              showToast('error', 'Saved locally, but no permission');
              setShowInput(false);
              return;
            }

            try {
              await addToDeviceContacts(data);
              showToast('success', 'Saved to phone contacts');
            } catch {
              showToast('error', 'Saved locally, device failed');
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
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '700', color: '#000' },
});
