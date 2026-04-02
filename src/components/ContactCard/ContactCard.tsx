import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
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
        activeOpacity={0.6}
        style={styles.container}
        onPress={() => onPress?.(contact)}
      >
        <Image
          source={{ uri: contact.profileImageUrl }}
          style={styles.avatar}
        />

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

    // iOS divider
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 17,
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
    fontSize: 15,
    fontWeight: '600',
  },
});
