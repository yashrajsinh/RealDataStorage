import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

type Props = {
  onPress: (event: GestureResponderEvent) => void;
};

const FloatingButton = (props: Props) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={props.onPress}>
      <Text style={styles.text}>+</Text>
    </TouchableOpacity>
  );
};

export default FloatingButton;
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },

    // Android
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 30,
  },
});
