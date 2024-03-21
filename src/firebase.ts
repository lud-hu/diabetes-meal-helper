import { initializeApp } from "firebase/app";
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";

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

const emulatorHost = "127.0.0.1";
// if (window.location.hostname === "localhost") {
//   console.log("Detected local usage, point to emulators now.");
//   connectFirestoreEmulator(db, emulatorHost, 8080);
// }

const createCollection = <T = DocumentData>(
  firestore: Firestore,
  collectionName: string,
) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export { app, db, createCollection };
