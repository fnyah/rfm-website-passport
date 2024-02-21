const Blog = require("../../models/Blog");
const addHttp = require("../../middleware/addhttp"); // Assuming you've moved the logic to a utility function for reusability
const asyncHandler = require("../../middleware/asyncHandler");


const prepareBlogData = (req = {}) => {
  if (!req.body) {
    return {
      title: undefined,
      description: undefined,
      filename: undefined,
      links: undefined,
    };
  }
  const { title, description, link } = req.body;
  const filenames = req.files.map(file => file.filename);
  const links = link.split(",").map(addHttp);

  return {
    title,
    description,
    filename: filenames,
    links,
  };
};

// Fetches and displays all blog posts
exports.getBlogPosts = asyncHandler(async (req, res) => {
  const blog = await Blog.find().sort({ createdAt: -1 });
  res.render("admin-for-educators/controlPanel", { blog });
});


// Creates a new blog post
exports.createBlogPost = asyncHandler(async (req, res) => {
  const newBlogPost = new Blog(prepareBlogData(req));
  await newBlogPost.save();
  res.redirect("/admin/for-educators");
});

// Updates an existing blog post
exports.updateBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingBlog = await Blog.findById(id);
  if (!existingBlog) {
    return res.status(404).send('Blog post not found');
  }

  const updateData = prepareBlogData(req, { filename: [...existingBlog.filename, ...req.files.map(file => file.filename)] });
  await Blog.findByIdAndUpdate(id, updateData, { new: true });
  res.redirect("/admin/for-educators");
});

// Edits photos associated with a blog post
exports.editBlogPhotos = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).send('Blog post not found');
  }

  const updatedFilenames = blog.filename.filter(filename => !req.body.photos.includes(filename));
  await Blog.findByIdAndUpdate(id, { filename: updatedFilenames });
  res.send({ message: 'Blog photos updated successfully' });
});

