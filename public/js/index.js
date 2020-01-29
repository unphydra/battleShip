const sendHttpGET = (url, data) => {
  const req = new XMLHttpRequest();
  req.onload = () => {
    document.location.href = 'http://10.132.21.176:4000/html/game.html';
  };
  req.open('POST', url);
  req.setRequestHeader('Set-Cookie', document.cookie);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(data);
};

const sendJson = function() {
  sendHttpGET('/json', JSON.stringify(shipsPositions));
};
