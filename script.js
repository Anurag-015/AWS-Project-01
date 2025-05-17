async function fetchRandomGames() {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_random_games?n=10');
        const games = await response.json();
        displayGamesWithIndices(games);
    } catch (error) {
        console.error('Error fetching random games:', error);
    }
}

function displayGamesWithIndices(games) {
    const gameList = document.getElementById('game-list');
    gameList.innerHTML = '';

    games.forEach((game, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index}: ${game.name} — Platforms: ${game.platforms}, Genres: ${game.genres}, Publishers: ${game.publishers}`;
        gameList.appendChild(listItem);
    });
    const selectionInput = document.createElement('input');
    selectionInput.setAttribute('placeholder', 'Select 4 games by indices (e.g., 1 3 5 7)');
    gameList.appendChild(selectionInput);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.onclick = () => selectGames(selectionInput.value, games);
    gameList.appendChild(submitButton);
}
async function selectGames(selection, randomGames) {
    const selectedIndices = selection.split(' ').map(Number);

    if (selectedIndices.length !== 4 || selectedIndices.some(idx => idx < 0 || idx >= randomGames.length)) {
        alert('Please select exactly 4 valid game indices.');
        return;
    }
    const selectedGames = selectedIndices.map(idx => randomGames[idx]);

    let previousRecommendations = [];
    let dislikedGames = [];

    while (true) {
        const recommendedGames = await recommendGames(selectedGames, previousRecommendations, dislikedGames);
        if (recommendedGames.length === 0) {
            alert('No more recommendations available based on your selections.');
            break;
        }

        console.log('Recommended games:', recommendedGames);
        const feedback = prompt(`Recommended games: ${recommendedGames.map(g => g.name).join(', ')}\nDo you like the recommendation? (yes/no) or type 'exit' to stop:`).toLowerCase();

        if (feedback === 'exit') {
            alert('Exiting the recommendation system.');
            break;
        } else if (feedback === 'yes') {
            previousRecommendations = previousRecommendations.concat(recommendedGames.map(g => g.name));
        } else if (feedback === 'no') {
            dislikedGames = dislikedGames.concat(recommendedGames.map(g => g.name));
        } else {
            alert('Invalid input, please enter "yes", "no", or "exit".');
        }
    }
}
async function recommendGames(selectedGames, previousRecommendations, dislikedGames) {
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
        return await response.json();
    } catch (error) {
        console.error('Error recommending games:', error);
        return [];
    }
}

function init() {
    fetchRandomGames();
}

// Call the init function to start the app
document.addEventListener('DOMContentLoaded', init);
