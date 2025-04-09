// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJw0tFYCqVm5fvJ4zeNu3CvzhSJbF22uA",
  authDomain: "ite010a-social-issues.firebaseapp.com",
  projectId: "ite010a-social-issues",
  storageBucket: "ite010a-social-issues.firebasestorage.app",
  messagingSenderId: "219262139921",
  appId: "1:219262139921:web:b2980339739c13d1de7bb0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { auth, db }