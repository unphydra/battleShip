const http = require('http');
const processRequest = require('./app.js');

const handleConnection = function(req, res) {
  console.log(req.url);
  let data = '';
  req.on('data', chunk => (data += chunk));
  req.on('end', () => {
    console.log(data);
  });
  processRequest(req, res, data);
};

const main = (port = 4000) => {
  const server = new http.Server(handleConnection);
  server.on('error', err => console.error('server error', err));
  server.on('listening', () =>
    console.warn('started listening', server.address())
  );
  server.listen(port);
};
main(process.argv[2]);
