const Blog = require("../../models/Blog");
const addHttp = require("../../middleware/addhttp"); // Assuming you've moved the logic to a utility function for reusability
const asyncHandler = require("../../middleware/asyncHandler");


const prepareBlogData = (req, existingFilenames = []) => {
  if (!req.body) {
    return { title: undefined, description: undefined, filename: undefined, links: undefined };
  }
  const { title, description, link } = req.body;
  const filenames = existingFilenames.concat(req.files?.map(file => file.filename) ?? []);
  const links = link ? link.split(",").map(addHttp) : [];
  

  return { title, description, filename: filenames, links };
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

  // Correctly passing existing filenames to prepareBlogData
  const updateData = prepareBlogData(req, existingBlog.filename);
  await Blog.findByIdAndUpdate(id, updateData, { new: true });
  res.redirect("/admin/for-educators");
});

// Edits photos associated with a blog post
exports.editBlogPhotos = asyncHandler(async (req, res) => {
  const photosToRemove = req.body; // Assuming this is an array of photo filenames to remove
  const files = req.params.id
  const blogPost = await Blog.findById(files);
  if (!blogPost) {
    return res.status(404).send('Blog post not found');
  }

  const updatedPhotos = blogPost.filename.filter(photo => !photosToRemove.includes(photo));

  await Blog.findByIdAndUpdate(files, { filename: updatedPhotos });
  res.sendStatus(200);
}); 