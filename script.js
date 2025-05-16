let points = 1000;
let bet = 0;
let playerHand = [];
let dealerHand = [];
let gameActive = false;

const winSound = new Audio('/sounds/win_sound.mp3');
const loseSound = new Audio('/sounds/lose_sound.mp3');
const cardSound = new Audio('/sounds/shuffle_sound.mp3');


function drawCardValue() {
    return Math.floor(Math.random() * 10) + 1; // card value between 1 and 10
}

function getCardHTML(value) {
    return `
    <div class="card">
      <img src="CardImages/monster${value}.png" alt="Card ${value}">
      <div class="card-number">${value}</div>
    </div>
  `;
}

function updateUI() {
    document.getElementById('points').textContent = points;
    document.getElementById('playerCards').innerHTML = playerHand.map(getCardHTML).join('');
    document.getElementById('dealerCards').innerHTML = dealerHand.map(getCardHTML).join('');
    document.getElementById('playerTotal').textContent = playerHand.reduce((a, b) => a + b, 0);
    document.getElementById('dealerTotal').textContent = dealerHand.reduce((a, b) => a + b, 0);
}

function startRound() {
    bet = parseInt(document.getElementById('betAmount').value);
    if (isNaN(bet) || bet <= 0 || bet > points) {
        alert('Invalid bet amount!');
        return;
    }

    playerHand = [drawCardValue(), drawCardValue()];
    dealerHand = [drawCardValue()];
    cardSound.play(); // 🎧 shuffle
    gameActive = true;
    document.getElementById('drawBtn').disabled = false;
    document.getElementById('standBtn').disabled = false;
    document.getElementById('message').textContent = '';
    updateUI();
}

function drawCard() {
    if (!gameActive) return;
    cardSound.play(); // 🔊 Shuffle
    playerHand.push(drawCardValue());
    updateUI();
    if (playerHand.reduce((a, b) => a + b, 0) > 21) {
        endGame("You busted!");
    }
}


function stand() {
    if (!gameActive) return;
    while (dealerHand.reduce((a, b) => a + b, 0) < 17) {
        dealerHand.push(drawCardValue());
    }
    updateUI();

    const playerTotal = playerHand.reduce((a, b) => a + b, 0);
    const dealerTotal = dealerHand.reduce((a, b) => a + b, 0);

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
        endGame("You win!", true);
    } else if (playerTotal === dealerTotal) {
        endGame("It's a draw!");
    } else {
        endGame("Dealer wins!");
    }
}

function newRound() {
    playerHand = [];
    dealerHand = [];
    bet = 0;
    gameActive = false;

    document.getElementById('betAmount').value = '';
    document.getElementById('playerTotal').textContent = '0';
    document.getElementById('dealerTotal').textContent = '0';
    document.getElementById('playerCards').innerHTML = '';
    document.getElementById('dealerCards').innerHTML = '';
    document.getElementById('message').textContent = '';

    document.getElementById('drawBtn').disabled = true;
    document.getElementById('standBtn').disabled = true;
}


function endGame(message, win = false) {
    gameActive = false;
    if (win) {
        points += bet;
        winSound.play(); // 🎧 Win
    } else if (message !== "It's a draw!") {
        points -= bet;
        loseSound.play(); // 🎧 Lose
    }

    document.getElementById('drawBtn').disabled = true;
    document.getElementById('standBtn').disabled = true;
    updateUI();

    let icon = 'info';
    let color = '#f9ca24'; // yellow by default

    if (message === "You win!") {
        icon = 'success';
        color = '#27ae60'; // green
    } else if (message === "Dealer wins!" || message === "You busted!") {
        icon = 'error';
        color = '#e74c3c'; // red

    }

    Swal.fire({
        title: message,
        icon: icon,
        background: '#2c2c3e',
        color: '#fff',
        confirmButtonColor: color,
        confirmButtonText: 'Next'
    });
}
