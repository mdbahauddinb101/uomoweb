
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase} from "firebase/database";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtkMhOJvLBJ429gksiHq17SJLYl7-u6Ho",
  authDomain: "uomo-eccomerce.firebaseapp.com",
  projectId: "uomo-eccomerce",
  storageBucket: "uomo-eccomerce.firebasestorage.app",
  messagingSenderId: "192103700168",
  appId: "1:192103700168:web:af4c09e1ccefe967fd77fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getDatabase(app)

export {auth, db}