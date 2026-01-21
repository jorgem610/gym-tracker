import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCI94VxDiw5vrLmjHzcFOWNHeSIb_3SPF4",
  authDomain: "gym-tracker-119cc.firebaseapp.com",
  projectId: "gym-tracker-119cc",
  storageBucket: "gym-tracker-119cc.firebasestorage.app",
  messagingSenderId: "1056121057464",
  appId: "1:1056121057464:web:8b8fdb7a45c9674f3f444d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore (base de datos)
export const db = getFirestore(app);