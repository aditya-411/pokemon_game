// Retrieve the winner pokemon from session storage
const winnerPokemon = JSON.parse(sessionStorage.getItem('winner'));

// Set the winner's name and HP to the page element
const winnerNameElement = document.getElementById('winner-name');
const winnerHpElement = document.getElementById('winner-hp');

winnerNameElement.textContent = winnerPokemon.name;
winnerHpElement.textContent = `${winnerPokemon.hp} HP`;