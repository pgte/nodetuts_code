var net = require('net');
var stats = require('./statistics');

function connect() {
  process.stdout.write('#');
  var time = Date.now();
  var conn = net.createConnection(4000);

  conn.on('connect', function() {
    stats.collect('connect', Date.now() - time);
    var latencyTime = Date.now();
    conn.write('Hello');
    conn.on('data', function(data) {
      stats.collect('latency', Date.now() - latencyTime);
    });
  });

  conn.on('close', function() {
    conn.end();
  });  
}

setInterval(connect, 100);

process.on('SIGINT', function() {
  console.log("\n######## summary:");
  stats.summarize();
  process.exit();
});