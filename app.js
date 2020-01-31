const fs = require('fs');
const querystring = require('querystring');
const contentType = require('./public/lib/content-types.json');
const status = require('./status.json');

const static_path = `${__dirname}/public`;

// status.no_of_player = 0;
// let status.start = false;
// let status.game_started = false;
// let status.players = {};

// let status.turn = false;
// let status.update = false;

const writeStatus = function() {
  fs.writeFileSync('./status.json', JSON.stringify(status), 'utf8');
};

const serveStaticFile = (req, res, data) => {
  const path = `${static_path}${req.url}`;

  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return fileNotFound(req, res);
  const playerName = querystring.parse(data).name;
  const content = fs.readFileSync(path);
  if (!req.headers['Cookie'] && req.url == '/html/select.html') {
    const cookie = `coco=${new Date().getTime()}`;
    res.setHeader('Set-Cookie', cookie);
    status.players[cookie] = { playerName };
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  res.setHeader('Content-Length', content.length);
  res.setHeader('Content-type', contentType[extension]);
  res.statusCode = 200;
  writeStatus();
  res.end(content);
};

const fileNotFound = (req, res) => {
  res.statusCode = 404;
  res.end('not Found');
};

const serveHomePage = (req, res) => {
  const html = fs.readFileSync(`${static_path}/html/login.html`);
  res.setHeader('Content-Length', html.length);
  res.setHeader('Content-type', contentType['html']);
  res.statusCode = 200;
  res.end(html);
};

const waitingHandler = function(req, res) {
  console.log('waiting');
  console.log(status.no_of_player);

  let content = 'waiting';
  if (status.game_started) {
    status.start = true;
  }

  if (status.no_of_player === 2) {
    status.game_started = true;
    content = 'start';
  }
  res.setHeader('Content-Length', content.length);
  res.setHeader('Content-Type', contentType['txt']);
  res.statusCode = 200;
  writeStatus();
  res.end(content);
};

const getShipsPositions = function(req, res, data) {
  status.no_of_player++;
  const cookie = req.headers['set-cookie'][0];
  status.players[cookie].ships = JSON.parse(data);
  res.end();
};

const serveShips = function(req, res) {
  const cookie = req.headers['set-cookie'][0];
  const content = JSON.stringify(status.players[cookie].ships);
  writeStatus();
  res.end(content);
};

const serveTurn = function(req, res) {
  const cookie = req.headers['set-cookie'][0];
  console.log(cookie);

  const content = [];
  if (!status.turn) {
    status.turn = cookie;
    writeStatus();
    console.log('assigning to', cookie, status.players[cookie]);
    content.push('yourTurn');
    // res.end('yourTurn');
    // return;
  }
  for (let playerId in status.update) {
    if (playerId != cookie) {
      if (status.update[playerId]) {
        console.log(
          'updating to',
          cookie,
          status.players[cookie].playerName
        );
        content.push(status.update[playerId]);
        status.update[playerId] = false;
        // res.end(status.update[playerId]);
        // return;
      }
    }
  }
  res.end(content.join('&'));
};

const serveClicked = function(req, res, data) {
  status.turn = false;
  const cookie = req.headers['set-cookie'][0];
  console.log(status.players[cookie].playerName, 'clicked on', data);

  console.log(status.update);

  let current = false;
  let content = 'miss';
  for (let player in status.players) {
    if (player != cookie) {
      if (status.players[player].ships.includes(data)) {
        current = true;
      }
    }
  }
  if (current) {
    content = 'hit';
  }
  status.update[cookie] = `${data}&${content}`;
  writeStatus();
  res.end(content);
};

const findHandler = req => {
  if (req.url == '/') {
    return serveHomePage;
  }
  if (req.url == '/wait') return waitingHandler;
  if (req.url == '/json') return getShipsPositions;
  if (req.url == '/getShips') return serveShips;
  if (req.url == '/turn') return serveTurn;
  if (req.url == '/clicked') return serveClicked;
  return serveStaticFile;
};
const processRequest = (req, res, data) => {
  const handler = findHandler(req);
  return handler(req, res, data);
};

module.exports = processRequest;
