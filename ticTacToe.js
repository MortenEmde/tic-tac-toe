// player factory function
const playerFactory = (name, color, marker, markerSrc, playerAvatarHappy, playerAvatarSad) => {
  let playerCells = [];
  let playerTurn = false;
  let playerScore = 0;
  let nameText = `<span style=\"color:${color}\">${name}</span>`
  return { name, nameText, marker, markerSrc, playerAvatarHappy, playerAvatarSad, playerCells, playerTurn, playerScore};
};

// global gamestate variables
let winner = false;
const playerOne = playerFactory('Champion of X', 'rgb(238, 211, 0)', 'x', './imgs/X.png', './imgs/peepoHappy.png', './imgs/peepoSad.png');
const playerTwo = playerFactory('Champion of O', 'rgb(52, 52, 255)', 'o', './imgs/O.png', './imgs/spongeHappy.png', './imgs/spongeSad.png');

// dynamically draw game grid
function createGame() {
  const rowClassNames = ['topRow', 'middleRow', 'bottomRow'];
  const cellClassNames = ['LeftCell', 'CenterCell', 'RightCell'];
  const rowLength = rowClassNames.length;
  const columnLength = cellClassNames.length;
  const gameBoardContainer = document.querySelector('.gameBoardContainer');
  toggleHideElement('.inputs');
  toggleHideElement('.avatarOptions');
  toggleHideElement('.startBtn');
  for (let gridX = 0; gridX < rowLength; gridX++) {
    let row = document.createElement('div');
    row.classList.add(rowClassNames[gridX]);
    gameBoardContainer.appendChild(row)
    for (let gridY = 0; gridY < columnLength; gridY++) {
      let cell = document.createElement('div');
      let cellName = rowClassNames[gridX]+cellClassNames[gridY];
      cell.classList.add(cellName);
      cell.onclick = () => placePlayerMarker(cell);
      row.appendChild(cell);
    }              
  }
  updatePlayer(playerOne);
  updatePlayer(playerTwo);
  updateAnnouncementBoard();
}

// toggle display html element
function toggleHideElement(elementClass) {
  const element = document.querySelector(elementClass);
  element.classList.contains('hide') ?
  element.classList.remove('hide') :
  element.classList.add('hide');
}

// update player name and avatar
function updatePlayer(player) {
  let playerName = document.querySelector(`.${player.marker}Input`).value;
  let playerAvatar = document.querySelector(`.${player.marker}Avatar`);
  if (playerName !== '') {
    player.name = playerName;
  }
  if (playerAvatar) {
    player.playerAvatarHappy = `./imgs/${playerAvatar.alt}Happy.png`;
    player.playerAvatarSad = `./imgs/${playerAvatar.alt}Sad.png`;
  }
}

// update announcement- and score-board
function updateAnnouncementBoard(currentPlayer) {
  const announcement = document.querySelector('.announcement');
  const score = document.querySelector('.score');
  const namePlates = document.querySelector('.namePlates');
  if (winner) {
    toggleHideElement('.gameOverElements');
    score.innerHTML = `${playerOne.playerScore} : ${playerTwo.playerScore}`;
    return announcement.innerHTML = `${currentPlayer.nameText} wins!`;
  } else if (playerOne.playerCells.length === 5 || playerTwo.playerCells.length === 5) {
    markDraw()
    toggleHideElement('.gameOverElements')
    return announcement.innerHTML = `It's a Draw!`;
  }
  if (!playerOne.playerTurn && !playerTwo.playerTurn){
    announcement.innerHTML = `It is ${randomStartingPlayer()}'s turn!`;
    namePlates.innerHTML = `${playerOne.nameText} VS ${playerTwo.nameText}`;
    score.innerHTML = `${playerOne.playerScore} : ${playerTwo.playerScore}`;
  } else if (playerOne.playerTurn) {
    announcement.innerHTML = `It is ${playerOne.nameText}'s turn!`;
  } else if (playerTwo.playerTurn) {
    announcement.innerHTML = `It is ${playerTwo.nameText}'s turn!`;
  }
};

// randomize if player one or player two starts
function randomStartingPlayer() {
  const possibleTurns = ['x', 'o'];
  let index = Math.floor(Math.random()*possibleTurns.length);
  let firstTurn = possibleTurns[index];
  if (firstTurn === playerOne.marker) {
    playerOne.playerTurn = true;
    return playerOne.nameText
  } else {
    playerTwo.playerTurn = true;
    return playerTwo.nameText
  }
}

