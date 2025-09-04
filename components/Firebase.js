// Firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
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

// ✅ Empêche la double initialisation
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Sur mobile (Android/iOS), on essaye initializeAuth une seule fois,
// sinon on retombe sur getAuth(app) si déjà initialisé.
let _auth;
if (Platform.OS === "web") {
  _auth = getAuth(app);
} else {
  try {
    _auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    // Déjà initialisé → on récupère l'instance existante
    _auth = getAuth(app);
  }
}
export const auth = _auth;




