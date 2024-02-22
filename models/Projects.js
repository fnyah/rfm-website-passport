const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    filename: {
        type: Array,
    },
    author: {
        type: String,
    },
    videoLink: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Project', projectSchema);
