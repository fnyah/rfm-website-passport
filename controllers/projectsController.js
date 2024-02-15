const { getGridFSStream } = require('../utils/gridfsUtility');

const streamFile = (req, res, bucketName, filename) => {
  const gfs = getGridFSStream(process.env.MONGO_URI, 'projectphotos');
  if (!gfs) {
    return res.status(500).send("Failed to access file storage.");
  }

  gfs.files.findOne({ filename: filename }, (err, file) => {
    if (!file || err) {
      return res.status(404).send('No file exists');
    }
    // Stream file to response
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  });
}

const displayProjectImage = (req, res) => {
  const filename = req.params.filename;
  streamFile(req, res, 'projectphotos', filename); // Assuming 'uploads' is your bucket name
};

module.exports = { displayProjectImage };






