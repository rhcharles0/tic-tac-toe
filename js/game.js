/*
 * game.js - 틱택토 보드 상태, 승패 판별, 턴 관리
 *
 * 구현할 파트:
 *
 * 1. 게임 상태 객체 (또는 main.js와 연동)
 *    - board: Array(9).fill(null)  // 'player' | 'cpu' | null
 *    - currentPlayer: 'player' | 'cpu'
 *    - isGameOver: boolean
 *    - selectedCellIndex: number | null  // 퀴즈 맞추면 착수할 칸
 *    - score: { player, cpu, draws }
 *
 * 2. 승리 판별
 *    - WINNING_COMBINATIONS 상수 (가로3, 세로3, 대각선2)
 *    - checkWin(playerType): gameState.board 기준으로 해당 플레이어 승리 여부
 *
 * 3. 무승부 판별
 *    - checkDraw(): 9칸이 모두 찼고 승자 없으면 true
 *
 * 4. 턴 전환
 *    - 플레이어 착수 후 → checkWin/checkDraw → 아니면 CPU 턴으로 전환, setTurn('cpu') 호출
 *    - CPU 착수 후(ai.js 연동) → checkWin/checkDraw → 아니면 플레이어 턴, setTurn('player')
 *
 * 5. 게임 종료 처리
 *    - 승리/무승부 시 결과 모달 표시, score 갱신
 *    - resetGame(): board/currentPlayer/isGameOver 등 초기화, 다시 하기용
 */
