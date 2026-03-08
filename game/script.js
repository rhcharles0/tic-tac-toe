const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

let board = JSON.parse(localStorage.getItem('board')) || [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
];

let cells = [...document.querySelectorAll('.cell')];
console.log(cells);
const player = ['X', 'O'];
let currentPlayer = player[0];
const playerIcon = document.getElementById('playerIcon');
let selectedCell = -1;
let isCorrect = false;

if (currentPlayer == player[0]) {
  playerIcon.src = '../files/player0.png';
} else {
  playerIcon.src = '../files/player1.png';
}

// initialize board
board.forEach((value, index) => {
  cells[index].textContent = value;
});

// when cell is clicked
cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    if (cell.textContent !== '') return;

    const index = cell.dataset.index;
    localStorage.setItem('selectedCell', index);
    window.location.href = '../quiz/index.html';
  });
});

// when returned
window.addEventListener('DOMContentLoaded', function () {
  const selectedCell = localStorage.getItem('selectedCell');
  const isCorrect = localStorage.getItem('isCorrect');

  console.log(selectedCell);
  console.log(isCorrect);

  if (selectedCell !== null && isCorrect === 'true') {
    board[selectedCell] = currentPlayer;
    cells[selectedCell].textContent = currentPlayer;

    localStorage.setItem('board', JSON.stringify(board));
  }

  if (isBingo() == currentPlayer) {
    alert(currentPlayer + ' wins!');
    return;
  }

  setTimeout(() => {
    turnPC();
  }, 500);

  localStorage.removeItem('isCorrect');
  localStorage.removeItem('selectedCell');
});

function isBingo() {
  for (let [a, b, c] of winPatterns) {
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      return cells[a].textContent;
    }
  }
  return null;
}

function turnPC() {
  let emptyCells = [];

  board.forEach((cell, index) => {
    if (cell === '') {
      emptyCells.push(index);
    }
  });

  if (emptyCells.length === 0) return;

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[randomIndex] = player[1];
  cells[randomIndex].textContent = player[1];

  localStorage.setItem('board', JSON.stringify(board));

  if (isBingo() === player[1]) {
    alert('PC wins!');
  }
}

// reset game

const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', resetGame);

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];

  cells.forEach((cell) => {
    cell.textContent = '';
  });

  localStorage.removeItem('board');
  localStorage.removeItem('selectedCell');
  localStorage.removeItem('isCorrect');

  currentPlayer = player[0];
}
