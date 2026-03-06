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

// when cell is clicked
cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    selectedCell = cell.dataset.index;
    window.location.href = '../quiz/index.html';
  });
});

// when returned
window.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const isCorrect = params.get('isCorrect');
  if (isCorrect == true) {
    //표시 추가, data 업데이트
    isCorrect = false;
  }
  if (isBingo()) {
  } //게임 종료
});

function isBingo() {}
function turnPC() {}
