/*
 * ai.js - CPU(철수) 착수 알고리즘
 *
 * 구현할 파트:
 *
 * 1. 난이도 읽기
 *    - URL 쿼리 ?difficulty=easy|normal|hard 또는 localStorage.getItem('tttDifficulty')
 *    - 난이도별로 다른 전략 함수 호출
 *
 * 2. getCPUMove(board) → number (0~8 인덱스)
 *    - board: 현재 보드 배열 (null | 'player' | 'cpu')
 *    - 빈 칸 인덱스 중 하나 반환
 *
 * 3. Easy: 랜덤 착수
 *    - 빈 칸 인덱스 배열을 만든 뒤 Math.random()으로 하나 선택
 *
 * 4. Normal: 방어만
 *    - 우선순위1: 플레이어가 다음 수에 이길 수 있는 자리(두 개 연속 + 빈 칸)가 있으면 그 빈 칸 방어
 *    - 없으면: 중앙(4) 비어 있으면 4
 *    - 없으면: 빈 칸 중 랜덤
 *
 * 5. Hard: 최선의 수
 *    - 우선순위1: CPU가 한 수에 이길 수 있는 자리 있으면 그 칸 선택
 *    - 우선순위2: 플레이어가 이길 자리 방어
 *    - 우선순위3: 중앙(4) 선점
 *    - 우선순위4: 빈 칸 중 랜덤
 *
 * 6. 보조 함수
 *    - 빈 칸 목록 반환: board.map((v,i)=>v===null?i:null).filter(i=>i!=null)
 *    - 특정 플레이어가 한 수만 두면 이기는 칸 찾기: WINNING_COMBINATIONS 순회하며 두 칸 채워진 줄의 빈 칸 반환
 */
