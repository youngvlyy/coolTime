// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMqbkbO1C7Dl1HvehrpLoLfWDs2NtHm0o",
  authDomain: "cooltime-b9a0c.firebaseapp.com",
  projectId: "cooltime-b9a0c",
  storageBucket: "cooltime-b9a0c.firebasestorage.app",
  messagingSenderId: "229348947429",
  appId: "1:229348947429:web:3d62a5bed012a4e72e6b0c",
  measurementId: "G-EEM8WC0QE6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth so it can be used in Auth.tsx
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
