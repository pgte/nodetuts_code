var http = require('http');
var fs   = require('fs');
var sys = require('sys');

var file_path = __dirname + '/cat.jpg';
fs.stat(file_path, function(err, stat) {
  
  if (err) {
    throw err;
  }
  
  http.createServer(function(request, response) {

    response.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length' : stat.size
    });
    
    var rs = fs.createReadStream(file_path);
    sys.pump(rs, response, function(err) {
      if (err) {
        throw err;
      }
    })
    
  }).listen(4000);
})

