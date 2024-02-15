const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    information: {
        type: String,
    },
    eventDate: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Events', eventSchema);