// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDI16GivuUqDgx92wfhn_HNhMLOD1New7M",
  authDomain: "carte-des-panos.firebaseapp.com",
  databaseURL: "https://carte-des-panos-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "carte-des-panos",
  storageBucket: "carte-des-panos.firebasestorage.app",
  messagingSenderId: "239851211013",
  appId: "1:239851211013:web:30423f3d383b3c54f78f6c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };


