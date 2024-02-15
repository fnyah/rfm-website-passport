const router = require("express").Router();;
const Blog = require("../../models/Blog");
const isAuth = require("../authMiddleware").isAuth;
const mongoose = require("mongoose");
const express = require("express");

const multer = require("multer");
const methodOverride = require("method-override");

const { makeGridFsStorage } = require("../../utils/gridfsStorageutil");
const { addHttp } = require("../../utils/addhttpUtil");

router.use(express.json());
router.use(methodOverride('_method'));

const mongoURI = process.env.MONGO_URI;

// Create storage engine
const storage = makeGridFsStorage(mongoURI, "blogphotos");
const upload = multer({ storage });

router.get("/", isAuth, async (req, res) => {
  let blog = await Blog.find().sort({ createdAt: -1 });
  res.render("admin-for-educators/controlPanel", { blog: blog });
});

router.post("/", isAuth, upload.any("file"), async (req, res) => {
  const filenames = req.files.map((file) => file.filename);

  // separate links into an array
  const links = req.body.link.split(",");
  // add https:// to links if it's not there
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
  }
});

router.get("/new", isAuth, (req, res) => {
  res.render("admin-for-educators/new", { title: "newpost" });
});

router.get("/edit/:id", isAuth, async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  res.render("admin-for-educators/edit", { blog: blog });
});

router.put("/:id", upload.any("file"), isAuth, async (req, res, next) => {
  const filenames = req.files.map((file) => file.filename);
  const currentFiles = await Blog.findById(req.params.id);
  const combinedFiles = [...currentFiles.filename, ...filenames];
  const links = req.body.link.split(",");
  const description = req.body.description.trim();
  const linksWithHttp = links.map(addHttp);

  if (req.files == "") {
    try {
      const editedProject = await Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: description,
        links: linksWithHttp,
      });
      console.log("Edited project: " + editedProject);
      res.redirect("/admin/for-educators");
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const editedProject = await Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        filename: combinedFiles,
        link: linksWithHttp,
      });
      console.log("Edited project: " + editedProject);
      res.redirect("/admin/projects");
    } catch (err) {
      console.log(err);
    }
  }
});

// edit project photos
router.post("/:id", isAuth, async (req, res, next) => {
  let photos = req.body;
  const blog = await Blog.findById(req.params.id);
  const files = blog.filename;
  // find the difference between the two arrays
  const difference = files.filter((x) => !photos.includes(x));
  console.log(difference);

  const editedBlog = await Blog.findByIdAndUpdate(req.params.id, {
    filename: difference,
  });
  try {
    await editedBlog.save();
    console.log("Saved Blog: " + editedBlog);
    res.sendStatus(200);
  } catch (e) {
    res.json(e);
  }
});

router.delete("/:id", isAuth, async (req, res, next) => {
  const blogId = mongoose.Types.ObjectId(req.params.id);
  try {
    await Blog.findByIdAndDelete(blogId);
    console.log("Deleted project: " + blogId);
    res.redirect("/admin/for-educators");
  } catch (e) {
    res.send("error", e);
  }
});

module.exports = router;
