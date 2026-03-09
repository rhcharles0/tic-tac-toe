import { fetchQuizzes, openQuizModal } from './data.js';
import { getEasyMove } from './ai_easy.js'; 
import { getHardMove } from './ai_hard.js'; 

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
  currentPlayer: 'X', // 'X'는 플레이어(짱구), 'O'는 AI(철수)
  isGameOver: false,
};

// --- 난이도 설정 로직 ---
const DIFFICULTY_KEY = 'tttDifficulty';
function getDifficulty() {
  const url = new URL(window.location.href);
  return (
    url.searchParams.get('difficulty') ||
    localStorage.getItem(DIFFICULTY_KEY) ||
    'easy'
  );
}
const difficulty = getDifficulty();

const cells = [...document.querySelectorAll('.cell')];
const playerIcon = document.getElementById('playerIcon');

// 1. 초기화 및 실행
async function initGame() {
  await fetchQuizzes();
  renderBoard();
  setTurn(gameState.currentPlayer); // 초기 턴에 맞춰 UI 동기화 [cite: 2026-03-09]
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

// 턴 전환 및 캐릭터 애니메이션 통합 제어
export function setTurn(turn) {
  gameState.currentPlayer = turn;
  const isPlayer = turn === 'X';

  // 캐릭터 이미지 애니메이션 클래스 토글 (is-active)
  document
    .querySelector('.character-left')
    ?.classList.toggle('is-active', isPlayer);
  document
    .querySelector('.character-right')
    ?.classList.toggle('is-active', !isPlayer);

  // 텍스트 및 아이콘 변경
  const turnText = document.querySelector('.turn-text');
  if (turnText) turnText.textContent = isPlayer ? '짱구의 차례' : '철수의 차례';

  updatePlayerIcon();
}

function updatePlayerIcon() {
  if (playerIcon) {
    playerIcon.src = `../assets/images/player${gameState.currentPlayer === 'X' ? 0 : 1}_mark.png`;
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
      alert(`${gameState.currentPlayer === 'X' ? '짱구' : '철수'} 승리!`);
      gameState.isGameOver = true;
      return;
    }
    if (checkDraw()) {
      alert('무승부입니다!');
      gameState.isGameOver = true;
      return;
    }
  } else {
    alert('오답입니다! 다음 기회에 도전하세요.');
  }

  // 턴 교체 (setTurn 사용으로 UI 연동)
  const nextPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
  setTurn(nextPlayer);

  // 만약 AI 차례라면 AI 로직 실행
  if (gameState.currentPlayer === 'O' && !gameState.isGameOver) {
    setTimeout(triggerAiTurn, 700); // 0.7초 뒤 AI 착수
  }
}

// AI 착수 로직 (난이도 분기)
function triggerAiTurn() {
  if (gameState.isGameOver) return;

  let aiIndex;

  // 난이도에 따라 다른 AI 모듈의 함수 호출
  if (difficulty === 'hard') {
    aiIndex = getHardMove(gameState.board);
  } else {
    aiIndex = getEasyMove(gameState.board);
  }

  if (aiIndex !== null && aiIndex !== undefined) {
    // AI는 별도의 퀴즈 없이 바로 착수 처리
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

    // 플레이어 클릭 시 퀴즈 모달 오픈
    openQuizModal(index, (isCorrect) => nextTurn(isCorrect, index));
  });
});

document.getElementById('resetBtn')?.addEventListener('click', () => {
  gameState.board = Array(9).fill('');
  gameState.isGameOver = false;
  localStorage.removeItem('board');
  renderBoard();
  setTurn('X'); // 초기화 시 짱구 차례로 설정
});

document.addEventListener('DOMContentLoaded', initGame);
