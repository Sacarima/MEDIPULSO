// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "medi-pulso.firebaseapp.com",
  projectId: "medi-pulso",
  storageBucket: "medi-pulso.appspot.com",
  messagingSenderId: "1084719001969",
  appId: "1:1084719001969:web:5f28e4f7c8c79c2e1a06d0",
  measurementId: "G-GPV5239T0N"
};


export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
