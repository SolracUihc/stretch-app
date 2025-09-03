// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOmptAlidsE7b5GDKBX4b3l8BuXaofCqI",
  authDomain: "stretch-app-7e628.firebaseapp.com",
  databaseURL: "https://stretch-app-7e628-default-rtdb.firebaseio.com",
  projectId: "stretch-app-7e628",
  storageBucket: "stretch-app-7e628.firebasestorage.app",
  messagingSenderId: "864995704422",
  appId: "1:864995704422:web:50333aa49f6bef1a50b7a7",
  measurementId: "G-78W2WE4MYB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// No storage export