const cells = Array.from(document.querySelectorAll('.cell'));
const quizModal = document.getElementById('quizModal');
const quizCloseBtn = document.getElementById('quizCloseBtn');
const quizCorrectBtn = document.getElementById('quizCorrectBtn');
const quizWrongBtn = document.getElementById('quizWrongBtn');

let selectedCellIndex = null;

function openQuizModal(cellIndex) {
  if (!quizModal) return;
  selectedCellIndex = cellIndex;
  quizModal.classList.add('is-open');
}

function closeQuizModal() {
  if (!quizModal) return;
  selectedCellIndex = null;
  quizModal.classList.remove('is-open');
}

function placePlayerPiece(index) {
  const cell = cells[index];
  if (!cell || cell.querySelector('.cell-piece')) return;
  cell.innerHTML = '';
  const img = document.createElement('img');
  img.src = '../assets/images/player_piece.png';
  img.alt = '짱구 말';
  img.classList.add('cell-piece');
  cell.appendChild(img);
}

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    const index = Number(cell.dataset.index);
    if (cell.querySelector('.cell-piece')) return;
    if (currentTurn !== 'player') return;
    openQuizModal(index);
  });
});

if (quizCorrectBtn) {
  quizCorrectBtn.addEventListener('click', () => {
    if (selectedCellIndex !== null) {
      placePlayerPiece(selectedCellIndex);
    }
    closeQuizModal();
  });
}

if (quizWrongBtn) {
  quizWrongBtn.addEventListener('click', () => {
    closeQuizModal();
  });
}

if (quizCloseBtn) {
  quizCloseBtn.addEventListener('click', closeQuizModal);
}

if (quizModal) {
  quizModal.addEventListener('click', (e) => {
    if (e.target === quizModal) {
      closeQuizModal();
    }
  });
}

const playerCharacter = document.querySelector('.character-left');
const cpuCharacter = document.querySelector('.character-right');
const turnIcon = document.getElementById('playerIcon');
const turnText = document.querySelector('.turn-text');

let currentTurn = 'player';

function setTurn(turn) {
  currentTurn = turn;

  if (!playerCharacter || !cpuCharacter || !turnIcon || !turnText) return;

  const isPlayerTurn = turn === 'player';

  playerCharacter.classList.toggle('is-active', isPlayerTurn);
  cpuCharacter.classList.toggle('is-active', !isPlayerTurn);
  turnIcon.classList.add('is-active');

  if (isPlayerTurn) {
    turnText.textContent = '짱구의 차례';
    turnIcon.src = '../assets/images/player0.png';
  } else {
    turnText.textContent = '철수의 차례';
    turnIcon.src = '../assets/images/player1.png';
  }
}

setTurn('player');
