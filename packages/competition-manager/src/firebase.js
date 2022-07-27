import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, push, query, orderByKey, limitToLast } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged  } from "firebase/auth";


  const firebaseConfig = {
    apiKey: "AIzaSyDsqu4zLfehzRKjhsGttMYml5XpIdZfaqg",
    authDomain: "dynastycontests.firebaseapp.com",
    projectId: "dynastycontests",
    storageBucket: "dynastycontests.appspot.com",
    messagingSenderId: "528860202144",
    databaseURL:'https://dynastycontests-default-rtdb.europe-west1.firebasedatabase.app/',
    appId: "1:528860202144:web:c9d746ac2181f6ac90f5c5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const database = getDatabase(app)
  globalThis.firebase = {app, database, ref, set, get, child, push, auth: getAuth(), signInWithEmailAndPassword, onAuthStateChanged, query, orderByKey, limitToLast }
