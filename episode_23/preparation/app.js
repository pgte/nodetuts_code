var express = require('express');
//require('express-namespace');
require('express-resource');

// Modules      
var forums   = require('./modules/forums'),
    products = require('./modules/products');

var app = express.createServer();

app.namespace('/forums', function() {
  forums.init(app);
});

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

app.resource('products', products);

app.listen(4000);