const mongoose = require('mongoose');

// This schema is for the file upload on the 'for educators' page.
const uploadFileSchema = new mongoose.Schema({
        filename: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    });

module.exports = mongoose.model('UploadFile', uploadFileSchema);
