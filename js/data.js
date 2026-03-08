/*
 * data.js - 퀴즈 데이터 로딩 및 출제 로직
 *
 * 구현할 파트:
 *
 * 1. 퀴즈 JSON 로드
 *    - fetch('/data/quiz.json') 또는 상대 경로로 data/quiz.json 로드
 *    - 응답 JSON 파싱 후 quizzes 배열 보관
 *
 * 2. Fisher-Yates 셔플
 *    - function shuffleArray(array): 배열을 무작위로 섞어 반환
 *    - 한 번 사용한 문제를 제거하거나, 매 게임/라운드마다 복사본을 셔플해 사용
 *
 * 3. 퀴즈 1개 뽑기
 *    - 사용 가능한 퀴즈 목록(availableQuizzes)에서 1개 꺼내서 반환
 *    - type에 따라 UI 분기: multiple_choice, ox, short_answer 등
 *
 * 4. (선택) 난이도/과목 필터
 *    - difficulty, subject로 필터링 후 셔플/선택
 */
