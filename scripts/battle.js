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
        let x = await fetch(apiUrl);
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




    const arena = new Image()
    const comment = document.getElementById("move-comment");
    const chance = document.getElementById("chance");

    
    arena.src = "../images/arena.png";

    const canvas = document.getElementById('battle-canvas');
    const ctx = canvas.getContext('2d');
    arena.onload = function(){
        ctx.drawImage(arena, 0, 0);
        const img1 = new Image()
        const img2 = new Image()
        img1.src = JSON.parse(sessionStorage.getItem(user1)).img_back;
        img2.src = JSON.parse(sessionStorage.getItem(user2)).img_front;
        img1.onload = function(){
            ctx.drawImage(img1, 100, 350, 2*img1.width, 2*img1.height);
        }
        img2.onload = function(){
            ctx.drawImage(img2, 550, 220, 2*img2.width, 2*img2.height);
        }
    }


    const poke_name_1 = document.getElementById("poke_name_1");
    const poke_name_2 = document.getElementById("poke_name_2");
    poke_name_1.textContent = user1;
    poke_name_2.textContent = user2;
    



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
            sessionStorage.clear();
            sessionStorage.setItem("winner", JSON.stringify({"name":user2, "hp":player2Health}));
            window.location.href = "../pages/winner.html";
        } else if (player2Health <= 0) {
            sessionStorage.clear();
            sessionStorage.setItem("winner", JSON.stringify({"name":user1, "hp":player1Health}));
            window.location.href = "../pages/winner.html";
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

    const audio = document.getElementById("audio");
    audio.addEventListener("canplaythrough", function() {
        audio.play();
    });

    const screenSize = window.innerWidth;

    function checkScreenSize() {
        if (window.innerWidth < 800) {
            const gameContainer = document.getElementsByClassName('master-container');
            gameContainer[0].style.display = 'none';

            const message = document.getElementById('small-screen')
            message.style.display = 'flex';

        } else {
            const gameContainer = document.getElementsByClassName('master-container');
            gameContainer[0].style.display = 'flex';

            const message = document.getElementById('small-screen')
            message.style.display = 'none';
        }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();

    const attackButtons1 = document.querySelectorAll('[id^="attack-button_1_"]');
    const attackButtons2 = document.querySelectorAll('[id^="attack-button_2_"]');

    function showTooltip(event, move) {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.textContent = `Damage: ${move.damage}, Accuracy: ${move.accuracy}%`;
        tooltip.classList.add('text_box');
        const gameContainer = document.getElementsByClassName('master-container');
        gameContainer[0].appendChild(tooltip);
    }

    function hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    attackButtons1.forEach((button, index) => {
        button.addEventListener('mouseover', (event) => {
            showTooltip(event, moves1[index]);
        });
        button.addEventListener('mouseout', () => {
            hideTooltip();
        });
    });

    attackButtons2.forEach((button, index) => {
        button.addEventListener('mouseover', (event) => {
            showTooltip(event, moves2[index]);
        });
        button.addEventListener('mouseout', () => {
            hideTooltip();
        });
    });
    
}

main()