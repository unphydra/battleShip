const main = () => {
  displayGrid();
};

let ship_placed = true;
let number;
let shipsPositions = [];

const handleClick = () => {
  number--;
  if (number == 0) {
    ship_placed = true;
  }
  const cellId = event.target.id;
  shipsPositions.push(cellId);
  const cell = document.querySelector(`#board1 #\\3${cellId}`);
  cell.classList.add('red');
  cell.removeEventListener('click', handleClick);
};

const shipSelect = () => {
  if (ship_placed) {
    ship_placed = false;
    const id = event.target.id;
    const box = document.getElementById(id);
    number = +box.innerText;
    box.classList.add('gray');
  }
};
