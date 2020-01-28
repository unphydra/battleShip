const main = () => {
  displayGrid();
};

let shipsPositions = [];

const handleClick = () => {
  const cellId = event.target.id;
  shipsPositions.push(cellId);
  console.log(cellId);

  const cell = document.querySelector(`#board1 #\\3${cellId}`);
  console.log(cell);

  cell.classList.add('red');
  cell.removeEventListener('click', demo);
};
