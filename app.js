const fs = require('fs');
const querystring = require('querystring');
const contentType = require('./public/lib/content-types.json');

const static_path = `${__dirname}/public`;
let no_of_player = 0;
let start = false;
let game_started = false;
let players = [];

const serveStaticFile = (req, res, data) => {
  const path = `${static_path}${req.url}`;

  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return fileNotFound(req, res);
  const playerName = querystring.parse(data).name;
  const content = fs.readFileSync(path);
  if (!req.headers['Cookie'] && req.url == '/html/select.html') {
    const cookie = `coco=${new Date().getTime()}`;
    res.setHeader('Set-Cookie', cookie);
    players.push({ playerName, cookie });
    console.log(players);
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  res.setHeader('Content-Length', content.length);
  res.setHeader('Content-type', contentType[extension]);
  res.statusCode = 200;
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
  console.log(no_of_player);

  let content = 'waiting';
  if (game_started) {
    start = true;
  }

  if (no_of_player === 2) {
    console.log('game started');

    game_started = true;
    content = 'start';
  }
  res.setHeader('Content-Length', content.length);
  res.setHeader('Content-Type', contentType['txt']);
  res.statusCode = 200;
  res.end(content);
};

const getShipsPositions = function(req, res, data) {
  no_of_player++;
  const cookie = req.headers['set-cookie'];
  players.forEach(player => {
    if (player.cookie == cookie) {
      player.ships = JSON.parse(data);
    }
  });
  res.end();
};

const serveShips = function(req, res) {
  const cookie = req.headers['set-cookie'];
  players.forEach(player => {
    if (player.cookie == cookie) {
      res.end(JSON.stringify(player.ships));
    }
  });
};

const findHandler = req => {
  if (req.url == '/') {
    return serveHomePage;
  }
  if (req.url == '/wait') return waitingHandler;
  if (req.url == '/json') return getShipsPositions;
  if (req.url == '/getShips') return serveShips;
  return serveStaticFile;
};
const processRequest = (req, res, data) => {
  const handler = findHandler(req);
  return handler(req, res, data);
};

module.exports = processRequest;
