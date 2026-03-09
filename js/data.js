/**
 * 퀴즈 데이터/모달을 별도 모듈로 분리하려고 했던 초안 코드입니다.
 * 현재 실제 게임 로직은 /game/script.js 안에서 quiz.json을 직접 읽어와 처리하고 있기 때문에
 * 이 모듈은 사용되지 않습니다.
 *
 * 나중에 리팩터링 시:
 *  - fetchQuizzes / openQuizModal / 정답 판별 로직을 이 파일로 옮기고
 *  - game/script.js 에서는 이 모듈만 호출하도록 정리할 수 있습니다.
 */

export let availableQuizzes = [];
const typeLabels = {
  multiple_choice: '객관식',
  ox: 'OX퀴즈',
  short_answer: '단답식',
};

// JSON 데이터(quizset.json)를 불러와 섞은 뒤, availableQuizzes 에 보관
export async function fetchQuizzes() {
  try {
    const response = await fetch('../data/quizset.json');
    const data = await response.json();
    availableQuizzes = data.quizzes.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
}

// 주어진 퀴즈를 기반으로 퀴즈 모달을 생성하고, 사용자의 선택 결과를 콜백으로 전달
export function openQuizModal(index, callback) {
  const currentQuiz = availableQuizzes.pop();
  const optionsContainer = document.getElementById('quiz-options');

  document.getElementById('quiz-subject').textContent =
    currentQuiz.subject || '일반';
  document.getElementById('quiz-type').textContent =
    typeLabels[currentQuiz.type] || '퀴즈';
  document.getElementById('quiz-question').textContent = currentQuiz.question;
  optionsContainer.innerHTML = '';

  if (currentQuiz.options?.length > 0) {
    currentQuiz.options.forEach((option) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = option;
      btn.onclick = () => {
        closeModal();
        callback(option === currentQuiz.answer);
      };
      optionsContainer.appendChild(btn);
    });
  } else {
    renderShortAnswerInput(currentQuiz, callback);
  }

  document.getElementById('quiz-modal').style.display = 'flex';
}

function renderShortAnswerInput(quiz, callback) {
  const container = document.getElementById('quiz-options');
  const input = document.createElement('input');
  input.id = 'quiz-answer-input';
  input.placeholder = '정답 입력';

  const submitBtn = document.createElement('button');
  submitBtn.className = 'quiz-option-btn';
  submitBtn.textContent = '확인';
  submitBtn.onclick = () => {
    closeModal();
    callback(checkShortAnswer(input.value, quiz));
  };

  container.appendChild(input);
  container.appendChild(submitBtn);
}

// 정답(또는 키워드)과 사용자가 입력한 값을 비교하는 유틸 함수들
function normalizeAnswer(text) {
  return text.trim().toLowerCase().replace(/\s+/g, '');
}

function checkShortAnswer(userAnswer, quiz) {
  const normUser = normalizeAnswer(userAnswer);
  const normCorrect = normalizeAnswer(quiz.answer);
  const isKeywordMatch = quiz.keywords?.some(
    (k) => normUser === normalizeAnswer(k),
  );
  return normUser === normCorrect || isKeywordMatch;
}

function closeModal() {
  document.getElementById('quiz-modal').style.display = 'none';
}
