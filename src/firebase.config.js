import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyA4J8YIKU2qxsoN3f8z3rBni5F33QNezok",
  authDomain: "fir-store-7efce.firebaseapp.com",
  projectId: "fir-store-7efce",
  storageBucket: "fir-store-7efce.firebasestorage.app",
  messagingSenderId: "184549417871",
  appId: "1:184549417871:web:cd54f0b91f8b0e64cae1fa"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage();
export const db = getFirestore()