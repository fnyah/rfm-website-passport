const asyncHandler = require('../middleware/asyncHandler');
const { streamFile } = require('../utils/gridfsUtility');

exports.displayHomeImage = asyncHandler( async (req, res) => { 
  const filename = req.params.filename;
  streamFile(req, res, 'uploads', filename); // Assuming 'uploads' is your bucket name
});




