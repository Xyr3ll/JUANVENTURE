// login.js
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from './firebaseauth.js'; // Import db from firebaseauth.js

const form = document.getElementById('login-form');
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const adminCollection = collection(db, 'adminUsers'); // Collection name in Firestore
        const q = query(adminCollection, where("username", "==", username), where("password", "==", password));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            // Redirect if login successful
            window.location.href = "admin-stories.html";
        } else {
            document.getElementById('username-error').textContent = "Invalid username or password.";
        }
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById('username-error').textContent = "Error during login. Please try again.";
    }
});
