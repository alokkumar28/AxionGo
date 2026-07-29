import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "axiongo.firebaseapp.com",
  projectId: "axiongo",
  storageBucket: "axiongo.firebasestorage.app",
  messagingSenderId: "387207401447",
  appId: "1:387207401447:web:f41dcf1503c659f6bcb742",
  measurementId: "G-RQT5TJH79F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app , auth}