import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbj-twGxrMPWnxO-BmzS8ET_Nv8NDeQgA",
    authDomain: "estuday-f8917.firebaseapp.com",
    projectId: "estuday-f8917",
    storageBucket: "estuday-f8917.firebasestorage.app",
    messagingSenderId: "925306273509",
    appId: "1:925306273509:web:5c778740c9706c475c5e0c",
    measurementId: "G-BF1SQYK0G1"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);