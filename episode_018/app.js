var express = require('express');
var multipart = require('multipart');
var fs = require('fs');

var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/db');

var app = express.createServer();

var MemStore = require('connect').session.MemoryStore;

app.configure(function() {
  app.use(express.logger());
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.staticProvider(__dirname + '/static'));
  app.use(express.cookieDecoder());
  app.use(express.session({store: MemStore( {
    reapInterval: 60000 * 10
  }),
    secret: "320ºrifsdçlfksdçfksf'ewfsdfkl"}));
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

app.dynamicHelpers(
  {
    session: function(req, res) {
      return req.session;
    },
    
    flash: function(req, res) {
      return req.flash();
    }
  }
);

function requiresLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/sessions/new?redir=' + req.url);
  }
};

app.get('/', function(req, res) {
  res.render('root');
});

/* Sessions */

require('./users');

var User = db.model('User');

app.get('/sessions/new', function(req, res) {
  res.render('sessions/new', {locals: {
    redir: req.query.redir
  }});
});


app.post('/sessions', function(req, res, next) {
  User.findOne({login: req.body.login, password: req.body.password}, function(err, user) {
    if (err) { next(err); return; }
    if (user) {
      req.session.user = user;
      res.redirect(req.body.redir || '/');
    } else {
      req.flash('warn', 'Login failed');
      res.render('sessions/new', {locals: {redir: req.body.redir}});
    }
  });
});

app.get('/sessions/destroy', function(req, res) {
  delete req.session.user;
  res.redirect('/sessions/new');
});

require('./products');
var Product = db.model('Product');
var photos   = require('./photos');

app.get('/products', requiresLogin, function(req, res, next) {
  Product.find({}, function(err, products) {
    if (err) { next(err); return;}
    res.render('products/index', {locals: {
      products: products
    }});
  });
});

app.get('/products/new', requiresLogin, function(req, res) {
  photos.list(function(err, photo_list) {
    if (err) {
      throw err;
    }
    res.render('products/new', {locals: {
      photos: photo_list,
      product: req.body && req.body.product || new Product()
    }});
    
  });
});

app.post('/products', requiresLogin, function(req, res) {
  var product = new Product(req.body.product);
  product.save(function() {
    res.redirect('/products/' + product._id.toHexString());
  });
});

app.get('/products/:id', function(req, res, next) {
  Product.findById(req.params.id, function(err, product) {
    if (err) { next(err); return;}
    res.render('products/show', {locals: {
      product: product
    }});
  });
});

app.get('/products/:id/edit', requiresLogin, function(req, res, next) {
  Product.findById(req.params.id, function(err, product) {
    if (err) { next(err); return; }
    photos.list(function(err, photo_list) {
      if (err) { next(err); return; }
      res.render('products/edit', {locals: {
        product: product,
        photos: photo_list
      }});
    });
  });
});

app.put('/products/:id', requiresLogin, function(req, res, next) {
  var id = req.params.id;
  console.log(req.body.product);
  Product.findById(id, function(err, product) {
    if (err) { next(err); return; }
    product.name = req.body.product.name;
    product.description = req.body.product.description;
    product.price = req.body.product.price;
    product.photo = req.body.product.photo;
    product.save(function() {
      res.redirect('/products/'+product._id.toHexString());
    });
  });
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