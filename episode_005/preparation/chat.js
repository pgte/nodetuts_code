var net     = require('net'),
    sys     = require('sys')
    carrier = require('carrier');

var connections = [];

net.createServer(function(conn) {
  
  console.log('one more connection');

  var username = 'anonymous';
  var first_line = true;

  connections.push(conn);
  conn.write("Welcome to the chat room.\n");
  conn.write("Currently there are " + connections.length + " active connections.\n");
  conn.write("Please say your name and start chatting.\n");
  
  conn.on('close', function() {
    var pos = connections.indexOf(conn);
    if (pos >= 0) {
      connections.splice(pos, 1);
    }
  });
  
  carrier.carry(conn, function(one_line) {
    console.log(username + ' said: ' + one_line);
    if (first_line) {
      username = one_line.toString();
      console.log(username);
      conn.write('Welcome, ' + username + "\n");
      first_line = false;
    }
    
    if (one_line == "quit") {
      conn.end();
      return;
    }

    var message = username + ': ' + one_line + "\n";
    console.log(message);
    connections.forEach(function(one_conn) {
      try {
        one_conn.write(message);
      } catch (excp) {
        sys.log("Error sending " + excp.message);
      }
    });    
  });
  
}).listen(4000);