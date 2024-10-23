// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSgRzXqRqY0Wu-EwYnbuiO34hr_pXTZSA",
    authDomain: "berdekar-receipt.firebaseapp.com",
    projectId: "berdekar-receipt",
    storageBucket: "berdekar-receipt.appspot.com",
    messagingSenderId: "163538568219",
    appId: "1:163538568219:web:94af4565bda7c470cae4be",
    measurementId: "G-VGHDPQGWHL"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };