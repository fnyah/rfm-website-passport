const mongoose = require('mongoose');

const standingSchema = new mongoose.Schema({
    information: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports = mongoose.model('Standings', standingSchema);