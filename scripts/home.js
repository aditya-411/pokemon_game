// Define your JavaScript code here

// Example code: Display a message in the console
console.log("Home page loaded");


// Example code: Add an event listener to a button
const button = document.querySelector("#start-button");
button.addEventListener("click", function() {
    const player1Selection = player1Pokemon.value;
    const player2Selection = player2Pokemon.value;
    
    if (player1Selection!=="none" && player2Selection!=="none") {
        // Redirect to the main game page with the selected pokemon info
        sessionStorage.setItem("player1Selection", player1Pokemon.value);
        sessionStorage.setItem("player2Selection", player2Pokemon.value);
        window.location.href = `../pages/main_game.html`;
    } else {
        alert("Please choose a pokemon for both players.");
    }
});


// Example code: Manipulate the DOM


const background = document.querySelector("body");
background.style.backgroundImage = "url('../images/home_bg.jpeg')";
background.style.backgroundSize = "cover";
background.style.backgroundRepeat = "no-repeat";
background.style.backgroundPosition = "center";

const game_name = document.querySelector("#game_name");
game_name.src = "../images/game_name.png";
game_name.style.width = "50vw";
game_name.selfalign = "center";


const player1Pokemon = document.querySelector("#player1-select");
const player2Pokemon = document.querySelector("#player2-select");

player1Pokemon.addEventListener("change", function() {
    const selectedPokemon = player1Pokemon.value;
    player2Pokemon.querySelectorAll("option").forEach(option => {
        if (option.value === selectedPokemon) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });
});

player2Pokemon.addEventListener("change", function() {
    const selectedPokemon = player2Pokemon.value;
    player1Pokemon.querySelectorAll("option").forEach(option => {
        if (option.value === selectedPokemon) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });
});