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
    bucketName: "projectphotos",
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("projectphotos");
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
          bucketName: "projectphotos",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.get("/", isAuth, async (req, res) => {
  let blog = await Blog.find().sort({ createdAt: -1 });
  console.log(blog)
  res.render("admin-for-educators/controlPanel", { blog: blog });
});

router.post("/", isAuth, upload.any("file"), async (req, res) => {
  const blogPost = new Blog({
    title: req.body.title,
    description: req.body.description,
    links: req.body.links,
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

router.get("/edit", isAuth, (req, res) => {
  res.render("admin-for-educators/edit", { title: "newpost" });
});

module.exports = router;
