import * as firebase from 'firebase/app';
import 'firebase/auth'; // required for side-effects
import 'firebase/database';

export function configureFirebase() {
  // TODO: use firebase hosting config implicit init here.
  return firebase.initializeApp({
    apiKey: 'AIzaSyBtkyapMzswKVZWQjUr7DeahLtcBfzUlpY',
    authDomain: 'peerping-91686.firebaseapp.com',
    databaseURL: 'https://peerping-91686.firebaseio.com',
    messagingSenderId: '517732934405',
    projectId: 'peerping-91686',
    storageBucket: ''
  });
}
