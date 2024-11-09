import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"


const firebaseConfig = {
    apiKey: "AIzaSyAfO8C7DP4mDgQ7FeqEuFLG6zAIJrRUIUo",
    authDomain: "fb-juanventures-8b8e2.firebaseapp.com",
    projectId: "fb-juanventures-8b8e2",
    storageBucket: "fb-juanventures-8b8e2.firebasestorage.app",
    messagingSenderId: "999840546607",
    appId: "1:999840546607:web:60ff7293b6cb3806caebda"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);