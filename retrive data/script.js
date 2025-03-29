// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { get, getDatabase, ref, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


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
const usersRef = ref(database, "users");
// Reference the "users" node
const formdb = ref(database, "users");

// Get the table body element
const usersTable = document.getElementById("usersTable");

// Fetch data from Firebase and populate the table
function fetchUsers() {
    get(usersRef)
        .then((snapshot) => {
            const usersTable = document.getElementById("usersTable");
            usersTable.innerHTML = ""; // Clear table

            if (snapshot.exists()) {
                const data = snapshot.val();
                Object.keys(data).forEach((key) => {
                    const user = data[key];
                    const row = `
                        <tr id="row-${key}">
                            <td><span id="name-text-${key}">${user.fullName || "N/A"}</span>
                                <input type="text" id="name-${key}" value="${user.fullName || ""}" class="form-control d-none"></td>
                            <td><span id="email-text-${key}">${user.email || "N/A"}</span>
                                <input type="email" id="email-${key}" value="${user.email || ""}" class="form-control d-none"></td>
                            <td>********</td> <!-- Password remains hidden -->
                            <td><span id="phone-text-${key}">${user.phone || "N/A"}</span>
                                <input type="text" id="phone-${key}" value="${user.phone || ""}" class="form-control d-none"></td>
                            <td>
                                <span id="gender-text-${key}">${user.gender || "N/A"}</span>
                                <select id="gender-${key}" class="form-control d-none">
                                    <option value="Male" ${user.gender === "Male" ? "selected" : ""}>Male</option>
                                    <option value="Female" ${user.gender === "Female" ? "selected" : ""}>Female</option>
                                </select>
                            </td>
                            <td><span id="dob-text-${key}">${user.dob || "N/A"}</span>
                                <input type="date" id="dob-${key}" value="${user.dob || ""}" class="form-control d-none"></td>
                            <td><span id="address-text-${key}">${user.address || "N/A"}</span>
                                <input type="text" id="address-${key}" value="${user.address || ""}" class="form-control d-none"></td>
                            <td>
                                <button class="btn btn-primary btn-sm" id="edit-btn-${key}" onclick="toggleEdit('${key}')">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteUser('${key}')">Delete</button>
                            </td>
                        </tr>`;
                    usersTable.innerHTML += row;
                });
            } else {
                usersTable.innerHTML = "<tr><td colspan='8' class='text-center text-danger'>No data available</td></tr>";
            }
        })
        .catch((error) => console.error("Error fetching users:", error));
}

// Function to toggle between Edit and Save mode
window.toggleEdit = function (userId) {
    const isEditing = document.getElementById(`edit-btn-${userId}`).innerText === "Save";

    if (isEditing) {
        // Save data to Firebase
        updateUser(userId);
    } else {
        // Switch to edit mode
        document.getElementById(`name-text-${userId}`).classList.add("d-none");
        document.getElementById(`email-text-${userId}`).classList.add("d-none");
        document.getElementById(`phone-text-${userId}`).classList.add("d-none");
        document.getElementById(`gender-text-${userId}`).classList.add("d-none");
        document.getElementById(`dob-text-${userId}`).classList.add("d-none");
        document.getElementById(`address-text-${userId}`).classList.add("d-none");

        document.getElementById(`name-${userId}`).classList.remove("d-none");
        document.getElementById(`email-${userId}`).classList.remove("d-none");
        document.getElementById(`phone-${userId}`).classList.remove("d-none");
        document.getElementById(`gender-${userId}`).classList.remove("d-none");
        document.getElementById(`dob-${userId}`).classList.remove("d-none");
        document.getElementById(`address-${userId}`).classList.remove("d-none");

        document.getElementById(`edit-btn-${userId}`).innerText = "Save";
    }
};

// Function to update user details in Firebase
window.updateUser = function (userId) {
    const updatedUser = {
        fullName: document.getElementById(`name-${userId}`).value,
        email: document.getElementById(`email-${userId}`).value,
        phone: document.getElementById(`phone-${userId}`).value,
        gender: document.getElementById(`gender-${userId}`).value,
        dob: document.getElementById(`dob-${userId}`).value,
        address: document.getElementById(`address-${userId}`).value
    };

    update(ref(database, `users/${userId}`), updatedUser)
        .then(() => {
            // Switch back to view mode
            document.getElementById(`name-text-${userId}`).innerText = updatedUser.fullName;
            document.getElementById(`email-text-${userId}`).innerText = updatedUser.email;
            document.getElementById(`phone-text-${userId}`).innerText = updatedUser.phone;
            document.getElementById(`gender-text-${userId}`).innerText = updatedUser.gender;
            document.getElementById(`dob-text-${userId}`).innerText = updatedUser.dob;
            document.getElementById(`address-text-${userId}`).innerText = updatedUser.address;

            document.getElementById(`name-text-${userId}`).classList.remove("d-none");
            document.getElementById(`email-text-${userId}`).classList.remove("d-none");
            document.getElementById(`phone-text-${userId}`).classList.remove("d-none");
            document.getElementById(`gender-text-${userId}`).classList.remove("d-none");
            document.getElementById(`dob-text-${userId}`).classList.remove("d-none");
            document.getElementById(`address-text-${userId}`).classList.remove("d-none");

            document.getElementById(`name-${userId}`).classList.add("d-none");
            document.getElementById(`email-${userId}`).classList.add("d-none");
            document.getElementById(`phone-${userId}`).classList.add("d-none");
            document.getElementById(`gender-${userId}`).classList.add("d-none");
            document.getElementById(`dob-${userId}`).classList.add("d-none");
            document.getElementById(`address-${userId}`).classList.add("d-none");

            document.getElementById(`edit-btn-${userId}`).innerText = "Edit";

            alert("User updated successfully!");
        })
        .catch((error) => console.error("Error updating user:", error));
};

// Function to delete a user
window.deleteUser = function (userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        remove(ref(database, `users/${userId}`))
            .then(() => {
                document.getElementById(`row-${userId}`).remove();
                alert("User deleted successfully!");
            })
            .catch((error) => console.error("Error deleting user:", error));
    }
};

// Initial Fetch
fetchUsers();
