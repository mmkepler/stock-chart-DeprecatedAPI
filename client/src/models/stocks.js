const mongoose = require('mongoose');

var stockSchema = mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Stocks', stockSchema);