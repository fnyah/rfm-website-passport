const router = require("express").Router();
const express = require("express");
const Blog = require("../../models/Blog");
const isAuth = require("../authMiddleware").isAuth;
const multer = require("multer");
const methodOverride = require("method-override");
const { makeGridFsStorage } = require("../../utils/gridfsStorageutil");
const { createBlogPost, updateBlogPost, editBlogPhotos, deleteBlogPost, getBlogPosts } = require("../../controllers/admin-controllers/adminBlogController");
const asyncHandler = require("../../middleware/asyncHandler");


router.use(express.json());
router.use(methodOverride('_method'));


const storage = makeGridFsStorage(process.env.MONGO_URI, "blogphotos");
const upload = multer({ storage });

// Gets all blog posts
router.get("/", isAuth, asyncHandler(getBlogPosts));

// Create a new blog post form
router.get("/new", isAuth, (req, res) => res.render("admin-for-educators/new", { title: "newpost" }));

// Fetch a blog for editing
router.get("/edit/:id", isAuth, asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).send("Blog post not found.");
  }
  res.render("admin-for-educators/edit", { blog });
}));

// Create, update, and delete blog posts
router.post("/", isAuth, upload.any("file"), asyncHandler(createBlogPost));
router.put("/:id", upload.any("file"), isAuth, asyncHandler(updateBlogPost));
router.post("/:id", isAuth, asyncHandler(editBlogPhotos));
router.delete("/:id", isAuth, asyncHandler(deleteBlogPost));

module.exports = router;
