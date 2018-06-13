const mongoose = require('mongoose');

var stockSchema = mongoose.Schema({
  name: String,
  companyName: String
});

module.exports = mongoose.model('stockList', stockSchema);

