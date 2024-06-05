// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "ecommerce-deb8f.firebaseapp.com",
  projectId: "ecommerce-deb8f",
  storageBucket: "ecommerce-deb8f.appspot.com",
  messagingSenderId: "562910574307",
  appId: "1:562910574307:web:904674eaa88c2cffcfb7d6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const auth1 = getAuth(app);
