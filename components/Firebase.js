// Firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEwpAek6JuWKBWxCZRWHIpJpFtLmngzLE",
  authDomain: "bddjson.firebaseapp.com",
  projectId: "bddjson",
  storageBucket: "bddjson.appspot.com",
  messagingSenderId: "797023585100",
  appId: "1:797023585100:web:027f9c5c56324e9fa885e9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
