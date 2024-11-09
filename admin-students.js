const sections = ["section1", "section2", "section3"];

// Function to toggle password visibility
function togglePasswordVisibility(inputId) {
    const inputField = document.getElementById(inputId);
    const isPasswordVisible = inputField.type === "text";

    // Toggle the input type between "text" and "password"
    inputField.type = isPasswordVisible ? "password" : "text";
}

// Function to open the Add Student modal
function openAddStudentModal() {
    document.getElementById('modal-title').innerText = "Add New Student"; // Reset title
    clearModalInputs(); // Clear inputs when opening the modal
    document.getElementById('add-student-modal').style.display = 'block';
}

// Function to close the Add Student modal
function closeAddStudentModal() {
    document.getElementById('add-student-modal').style.display = 'none';
}

// Function to save a new student
function saveStudent() {
    const username = document.getElementById('username').value;
    const lastName = document.getElementById('last-name').value;
    const middleName = document.getElementById('middle-name').value;
    const firstName = document.getElementById('first-name').value;
    const studentSection = document.getElementById('student-section').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Add validation logic
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Check if we are editing an existing student or adding a new one
    const studentIndex = students.findIndex(s => s.username === username);

    if (studentIndex !== -1) {
        // Update existing student
        students[studentIndex] = {
            id: students[studentIndex].id, // Keep the same ID
            username,
            lastName,
            middleName,
            firstName,
            section: studentSection
        };
    } else {
        // Add new student
        const newStudent = {
            id: students.length + 1, // Assign an ID based on the current number of students
            username,
            lastName,
            middleName,
            firstName,
            section: studentSection
        };
        students.push(newStudent);
    }

    console.log('Students:', students);
    closeAddStudentModal();
    updateStudentTable();
}

// Function to clear modal inputs
function clearModalInputs() {
    document.getElementById('username').value = '';
    document.getElementById('last-name').value = '';
    document.getElementById('middle-name').value = '';
    document.getElementById('first-name').value = '';
    document.getElementById('student-section').value = 'section1'; // Reset to default
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

// Function to open the Edit Student modal
function openEditModal(studentId) {
    const studentData = students.find(s => s.id === studentId); // Find student by ID
    if (studentData) {
        // Populate the modal with the student data
        document.getElementById('username').value = studentData.username;
        document.getElementById('last-name').value = studentData.lastName;
        document.getElementById('middle-name').value = studentData.middleName;
        document.getElementById('first-name').value = studentData.firstName;
        document.getElementById('student-section').value = studentData.section;

        // Update the modal title
        document.getElementById('modal-title').innerText = "Edit Student"; // Change the title here
        
        // Show the modal
        document.getElementById('add-student-modal').style.display = 'block';
    }
}

// Function to delete a student
function deleteStudent(element) {
    const row = element.closest('tr');
    const username = row.cells[0].innerText; // Get the username from the row

    const studentIndex = students.findIndex(student => student.username === username);
    if (studentIndex !== -1) {
        students.splice(studentIndex, 1); // Remove the student from the array
    }

    updateStudentTable(); // Refresh the table after deletion
}

// Function to update the student table
function updateStudentTable() {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Populate the table with students
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.username}</td>
            <td>${student.lastName}</td>
            <td>${student.middleName}</td>
            <td>${student.firstName}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><img src="pen_2.png" alt="Edit Icon" class="icon-btn" onclick="openEditModal(${student.id})"></td>
            <td><img src="bin_3.png" alt="Delete Icon" class="icon-btn" onclick="deleteStudent(this)"></td>
        `;
        tableBody.appendChild(row);
    });
}

// Initial population of the table
updateStudentTable();

// Function to handle section change
function handleSectionChange(selectElement) {
    const selectedSection = selectElement.value;

    // Check if "Add New Section" is selected
    if (selectedSection === "add-new-section") {
        openAddSectionModal(); // Open the Add Section modal
        selectElement.value = "section1"; // Reset to a default value after opening modal
    }
    
    console.log('Selected section:', selectedSection);
}

// Function to open the Add Section modal
function openAddSectionModal() {
    document.getElementById('add-section-modal').style.display = 'block';
}

// Function to close the Add Section modal
function closeAddSectionModal() {
    document.getElementById('add-section-modal').style.display = 'none';
}

// Function to save the new section
function saveSection() {
    const sectionName = document.getElementById('section-name').value.trim();
    
    // Check if the section name is valid (not empty and not already existing)
    if (sectionName && !sections.includes(sectionName)) {
        // Add the new section to the array
        sections.push(sectionName);

        // Add the new section to the dropdown
        const sectionSelect = document.getElementById('section');
        const newOption = document.createElement('option');
        newOption.value = sectionName;
        newOption.textContent = sectionName;
        sectionSelect.appendChild(newOption);
        
        // Reset the input field
        document.getElementById('section-name').value = '';
        
        console.log('New section saved:', sectionName);
    } else {
        alert("Please enter a valid section name or it already exists.");
    }

    // Close the modal after saving
    closeAddSectionModal();
}

// Function to delete the selected section
function deleteSection() {
    const sectionSelect = document.getElementById('section');
    const selectedSection = sectionSelect.value;

    // Check if the selected section is not a default one
    if (selectedSection && sections.includes(selectedSection)) {
        // Remove the section from the array
        sections.splice(sections.indexOf(selectedSection), 1);
        
        // Remove the section from the dropdown
        sectionSelect.remove(sectionSelect.selectedIndex);

        // Filter out students from the deleted section
        students = students.filter(student => student.section !== selectedSection);

        console.log('Deleted section:', selectedSection);
        console.log('Remaining students:', students);
        
        updateStudentTable(); // Refresh the student table after deletion
    } else {
        alert("Please select a valid section to delete.");
    }
}

// Function to handle saving section data when the header Save button is clicked
function saveHeaderChanges() {
    const selectedSection = document.getElementById('section').value;
    
    // Example: Logic to save the current section or any other relevant data
    // You can customize this as per your requirements
    console.log('Saving changes for section:', selectedSection);

    // If you have any specific logic for saving data related to the selected section, implement it here.
    
    // For instance, if you want to save the current students in that section:
    const studentsInSection = students.filter(student => student.section === selectedSection);
    // Do something with studentsInSection, like saving to a database or local storage if needed

    alert(`Changes for ${selectedSection} have been saved!`);
}

// Update your HTML to ensure the Save button calls the saveHeaderChanges function
