const mongoose = require('mongoose');

const token = new mongoose.Schema({
  tokenId: String,
  userId: String
});

mongoose.model('Token', token);
