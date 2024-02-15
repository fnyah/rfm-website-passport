const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Home', homeSchema);