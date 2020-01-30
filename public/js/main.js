const main = () => {
  displayGrid();
  requestGame();
};

const handleClick = () => {
  const cellId = event.target.id;
  shipsPositions.push(cellId);
  const cell = document.querySelector(`#board1 #\\3${cellId}`);
  cell.classList.add('red');
  cell.removeEventListener('click', demo);
};

const sendHttpGET = (url, callback) => {
  const req = new XMLHttpRequest();
  req.onload = () => {
    callback(req);
  };
  req.open('GET', url);
  req.setRequestHeader('Set-Cookie', document.cookie);
  req.send();
};

const drawShips = function(positions) {
  positions.forEach(position => {
    const cell = document.querySelector(`#board2 #\\3${position}`);
    cell.classList.add('blue');
  });
};

const getShips = function(req) {
  const shipsPositions = JSON.parse(req.responseText);
  drawShips(shipsPositions);
};

const requestGame = function() {
  const checkGameStat = req => {
    if (req.responseText == 'start') {
      sendHttpGET('/getShips', getShips);
      clearInterval(interval);
      const waitingBar = document.getElementById('waitingBar');
      waitingBar.style.display = 'none';
    }
  };
  const interval = setInterval(
    () => sendHttpGET('/wait', checkGameStat),
    1000
  );
};
