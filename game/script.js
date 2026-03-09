/**
 * game/script.js
 *  - /game/index.html 의 틱택토 게임 로직 전체를 담당
 *  - 퀴즈 로딩/렌더링, 플레이어 입력 처리
 *  - 보드 상태, 승리/무승부 판정
 *  - CPU(철수)의 착수 로직 (난이도에 따라 랜덤 / AI)
 */

import { getAiMove } from '../js/ai.js';

// DOM 캐싱: 보드 셀 및 퀴즈 모달 관련 요소들
const cells = Array.from(document.querySelectorAll('.cell'));
const quizModal = document.getElementById('quizModal');
const quizCloseBtn = document.getElementById('quizCloseBtn');
const quizCorrectBtn = document.getElementById('quizCorrectBtn');
const quizWrongBtn = document.getElementById('quizWrongBtn');
const quizContent = document.getElementById('quizContent');

let selectedCellIndex = null;

// 사운드 추가...
let audioUnlocked = false;

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const endingSound = document.getElementById("endingSound");


// ----- 퀴즈 데이터 -----
const QUIZ_DATA_URL = '../data/quiz.json';
let quizzes = [];
let currentQuiz = null;

async function loadQuizzes() {
  try {
    const res = await fetch(QUIZ_DATA_URL);
    const data = await res.json();
    const list = Array.isArray(data.quizzes) ? data.quizzes : [];
    quizzes = list.slice().sort(() => Math.random() - 0.5);
  } catch (err) {
    console.error('퀴즈 데이터를 불러오지 못했습니다.', err);
  }
}

function normalize(text) {
  return String(text ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

function isAnswerCorrect(userAnswer) {
  if (!currentQuiz) return false;

  const normUser = normalize(userAnswer);
  const normCorrect = normalize(currentQuiz.answer);

  if (normUser === normCorrect) return true;

  if (Array.isArray(currentQuiz.keywords)) {
    return currentQuiz.keywords.some((k) => normalize(k) === normUser);
  }

  return false;
}

function clearQuizContent() {
  if (!quizContent) return;
  quizContent.innerHTML = '';
}

function renderQuiz(quiz) {
  if (!quizContent) return;
  clearQuizContent();

  const title = document.createElement('h3');
  const typeLabel =
    quiz.type === 'multiple_choice'
      ? '객관식'
      : quiz.type === 'ox'
        ? 'OX 퀴즈'
        : '단답형';
  title.textContent = `[${quiz.subject || '일반'}] ${typeLabel}`;

  const question = document.createElement('p');
  question.textContent = quiz.question;

  quizContent.appendChild(title);
  quizContent.appendChild(question);

  const optionsWrapper = document.createElement('div');
  optionsWrapper.classList.add('quiz-options');

  if (Array.isArray(quiz.options) && quiz.options.length > 0) {
    quiz.options.forEach((option) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-answer-btn';
      btn.textContent = option;
      btn.addEventListener('click', () => handleAnswer(option));
      optionsWrapper.appendChild(btn);
    });
  } else {
    const input = document.createElement('input');
    input.id = 'quiz-answer-input';
    input.placeholder = '정답을 입력하세요';

    const submitBtn = document.createElement('button');
    submitBtn.className = 'quiz-answer-btn';
    submitBtn.textContent = '확인';
    submitBtn.addEventListener('click', () => {
      handleAnswer(input.value);
    });

    optionsWrapper.appendChild(input);
    optionsWrapper.appendChild(submitBtn);
  }

  quizContent.appendChild(optionsWrapper);
}

function handleAnswer(userAnswer) {
  const cellIndex = selectedCellIndex;
  closeQuizModal();

  if (cellIndex === null || cellIndex === undefined) return;

  const correct = isAnswerCorrect(userAnswer);

  if (correct) {
    handlePlayerMove(cellIndex);
    // 사운드 추가
    correctSound.play();
  } else {
    // 사운드 추가
    wrongSound.play();
    alert('오답입니다! 다시 도전해 보세요.');
  }
}

// ----- 게임 상태 및 승리 패턴 -----
const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const PLAYER = 'player';
const CPU = 'cpu';
const BOARD_SIZE = 9;

// 난이도: easy / normal / hard
const DIFFICULTY_KEY = 'tttDifficulty';

function getDifficulty() {
  // 1) URL 쿼리에서 우선 읽기 (?difficulty=easy)
  try {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get('difficulty');
    if (fromUrl) return fromUrl;
  } catch (e) {}

  // 2) localStorage 에 저장된 값 사용
  try {
    const stored = localStorage.getItem(DIFFICULTY_KEY);
    if (stored) return stored;
  } catch (e) {}

  // 3) 기본값
  return 'easy';
}

const difficulty = getDifficulty();

let board = Array(BOARD_SIZE).fill(null); // 'player' | 'cpu' | null
let isGameOver = false;

async function openQuizModal(cellIndex) {
  if (!quizModal || isGameOver) return;
  if (board[cellIndex] !== null) return;
  selectedCellIndex = cellIndex;

  if (!quizzes.length) {
    await loadQuizzes();
  }

  currentQuiz = quizzes.pop() || null;

  if (!currentQuiz) {
    // 퀴즈가 없으면 바로 착수
    handlePlayerMove(cellIndex);
    return;
  }

  renderQuiz(currentQuiz);
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

function placeCpuPiece(index) {
  const cell = cells[index];
  if (!cell || cell.querySelector('.cell-piece')) return;
  cell.innerHTML = '';
  const img = document.createElement('img');
  img.src = '../assets/images/cpu_piece.png';
  img.alt = '철수 말';
  img.classList.add('cell-piece');
  cell.appendChild(img);
}

function checkWin(owner) {
  return WIN_PATTERNS.some(([a, b, c]) => {
    return board[a] === owner && board[b] === owner && board[c] === owner;
  });
}

function checkDraw() {
  return board.every((cell) => cell !== null);
}

function endGame(result) {
  if (isGameOver) return;
  isGameOver = true;

  setTimeout(() => {
    openGameEnding(result);
  }, 10);
}

function cpuTurn() {
  if (isGameOver) return;

  const emptyIndices = board
    .map((value, index) => (value === null ? index : null))
    .filter((index) => index !== null);

  if (emptyIndices.length === 0) {
    if (checkDraw()) {
      endGame('draw');
    }
    return;
  }

  let cpuIndex;

  // hard 난이도: AI 모듈 사용
  if (difficulty === 'hard') {
    // 내부 보드 표현을 AI가 이해할 수 있는 형태('X' / 'O' / '')로 변환
    const aiBoard = board.map((cell) => {
      if (cell === PLAYER) return 'X';
      if (cell === CPU) return 'O';
      return '';
    });

    const aiMove = getAiMove(aiBoard);
    if (aiMove !== null && board[aiMove] === null) {
      cpuIndex = aiMove;
    }
  }

  // easy/normal 또는 hard 에서 유효한 수를 못 찾은 경우 → 랜덤
  if (cpuIndex === undefined) {
    cpuIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  board[cpuIndex] = CPU;
  placeCpuPiece(cpuIndex);

  if (checkWin(CPU)) {
    endGame(CPU);
    return;
  }

  if (checkDraw()) {
    endGame('draw');
    return;
  }

  setTurn(PLAYER);
}

function handlePlayerMove(index) {
  if (isGameOver) return;
  board[index] = PLAYER;
  placePlayerPiece(index);

  if (checkWin(PLAYER)) {
    endGame(PLAYER);
    return;
  }

  if (checkDraw()) {
    endGame('draw');
    return;
  }

  setTurn(CPU);
  setTimeout(cpuTurn, 700);
}

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    const index = Number(cell.dataset.index);
    if (isGameOver) return;
    if (board[index] !== null) return;
    if (currentTurn !== PLAYER) return;

    // 오디오 잠금 해제..
    if (!audioUnlocked) {
      const audio = new Audio();
      audio.play().catch(()=>{});
      audioUnlocked = true;
    }

    openQuizModal(index);
  });
});

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

