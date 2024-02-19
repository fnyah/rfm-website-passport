const asyncHandler = require('../middleware/asyncHandler');
const { streamFile } = require('../utils/gridfsUtility');
const Home = require('../models/Home');
const PhotoLinkInfo = require('../models/Photos');

exports.displayHomeImage = asyncHandler(async (req, res) => {
  const filename = req.params.filename;
  streamFile(req, res, 'uploads', filename);
});

exports.getHomeData = asyncHandler(async (req, res) => {
  const posts = await Home.find().sort({ createdAt: -1 });
  const photolinks = await PhotoLinkInfo.find().sort({ createdAt: -1 });
  res.render("home", { posts: posts, photolinks: photolinks });
});





