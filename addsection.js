import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfO8C7DP4mDgQ7FeqEuFLG6zAIJrRUIUo",
    authDomain: "fb-juanventures-8b8e2.firebaseapp.com",
    projectId: "fb-juanventures-8b8e2",
    storageBucket: "fb-juanventures-8b8e2.appspot.com",
    messagingSenderId: "999840546607",
    appId: "1:999840546607:web:60ff7293b6cb3806caebda"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to open the Add Student modal
function openAddStudentModal() {
    const addStudentModal = document.getElementById("add-student-modal");
    addStudentModal.style.display = "flex"; // Show the modal as a flexbox
}

// Function to add a new student to the database
// Function to add a new student to Firestore
async function addStudent() {
    const lastName = document.getElementById("last-name").value.trim();
    const middleName = document.getElementById("middle-name").value.trim();
    const firstName = document.getElementById("first-name").value.trim();
    const sectionName = document.getElementById("student-section").value;  // Use the selected section from dropdown
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate input fields
    if (!lastName || !firstName || !sectionName || !password || !confirmPassword) {
        alert("Please fill in all the required fields.");
        return;
    }

    // Confirm passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Create a default email based on the name and section (or another approach if needed)
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${sectionName.replace(/\s+/g, '-').toLowerCase()}.edu`;

    try {
        // Add new student account document to Firestore under 'accounts' collection
        await addDoc(collection(db, "accounts"), {
            section: sectionName,
            email: email,
            lastName: lastName,
            middleName: middleName || "N/A",  // Set as "N/A" if no middle name is provided
            firstName: firstName,
            password: password, 
            storyScore1: 0,  // Default value for story score 1
            storyScore2: 0,  // Default value for story score 2
            storyScore3: 0,  // Default value for story score 3
            storyScore4: 0,  // Store password (consider encryption in a real application)
            createdAt: new Date().toISOString() // Track account creation time
        });

        // Show success alert and clear form
        alert(`Student ${firstName} ${lastName} added successfully to section "${sectionName}".`);
        closeAddStudentModal(); // Close the modal
        loadStudents(sectionName); // Reload the student list for the selected section

    } catch (error) {
        console.error("Error adding student:", error);
        alert("An error occurred while adding the student.");
    }
}

// Make sure the function is accessible globally
window.addStudent = addStudent;


// Function to clear the form fields after submission
function clearStudentForm() {
    document.getElementById("username").value = "";
    document.getElementById("last-name").value = "";
    document.getElementById("middle-name").value = "";
    document.getElementById("first-name").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";
}

// Make sure the addStudent function is available globally
window.addStudent = addStudent;


// Function to close the Add Student modal
function closeAddStudentModal() {
    const addStudentModal = document.getElementById("add-student-modal");
    addStudentModal.style.display = "none"; // Hide the modal
}

// Make sure the functions are accessible globally
window.openAddStudentModal = openAddStudentModal;
window.closeAddStudentModal = closeAddStudentModal;


// Select modal and section dropdown
const modal = document.getElementById("add-section-modal");
const sectionDropdown = document.getElementById("section");
const sectionError = document.getElementById("section-error");

// Load sections dynamically from Firestore
// Modify the section dropdown population to keep the section names as they are
async function loadSections() {
    const sectionsCollection = collection(db, "sections");
    const sectionsSnapshot = await getDocs(sectionsCollection);
    const sectionsDropdown = document.getElementById("section");

    // Ensure the default option is always present
    sectionsDropdown.innerHTML = '<option value="" disabled selected>Select a Section</option>';

    sectionsSnapshot.forEach((doc) => {
        const sectionData = doc.data();
        const sectionName = sectionData.name; // No lowercase conversion
        const newOption = document.createElement("option");
        newOption.value = sectionName; // Use the exact name as the value
        newOption.textContent = sectionName;
        sectionsDropdown.appendChild(newOption);
    });

    const addNewOption = document.createElement("option");
    addNewOption.value = "add-new-section";
    addNewOption.textContent = "Add New Section";
    sectionsDropdown.appendChild(addNewOption);
}


// Call loadSections to populate the dropdown when the page loads
window.onload = loadSections;

// Handle section change
function handleSectionChange(select) {
    console.log("Selected Section:", select.value);  // Log the selected section value

    if (select.value === "") {
        return; // Do nothing if "Select a Section" is chosen
    }

    if (select.value === "add-new-section") {
        showModal();  // Trigger modal display for adding new section
    } else {
        loadStudents(select.value);  // Load students for the selected section
    }
}


// Show the modal
function showModal() {
    modal.style.display = "flex";  // Show modal as a flexbox
    const sectionError = document.getElementById("section-error");
    if (sectionError) sectionError.style.display = "none";  // Hide error message if present
}

// Function to add a new section and integrate with Firestore
// Function to add a new section and integrate with Firestore
async function addNewSection() {
    const sectionName = document.getElementById("section-name").value.trim(); // Get the section name
    const numberOfStudents = parseInt(document.getElementById("num-students").value.trim(), 10); // Ensure it's a number

    // Validate input fields
    if (!sectionName || !numberOfStudents || isNaN(numberOfStudents)) {
        alert("Please fill in all the details with a valid number for students."); // Ensure section name and number of students are not empty
        return;
    }

    // Check if the section name already exists
    if (await sectionExists(sectionName)) {
        sectionError.textContent = "Section name already exists!";
        sectionError.style.display = "block"; // Show error message
    } else {
        try {
            // Add the new section to Firestore
            await addDoc(collection(db, "sections"), {
                name: sectionName,
                num_students: numberOfStudents
            });

            // Create student accounts for the new section
            await createStudentAccounts(sectionName, numberOfStudents);

            // Reload the sections dropdown to reflect the new section
            await loadSections(); // Reload asynchronously after adding the section

            closeModal();  // Close the modal after adding
            
            // Show success alert for section and account creation
            alert(`Section "${sectionName}" and student accounts have been created successfully!`);

        } catch (error) {
            console.error("Error adding section: ", error);
            alert("An error occurred while adding the section.");
        }
    }
}



// Function to create student accounts in Firestore

async function createStudentAccounts(sectionName, numberOfStudents) {
    for (let i = 1; i <= numberOfStudents; i++) {
        const accountEmail = `student${i}@${sectionName.toLowerCase().replace(/\s+/g, '-')}.edu`; // Generate email for each student
        const password = "123456"; // Default password for each student (can be changed)

        try {
            // Add new student account document to Firestore under 'accounts' collection
            await addDoc(collection(db, "accounts"), {
                section: sectionName,
                email: accountEmail,
                password: password,
                storyScore1: 0,  // Default value for story score 1
                storyScore2: 0,  // Default value for story score 2
                storyScore3: 0,  // Default value for story score 3
                storyScore4: 0, 
                createdAt: new Date().toISOString() // Track account creation time
            });
            console.log(`Account ${accountEmail} added.`);
        } catch (e) {
            console.error("Error adding student account: ", e);
        }
    }

    // Show alert once all student accounts are created
    alert(`${numberOfStudents} student accounts created for section "${sectionName}".`);
}


// Check if the section already exists in Firestore
async function sectionExists(sectionName) {
    const sectionsCollection = collection(db, "sections");
    const q = query(sectionsCollection, where("name", "==", sectionName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // If empty, section doesn't exist
}

// Close the modal
function closeModal() {
    modal.style.display = "none";
}

// Expose functions globally
window.closeModal = closeModal;
window.addNewSection = addNewSection; // Ensure function is globally accessible
window.handleSectionChange = handleSectionChange;

// Load sections when the page loads
loadSections();

// Function to load students for the selected section and populate the table
// Modify the query to avoid converting section names to lowercase
// Function to load students for the selected section and populate the table
async function loadStudents(sectionName) {
    console.log("Loading students for section:", sectionName);
    const studentsCollection = collection(db, "accounts");
    const q = query(studentsCollection, where("section", "==", sectionName));
    const querySnapshot = await getDocs(q);
    
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = ""; // Clear the existing table rows

    console.log("Query snapshot size:", querySnapshot.size);

    if (querySnapshot.size === 0) {
        console.log("No students found for this section");
        return; // If no students are found, stop further execution
    }

    // Initialize index counter
    let index = 1;

    querySnapshot.forEach((doc) => {
        const studentData = doc.data();
        const studentRow = document.createElement("tr");
        studentRow.innerHTML = `
            <td>${index}</td> <!-- Display the index number -->
            <td>${studentData.email}</td>
            <td>${studentData.lastName || "N/A"}</td>
            <td>${studentData.middleName || "N/A"}</td>
            <td>${studentData.firstName || "N/A"}</td>
            <td>${studentData.storyScore1 || "N/A"}</td>
            <td>${studentData.storyScore2 || "N/A"}</td>
            <td>${studentData.storyScore3 || "N/A"}</td>
            <td>${studentData.storyScore4 || "N/A"}</td>
        `;
        tableBody.appendChild(studentRow);

        // Increment the index for the next student
        index++;
    });
}


// Function to delete the selected section
async function deleteSection() {
    const selectedSection = sectionDropdown.value; // Get the selected section name

    // Check if a valid section is selected
    if (!selectedSection || selectedSection === "add-new-section") {
        alert("Please select a valid section to delete.");
        return;
    }

    // Confirm with the user before deleting
    const confirmDelete = confirm(`Are you sure you want to delete the section "${selectedSection}"?`);
    if (!confirmDelete) return; // Exit if the user cancels the action

    try {
        // Delete the section from the "sections" collection
        const sectionRef = collection(db, "sections");
        const sectionQuery = query(sectionRef, where("name", "==", selectedSection));
        const sectionSnapshot = await getDocs(sectionQuery);

        if (sectionSnapshot.empty) {
            alert("Section not found!");
            return;
        }

        // Get the document ID of the section to delete
        const sectionDoc = sectionSnapshot.docs[0]; // Assuming there's only one section with this name
        await deleteDoc(doc(db, "sections", sectionDoc.id));
        console.log(`Section "${selectedSection}" deleted.`);

        // Optionally, delete students related to this section
        await deleteStudentsFromSection(selectedSection);

        // Reload the sections to update the dropdown
        await loadSections();
        alert("Section deleted successfully!");

    } catch (error) {
        console.error("Error deleting section: ", error);
        alert("An error occurred while deleting the section.");
    }
}

// Function to delete students in the selected section (optional)
async function deleteStudentsFromSection(sectionName) {
    const studentsCollection = collection(db, "accounts");
    const studentsQuery = query(studentsCollection, where("section", "==", sectionName));
    const studentsSnapshot = await getDocs(studentsQuery);

    // Delete each student in the selected section
    studentsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref); // Delete student document
        console.log(`Student with email ${doc.data().email} deleted.`);
    });
}

// Make sure deleteSection function is available globally
window.deleteSection = deleteSection;





// Function to edit student (to be implemented)
function editStudent(studentId) {
    console.log("Edit student with ID:", studentId);
    // Implement edit logic
}

// Function to delete student
// Function to delete the selected student
async function deleteStudent(studentId, button) {
    try {
        // Reference to the student document
        const studentDocRef = doc(db, "accounts", studentId);
        
        // Delete the student document from Firestore
        await deleteDoc(studentDocRef);
        console.log("Student deleted:", studentId);

        // Remove the row from the table
        const row = button.closest("tr"); // Get the parent row of the button
        row.remove(); // Remove the row from the DOM

    } catch (error) {
        console.error("Error deleting student:", error);
        alert("An error occurred while deleting the student.");
    }
}

