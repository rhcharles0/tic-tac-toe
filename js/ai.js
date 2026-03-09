/**
 * 비어있는 칸 중에서 무작위로 하나를 선택하여 반환합니다.
 * @param {Array} board 현재 게임판 상태
 * @returns {number|null} 선택된 인덱스 또는 null
 */
export function getAiMove(board) {
  const availableIndices = board
    .map((cell, idx) => (cell === '' ? idx : null))
    .filter((idx) => idx !== null);

  if (availableIndices.length === 0) return null;

  // 단순한 랜덤 AI (나중에 더 똑똑한 로직으로 교체 가능)
  const randomIndex = Math.floor(Math.random() * availableIndices.length);
  return availableIndices[randomIndex];
}
