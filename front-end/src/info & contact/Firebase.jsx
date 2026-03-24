import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "ecommerce-2e65e.firebaseapp.com",
  projectId: "ecommerce-2e65e",
  storageBucket: "ecommerce-2e65e.firebasestorage.app",
  messagingSenderId: "691704869674",
  appId: "1:691704869674:web:f54ab52aad59a7fd54a453",
  measurementId: "G-YP2XYBQ4EJ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
