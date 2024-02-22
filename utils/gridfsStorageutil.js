const crypto = require('crypto');
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');

function makeGridFsStorage(mongoURI, bucketName) {
    return new GridFsStorage({
        url: mongoURI,
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    const filename = buf.toString("hex") + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: bucketName,
                    };
                    resolve(fileInfo);
                });
            });
        },
    });
}

module.exports = { makeGridFsStorage };
