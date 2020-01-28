const row = 11;
const col = 11;

const getCellId = function(col, row) {
  return `${col}_${row}`;
};

const createCell = function(player, col, row) {
  console.log(player, col, row);

  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(col, row);
  player.appendChild(cell);
};

const displayGrid = function() {
  const player1 = document.getElementById('player1');
  const player2 = document.getElementById('player2');
  const players = [player1, player2];
  players.forEach(player => {
    for (let x = 1; x <= col; x++) {
      for (let y = 1; y <= row; y++) {
        createCell(player, x, y);
      }
    }
  });
};
