// Variables to store game data
let randomGames = [];
let selectedGames = [];
let previousRecommendations = [];
let dislikedGames = [];

// Fetch random games when DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchRandomGames);

// Function to fetch random games from the server
async function fetchRandomGames() {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_random_games?n=12');
        randomGames = await response.json();
        displayGames(randomGames);
    } catch (error) {
        console.error('Error fetching random games:', error);
    }
}

// Function to display games in the HTML
function displayGames(games) {
    const gameList = document.getElementById('game-list');
    gameList.innerHTML = '';

    games.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105';
        card.innerHTML = `
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-100 mb-2">${game.name}</h3>
                <p class="text-sm text-gray-400 mb-1">Platforms: ${game.platforms}</p>
                <p class="text-sm text-gray-400 mb-1">Genres: ${game.genres}</p>
                <p class="text-sm text-gray-400 mb-4">Publishers: ${game.publishers}</p>
                <button onclick="selectGame(${index})" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">Select</button>
            </div>
        `;
        gameList.appendChild(card);
    });
}

// Function to handle game selection
function selectGame(index) {
    if (!selectedGames.includes(randomGames[index])) {
        selectedGames.push(randomGames[index]);
        updateSelectedGamesList();
    }
}

// Function to update the selected games list
function updateSelectedGamesList() {
    const selectedGamesList = document.getElementById('selected-games-list');
    selectedGamesList.innerHTML = '';

    selectedGames.forEach((game, index) => {
        const li = document.createElement('li');
        li.className = 'bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105';
        li.innerHTML = `
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-100 mb-2">${game.name}</h3>
                <p class="text-sm text-gray-400 mb-1">Platforms: ${game.platforms}</p>
                <p class="text-sm text-gray-400 mb-1">Genres: ${game.genres}</p>
                <p class="text-sm text-gray-400 mb-4">Publishers: ${game.publishers}</p>
                <button onclick="removeSelectedGame(${index})" class="w-full bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800 transition duration-300">Remove</button>
            </div>
        `;
        selectedGamesList.appendChild(li);
    });

    if (selectedGames.length >= 4) {
        getRecommendations();
    }
}

// Function to remove selected games
function removeSelectedGame(index) {
    selectedGames.splice(index, 1);
    updateSelectedGamesList();
}

// Function to fetch and display recommendations
async function getRecommendations() {
    try {
        const response = await fetch('http://127.0.0.1:5000/recommend_games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                selected_games: selectedGames,
                previous_recommendations: previousRecommendations,
                disliked_games: dislikedGames
            })
        });
        const recommendedGames = await response.json();
        displayRecommendations(recommendedGames);
    } catch (error) {
        console.error('Error recommending games:', error);
    }
}

// Function to display recommended games
function displayRecommendations(games) {
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = '';

    games.forEach((game) => {
        const li = document.createElement('li');
        li.className = 'bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105';
        li.innerHTML = `
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-100 mb-2">${game.name}</h3>
                <p class="text-sm text-gray-400 mb-1">Platforms: ${game.platforms}</p>
                <p class="text-sm text-gray-400 mb-1">Genres: ${game.genres}</p>
                <p class="text-sm text-gray-400 mb-4">Publishers: ${game.publishers}</p>
                <div class="flex justify-between">
                    <button onclick="likeGame('${game.name}')" class="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition duration-300 flex-grow mr-2">Like</button>
                    <button onclick="dislikeGame('${game.name}')" class="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800 transition duration-300 flex-grow ml-2">Dislike</button>
                </div>
            </div>
        `;
        recommendationsList.appendChild(li);
    });
}

// Function to handle liking a game
function likeGame(gameName) {
    previousRecommendations.push(gameName);
    getRecommendations();
}

// Function to handle disliking a game
function dislikeGame(gameName) {
    dislikedGames.push(gameName);
    getRecommendations();
}

// Slideshow functionality
let slideIndex = 0;
showSlides(slideIndex);

// Navigate slideshow
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Display the current slide
function showSlides(n) {
    let slides = document.getElementsByClassName("slideshow-image");
    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
}

// Smooth scroll to sections
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Open login or signup popup
document.getElementById('login-btn').addEventListener('click', () => openPopup('popup-login'));
document.getElementById('signup-btn').addEventListener('click', () => openPopup('popup-signup'));

// Open popup
function openPopup(popupId) {
    document.getElementById(popupId).classList.remove('hidden');
}

// Close popup
function closePopup(popupId) {
    document.getElementById(popupId).classList.add('hidden');
}

