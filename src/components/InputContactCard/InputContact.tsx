import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';

type Props = {
  onAdd: (data: { firstName: string; lastName: string; phone: string }) => void;
  onCancel: () => void;
};

const InputContact = ({ onAdd, onCancel }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const disabled = !firstName || !phone;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Add Contact</Text>

        <TextInput
          placeholder="First Name"
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          placeholder="Last Name"
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          placeholder="Phone"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <View style={styles.buttons}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addBtn, disabled && { opacity: 0.4 }]}
            disabled={disabled}
            onPress={() => onAdd({ firstName, lastName, phone })}
          >
            <Text style={styles.addText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default InputContact;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },

  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },

  cancel: {
    marginRight: 16,
    color: '#8E8E93',
  },

  addBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  addText: {
    color: '#fff',
    fontWeight: '600',
  },
});
