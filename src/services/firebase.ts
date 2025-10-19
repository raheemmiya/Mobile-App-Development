import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase config provided by user
const firebaseConfig = {
  apiKey: 'AIzaSyA_nE9JHsPH9FAif3fXBYH8UiModp2nMxg',
  authDomain: 'travelnepal-e9e3f.firebaseapp.com',
  databaseURL: 'https://travelnepal-e9e3f-default-rtdb.firebaseio.com',
  projectId: 'travelnepal-e9e3f',
  storageBucket: 'travelnepal-e9e3f.firebasestorage.app',
  messagingSenderId: '263566852689',
  appId: '1:263566852689:web:7bfa1a8f3cb54913976e70',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);


