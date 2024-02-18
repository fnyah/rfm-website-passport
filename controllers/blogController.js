const { streamFile } = require('../utils/gridfsUtility');
const asyncHandler = require('../middleware/asyncHandler');

exports.displayBlogImage = asyncHandler( async (req, res) => {  
  const filename = req.params.filename;
  streamFile(req, res, 'blogphotos', filename); // Assuming 'uploads' is your bucket name
});


