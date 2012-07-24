var express = require('express');
var multipart = require('multipart');
var fs = require('fs');

var app = express.createServer();

app.configure(function() {
  app.use(express.logger());
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.staticProvider(__dirname + '/static'));
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('root');
});

var products = require('./products');
var photos   = require('./photos');

app.get('/products', function(req, res) {
  res.render('products/index', {locals: {
    products: products.all
  }});
});

app.get('/products/new', function(req, res) {
  res.render('products/new', {locals: {
    product: req.body && req.body.product || products.new()
  }});
});

app.post('/products', function(req, res) {
  var id = products.insert(req.body.product);
  res.redirect('/products/' + id);
});

app.get('/products/:id', function(req, res) {
  var product = products.find(req.params.id);
  res.render('products/show', {locals: {
    product: product
  }});
});

app.get('/products/:id/edit', function(req, res) {
  var product = products.find(req.params.id);
  photos.list(function(err, photo_list) {
    if (err) {
      throw err;
    }
    res.render('products/edit', {locals: {
      product: product,
      photos: photo_list
    }});
    
  });
});

app.put('/products/:id', function(req, res) {
  var id = req.params.id;
  products.set(id, req.body.product);
  res.redirect('/products/'+id);
});

/* Photos */

app.get('/photos', function(req, res) {
  photos.list(function(err, photo_list) {
    res.render('photos/index', {locals: {
      photos: photo_list
    }})
  });
});

app.get('/photos/new', function(req, res) {
  res.render('photos/new');
});

app.post('/photos', function(req, res) {
  req.setEncoding('binary');
  
  var parser = multipart.parser();
  
  parser.headers = req.headers;
  var ws;
  
  parser.onPartBegin = function(part) {
    ws = fs.createWriteStream(__dirname + '/static/uploads/photos/' + part.filename);
    ws.on('error', function(err) {
      throw err;
    });
  };
  
  parser.onData = function(data) {
    ws.write(data, 'binary');
  };
  
  parser.onPartEnd = function() {
    ws.end();
    parser.close();
    res.redirect('/photos');
  };
  
  req.on('data', function(data) {
    parser.write(data);
  });
  
});

app.listen(4000);