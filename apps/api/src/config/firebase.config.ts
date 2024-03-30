// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBRZFSe-wZBxuq1H1klKDORGNMfZv9Y3G8',
  authDomain: 'vite-admin-5a901.firebaseapp.com',
  projectId: 'vite-admin-5a901',
  storageBucket: 'vite-admin-5a901.appspot.com',
  messagingSenderId: '124670154438',
  appId: '1:124670154438:web:014e098730d7f2c27f69c7',
  measurementId: 'G-72Q91M6QZ9',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// firebase storage
const storage = getStorage(firebaseApp);

// firebase auth
const authentication = getAuth(firebaseApp);

export { authentication, storage };
