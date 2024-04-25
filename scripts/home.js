sessionStorage.clear();


var poke_options = [];
for (var i = 1; i < 5; i++) {
    poke_options.push(Math.floor(Math.random() * (1025 - 1 + 1)) + 1);
}

var poke_options_names = [];
var fetchPromises = [];

for (var i = 0; i < 4; i++) {
    var apiUrl = `https://pokeapi.co/api/v2/pokemon/${poke_options[i]}`;
    var fetchPromise = fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            poke_options_names.push(data.name);
            sessionStorage.setItem(data.name, JSON.stringify({"img_back":data.sprites.other.showdown.back_default, "img_front":data.sprites.other.showdown.front_default, "hp":data.stats[0].base_stat}));
        });
    fetchPromises.push(fetchPromise);
}

Promise.all(fetchPromises)
    .then(() => {
        var select1 = document.getElementById("player1-select");
        var select2 = document.getElementById("player2-select");
        for (var i = 0; i < 4; i++) {
            var option1 = document.createElement("option");
            var option2 = document.createElement("option");
            option1.text = poke_options_names[i];
            option2.text = poke_options_names[i];
            select1.add(option1);
            select2.add(option2);
        }
        set_options();
    });



function set_options(){
    const button = document.querySelector("#start-button");
    button.addEventListener("click", function() {
        const player1Selection = player1Pokemon.value;
        const player2Selection = player2Pokemon.value;
        
        if (player1Selection!=="none" && player2Selection!=="none") {
            sessionStorage.setItem("player1Selection", player1Pokemon.value);
            sessionStorage.setItem("player2Selection", player2Pokemon.value);
            window.location.href = `../pages/main_game.html`;
        } else {
            alert("Please choose a pokemon for both players.");
        }
    });
    
    const loading = document.getElementById('loading');
    loading.style.display = "none";
    const selections = document.getElementById('player-select');
    selections.style.display = "flex";
    const start = document.getElementById('start');
    start.style.display = "flex";
}





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

