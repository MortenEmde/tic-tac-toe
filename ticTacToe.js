let winner = false;

//player factory functions
const playerFactory = (name, marker, markerSrc) => {
  let playerCells = [];
  let playerTurn = false;
  return { name, marker, markerSrc, playerCells, playerTurn};
};

//create players
const playerOne = playerFactory('Jeff', 'x', './X.png');
const playerTwo = playerFactory('Jenn', 'o', './O.png');

//dynamically draw grid with eventlisterner for player click
(function createGrid() {
  const rowClassNames = ['topRow', 'middleRow', 'bottomRow'];
  const cellClassNames = ['LeftCell', 'CenterCell', 'RightCell'];
  const rowLength = rowClassNames.length;
  const columnLength = cellClassNames.length;
  const container = document.querySelector('.container');

  for (let gridX = 0; gridX < rowLength; gridX++) {
    let row = document.createElement('div');
    row.classList.add(rowClassNames[gridX]);
    container.appendChild(row)
    for (let gridY = 0; gridY < columnLength; gridY++) {
      let cell = document.createElement('div');
      let cellName = rowClassNames[gridX]+cellClassNames[gridY];
      cell.classList.add(cellName);
      cell.onclick = () => placePlayerMarker(cell);
      row.appendChild(cell);
    }              
  }
  updateAnnouncementBoard();
})()

//check gamestatus and update announcement-board
function updateAnnouncementBoard(player) {
  const announcementBoard = document.querySelector('.announcementBoard');
  if (winner) {
    return announcementBoard.innerHTML = `${player.marker.toUpperCase()} wins!`;
  } 
  if (!playerOne.playerTurn && !playerTwo.playerTurn){
    let possibleTurns = ['x', 'o'];
    let index = Math.floor(Math.random()*possibleTurns.length);
    let firstTurn = possibleTurns[index].toUpperCase();
    announcementBoard.innerHTML = `It is ${firstTurn}'s turn!`;
    if (firstTurn === playerOne.marker.toUpperCase()) {
      return playerOne.playerTurn = true;
    } else {
      return playerTwo.playerTurn = true;
    }
  } else if (playerOne.playerTurn) {
    return announcementBoard.innerHTML = `It is ${playerOne.marker.toUpperCase()}'s turn!`;
  } else if (playerTwo.playerTurn) {
    return announcementBoard.innerHTML = `It is ${playerTwo.marker.toUpperCase()}'s turn!`;
  }
};

//place player-marker.
function placePlayerMarker(cell) {
  let playerMarker = document.createElement('img');
  if (cell.innerHTML !== '' || winner) {
    return
  } else if (cell.innerHTML === '' && playerOne.playerTurn) {
    processTurn(cell, playerMarker, playerOne)
  } else if (cell.innerHTML === '' && playerTwo.playerTurn) {
    processTurn(cell, playerMarker, playerTwo)
  }
}

//process player marker selection, placement, register move made.
function processTurn(cell, element, player) {
  element.src = player.markerSrc;
  element.classList.add(player.marker);
  togglePlayerTurn();
  player.playerCells.push(cell.classList.value);
  cell.appendChild(element);
  checkForWin(player);
}

//toggle player turn.
function togglePlayerTurn() {
  if (playerOne.playerTurn) {
    playerOne.playerTurn = false;
    playerTwo.playerTurn = true;
  } else {
    playerTwo.playerTurn = false;
    playerOne.playerTurn = true;
  }
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
        console.log(winningMove)
        colorWinningMove(winningMove);
      }
    }
  }
  updateAnnouncementBoard(player)
}

//add new image to winning move
function colorWinningMove(move) {
  move.map(cell => console.log(document.querySelector(`.${cell}`).getElementsByTagName('img')[0].src = './Happy.png'))
}