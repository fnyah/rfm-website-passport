const asyncHandler = require('../middleware/asyncHandler');
const { streamFile } = require('../utils/gridfsUtility');

exports.displayProjectImage = asyncHandler( async (req, res) => {
  const filename = req.params.filename;
  streamFile(req, res, 'projectphotos', filename); // Assuming 'uploads' is your bucket name
});




