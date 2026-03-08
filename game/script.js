// 1. 게임 상태 및 상수 설정
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // 가로
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // 세로
  [0, 4, 8],
  [2, 4, 6], // 대각선
];

let gameState = {
  board: JSON.parse(localStorage.getItem('board')) || Array(9).fill(''),
  currentPlayer: 'X',
  availableQuizzes: [],
  selectedCellIndex: null,
  isGameOver: false,
};

const cells = [...document.querySelectorAll('.cell')];
const playerIcon = document.getElementById('playerIcon');
const quizModal = document.getElementById('quiz-modal');
const resetBtn = document.getElementById('resetBtn');

// 2. 초기 데이터 로드 및 환경 설정
async function initGame() {
  try {
    const response = await fetch('../quiz/quizset.json');
    const data = await response.json();

    // 1. 데이터 할당
    gameState.availableQuizzes = [...data.quizzes];

    // 2. 셔플 (Fisher-Yates)
    for (let i = gameState.availableQuizzes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameState.availableQuizzes[i], gameState.availableQuizzes[j]] = [
        gameState.availableQuizzes[j],
        gameState.availableQuizzes[i],
      ];
    }

    // 3. 데이터 로딩이 끝난 후 화면 업데이트
    renderBoard();
    updatePlayerIcon();

    console.log('게임 준비 완료!');
  } catch (error) {
    console.error('데이터 처리 중 에러:', error);
  }
}

// 3. 화면 업데이트 함수들
function renderBoard() {
  gameState.board.forEach((value, index) => {
    if (value === 'X') {
      cells[index].innerHTML =
        '<img src="../assets/player0_mark.png" class="cell-mark">';
    } else if (value === 'O') {
      cells[index].innerHTML =
        '<img src="../assets/player1_mark.png" class="cell-mark">';
    } else {
      cells[index].innerHTML = '';
    }
  });
}

function updatePlayerIcon() {
  if (playerIcon) {
    playerIcon.src =
      gameState.currentPlayer === 'X'
        ? '../assets/player0.png'
        : '../assets/player1.png';
  }
}

//퀴즈 형식 한글 변환
const typeLabels = {
  multiple_choice: '객관식',
  ox: 'OX퀴즈',
  short_answer: '단답식',
};

function openQuizModal(index) {
  gameState.selectedCellIndex = index;
  const currentQuiz = gameState.availableQuizzes.pop();

  const subjectEl = document.getElementById('quiz-subject');
  const typeEl = document.getElementById('quiz-type');
  const questionEl = document.getElementById('quiz-question');
  const optionsContainer = document.getElementById('quiz-options');

  // 1. 과목 표시
  if (subjectEl) subjectEl.textContent = currentQuiz.subject || '일반';

  // 2. 퀴즈 타입 한글 변환 (매핑 적용)
  if (typeEl) {
    const koreanType =
      typeLabels[currentQuiz.type] || currentQuiz.type || '퀴즈';
    typeEl.textContent = koreanType;
  }

  // 3. 문제 텍스트
  if (questionEl) questionEl.textContent = currentQuiz.question;

  // 4. 보기 버튼 생성
  if (optionsContainer) {
    optionsContainer.innerHTML = '';

    // 객관식이나 OX 퀴즈처럼 options가 있는 경우에만 버튼 생성
    if (currentQuiz.options && currentQuiz.options.length > 0) {
      currentQuiz.options.forEach((option) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = option;
        btn.onclick = () => handleQuizResult(option === currentQuiz.answer);
        optionsContainer.appendChild(btn);
      });
    } else {
      // 주관식/단답식인 경우: 입력창(Input)을 동적으로 생성하거나 안내 메시지 표시
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = '정답을 입력하세요';
      input.id = 'quiz-answer-input';

      const submitBtn = document.createElement('button');
      submitBtn.textContent = '확인';
      submitBtn.onclick = () => {
        const userAnswer = document
          .getElementById('quiz-answer-input')
          .value.trim();
        handleQuizResult(userAnswer === currentQuiz.answer);
      };

      optionsContainer.appendChild(input);
      optionsContainer.appendChild(submitBtn);
    }
  }

  quizModal.style.display = 'flex';
}

// 4. 퀴즈 결과 처리 및 게임 로직
function handleQuizResult(isCorrect) {
  const index = gameState.selectedCellIndex;
  if (isCorrect) {
    // 정답인 경우: 해당 셀에 현재 플레이어의 마크 표시
    gameState.board[index] = gameState.currentPlayer;
    renderBoard();
    saveToLocalStorage();

    // 승리 체크
    if (checkWinner()) {
      gameState.isGameOver = true;
      closeQuizModal();
      setTimeout(() => {
        alert(`${gameState.currentPlayer} 플레이어 승리!`);
      }, 100);
      gameState.selectedCellIndex = null;
      return;
    }

    // 무승부 체크
    if (checkDraw()) {
      gameState.isGameOver = true;
      closeQuizModal();
      setTimeout(() => {
        alert('무승부입니다!');
      }, 100);
      gameState.selectedCellIndex = null;
      return;
    }
  } else {
    alert('틀렸습니다! 다음 기회에 도전하세요.');
  }
  // 턴 변경
  gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';

  updatePlayerIcon();
  closeQuizModal();
}

function checkWinner() {
  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return (
      gameState.board[a] !== '' &&
      gameState.board[a] === gameState.board[b] &&
      gameState.board[b] === gameState.board[c]
    );
  });
}

function checkDraw() {
  return gameState.board.every((cell) => cell !== '');
}

function closeQuizModal() {
  const quizModal = document.getElementById('quiz-modal');
  if (quizModal) {
    quizModal.style.display = 'none';
  }
}

function saveToLocalStorage() {
  localStorage.setItem('board', JSON.stringify(gameState.board));
}

// 6. 이벤트 리스너 등록
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (gameState.board[index] !== '' || gameState.isGameOver) return;
    openQuizModal(index);
  });
});

resetBtn.addEventListener('click', () => {
  gameState.board = Array(9).fill('');
  gameState.isGameOver = false;
  gameState.currentPlayer = 'X';
  localStorage.removeItem('board');
  renderBoard();
  updatePlayerIcon();
});

// 실행
document.addEventListener('DOMContentLoaded', initGame);
