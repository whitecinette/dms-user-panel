import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ this was missing

const firebaseConfig = {
  apiKey: "AIzaSyAQCexG0xbsVD7GP-sEh-WmEZpbGymmHWE",
  authDomain: "dms-app-5da91.firebaseapp.com",
  projectId: "dms-app-5da91",
  storageBucket: "dms-app-5da91.appspot.com",
  messagingSenderId: "655297895124",
  appId: "1:655297895124:web:7952572d2f66eb63213941",
  measurementId: "G-8L14L0TMFE"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp); // ✅ this is key!
