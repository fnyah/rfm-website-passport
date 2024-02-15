const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    link: {
        type: String,
    },
    description: {
        type: String,
    },
    filename: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('PhotoLink', photoSchema);
