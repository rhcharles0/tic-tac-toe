export let availableQuizzes = [];
const typeLabels = {
  multiple_choice: '객관식',
  ox: 'OX퀴즈',
  short_answer: '단답식',
};

// 1. JSON 데이터 읽기
export async function fetchQuizzes() {
  try {
    const response = await fetch('../data/quizset.json');
    const data = await response.json();
    availableQuizzes = data.quizzes.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
}

// 2. 퀴즈 모달 렌더링
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
  input.className = 'quiz-answer-input';
  input.autocomplete = 'off';
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

// 3. 정답 확인 로직
function normalizeAnswer(text) {
  return String(text ?? '').trim().toLowerCase().replace(/\s+/g, '');
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
