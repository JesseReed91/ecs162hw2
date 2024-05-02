const positions = document.querySelectorAll(".position");
let currentPlayer = "Red";
let gameActive = true;
let gameState = new Array(42).fill("");

// resets the board to be an empty board
function resetBoard() {
  for (let i = 0; i < gameState.length; i++) {
    gameState[i] = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  positions.forEach((position) =>
    position.addEventListener("click", handleColumnClicked)
  );
  document
    .getElementById("restartButton")
    .addEventListener("click", restartGame);
});

function restartGame() {
  gameActive = true;
  currentPlayer = "Red";
  resetBoard();
  document.getElementById("playerTurn").innerText = "Player Red's Turn";
  positions.forEach((position) => {
    position.className = "position";
    position.innerHTML = "";
  });
}

function getCurrentValidMove(clickedPositionIndex) {
  let validMove = clickedPositionIndex % 7; // Calculate column index
  // Find the lowest empty position in the column
  for (let i = 5; i >= 0; i--) {
    if (gameState[validMove + i * 7] === "") {
      return validMove + i * 7;
    }
  }
  return -1;
}

function handleColumnClicked(clickedPositionEvent) {
  const clickedPosition = clickedPositionEvent.target;
  const clickedPositionIndex = parseInt(
    clickedPosition.getAttribute("data-position-index")
  );

  if (!gameActive) {
    return;
  }
  const index = getCurrentValidMove(clickedPositionIndex);
  if (index === -1) {
    return;
  }
  const buttonToChange = positions[index];
  handleColumnPlayed(buttonToChange, index);
  if (checkWinConditions(index)) {
    gameActive = false;
    //this reads the current player, so we need to switch it because handleColumnPlayed already switched it
    document.getElementById("playerTurn").innerText =
      currentPlayer === "Yellow" ? "Red Wins!" : "Yellow Wins!";
  }
  if (boardIsFull()) {
    gameActive = false;
    document.getElementById("playerTurn").innerText = "It's a Tie!";
  }
}

function handleColumnPlayed(clickedPosition, columnIndex) {
  gameState[columnIndex] = currentPlayer;
  if (currentPlayer == "Red") clickedPosition.classList.add("red");
  else if (currentPlayer == "Yellow") clickedPosition.classList.add("yellow");
  clickedPosition.classList.add(currentPlayer === "Red" ? "red" : "yellow");
  currentPlayer === "Red"
    ? (currentPlayer = "Yellow")
    : (currentPlayer = "Red");
  document.getElementById("playerTurn").innerText =
    currentPlayer === "Red" ? "Red Player's Turn" : "Yellow Player's Turn";
}

function checkWinConditions(index) {
  return checkHorizontalWin() || checkVerticalWin() || checkDiagonalWin(index);
}

function checkHorizontalWin() {
  for (let i = 0; i < 42; i += 7) {
    for (let j = 0; j < 4; j++) {
      if (checkCharacterMatch(i + j, i + j + 1, i + j + 2, i + j + 3)) {
        markWinCondition(i + j, i + j + 1, i + j + 2, i + j + 3);
        return true;
      }
    }
  }
  return false;
}

function checkVerticalWin() {
  for (let i = 0; i < 21; i++) {
    if (checkCharacterMatch(i, i + 7, i + 14, i + 21)) {
      markWinCondition(i, i + 7, i + 14, i + 21);
      return true;
    }
  }
  return false;
}

function checkDiagonalWin(index) {
  size = gameState.length;
  //check for diagonal win from top left to bottom right
  for (let i = index; i < size; i += 7) {
    if (inBounds(i + 8) && inBounds(i + 16) && inBounds(i + 24)) {
      if (checkCharacterMatch(i, i + 8, i + 16, i + 24)) {
        markWinCondition(i, i + 8, i + 16, i + 24);
        return true;
      }
    }
  }
  //check for diagonal win from top right to bottom left
  for (let i = index; i < size; i += 7) {
    if (inBounds(i + 6) && inBounds(i + 12) && inBounds(i + 18)) {
      if (checkCharacterMatch(i, i + 6, i + 12, i + 18)) {
        markWinCondition(i, i + 6, i + 12, i + 18);
        return true;
      }
    }
  }
  //check for diagonal win from bottom left to top right
  for (let i = index; i >= 0; i -= 7) {
    if (inBounds(i + 8) && inBounds(i + 16) && inBounds(i + 24)) {
      if (checkCharacterMatch(i, i + 8, i + 16, i + 24)) {
        markWinCondition(i, i + 8, i + 16, i + 24);
        return true;
      }
    }
  }
  //check for diagonal win from bottom right to top left
  for (let i = index; i >= 0; i -= 7) {
    if (inBounds(i + 6) && inBounds(i + 12) && inBounds(i + 18)) {
      if (checkCharacterMatch(i, i + 6, i + 12, i + 18)) {
        markWinCondition(i, i + 6, i + 12, i + 18);
        return true;
      }
    }
  }
  return false;
}

function inBounds(index) {
  size = gameState.length;
  return index >= 0 && index < size;
}

function boardIsFull() {
  for (let i = 0; i < 42; i++) {
    if (gameState[i] === "") {
      return false;
    }
  }
  return true;
}

function markWinCondition(index1, index2, index3, index4) {
  positions[index1].innerHTML = "X";
  positions[index2].innerHTML = "X";
  positions[index3].innerHTML = "X";
  positions[index4].innerHTML = "X";
}

function checkCharacterMatch(index1, index2, index3, index4) {
  return (
    gameState[index1] !== "" &&
    gameState[index1] === gameState[index2] &&
    gameState[index1] === gameState[index3] &&
    gameState[index1] === gameState[index4]
  );
}
