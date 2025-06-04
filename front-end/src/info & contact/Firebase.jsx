// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export const auth = getAuth(app);
