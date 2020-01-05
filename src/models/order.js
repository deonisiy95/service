const mongoose = require('mongoose');

const order = new mongoose.Schema({
  name: String,
  details: String,
  broadcasting: Boolean,
});

mongoose.model('Order', order);
