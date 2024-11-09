import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAfO8C7DP4mDgQ7FeqEuFLG6zAIJrRUIUo",
    authDomain: "fb-juanventures-8b8e2.firebaseapp.com",
    projectId: "fb-juanventures-8b8e2",
    storageBucket: "fb-juanventures-8b8e2.appspot.com",
    messagingSenderId: "999840546607",
    appId: "1:999840546607:web:60ff7293b6cb3806caebda"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variable for collection name
const questionsCollection = "Quizzes4"; // Changeable collection name

document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.getElementById('addQuestionModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionText = document.getElementById('questionText');
    const answersSection = document.getElementById('answersSection');
    const modalTitle = document.querySelector('.modal-content h2');
    const questionsTable = document.querySelector('tbody');
    let isEditMode = false;
    let currentQuestionId = null;

    openModalBtn.addEventListener('click', () => {
        isEditMode = false;
        openModal();
    });

    function openModal() {
        // Update modal title and button text based on edit mode
        modalTitle.innerText = isEditMode ? 'Edit Question' : 'Add Question';
        addQuestionBtn.innerText = isEditMode ? 'Update Question' : 'Add Question';
        updateAnswersSection();
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
        questionText.value = '';
        answersSection.innerHTML = '';
        isEditMode = false;
        currentQuestionId = null;
    }

    const cancelQuestionBtn = document.getElementById('cancelQuestionBtn');
    cancelQuestionBtn.addEventListener('click', () => {
    closeModal();
    });

    addQuestionBtn.addEventListener('click', async () => {
        if (questionText.value.trim() === '') {
            alert("Please enter a question.");
            return;
        }

        const answers = Array.from(answersSection.querySelectorAll('input[type="text"]')).map(input => input.value);
        const correctAnswer = document.querySelector('input[name="correctAnswer"]:checked');

        if (!answers.every(answer => answer.trim() !== '') || !correctAnswer) {
            alert("Please fill out all answers and select the correct answer.");
            return;
        }

        const questionData = {
            Question: questionText.value,
            Options: answers,
            Answer: correctAnswer.value
        };

        if (isEditMode) {
            await updateQuestionInFirestore(currentQuestionId, questionData);
        } else {
            await addQuestionToFirestore(questionData);
        }
        closeModal();
        await loadQuestions();
    });

    function updateAnswersSection() {
        const answers = ['A', 'B', 'C', 'D'];
    
        // Only clear and recreate inputs if it's a new question (not in edit mode)
        if (!isEditMode) {
            answersSection.innerHTML = ''; // Clear answers section for new questions
        }
    
        // Update existing fields or create new ones
        answers.forEach((label, index) => {
            let div = answersSection.querySelector(`#answer-${label}`);
            
            if (!div) { // Create new div if it doesn't exist
                div = document.createElement('div');
                div.id = `answer-${label}`;
                answersSection.appendChild(div);
            }
    
            // Create or update the radio button
            let radioInput = div.querySelector('input[type="radio"]');
            if (!radioInput) {
                radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = 'correctAnswer';
                radioInput.value = label;
                div.appendChild(radioInput);
            }
    
            // Create or update the input for the answer text
            let answerInput = div.querySelector('input[type="text"]');
            if (!answerInput) {
                answerInput = document.createElement('input');
                answerInput.type = 'text';
                answerInput.placeholder = `Answer ${label}`;
                div.appendChild(answerInput);
            }
    
            // Ensure the correct input exists and is updated
            answerInput.placeholder = `Answer ${label}`;
        });
    }

    async function addQuestionToFirestore(questionData) {
        try {
            await addDoc(collection(db, questionsCollection), questionData); // Use the variable here
            alert("Question added successfully.");
        } catch (error) {
            console.error("Error adding question: ", error);
        }
    }

    async function updateQuestionInFirestore(id, questionData) {
        try {
            const questionRef = doc(db, questionsCollection, id); // Use the variable here
            await updateDoc(questionRef, questionData);
            alert("Question updated successfully.");
        } catch (error) {
            console.error("Error updating question: ", error);
        }
    }

    async function deleteQuestionFromFirestore(id) {
        try {
            await deleteDoc(doc(db, questionsCollection, id)); // Use the variable here
            alert("Question deleted successfully.");
            await loadQuestions();
        } catch (error) {
            console.error("Error deleting question: ", error);
        }
    }

    async function loadQuestions() {
        questionsTable.innerHTML = '';
        const querySnapshot = await getDocs(collection(db, questionsCollection)); // Use the variable here
        let index = 1;
        querySnapshot.forEach((doc) => {
            const questionData = doc.data();
            const questionText = questionData.Question || "No question text available";

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index++}</td>
                <td>${questionText}</td>
                <td>Multiple Choice</td>
                <td><img src="pen_2.png" alt="Edit Icon" class="icon-btn" onclick="editQuestion('${doc.id}')"></td>
                <td><img src="bin_3.png" alt="Delete Icon" class="icon-btn" onclick="deleteQuestion('${doc.id}')"></td>
            `;
            questionsTable.appendChild(row);
        });
    }

    window.editQuestion = async function(id) {
        isEditMode = true;
        currentQuestionId = id;
        
        // Fetch question data from Firestore based on the id
        const docRef = doc(db, questionsCollection, id); // Use the variable here
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const questionData = docSnap.data();
            questionText.value = questionData.Question;
    
            // Update the answer section with fields (do not clear them)
            updateAnswersSection();
    
            // Populate answers in the modal (ensure no new fields are added, only values are updated)
            const answers = answersSection.querySelectorAll('input[type="text"]');
            answers[0].value = questionData.Options[0];
            answers[1].value = questionData.Options[1];
            answers[2].value = questionData.Options[2];
            answers[3].value = questionData.Options[3];
    
            // Ensure `questionData.Answer` is a string (e.g., 'A', 'B', 'C', 'D')
            const correctAnswerLetter = questionData.Answer;
    
            // Wait for the radio buttons to be rendered before checking
            setTimeout(() => {
                const correctAnswerRadio = document.querySelector(`input[name="correctAnswer"][value="${correctAnswerLetter}"]`);
                if (correctAnswerRadio) {
                    correctAnswerRadio.checked = true;
                } else {
                    console.warn(`No radio button found for answer: ${correctAnswerLetter}`);
                }
            }, 0);
            
            // Open the modal in edit mode
            openModal();
        } else {
            alert("No such question exists!");
        }
    };

    window.deleteQuestion = async function(id) {
        await deleteQuestionFromFirestore(id);
    };

    // Load questions on page load
    await loadQuestions();
});
