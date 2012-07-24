(function() {
  var http, str, varname;
  http = require('http');
  str = 'Hello World';
  varname = false;
  http.createServer(function(req, res) {
    str = 'Hello World!';
    res.writeHead(200);
    if (varname != null) {
      res.write('First ');
    }
    if (!false) {
      return res.end(str);
    }
  }).listen(4000);
}).call(this);
