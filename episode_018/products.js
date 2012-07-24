var Mongoose = require('mongoose'),
    Schema   = Mongoose.Schema;

Mongoose.model('Product', new Schema({
  name: String,
  description: String,
  price: Number,
  photo: String
}));
