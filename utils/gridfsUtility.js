const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const connections = {};
let isDbConnected = false;

mongoose.connection.once('open', () => {
  isDbConnected = true;
});

function initializeGridFS(mongoURI, bucketName) {
    if (!connections[mongoURI]) {
        const conn = mongoose.createConnection(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        conn.once('open', () => {
            console.log(`Connection to mongodb-gfs established for bucket ${bucketName}.`);
            const gfs = Grid(conn.db, mongoose.mongo);
            gfs.collection(bucketName);
            // Initialize the gfs object for this URI and bucketName
            if (!connections[mongoURI]) {
                connections[mongoURI] = { conn, gfs: {} };
            }
            connections[mongoURI].gfs[bucketName] = gfs;
        });
    } else if (!connections[mongoURI].gfs[bucketName]) {
        // This ensures that for an existing connection, a new GridFS stream is only initialized if it hasn't been for the specified bucketName
        const gfs = Grid(connections[mongoURI].conn.db, mongoose.mongo);
        gfs.collection(bucketName);
        connections[mongoURI].gfs[bucketName] = gfs;
    }
}


function getGridFSStream(mongoURI, bucketName) {
    if (connections[mongoURI] && connections[mongoURI].gfs[bucketName]) {
        return connections[mongoURI].gfs[bucketName];
    } else {
        console.error(`GridFS stream not initialized for ${bucketName}.`);
        return null;
    }
}

module.exports = { initializeGridFS, getGridFSStream };