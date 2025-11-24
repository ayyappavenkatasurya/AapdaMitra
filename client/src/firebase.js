import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2Vt2vuFyRcacOhJ87-5_Oy6HAZvk-DPg",
  authDomain: "nexuschat-d1897.firebaseapp.com",
  projectId: "nexuschat-d1897",
  storageBucket: "nexuschat-d1897.firebasestorage.app",
  messagingSenderId: "319146644423",
  appId: "1:319146644423:web:4e6d91d8d5f8fa761bffe2",
  measurementId: "G-41VWYM5RKM"
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logOut = () => signOut(auth);