const Blog = require("../../models/Blog");
const { addHttpToLinks } = require("../../middleware/addhttp");
const asyncHandler = require("../../middleware/asyncHandler");

// Fetches and displays all blog posts
exports.getBlogPosts = asyncHandler(async (req, res) => {
  const blogPosts = await Blog.find().sort({ createdAt: -1 });
  res.render("admin-for-educators/controlPanel", { blog: blogPosts });
});

// Creates a new blog post
exports.createBlogPost = asyncHandler(async (req, res) => {
  const { title, description, link } = req.body;
  const filenames = req.files.map(file => file.filename);
  const links = link.split(",").map(addHttpToLinks);

  const newBlogPost = new Blog({
    title,
    description,
    filename: filenames,
    links
  });

  await newBlogPost.save();
  res.redirect("/admin/for-educators");
});

// Updates an existing blog post
exports.updateBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, link } = req.body;
  const newFilenames = req.files.map(file => file.filename);
  const links = link.split(",").map(addHttpToLinks);

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).send('Blog post not found');
  }

  const updatedFilenames = [...blog.filename, ...newFilenames];
  await Blog.findByIdAndUpdate(id, { title, description, links: linksWithHttp, filename: updatedFilenames }, { new: true });
  res.redirect("/admin/for-educators");
});

// Edits photos associated with a blog post
exports.editBlogPhotos = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const photosToRemove = req.body.photosToRemove;

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).send('Blog post not found');
  }

  blog.filename = blog.filename.filter(filename => !photosToRemove.includes(filename));
  await blog.save();
  res.send({ message: 'Blog photos updated successfully', blog });
});

// Deletes a blog post
exports.deleteBlogPost = asyncHandler(async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect("/admin/for-educators");
});
