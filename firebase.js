// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNL68AoAedMr88vY2Yvkfk9WkSr9F7Xmc",
  authDomain: "pantry-tracker-b4e97.firebaseapp.com",
  projectId: "pantry-tracker-b4e97",
  storageBucket: "pantry-tracker-b4e97.appspot.com",
  messagingSenderId: "694299122024",
  appId: "1:694299122024:web:a2cd59da0b886ec50e1edd",
  measurementId: "G-1KYHKWF2EB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}