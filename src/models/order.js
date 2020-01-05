const mongoose = require('mongoose');

const order = new mongoose.Schema({
  name: String,
  details: String,
  broadcasting: Boolean,
  userId: String
});

mongoose.model('Order', order);
