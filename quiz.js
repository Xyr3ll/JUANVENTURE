// Get a reference to the Firestore service
const db = firebase.firestore();

// Function to load quiz data
function loadQuizData() {
    const quizContainer = document.getElementById('quiz-container');
    
    // Reference to the 'Quizzes' collection
    db.collection("Quizzes").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const quizData = doc.data();
            const question = quizData.Question;
            const options = quizData.Options;

            // Create HTML elements for the question and options
            const questionElement = document.createElement('h3');
            questionElement.textContent = question;
            quizContainer.appendChild(questionElement);

            options.forEach(option => {
                const optionButton = document.createElement('button');
                optionButton.textContent = option;
                quizContainer.appendChild(optionButton);
            });
        });
    }).catch((error) => {
        console.error("Error getting documents: ", error);
    });
}

// Call the function to load quiz data
loadQuizData();
