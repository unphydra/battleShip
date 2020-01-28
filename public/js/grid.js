const row = 10;
const col = 10;

const getCellId = function(col, row) {
  return `${col}_${row}`;
};

const createCell = function(board, col, row, allow) {
  const cell = document.createElement('div');
  if (row === -1) {
    cell.innerText = col + 1;
  }
  if (col === -1) {
    cell.innerHTML = String.fromCharCode(65 + row);
  }
  cell.className = 'cell';
  if (allow && row !== -1 && col !== -1) {
    cell.addEventListener('click', handleClick);
  }
  cell.id = getCellId(col, row);
  board.appendChild(cell);
};

const createBoard = function(player, allow) {
  for (let y = -1; y < row; y++) {
    for (let x = -1; x < col; x++) {
      createCell(player, x, y, allow);
    }
  }
};

const displayGrid = function() {
  const board1 = document.getElementById('board1');
  const board2 = document.getElementById('board2');
  createBoard(board1, true);
  board2 && createBoard(board2, false);
};
