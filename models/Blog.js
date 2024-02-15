const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    filename: {
        type: Array,
    },
    links: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Blog', blogSchema);