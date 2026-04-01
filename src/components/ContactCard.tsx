import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Contacts } from '../model/Contacts';

type Props = {
  contact: Contacts;
  onPress?: (contact: Contacts) => void;
  onCallPress?: (contact: Contacts) => void;
};

const ContactCard = ({ contact, onPress, onCallPress }: Props) => {
  const initials = contact.firstName.charAt(0) + contact.lastName.charAt(0);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.container}
      onPress={() => onPress?.(contact)}
    >
      {/* Avatar */}
      {contact.profileImageUrl ? (
        <Image
          source={{ uri: contact.profileImageUrl }}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>
          {contact.firstName} {contact.lastName}
        </Text>
        <Text style={styles.phone}>{contact.phone}</Text>
      </View>

      {/* Action */}
      <TouchableOpacity
        onPress={() => onCallPress?.(contact)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.callText}>Call</Text>
      </TouchableOpacity>
    </TouchableOpacity>
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

    // subtle divider
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1D1D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  initials: {
    color: '#fff',
    fontWeight: '600',
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

  callText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});
