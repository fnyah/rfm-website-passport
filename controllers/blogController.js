const { streamFile } = require('../utils/gridfsUtility');
const asyncHandler = require('../middleware/asyncHandler');
const Blog = require('../models/Blog');

exports.displayBlogImage = asyncHandler(async (req, res) => {
  const filename = req.params.filename;
  streamFile(req, res, 'blogphotos', filename);
});

exports.getBlogData = asyncHandler(async (req, res) => {
  const blog = await Blog.find().sort({ createdAt: -1 });
  res.render("for-educators", { blog: blog });
});
