const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const connections = {};

// Improved initialization to ensure a single connection per URI and reuse it
async function initializeGridFS(mongoURI, bucketName) {
    if (!connections[mongoURI]) {
        try {
            const conn = await mongoose.createConnection(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`Connection established for GridFS bucket: ${bucketName}`);

            // Using GridFSBucket for a modern approach over Grid
            const gridFSBucket = new GridFSBucket(conn.db, { bucketName });
            if (!connections[mongoURI]) connections[mongoURI] = { conn, gfs: {} };
            connections[mongoURI].gfs[bucketName] = gridFSBucket;

        } catch (error) {
            console.error(`Failed to initialize GridFS for bucket ${bucketName}:`, error);
        }
    } else if (!connections[mongoURI].gfs[bucketName]) {
        // Initialize GridFSBucket if it hasn't been for the specified bucketName
        const gridFSBucket = new GridFSBucket(connections[mongoURI].conn.db, { bucketName });
        connections[mongoURI].gfs[bucketName] = gridFSBucket;
    }
}

// Stream file from GridFS
const streamFile = async (req, res, bucketName, filename) => {
    const gfs = getGridFSStream(process.env.MONGO_URI, bucketName);
    if (!gfs) {
        return res.status(500).send("Failed to access file storage.");
    }

    gfs.find({ filename }).toArray((err, files) => {
        if (!files[0] || files.length === 0 || err) {
            return res.status(404).send('No file exists');
        }
        const readStream = gfs.openDownloadStreamByName(filename);
        readStream.pipe(res);
    });
};

// Retrieve the GridFS stream
function getGridFSStream(mongoURI, bucketName) {
    if (connections[mongoURI] && connections[mongoURI].gfs[bucketName]) {
        return connections[mongoURI].gfs[bucketName];
    } else {
        console.error(`GridFS stream not initialized for bucket: ${bucketName}.`);
        return null;
    }
}

module.exports = { initializeGridFS, getGridFSStream, streamFile };
