# tic-tac-toe

1. 퀴즈 세트 원본 데이터 구조 (JSON)
외부 파일(data/quiz.json)로 분리하여 관리할 퀴즈 데이터의 구조입니다. 객관식, OX, 주관식이라는 서로 다른 유형을 하나의 일관된 포맷으로 처리할 수 있도록 설계했습니다.

JSON
{
  "version": "1.0",
  "totalCount": 54,
  "quizzes": [
    {
      "id": 1,
      "subject": "HTML", 
      "type": "multiple_choice", // 'multiple_choice', 'ox', 'short_answer' 중 택 1
      "difficulty": "medium",    // 추후 난이도 조절 기능을 위한 필드
      "question": "HTML에서 하이퍼링크를 생성할 때 사용하는 태그는 무엇인가요?",
      "options": ["<link>", "<a>", "<href>", "<url>"], // 주관식일 경우 빈 배열 [] 처리
      "answer": "<a>",
      "keywords": ["a", "anchor"], // 주관식 정답 판별을 위한 핵심 키워드 배열 (객관식/OX는 빈 배열 처리 가능)
      "explanation": "<a> 태그는 anchor의 약자로, 다른 페이지나 위치로 연결하는 하이퍼링크를 만듭니다."
    }
    // ... 나머지 53개 퀴즈
  ]
}
💡 설계 포인트: UI 단(HTML)에서 이 JSON을 받아 렌더링할 때, if (quiz.type === 'multiple_choice') 와 같이 조건문을 걸어 화면에 버튼 4개를 보여줄지, O/X 버튼 2개를 보여줄지, 입력창(<input>)을 보여줄지 분기 처리하기 매우 좋습니다.

2. 게임 상태 관리 자료구조 (JS State Object)
전역 변수들을 여기저기 흩어놓기보다는, 게임의 **현재 상태(State)**를 하나의 큰 객체로 묶어서 관리하는 것이 객체지향적이고 유지보수에 유리합니다. main.js 최상단에 아래와 같은 구조를 선언합니다.

JavaScript
const gameState = {
  // 1. 보드 상태 관리 (0~8 인덱스의 1차원 배열)
  // null: 빈칸, 'player': 짱구(O), 'cpu': 철수(X)
  board: Array(9).fill(null), 
  
  // 2. 턴 및 진행 상태 관리
  currentPlayer: 'player', // 현재 턴 ('player' 또는 'cpu')
  isGameOver: false,       // 게임 종료 여부 플래그
  selectedCellIndex: null, // 플레이어가 클릭하여 퀴즈가 진행 중인 칸의 인덱스
  
  // 3. 퀴즈 데이터 관리
  availableQuizzes: [],    // JSON에서 불러와 셔플(Shuffle)한 후 남은 퀴즈 배열
  currentQuiz: null,       // 현재 모달 창에 띄워진 문제 객체
  
  // 4. 통계 (선택 사항: 연승 카운트 등 추가 확장용)
  score: {
    player: 0,
    cpu: 0,
    draws: 0
  }
};
3. 데이터 흐름(Data Flow) 시나리오
위의 자료구조들이 실제 게임에서 어떻게 상호작용하는지 순서대로 살펴보겠습니다.

초기화 (Initialization):

게임이 로드되면 fetch('data/quiz.json')을 호출하여 54개의 퀴즈를 가져옵니다.

가져온 quizzes 배열을 무작위로 섞은 뒤 gameState.availableQuizzes에 저장합니다.

착수 시도 (Player Action):

짱구(플레이어)가 4번 칸(정중앙)을 클릭합니다.

gameState.board[4]가 null인지 확인합니다. (이미 돌이 있으면 무시)

gameState.selectedCellIndex = 4; 로 클릭한 위치를 기억합니다.

퀴즈 출제 (Quiz Phase):

gameState.availableQuizzes.pop()으로 퀴즈 하나를 꺼내 gameState.currentQuiz에 담습니다.

화면에 모달을 띄우고 currentQuiz의 내용을 렌더링합니다.

정답 판별 및 상태 업데이트 (Resolution):

정답일 경우: gameState.board[gameState.selectedCellIndex] = 'player'; (보드 배열 업데이트)
-> 화면의 4번 칸에 짱구 얼굴 이미지를 렌더링합니다.

오답일 경우: gameState.board는 그대로 둡니다. (빈칸 유지)

공통 처리: 모달을 닫고, gameState.currentPlayer = 'cpu'; 로 턴을 넘긴 뒤, 철수의 자동 착수 함수를 호출합니다.

이러한 상태 기반(State-driven) 데이터 구조를 바탕으로 개발을 진행하면, 중간에 에러가 나더라도 console.log(gameState) 한 줄만 찍어보면 현재 게임의 모든 상황을 즉각 파악할 수 있어 디버깅이 매우 편해집니다.

현재 블루프린트에서 데이터를 fetch로 불러와서 배열을 섞어주는 초기화 자바스크립트 코드부터 작성해 볼까요? 아니면 UI(HTML/CSS) 구조를 먼저 잡아보는 것이 좋을까요? 원하는 시작점을 말씀해 주시면 바로 코드를 제공해 드리겠습니다.
