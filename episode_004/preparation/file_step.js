var http = require('http'),
    fs   = require('fs'),
    step = require('step');

var file_path = __dirname + '/cat.jpg';
var file_size;
var file_content;

step(
  function stat() {
    fs.stat(file_path, this);
  },
  function readfile(err, stat) {
    if (err) throw err;
    file_size = stat.size;
    fs.readFile(file_path, this);
  },
  function store_file(err, content) {
    if (err) throw err;
    file_content = content;
    this();
  },
  function createServer() {
    http.createServer(function(request, response) {
      response.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': file_size
      });
      
      response.end(file_content);

    }).listen(4000);
  }
);