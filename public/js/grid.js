const row = 10;
const col = 10;

const getCellId = function(col, row) {
  return `${col}_${row}`;
};

const createCell = function(board, innerText, id) {
  const cell = document.createElement('div');
  if (innerText) {
    cell.innerText = innerText;
  }
  cell.className = 'cell';
  cell.id = id;
  board.appendChild(cell);
};

const createBoard = function(player) {
  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      const id = getCellId(x, y);
      createCell(player, false, id);
    }
  }
};

const createHeader = function(header) {
  for (let x = 0; x <= col; x++) {
    createCell(header, x);
  }
};

const createSide = function(side) {
  for (let y = 0; y < row; y++) {
    const innerText = String.fromCharCode(65 + y);
    createCell(side, innerText);
  }
};

const createContainer = function(container) {
  createBoard(container);
  const header = container.parentElement.parentElement.children[0];
  createHeader(header);
  const side = container.parentElement.children[0];
  createSide(side);
};

const displayGrid = function() {
  const board1 = document.getElementById('board1');
  const board2 = document.getElementById('board2');
  createContainer(board1);
  board2 && createContainer(board2);
};
