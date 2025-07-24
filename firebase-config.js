// firebase-config.js
const firebaseConfig = {
  apiKey: "TA_COLLE_ICI",
  authDomain: "TON_PROJET.firebaseapp.com",
  databaseURL: "https://TON_PROJET.firebaseio.com",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "xxx",
  appId: "xxx"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Accès à la base de données
const db = firebase.database();
