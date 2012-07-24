var http = require('http'),
    sys  = require('sys'),
    fs   = require('fs'),
    io   = require('socket.io');

var clients = [];

var server = http.createServer(function(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  
  var rs = fs.createReadStream(__dirname + '/template.html');
  sys.pump(rs, response);
  
});

var socket = io.listen(server); 
socket.on('connection', function(client) {
  
  var username;
  
  clients.push(client);
  
  client.send('Welcome to this chat server!');
  client.send('Please input your username:');
  
  client.on('message', function(message) {
    if (!username) {
      username = message.toString();
      client.send('Welcome, ' + username + '!');
      return;
    }
    var broadcast_message = username + ' said: ' + message.toString();
    socket.broadcast(broadcast_message);
  });
  
  client.on('disconnect', function() {
    var pos = clients.indexOf(client);
    if (pos >= 0) {
      clients.splice(pos, 1);
    }
  });
  
});

server.listen(4000);
