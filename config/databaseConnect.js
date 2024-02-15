const mongoose = require('mongoose');
require('dotenv').config();

const connection = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;