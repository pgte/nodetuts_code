var http = require('http'),
    fs   = require('fs');

var file_path = __dirname + '/cat.jpg';

fs.stat(file_path, function(err, stat) {
  var file_size = stat.size;
  
  http.createServer(function(request, response) {

    response.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': file_size
    });
    
    fs.open(file_path, 'r', undefined, function(err, fd) {
      fs.read(fd, buf, 0, buf.length, null, function(err, bytesRead) {
        response.write(buf, 0, bytesRead);
      });
    });

    fs.readFile(file_path, function(err, file_data) {
      if (err) {
        throw err;
      }
      response.write(file_data);
      response.end();
    });

  }).listen(4000);
});

