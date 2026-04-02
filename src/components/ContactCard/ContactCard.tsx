import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Contact } from '../../model/Contact';
import { Swipeable } from 'react-native-gesture-handler';

type Props = {
  contact: Contact;
  onPress?: (contact: Contact) => void;
  index?: number;
  onDelete?: (index: number) => void;
};

const ContactCard = ({ contact, onPress, onDelete, index }: Props) => {
  const swipeableRef = useRef<Swipeable>(null);

  if (!contact.isValid()) return null;
  const isOnline = Math.random() > 0.4;

  const handleDelete = () => {
    // Close swipeable, wait animation, then notify parent
    swipeableRef.current?.close();
    setTimeout(() => onDelete?.(index!), 250);
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity style={styles.deleteBox} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <TouchableOpacity style={styles.card} onPress={() => onPress?.(contact)}>
        {/* Avatar + Status */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: contact.profileImageUrl }}
            style={styles.avatar}
          />

          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isOnline ? '#34C759' : '#C7C7CC',
              },
            ]}
          />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>
            {contact.firstName} {contact.lastName}
          </Text>
          <Text style={styles.phone}>{contact.phone}</Text>
        </View>

        {/* iOS Chevron */}
        <Text style={styles.chevron}>{'>'}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default ContactCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 10,
    paddingHorizontal: 16,

    backgroundColor: '#fff',

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },

  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  statusDot: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 10,
    height: 10,
    borderRadius: 5,

    borderWidth: 2,
    borderColor: '#fff',
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },

  phone: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },

  chevron: {
    fontSize: 18,
    color: '#C7C7CC',
  },

  deleteBox: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },

  deleteText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