// reset gamestate
function resetGame() {
  let allXMarkers = Array.from(document.querySelectorAll('.x'));
  allXMarkers.map(img => img.parentNode.removeChild(img));
  let allOMarkers = Array.from(document.querySelectorAll('.o'));
  allOMarkers.map(img => img.parentNode.removeChild(img));
  winner = false
  playerOne.playerCells = [];
  playerOne.playerTurn = false;
  playerOne.avatar
  playerTwo.playerCells = [];
  playerTwo.playerTurn = false;
  updatePlayer(playerOne);
  updatePlayer(playerTwo);
  toggleHideElement('.gameOverElements');
  updateAnnouncementBoard();
  if (!document.querySelector('.avatarOptions').classList.contains('hide')) {
    document.querySelector('.avatarOptions').classList.add('hide');
  }
}

// toggles avatar selection
function toggleAvatarSelection() {
  toggleHideElement('.avatarOptions');
}

// place player-marker
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

// process player-marker selection, placement and register move made
function processTurn(cell, element, currentPlayer, nextPlayer) {
  element.src = currentPlayer.markerSrc;
  element.classList.add(currentPlayer.marker);
  togglePlayerTurn(currentPlayer, nextPlayer);
  currentPlayer.playerCells.push(cell.classList.value);
  cell.appendChild(element);
  checkForWin(currentPlayer);
}

// toggle player turn
function togglePlayerTurn(currentPlayer, nextPlayer) {
    currentPlayer.playerTurn = false;
    nextPlayer.playerTurn = true;
}

// array of possible winconditions
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

// function checking if wincondition is met
function checkForWin(player) {
  for (let i = 0; i < winningMoves.length; i++) {
    let winningMove = winningMoves[i]
    for (let j = 0; j < winningMove.length; j++) {
      if (player.playerCells.some(playerCellVal => playerCellVal === winningMove[j]) &&
      player.playerCells.some(playerCellVal => playerCellVal === winningMove[j+1]) &&
      player.playerCells.some(playerCellVal => playerCellVal === winningMove[j+2])) {
        winner = true;
        player.playerScore += 1;
        markWinningMove(winningMove, player);
      }
    }
  }
  updateAnnouncementBoard(player)
}

// add new image to winning move markers
function markWinningMove(move, player) {
  move.map(cell => document.querySelector(`.${cell}`).getElementsByTagName('img')[0].src = player.playerAvatarHappy)
}

// add new image to all markers
function markDraw() {
  let xMarkers = Array.from(document.querySelectorAll('.x'));
  let oMarkers = Array.from(document.querySelectorAll('.o'));
  xMarkers.map(marker => marker.src = playerOne.playerAvatarSad);
  oMarkers.map(marker => marker.src = playerTwo.playerAvatarSad);
}

// generate avatar options
(function generateAvatarOptions() {
  const avatarSrcs = ['./imgs/spongeNeutral.png', './imgs/rockNeutral.png', './imgs/peepoNeutral.png', './imgs/kekWNeutral.png', './imgs/picardNeutral.png'];
  const avatarsLength = avatarSrcs.length;
  const avatarOptionContainer = document.querySelector('.avatarOptionContainer');
  for (let i = 0; i < avatarsLength; i++) {
    let avatar = document.createElement('img');
    avatar.classList.add('avatarImg', 'unselected');
    let avatarSrc = avatarSrcs[i];
    let avatarAlt = (avatarSrc.match(/(?<=.\/imgs\/)(.*)(?=Neutral.png)/g))[0];
    avatar.src = avatarSrc;
    avatar.alt = avatarAlt;
    avatar.onclick = () => avatarOnClick(avatar);
    avatarOptionContainer.appendChild(avatar);
  }
})();

// add shadow to avatar selected and toggle next player to select.
function avatarOnClick(avatar) {
  if (avatar.classList.contains('xAvatar')) {
    return avatar.classList.replace('xAvatar', 'unselected');
  } else if (avatar.classList.contains('oAvatar')) {
    return avatar.classList.replace('oAvatar', 'unselected');
  }
  if (document.querySelector('.xAvatar') && document.querySelector('.oAvatar')) {
    return
  }
  if (document.querySelector('.xAvatar')) {
    avatar.classList.replace('unselected', 'oAvatar')
  } else {
    avatar.classList.replace('unselected', 'xAvatar')
  }
}
