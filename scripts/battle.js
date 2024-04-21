window.onload = function poke_check() {
    const loading = document.getElementById('loading');
    loading.style.display = "flex";
    const master = document.getElementsByClassName('master-container');
    master[0].style.display = "none";
    setTimeout(function() {
        console.log("Battle page loaded");
        const user1 = sessionStorage.getItem("player1Selection")
        const user2 = sessionStorage.getItem("player2Selection")
        if (user1 === null || user2 === null) {
            console.log("Invalid Pokemon")
            alert("Please choose a pokemon for both players.");
            window.location.href = `../index.html`;
        }
    }, 100);
} 

async function main(){
    const user1 = sessionStorage.getItem("player1Selection")
    const user2 = sessionStorage.getItem("player2Selection")


    async function get_attacks(apiUrl) {
        x = await fetch(apiUrl);
        data = await x.json();
        return data;
    }

    var apiUrl = `https://pokeapi.co/api/v2/pokemon/${user1.toLowerCase()}`;
    const data1 = await get_attacks(apiUrl);
    apiUrl = `https://pokeapi.co/api/v2/pokemon/${user2.toLowerCase()}`;
    const data2 = await get_attacks(apiUrl);
    // Move the console.log(data1) outside the promise


    async function fetchAttackDamage(apiUrl) {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    }

    async function choose_three_random(data){
        var moves = []
        var i = 0;
        while (i < 3) {
            var random = Math.floor(Math.random() * data.length);
            const data1 = await fetchAttackDamage(data[random].move.url);
            const reducer = Math.floor(Math.random() * (4 - 3 + 1)) + 1 ;
            if (data1.power > 0){
                data[random].move.damage = data1.power/reducer;
                data[random].move.accuracy = data1.accuracy;
                moves.push(data[random].move);
                i++
            }
        }
        return moves;
    }

    var moves1 = await choose_three_random(data1.moves);
    var moves2 = await choose_three_random(data2.moves);





    const img1 = document.getElementById("img_1");
    const img2 = document.getElementById("img_2");
    const comment = document.getElementById("move-comment");
    const chance = document.getElementById("chance");

    img1.src = JSON.parse(sessionStorage.getItem(user1)).img;
    img2.src = JSON.parse(sessionStorage.getItem(user2)).img;

    chance.textContent = `It's ${user1}'s turn!`;

    // Set HTML elements with ids attack-button_x_y
    for (let i = 0; i < moves1.length; i++) {
        const attackButton = document.getElementById(`attack-button_1_${i+1}`);
        attackButton.textContent = moves1[i].name;
    }

    for (let i = 0; i < moves2.length; i++) {
        const attackButton = document.getElementById(`attack-button_2_${i+1}`);
        attackButton.textContent = moves2[i].name;
    }


    const health1 = document.getElementById("HP1");
    const health2 = document.getElementById("HP2");
    const healthBar1 = document.getElementById("health-1");
    const healthBar2 = document.getElementById("health-2");
    let player1Health = JSON.parse(sessionStorage.getItem(user1)).hp * 8;
    let player2Health = JSON.parse(sessionStorage.getItem(user2)).hp * 8;
    healthBar1.max = player1Health;
    healthBar2.max = player2Health;
    healthBar1.value = player1Health;
    healthBar2.value = player2Health;
    console.log(healthBar1.max, healthBar1.value, player1Health, healthBar1);
    health1.textContent = `HP: ${player1Health}`;
    health2.textContent = `HP: ${player2Health}`;

    

    function attackPlayer(attacker, defender, taker, move) {
        const accuracy = move.accuracy;
        const damage = move.damage;

        // Check if the attack hits based on accuracy
        const hit = Math.random() < accuracy/100;

        if (hit) {
            // Reduce defender's health by the damage
            if (taker === 1){ 
                player1Health-= damage;
            } else {
                player2Health-= damage;
            }
            console.log(`${attacker} attacked ${defender} with ${move.name} and dealt ${damage} damage.`);
            comment.textContent = `${attacker} attacked ${defender} with ${move.name} and dealt ${damage} damage.`;
        } else {
            console.log(`${attacker}'s attack missed.`);
            comment.textContent = `${attacker}'s attack missed.`;
        }
        chance.textContent = `It's ${defender}'s turn!`;
    }

    function updateHealth() {
        

        

        health1.textContent = `HP: ${player1Health}`;
        health2.textContent = `HP: ${player2Health}`;

        healthBar1.value = player1Health;
        healthBar2.value = player2Health;

        if (player1Health <= 0) {
            alert(`Player 2 wins with ${user2}!`);
            sessionStorage.clear();
            window.location.href = "../index.html";
        } else if (player2Health <= 0) {
            alert(`Player 1 wins with ${user1}!`);
            sessionStorage.clear();
            window.location.href = "../index.html";
        }
    }


    let currentPlayer = 1;

    function switchTurn() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    function handleAttackClick(attacker, defender, taker, move) {
        if (currentPlayer !== taker) {
            attackPlayer(attacker, defender, taker, move);
            updateHealth();
            switchTurn();
        } else {
            if (taker === 1) {
                alert(`It's ${user1}'s turn!`);
            } else {
                alert(`It's ${user2}'s turn!`)
            }
        }
    }

    // Add event listeners to attack buttons
    for (let i = 0; i < moves1.length; i++) {
        const attackButton = document.getElementById(`attack-button_1_${i + 1}`);
        attackButton.addEventListener("click", function () {
            handleAttackClick(user1, user2, 2, moves1[i]);
        });
    }

    for (let i = 0; i < moves2.length; i++) {
        const attackButton = document.getElementById(`attack-button_2_${i + 1}`);
        attackButton.addEventListener("click", function () {
            handleAttackClick(user2, user1, 1, moves2[i]);
        });
    }
    console.log("Battle page ready");
    const loading = document.getElementById('loading');
    loading.style.display = "none";
    const master = document.getElementsByClassName('master-container');
    master[0].style.display = "flex";
    
}

main()