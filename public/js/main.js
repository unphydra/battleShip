const main = () => {
  displayGrid();
  requestGame();
};

let Id;

const sendHttpGET = (method, url, data, callback) => {
  const req = new XMLHttpRequest();
  req.onload = () => {
    callback(req);
  };
  req.open(method, url);
  req.setRequestHeader('Set-Cookie', document.cookie);
  console.log('data', data);

  if (data) {
    req.setRequestHeader('Content-Type', 'text/plain');
    req.send(data);
    return;
  }
  req.send();
};

const drawShips = function(positions) {
  positions.forEach(position => {
    const cell = document.querySelector(`#board2 #\\3${position}`);
    cell.classList.add('green');
  });
};

const getShips = function(req) {
  const shipsPositions = JSON.parse(req.responseText);
  drawShips(shipsPositions);
  requestTurn();
};

const requestGame = function() {
  const checkGameStat = req => {
    if (req.responseText == 'start') {
      sendHttpGET('GET', '/getShips', null, getShips);
      clearInterval(interval);
      const waitingBar = document.getElementById('waitingBar');
      waitingBar.style.display = 'none';
    }
  };
  const interval = setInterval(
    () => sendHttpGET('GET', '/wait', null, checkGameStat),
    1000
  );
};

const showHit = function(id) {
  const cell = document.querySelector(`#board1 #\\3${id}`);
  cell.classList.add('red');
};

const updateBoard = function(id, stat) {
  console.log(id);

  if (id) {
    const cell = document.querySelector(`#board2 #\\3${id}`);
    cell.classList.remove('green');
    let color = 'blue';
    if (stat == 'hit') {
      color = 'red';
    }
    cell.classList.add(color);
  }
};

const showMiss = function(id) {
  const cell = document.querySelector(`#board1 #\\3${id}`);
  cell.classList.add('blue');
};

const serverResponseOnClick = function(cellId, req) {
  const res = req.responseText;
  if (res == 'hit') {
    showHit(cellId);
    requestTurn();
    return;
  }
  showMiss(cellId);
  const board = document.getElementById('board1');
  board.removeEventListener('click', handleClick);
  requestTurn();
};

const handleClick = function() {
  const cellId = event.target.id;
  sendHttpGET(
    'POST',
    '/clicked',
    cellId.toString(),
    serverResponseOnClick.bind(null, cellId)
  );
};

const enableOnClick = function() {
  const board = document.getElementById('board1');
  board.addEventListener('click', handleClick);
};

const checkOnTurn = function(req) {
  const res = req.responseText.split('&');
  if (res[0] == 'yourTurn') {
    enableOnClick();
    clearInterval(Id);
  }
  updateBoard(res[1], res[2]);
};

const requestTurn = function() {
  const turnId = setInterval(
    () => sendHttpGET('GET', '/turn', null, checkOnTurn),
    2000
  );
  Id = turnId;
};
