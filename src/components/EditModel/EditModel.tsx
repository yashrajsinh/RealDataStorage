import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import React from 'react';

type Props = {
  visible: boolean;

  firstName: string;
  lastName: string;

  onChangeFirstName: (text: string) => void;
  onChangeLastName: (text: string) => void;

  onUpdate: () => void;
  onCancel: () => void;
};

const EditModal = ({
  visible,
  firstName,
  lastName,
  onChangeFirstName,
  onChangeLastName,
  onUpdate,
  onCancel,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Edit Contact</Text>

          {/* First Name */}
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={onChangeFirstName}
            style={styles.input}
            placeholderTextColor="#999"
          />

          {/* Last Name */}
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={onChangeLastName}
            style={styles.input}
            placeholderTextColor="#999"
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelBtn]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.updateBtn]}
              onPress={onUpdate}
            >
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },

  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    color: '#000',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },

  cancelBtn: {
    backgroundColor: '#E5E5EA',
  },

  updateBtn: {
    backgroundColor: '#007AFF',
  },

  cancelText: {
    color: '#000',
    fontWeight: '500',
  },

  updateText: {
    color: '#fff',
    fontWeight: '600',
  },
});
