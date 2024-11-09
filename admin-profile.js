// Function to toggle password visibility
function togglePassword(inputId) {
    const inputField = document.getElementById(inputId);
    if (inputField.type === "password") {
        inputField.type = "text"; // Change to text to show the password
    } else {
        inputField.type = "password"; // Change back to password to hide it
    }
}

// Function to handle image upload
document.getElementById('file-input').addEventListener('change', function() {
    const file = this.files[0]; // Get the selected file
    const reader = new FileReader(); // Create a FileReader object

    reader.onload = function(e) {
        // Set the background image of the profile picture div to the selected image
        document.getElementById('profile-pic').style.backgroundImage = `url(${e.target.result})`;
        document.getElementById('profile-pic').style.backgroundSize = 'cover'; // Ensures the image covers the div
        document.getElementById('profile-pic').style.backgroundPosition = 'center'; // Centers the image
        document.getElementById('profile-pic').style.height = '100px'; // Set the height
        document.getElementById('profile-pic').style.width = '100px'; // Set the width
        document.getElementById('profile-pic').style.borderRadius = '50%'; // Make it circular
        document.getElementById('profile-pic').style.border = '2px solid #ccc'; // Add a border
    };

    if (file) {
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});

// Function to toggle edit mode
function toggleEditMode() {
    console.log("Edit button clicked");
    const nameInput = document.getElementById('name');
    const passInput = document.getElementById('pass');
    const saveBtn = document.querySelector('.save-btn');

    if (!nameInput || !passInput || !saveBtn) {
        console.error("One or more elements are missing: nameInput, passInput, or saveBtn.");
        return;
    }

    // Toggle the 'disabled' attribute on the input fields
    nameInput.disabled = !nameInput.disabled;
    passInput.disabled = !passInput.disabled;

    // Toggle the visibility of the save button
    if (!nameInput.disabled) {
        saveBtn.classList.remove('hidden');  // Show the Save button if inputs are enabled
        saveBtn.disabled = false;
    } else {
        saveBtn.classList.add('hidden'); // Hide the Save button if inputs are disabled
        saveBtn.disabled = true;
    }
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents the form from reloading the page

    // Hide the Save button after submission
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.classList.add('hidden'); // Hide the Save button
        saveBtn.disabled = true;
    }

    // Optionally reset the input fields or perform other actions
    const nameInput = document.getElementById('name');
    const passInput = document.getElementById('pass');

    // Disable inputs again after saving
    if (nameInput && passInput) {
        nameInput.disabled = true;
        passInput.disabled = true;
    }

    alert('Form submitted!'); // You can replace this with any other logic you want
});