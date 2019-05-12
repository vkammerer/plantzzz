import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import flamelink from 'flamelink/app'
import 'flamelink/content'
import 'flamelink/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBX6SgjHRtzlSFO4pylrKRYx4lOhJ5Fb9A",
  databaseURL: "https://plantzzz.firebaseio.com",
  projectId: "plantzzz",
  storageBucket: "plantzzz.appspot.com",
  appId: "1:636906668707:web:160d0f1127459827"
};

const bucketUrl = 'https://firebasestorage.googleapis.com/v0/b/plantzzz.appspot.com/o';
export const storageBaseUri = `${bucketUrl}/drive%2F375%2F`

export const firebaseApp = firebase.initializeApp(firebaseConfig)

export const flamelinkApp = flamelink({
  firebaseApp, // required
  dbType: 'cf', // can be either 'rtdb' or 'cf' for Realtime DB or Cloud Firestore
  env: 'production', // optional, default shown
  locale: 'en-US', // optional, default shown
  precache: true // optional, default shown. Currently it only precaches "schemas" for better performance
})
