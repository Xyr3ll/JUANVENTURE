// JavaScript for pagination and story management
let currentPage = 0; // Current page index
const totalPages = 3; // Total number of story pages

// Function to navigate to the next page
document.getElementById('next-page').addEventListener('click', function() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        updatePage();
    }
});

// Function to navigate to the previous page
document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 0) {
        currentPage--;
        updatePage();
    }
});

// Update the page indicators and cards based on the current page
function updatePage() {
    const squares = document.querySelectorAll('.square');
    squares.forEach((square, index) => {
        square.style.backgroundColor = index === currentPage ? 'darkgray' : 'gray';
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.display = index === currentPage ? 'flex' : 'none'; // Show the current card
    });
}

// Initial setup: Show only the first card and set the first square indicator
updatePage();
