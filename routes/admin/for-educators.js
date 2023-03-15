const router = require("express").Router();
const connection = require("../../config/database");
const Blog = connection.models.Blog;
const isAuth = require("../authMiddleware").isAuth;
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");

router.use(methodOverride("_method"));
router.use(bodyParser.json());

// Mongo URI
const mongoURI = process.env.MONGO_URI;
// use new mongo url parser
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Photo upload
let gfs;
let gridfsBucket;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "blogphotos",
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("blogphotos");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "blogphotos",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.get("/", isAuth, async (req, res) => {
  let blog = await Blog.find().sort({ createdAt: -1 });
  res.render("admin-for-educators/controlPanel", { blog: blog });
});

router.post("/", isAuth, upload.any("file"), async (req, res) => {
  const filenames = req.files.map((file) => file.filename);

  // separate links into an array
  const links = req.body.link.split(",");

  const blogPost = new Blog({
    title: req.body.title,
    description: req.body.description,
    filename: filenames,
    links: links,
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

  if (req.files == "") {
    try {
      const editedProject = await Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: description,
        links: links,
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
        link: links,
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


