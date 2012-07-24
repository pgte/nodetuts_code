var util = require('util');

exports.index = {
  xml: function(req, res) {
    res.send('blabla');
  },
  json: function(req, res) {
    res.send('json');
  },
};

exports.show = function(req, res) {
  res.send('forums#show: ' + util.inspect(req.product));
};

exports.new = function(req, res) {
  res.send('forums#new')
};

exports.create = function(req, res) {
  res.send('forums#create')
};

exports.edit = function(req, res) {
  res.send('forums#edit')
};

exports.update = function(req, res) {
  res.send('forums#update')
};
