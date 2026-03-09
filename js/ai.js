/**
 * 난이도 'hard'에서 사용할 틱택토 AI 로직
 *
 * 보드 표현
 *  - 'X' : 플레이어 말
 *  - 'O' : AI 말
 *  - ''  : 비어 있는 칸
 *
 * 전략
 *  1. AI가 바로 이길 수 있는 수가 있으면 그 칸 선택
 *  2. 플레이어가 바로 이길 수 있는 수가 있으면 그 칸을 막기
 *  3. 중앙(4번 칸)이 비어 있으면 우선 차지
 *  4. 모서리(0, 2, 6, 8) 중 비어 있는 칸 선호
 *  5. 그래도 없으면 남은 칸 중 랜덤
 */

// 승리 패턴 (가로 3, 세로 3, 대각 2)
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function findWinningMove(board, player) {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    const values = [board[a], board[b], board[c]];

    const playerCount = values.filter((v) => v === player).length;
    const emptyIndex = pattern.find((i) => board[i] === '');

    if (playerCount === 2 && emptyIndex !== undefined) {
      return emptyIndex;
    }
  }
  return null;
}

/**
 * 현재 보드 상태에서 AI가 둘 위치(0~8)를 결정합니다.
 * @param {Array<'X'|'O'|''>} board 현재 게임판 상태
 * @returns {number|null} 선택된 인덱스 또는 null
 */
export function getAiMove(board) {
  const ai = 'O';
  const human = 'X';

  const availableIndices = board
    .map((cell, idx) => (cell === '' ? idx : null))
    .filter((idx) => idx !== null);

  if (availableIndices.length === 0) return null;

  // 1. AI가 바로 이길 수 있는 수
  let move = findWinningMove(board, ai);
  if (move !== null) return move;

  // 2. 플레이어가 바로 이길 수 있는 수를 막기
  move = findWinningMove(board, human);
  if (move !== null) return move;

  // 3. 중앙 선호
  if (board[4] === '') return 4;

  // 4. 모서리 선호
  const corners = [0, 2, 6, 8].filter((i) => board[i] === '');
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. 나머지 칸 중 랜덤
  const randomIndex = Math.floor(Math.random() * availableIndices.length);
  return availableIndices[randomIndex];
}
