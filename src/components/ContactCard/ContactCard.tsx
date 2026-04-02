import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Contact } from '../../model/Contact';
import { Swipeable } from 'react-native-gesture-handler';

type Props = {
  contact: Contact;
  onPress?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
};

const ContactCard = ({ contact, onPress, onDelete }: Props) => {
  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.deleteBox}
        onPress={() => onDelete?.(contact)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.card}
        onPress={() => onPress?.(contact)}
      >
        {/* Avatar */}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',

    marginHorizontal: 8,
    marginVertical: 3,
    padding: 12,

    backgroundColor: '#fff',
    borderRadius: 14,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    // Android shadow
    elevation: 3,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 36,
    marginRight: 14,

    // border
    borderWidth: 2,
    borderColor: '#fff',

    // subtle shadow for avatar
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
  },

  phone: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },

  deleteBox: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '90%',
    marginVertical: 6,
    borderRadius: 14,
  },

  deleteText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
