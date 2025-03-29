// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { get, getDatabase, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzJdsGfLEL-xF_HJKbitp0GTtLGV-g6jo",
    authDomain: "atharva-data.firebaseapp.com",
    databaseURL: "https://atharva-data-default-rtdb.firebaseio.com",
    projectId: "atharva-data",
    storageBucket: "atharva-data.appspot.com",
    messagingSenderId: "235106059798",
    appId: "1:235106059798:web:e60160f850c7e926eb9737",
    measurementId: "G-JZLYGZW1XG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference the "users" node
const formdb = ref(database, "users");

// Get the table body element
const usersTable = document.getElementById("usersTable");

// Fetch data from Firebase and populate the table
get(formdb)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            usersTable.innerHTML = ""; // Clear table before inserting new rows

            Object.keys(data).forEach((key) => {
                const user = data[key];
                const row = `
                    <tr>
                        <td>${user.fullName || "N/A"}</td>
                        <td>${user.email || "N/A"}</td>
                        <td>********</td> <!-- Password Hidden -->
                        <td>${user.phone || "N/A"}</td>
                        <td>${user.gender || "N/A"}</td>
                        <td>${user.dob || "N/A"}</td>
                        <td>${user.address || "N/A"}</td>
                    </tr>`;
                usersTable.innerHTML += row;
            });
        } else {
            usersTable.innerHTML = "<tr><td colspan='7' class='text-center text-danger'>No data available</td></tr>";
        }
    })
    .catch((error) => {
        console.error("Error reading data:", error);
        usersTable.innerHTML = "<tr><td colspan='7' class='text-center text-danger'>Error loading data</td></tr>";
    });