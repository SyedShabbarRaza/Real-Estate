// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "teacherayaa.firebaseapp.com",
  projectId: "teacherayaa",
  storageBucket: "teacherayaa.appspot.com",
  messagingSenderId: "544775775264",
  appId: "1:544775775264:web:254c5ccf16e37e81b38845"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);