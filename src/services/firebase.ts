// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; // Keep initializeApp for the new structure
import { getAuth } from 'firebase/auth';

// Firebase configuration and initialization
// Note: Make sure firebase is initialized before calling getAuth()
const firebaseConfig = {
  apiKey: "AIzaSyCzh4OKhuIrIngf6lllP35EwxatlcUNRRE",
  authDomain: "telegram-clone-7300f.firebaseapp.com",
  projectId: "telegram-clone-7300f",
  storageBucket: "telegram-clone-7300f.firebasestorage.app",
  messagingSenderId: "519536583706",
  appId: "1:519536583706:web:df7627c6c53d3817751da3",
  measurementId: "G-NXBNXPSBNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);