var net = require('net');
var carrier = require('carrier');

var connections = [];

var server = net.createServer(function(conn) {
 
  console.log(server.connections);
  
  connections.push(conn);
  
  conn.on('close', function() {
    var pos = connections.indexOf(conn);
    if (pos >= 0) {
      connections.splice(pos, 1);
    }
  });
  
  conn.write("Hello, welcome to this chat server!\n");
  conn.write("Please input your user name:\n");
  
  var username;
  
  carrier.carry(conn, function(line) {
    if (!username) {
      username = line;
      conn.write("Hello " + username + "!\n");
      return;
    }
    
    if (line == 'quit') {
      conn.end();
      return;
    }
    
    var feedback = username + ": " + line + "\n";
    
    connections.forEach(function(one_connection) {
      one_connection.write(feedback);
    }); 
  });
  
});
server.listen(4000);
