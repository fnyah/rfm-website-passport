const Blog = require("../../models/Blog");
const { addHttp } = require("../../utils/addhttpUtil");
const asyncHandler = require("../../middleware/asyncHandler");

exports.getBlogPosts = async (req, res) => {
  let blog = await Blog.find().sort({ createdAt: -1 });
  res.render("admin-for-educators/controlPanel", { blog });
};

exports.createBlogPost = async (req, res) => {
  const filenames = req.files.map((file) => file.filename);
  const links = req.body.link.split(",");

  const linksWithHttp = links.map(addHttp);

  const blogPost = new Blog({
    title: req.body.title,
    description: req.body.description,
    filename: filenames,
    links: linksWithHttp,
  });
  try {
    await blogPost.save();
    res.redirect("/admin/for-educators");
  } catch (err) {
    console.log(err);
  };
};

exports.updateBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, link } = req.body;
  const newFilenames = req.files.map(file => file.filename); // New filenames from the uploaded files
  const links = link.split(",");
  const linksWithHttp = links.map(addHttp);

  // Fetch the existing blog post to get current filenames
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).send('Blog post not found');
  }

  // Combine existing filenames with new filenames
  const updatedFilenames = blog.filename ? [...blog.filename, ...newFilenames] : newFilenames;

  // Prepare the update object
  const update = {
    title,
    description,
    links: linksWithHttp,
    filename: updatedFilenames // Use the combined filenames
  };

  // Perform the update operation
  await Blog.findByIdAndUpdate(id, update, { new: true });
  res.redirect("/admin/for-educators");
});

// exports.editBlogPhotos = asyncHandler(async (req, res) => {

//   console.log(req.body);
  // const { id } = req.params; // Get the blog post ID from the URL parameter
  // const photosToRemove = req.body.photos; // Assuming the body contains an array of photo filenames to remove

  // // Fetch the current blog post by ID
  // const blog = await Blog.findById(id);
  // if (!blog) {
  //   return res.status(404).send('Blog post not found');
  // }

  // // Filter out the photos that need to be removed
  // const updatedFilenames = blog.filename.filter(filename => !photosToRemove.includes(filename));

  // // Update the blog post with the new list of filenames
  // blog.filename = updatedFilenames;
  // await blog.save();

  // res.send({ message: 'Blog photos updated successfully', blog });
// });

exports.editBlogPhotos = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { id } = req.params; // Get the blog post ID from the URL parameter
  const photosToRemove = req.body; 

  // Fetch the current blog post by ID
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).send('Blog post not found');
  }

  // Filter out the photos that need to be removed

  const updatedFilenames = blog.filename.filter(filename => !photosToRemove.includes(filename));

  // Update the blog post with the new list of filenames
  blog.filename = updatedFilenames;
  await blog.save();

  res.send({ message: 'Blog photos updated successfully', blog });
});

exports.deleteBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndDelete(id);
  res.redirect("/admin/for-educators");
});