let winner = false;

//player factory functions
const playerFactory = (name, marker, markerSrc) => {
  let playerCells = [];
  let playerTurn = false;
  let playerScore = 0;
  return { name, marker, markerSrc, playerCells, playerTurn, playerScore};
};

const playerOne = playerFactory('Champion of X', 'x', './imgs/X.png');
const playerTwo = playerFactory('Champion of O', 'o', './imgs/O.png');


//dynamically draw grid with eventlisterner for player click
function createGame() {
  const rowClassNames = ['topRow', 'middleRow', 'bottomRow'];
  const cellClassNames = ['LeftCell', 'CenterCell', 'RightCell'];
  const rowLength = rowClassNames.length;
  const columnLength = cellClassNames.length;
  const container = document.querySelector('.container');
  hideElement('.startElements')
  for (let gridX = 0; gridX < rowLength; gridX++) {
    let row = document.createElement('div');
    row.classList.add(rowClassNames[gridX]);
    container.appendChild(row)
    for (let gridY = 0; gridY < columnLength; gridY++) {
      let cell = document.createElement('div');
      let cellName = rowClassNames[gridX]+cellClassNames[gridY];
      cell.classList.add(cellName);
      cell.onclick = () => placePlayerMarker(cell, );
      row.appendChild(cell);
    }              
  }
  updateName(playerOne);
  updateName(playerTwo);
  updateAnnouncementBoard();
}

//hide element
function hideElement(elementClass) {
  const element = document.querySelector(elementClass);
  element.style.display === 'none' ?
  element.style.display = 'block' :
  element.style.display = 'none';
}

//update name from input fields
function updateName(player) {
  let playerName = document.querySelector(`.${player.marker}Input`).value
  if (playerName !== '') {
    player.name = playerName;
  }
}

//check gamestatus and update announcement- and score-board
function updateAnnouncementBoard(currentPlayer) {
  const announcementBoard = document.querySelector('.announcementBoard');
  const score = document.querySelector('.score');
  const namePlates = document.querySelector('.namePlates');
  if (winner) {
    hideElement('.resetBtn');
    score.innerHTML = `${playerOne.playerScore} : ${playerTwo.playerScore}`;
    return announcementBoard.innerHTML = `${currentPlayer.name} wins!`;
  } else if (playerOne.playerCells.length === 5 || playerTwo.playerCells.length === 5) {
    markDraw()
    announcementBoard.innerHTML = `It's a Draw!`;
  }
  if (!playerOne.playerTurn && !playerTwo.playerTurn){
    announcementBoard.innerHTML = `It is ${randomStartingPlayer()}'s turn!`;
    namePlates.innerHTML = `${playerOne.name} VS ${playerTwo.name}`;
    score.innerHTML = `${playerOne.playerScore} : ${playerTwo.playerScore}`;
  } else if (playerOne.playerTurn) {
    announcementBoard.innerHTML = `It is ${playerOne.name}'s turn!`;
  } else if (playerTwo.playerTurn) {
    announcementBoard.innerHTML = `It is ${playerTwo.name}'s turn!`;
  }
};

//randomize if player one or two starts
function randomStartingPlayer() {
  const possibleTurns = ['x', 'o'];
  let index = Math.floor(Math.random()*possibleTurns.length);
  let firstTurn = possibleTurns[index];
  if (firstTurn === playerOne.marker) {
    playerOne.playerTurn = true;
    return playerOne.name
  } else {
    playerTwo.playerTurn = true;
    return playerTwo.name
  }
}

//reset gamestate
function resetGame() {
  let allImgs = Array.from(document.querySelectorAll('img'));
    allImgs.map(img => img.parentNode.removeChild(img));
  winner = false
  playerOne.playerCells = [];
  playerOne.playerTurn = false;
  playerTwo.playerCells = [];
  playerTwo.playerTurn = false;
  hideElement('.resetBtn');
  updateAnnouncementBoard();
}

//place player-marker.
function placePlayerMarker(cell, ) {
  let playerMarker = document.createElement('img');
  if (cell.innerHTML !== '' || winner) {
    return
  } else if (cell.innerHTML === '' && playerOne.playerTurn) {
    processTurn(cell, playerMarker, playerOne, playerTwo)
  } else if (cell.innerHTML === '' && playerTwo.playerTurn) {
    processTurn(cell, playerMarker, playerTwo, playerOne)
  }
}

//process player marker selection, placement, register move made.
function processTurn(cell, element, currentPlayer, nextPlayer) {
  element.src = currentPlayer.markerSrc;
  element.classList.add(currentPlayer.marker);
  togglePlayerTurn(currentPlayer, nextPlayer);
  currentPlayer.playerCells.push(cell.classList.value);
  cell.appendChild(element);
  checkForWin(currentPlayer);
}

//toggle player turn.
function togglePlayerTurn(currentPlayer, nextPlayer) {
    currentPlayer.playerTurn = false;
    nextPlayer.playerTurn = true;
}

//array of possible winconditions
const winningMoves = [
  ['topRowLeftCell', 'topRowCenterCell', 'topRowRightCell'],
  ['middleRowLeftCell', 'middleRowCenterCell', 'middleRowRightCell'],
  ['bottomRowLeftCell', 'bottomRowCenterCell', 'bottomRowRightCell'],
  ['topRowLeftCell', 'middleRowLeftCell', 'bottomRowLeftCell'],
  ['topRowCenterCell', 'middleRowCenterCell', 'bottomRowCenterCell'],
  ['topRowRightCell', 'middleRowRightCell', 'bottomRowRightCell'],
  ['topRowLeftCell', 'middleRowCenterCell', 'bottomRowRightCell'],
  ['topRowRightCell', 'middleRowCenterCell', 'bottomRowLeftCell']
];

//function checking if wincondition is met
function checkForWin(player) {
  for (let i = 0; i < winningMoves.length; i++) {
    let winningMove = winningMoves[i]
    for (let j = 0; j < winningMove.length; j++) {
      if (player.playerCells.some(playerCellVal => playerCellVal === winningMove[j]) &&
      player.playerCells.some(playerCellVal => playerCellVal === winningMove[j+1]) &&
      player.playerCells.some(playerCellVal => playerCellVal === winningMove[j+2])) {
        winner = true;
        player.playerScore += 1;
        markWinningMove(winningMove);
      }
    }
  }
  updateAnnouncementBoard(player)
}

//add new image to winning move markers
function markWinningMove(move) {
  move.map(cell => document.querySelector(`.${cell}`).getElementsByTagName('img')[0].src = './imgs/Happy.png')
}

//add new image to all markers in case
function markDraw() {
  let oMarkers = Array.from(document.querySelectorAll('.o'));
  let xMarkers = Array.from(document.querySelectorAll('.x'));
    oMarkers.map(marker => marker.src = './imgs/Sad1.png');
    xMarkers.map(marker => marker.src = './imgs/Sad2.png');
}