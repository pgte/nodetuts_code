var nano = require('nano');
var server   = nano('http://admin:nodetuts30@nodetuts30.iriscouch.com');
var db = server.use('mydb');
var fs = require('fs');

var writeStream = fs.createWriteStream('/tmp/myphoto.jpg');
db.attachment.get('doc_two', 'my_photo').pipe(writeStream);