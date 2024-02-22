const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const connections = {};

// Improved initialization to ensure a single connection per URI and reuse it.
async function initializeGridFS(mongoURI, bucketName) {
    if (!connections[mongoURI]) {
        try {
            // Check if mongoose is connected
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Mongoose is not connected. Ensure mongoose.connect() is called first.');
            }

            const db = mongoose.connection.db; // Use the existing connection's db instance
            const gridFSBucket = new GridFSBucket(db, { bucketName });

            // Store the GridFSBucket for later use
            connections[mongoURI] = { db, gfs: {} };
            connections[mongoURI].gfs[bucketName] = gridFSBucket;

            console.log(`GridFS initialized for bucket ${bucketName}.`);

        } catch (error) {
            console.error(`Failed to initialize GridFS for bucket ${bucketName}:`, error);
        }
    } else if (!connections[mongoURI].gfs[bucketName]) {
        // If the bucket has not been initialized yet, initialize it now
        const db = connections[mongoURI].db;
        const gridFSBucket = new GridFSBucket(db, { bucketName });
        connections[mongoURI].gfs[bucketName] = gridFSBucket;
    }
}

// Stream file from GridFS.
const streamFile = async (req, res, bucketName, filename) => {
    const gfs = getGridFSStream(process.env.MONGO_URI, bucketName);
    if (!gfs) {
        return res.status(500).send("Failed to access file storage.");
    }

    const files = await gfs.find({ filename }).toArray();
    if (!files[0] || files.length === 0) {
        return res.status(404).send('No file exists');
    }
    
    gfs.openDownloadStreamByName(filename).pipe(res);
};

// Retrieve the GridFS stream.
function getGridFSStream(mongoURI, bucketName) {
    if (connections[mongoURI] && connections[mongoURI].gfs[bucketName]) {
        return connections[mongoURI].gfs[bucketName];
    } else {
        console.error(`GridFS stream not initialized for bucket: ${bucketName}.`);
        return null;
    }
}

module.exports = { initializeGridFS, getGridFSStream, streamFile };
