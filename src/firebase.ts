import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDX_hfSc6p_6pbnc1lXoFZ9fjX_JBFr5Ng",
  authDomain: "org-memberlist.firebaseapp.com",
  databaseURL: "https://org-memberlist-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "org-memberlist",
  storageBucket: "org-memberlist.firebasestorage.app",
  messagingSenderId: "230679625314",
  appId: "1:230679625314:web:059dd80777717bc4225b3b",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);

signInAnonymously(auth)
  .then(() => {
    console.log("Firebase Anonymous Authentication successful");
  })
  .catch((error) => {
    console.error("Firebase Authentication error:", error);
  });