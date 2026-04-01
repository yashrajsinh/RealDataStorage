import { View, Text, FlatList } from 'react-native';
import React from 'react';
//data
import { ContactsData } from '../data/ContactsData';
//components
import ContactCard from '../components/ContactCard';

type Props = {};

const HomeScreen = (props: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={ContactsData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onPress={contact => console.log('Open', contact)}
            onCallPress={contact => console.log('Call', contact)}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;
