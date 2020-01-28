const row = 11;
const col = 11;

const alphabets = [
  '&nbsp;',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j'
];

const getCellId = function(col, row) {
  return `${col}_${row}`;
};

const createCell = function(player, col, row) {
  const cell = document.createElement('div');
  if (row === 0) {
    cell.innerText = col;
  }
  if (col === 0) {
    cell.innerHTML = alphabets[row];
  }
  cell.className = 'cell';
  cell.id = getCellId(col, row);
  player.appendChild(cell);
};

const displayGrid = function() {
  const player1 = document.getElementById('player1');
  const player2 = document.getElementById('player2');
  const players = [player1, player2];
  players.forEach(player => {
    for (let y = 0; y < row; y++) {
      for (let x = 0; x < col; x++) {
        createCell(player, x, y);
      }
    }
  });
};
