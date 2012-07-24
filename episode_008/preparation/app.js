var Connect = require('connect');

var server = Connect.createServer(
  require('./log-it')(),
  require('./serve-js')()
);
server.listen(4000);