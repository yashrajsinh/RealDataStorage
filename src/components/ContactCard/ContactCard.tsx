import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React from 'react';
import { Contact } from '../../model/Contact';
import { Swipeable } from 'react-native-gesture-handler';

type Props = {
  contact: Contact;
  onPress?: (contact: Contact) => void;
  onCallPress?: (contact: Contact) => void;
};

const ContactCard = ({ contact, onPress, onCallPress }: Props) => {
  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.deleteBox}
        onPress={() => {
          Alert.alert('Delete Contact', `Delete ${contact.firstName}?`, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => onCallPress?.(contact),
            },
          ]);
        }}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.container}
        onPress={() => onPress?.(contact)}
      >
        {/* User image */}
        <Image
          source={{ uri: contact.profileImageUrl }}
          style={styles.avatar}
        />

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>
            {contact.firstName} {contact.lastName}
          </Text>
          <Text style={styles.phone}>{contact.phone}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default ContactCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },

  phone: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },

  deleteBox: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },

  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});
