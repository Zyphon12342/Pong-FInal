const socket = io();
let canvas, model, view, controller;
let playerId = null;

const menu = document.getElementById('menu');
const gameContainer = document.getElementById('game-container');
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomIdInput = document.getElementById('roomIdInput');
const sound1 = new Audio('../audio/pl1 audio.mp3');
const sound2 = new Audio('../audio/pl2 audio.mp3');
const sound3 = new Audio('../audio/wall audio.mp3');
const sound4 = new Audio('../audio/wall alt audio.mp3');

socket.on('playSound', (soundId) => {
    switch (soundId) {
        case 1:
            sound1.play();
            break;
        case 2:
            sound2.play();
            break;
        case 4:
            sound3.play();
            break;
        case 3:
            sound4.play();
            break;
    }
});


createRoomBtn.addEventListener('click', () => {
    socket.emit('createRoom');
});

joinRoomBtn.addEventListener('click', () => {
    const roomId = roomIdInput.value.trim();
    if (roomId) {
        socket.emit('joinRoom', roomId);
    }
});

socket.on('roomCreated', (roomId) => {
    alert(`Room created with ID: ${roomId}`);
    startGame();
});

socket.on('roomJoined', (roomId) => {
    alert(`Joined room with ID: ${roomId}`);
    startGame();
});

socket.on('roomJoinError', (error) => {
    alert(error);
});

socket.on('playerAssigned', (assignedPlayerId) => {
    playerId = assignedPlayerId;
});

socket.on('gameStart', (initialState) => {
    console.log('Game started!', initialState);
    if (model) {
        model.updateGameState(initialState);
    }
});

socket.on('gameStateFull', (gameState) => {
    console.log('Received full game state:', gameState);
    if (model) {
        model.updateGameState(gameState);
    }
});

socket.on('gameStateDelta', (deltaState) => {
    if (model) {
        model.updateDeltaState(deltaState);
    }
});

function startGame() {
    menu.style.display = 'none';
    gameContainer.style.display = 'block';

    canvas = document.getElementById('pongCanvas');
    model = new GameModel();
    view = new GameView(canvas);
    controller = new GameController(model, view, socket, playerId);

    controller.start();
}

window.addEventListener('load', () => {
    // The game will start when a room is created or joined
});