let currentTurn = PLAYER;

function setTurn(turn) {
  currentTurn = turn;

  if (!playerCharacter || !cpuCharacter || !turnIcon || !turnText) return;

  const isPlayerTurn = turn === PLAYER;

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

setTurn(PLAYER);

// 초기 퀴즈 로딩
loadQuizzes();

// 종료 모달 변수추가
const endModal = document.getElementById('game-end-modal');
const restartBtn = document.getElementById('restartBtn');
const endModalTitle = document.getElementById('end-modal-title');
const endModalContent = document.getElementById('end-modal-content');

// 다시 하기
restartBtn.addEventListener('click', () => {
  // 1. 게임 상태 초기화
  board = Array(BOARD_SIZE).fill(null);
  isGameOver = false;
  selectedCellIndex = null;
  currentQuiz = null;

  // 2. 보드 UI 초기화
  cells.forEach((cell, index) => {
    const number = document.createElement('span');
    number.classList.add('cell-number');
    number.textContent = index + 1;

    cell.innerHTML = '';
    cell.appendChild(number);
  });

  // 3. 턴 초기화
  setTurn(PLAYER);

  // 모달 리셋
  endModalContent.innerHTML = '';
  endModal.classList.remove('is-open');

  // 사운드 리셋
  endingSound.pause();
  endingSound.currentTime = 0;
});


// 게임 결과창
function openGameEnding(result) {
  // 사운드 시작
  endingSound.play();

  if (result === 'draw') {
    // 무승부일 경우
    endModalContent.className += 'move draw';
    endModalContent.innerHTML = ` <img src="../assets/images/player_character.png" class="img-size move" >
                                  <img src="../assets/images/cpu_character.png" class="img-size move">`;
  } else {
    // 승리자에 따른 이미지 표시
    let srcUrl = '';
    let text = '';

    if (result === 'cpu') {
      srcUrl = '../assets/images/cpu_character.png';
      text = `후훗, <br>예상한 결과야.`;
    } else if (result === 'player') {
      srcUrl = '../assets/images/player_character.png';
      text = `히히~ 어때? <br>역시 짱구지!`;
    }

    // 백그라운드 말풍선 이미지 변경
    endModalContent.className += ' win';
    endModalContent.innerHTML = `<img class="move img-size" src="` + srcUrl + `"> 
                                 <div><div id="result-text-div">
                                    <p id="result-text">` + text + `</p>
                                 </div></div>`;
  }

  endModalTitle.innerText = result;
  endModal.classList.add('is-open');
}
