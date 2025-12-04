import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCj4GAAaqgVzcteMmxz9tw1s_rbfTolJ54",
  authDomain: "reactnative-75982.firebaseapp.com",
  databaseURL: "https://reactnative-75982-default-rtdb.firebaseio.com",
  projectId: "reactnative-75982",
  storageBucket: "reactnative-75982.firebasestorage.app",
  messagingSenderId: "260606670385",
  appId: "1:260606670385:web:8d722c132046c90a890710"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getDatabase(app);
const storage = getStorage(app);

export { app, db, storage };
