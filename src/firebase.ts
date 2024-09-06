import { initializeApp } from "firebase/app";
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
auth.useDeviceLanguage();
setPersistence(auth, browserLocalPersistence);

const emulatorHost = "127.0.0.1";
if (window.location.hostname === "127.0.0.1") {
  console.log("Detected local usage, point to emulators now.");
  connectFirestoreEmulator(db, emulatorHost, 8080);
  connectAuthEmulator(auth, `http://127.0.0.1:9099`);
}

const createCollection = <T = DocumentData>(
  firestore: Firestore,
  collectionName: string,
) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export { app, auth, createCollection, db };
