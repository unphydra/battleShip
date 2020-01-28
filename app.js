const fs = require('fs');

const static_path = `${__dirname}/public`;

const serveStaticFile = (req, res) => {
  const path = `${static_path}${req.url}`;
  console.log('path:', path);

  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return fileNotFound(res);
  const content = fs.readFileSync(path);
  res.setHeader('Content-Length', content.length);
  res.statusCode = 200;
  res.end(content);
};

const fileNotFound = function(res) {
  res.statusCode = 404;
  res.end();
};

const serveHomePage = (req, res) => {
  const html = fs.readFileSync('./public/');
  res.setHeader('Content-Length', html.length);
  res.statusCode = 200;
  res.end(html);
};

const findHandler = req => {
  return serveStaticFile;
};
const processRequest = (req, res, data) => {
  const handler = findHandler(req);
  return handler(req, res, data);
};

module.exports = processRequest;
