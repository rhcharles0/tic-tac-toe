import { fetchQuizzes, openQuizModal } from './data.js';
import { getAiMove } from './ai.js';

export const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export let gameState = {
  board: JSON.parse(localStorage.getItem('board')) || Array(9).fill(''),
  currentPlayer: 'X', // 'X'는 플레이어, 'O'는 AI
  isGameOver: false,
};

const cells = [...document.querySelectorAll('.cell')];
const playerIcon = document.getElementById('playerIcon');

// 1. 초기화 및 실행
async function initGame() {
  await fetchQuizzes();
  renderBoard();
  updatePlayerIcon();
}

// 2. 화면 업데이트
export function renderBoard() {
  gameState.board.forEach((value, index) => {
    if (value === 'X') {
      cells[index].innerHTML =
        '<img src="../assets/images/player0_mark.png" class="cell-mark">';
    } else if (value === 'O') {
      cells[index].innerHTML =
        '<img src="../assets/images/player1_mark.png" class="cell-mark">';
    } else {
      cells[index].innerHTML = '';
    }
  });
}

function updatePlayerIcon() {
  if (playerIcon) {
    playerIcon.src = `../assets/images/player${
      gameState.currentPlayer === 'X' ? 0 : 1
    }.png`;
  }
}

// 3. 게임 규칙 로직
export function checkWinner() {
  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return (
      gameState.board[a] &&
      gameState.board[a] === gameState.board[b] &&
      gameState.board[a] === gameState.board[c]
    );
  });
}

export function checkDraw() {
  return gameState.board.every((cell) => cell !== '');
}

export function saveToLocalStorage() {
  localStorage.setItem('board', JSON.stringify(gameState.board));
}

// 4. 턴 전환 및 결과 처리
export function nextTurn(isCorrect, index) {
  if (isCorrect) {
    gameState.board[index] = gameState.currentPlayer;
    renderBoard();
    saveToLocalStorage();

    if (checkWinner()) {
      alert(`${gameState.currentPlayer} 승리!`);
      gameState.isGameOver = true;
      return;
    }
    if (checkDraw()) {
      alert('무승부!');
      gameState.isGameOver = true;
      return;
    }
  }

  // 턴 교체
  gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
  updatePlayerIcon();

  // 만약 AI 차례라면 AI 로직 실행
  if (gameState.currentPlayer === 'O' && !gameState.isGameOver) {
    setTimeout(triggerAiTurn, 500);
  }
}

function triggerAiTurn() {
  const aiIndex = getAiMove(gameState.board);
  if (aiIndex !== null) {
    // AI도 퀴즈를 거쳐야 한다면 openQuizModal 호출, 아니면 바로 착수
    nextTurn(true, aiIndex);
  }
}

// 이벤트 리스너
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (
      gameState.board[index] !== '' ||
      gameState.isGameOver ||
      gameState.currentPlayer !== 'X'
    )
      return;
    openQuizModal(index, (isCorrect) => nextTurn(isCorrect, index));
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  gameState.board = Array(9).fill('');
  gameState.isGameOver = false;
  gameState.currentPlayer = 'X';
  localStorage.removeItem('board');
  renderBoard();
  updatePlayerIcon();
});

document.addEventListener('DOMContentLoaded', initGame);
