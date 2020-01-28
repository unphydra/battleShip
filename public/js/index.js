const sendHttpGET = (url, data) => {
  const req = new XMLHttpRequest();
  req.onload = () => {
    document.location.href = 'http://localhost:4000/html/game.html';
  };
  req.open('POST', url);
  console.log(data);

  req.send(data);
};

const sendJson = function() {
  sendHttpGET('/json', JSON.stringify(shipsPositions));
};
