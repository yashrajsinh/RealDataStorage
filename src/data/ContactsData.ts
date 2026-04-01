import Realm from 'realm';
import { Contact } from '../model/Contact';
import { BSON } from 'realm';

export const fetchContact = (realm: Realm) => {
  const existing = realm.objects<Contact>('Contact');
  if (existing.length === 0) {
    realm.write(() => {
      realm.create('Contact', {
        _id: new BSON.ObjectId(),
        profileImageUrl:
          'https://pbs.twimg.com/media/Dsicl5vU0AAx5j1?format=jpg&name=small',
        firstName: 'Tom',
        lastName: 'Hardy',
        phone: '123-456-7890',
      });
      realm.create('Contact', {
        _id: new BSON.ObjectId(),
        profileImageUrl:
          'https://i0.wp.com/stallonezone.com/imgs/news/2002/nov/112902cig.jpg?resize=255%2C354',
        firstName: 'Sylvester',
        lastName: 'Stallone',
        phone: '987-654-3210',
      });
      realm.create('Contact', {
        _id: new BSON.ObjectId(),
        profileImageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_PKwIsQ8DGd8zQsNK77Dga-MnqdNaxIZHPQ&s',
        firstName: 'Christian',
        lastName: 'Bale',
        phone: '555-111-2222',
      });
      realm.create('Contact', {
        _id: new BSON.ObjectId(),
        profileImageUrl:
          'https://static0.moviewebimages.com/wordpress/wp-content/uploads/2024/11/steve-carell-as-michael-scott-in-the-office.jpg?q=70&fit=crop&w=1600&h=900&dpr=1',
        firstName: 'Michael',
        lastName: 'Scott',
        phone: '555-111-2222',
      });
      realm.create('Contact', {
        _id: new BSON.ObjectId(),
        profileImageUrl:
          'https://external-preview.redd.it/happy-9-2-n-d-30th-birthday-to-creed-bratton-v0-JjV3js--Q2CTR1Dwj_-lQRJ3hZWw0rKWEXJ8fUic0uI.jpg?width=1080&crop=smart&auto=webp&s=50b25c59f1544cc6c06d505d1fb8d5b25734d3ef',
        firstName: 'Creed',
        lastName: 'Bratton',
        phone: '555-111-2222',
      });
    });
  }
};
