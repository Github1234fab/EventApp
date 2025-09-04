// Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence  } from "firebase/auth"; // 👈 import auth
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
export const storage = getStorage(app, "gs://bddjson.appspot.com");


export const auth =
 Platform.OS === "web"
   ? getAuth(app) // web garde le comportement standard
    : initializeAuth(app, {
       persistence: getReactNativePersistence(AsyncStorage),      });





