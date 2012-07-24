var Mongoose = require('mongoose'),
    Schema  = Mongoose.Schema;

var User = new Schema({
  login: String,
  password: String,
  role: String,
});

Mongoose.model('User', User);