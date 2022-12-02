const router = require("express").Router();
const connection = require("../../config/database");
const HomeInfo = connection.models.Home;
const PhotoLinkInfo = connection.models.PhotoLink;
const isAuth = require("../authMiddleware").isAuth;
const mongoose = require("mongoose");

// Testing vvvvvvvvvvvvvvvvvvvvvvvvvvvv
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

// Home page photo upload CRUD routes~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let gfs;
let gridfsBucket;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
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
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.get("/photolink/new", isAuth, (req, res, next) => {
  res.render("admin-home/home-photo-link/newPhotoLink");
});

// @route POST /upload
// @desc  Uploads file to DB
router.post("/upload", upload.single("file"), isAuth, async (req, res) => {
  let photoLink = new PhotoLinkInfo({
    link: req.body.link,
    description: req.body.description,
  });
  try {
    await photoLink.save();
    console.log("Saved photo link: " + photoLink);
    res.redirect(`/admin`);
  } catch (e) {
    res.json(e);
    //   res.render("admin-about/new", { standings: standings });
  }
});

// Home page posts CRUD routes~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/", isAuth, async (req, res) => {
  try {
    const posts = await HomeInfo.find({});
    const photolinks = await PhotoLinkInfo.find({});
    res.render("admin-home/controlPanel", { posts: posts, photolinks: photolinks });
  } catch (e) {
    res.json(e);
  }
});

router.get("/new", isAuth, (req, res, next) => {
  res.render("admin-home/new", { posts: new HomeInfo() });
});

router.get("/:id", isAuth, async (req, res) => {
  let posts = await HomeInfo.findById(req.params.id);
  res.render("admin-home/show", { posts: posts });
});

router.get("/edit/:id/", isAuth, async (req, res) => {
  let posts = await HomeInfo.findById(req.params.id);
  res.render("admin-home/edit", { posts: posts });
});

router.put(
  "/:id",
  isAuth,
  async (req, res, next) => {
    req.post = await HomeInfo.findById(req.params.id);
    next();
  },
  savePostAndRedirect("edit")
);

router.post("/", isAuth, async (req, res) => {
  let posts = new HomeInfo({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    await posts.save();
    res.redirect(`/admin/home/${posts.id}`);
    // res.redirect(`/admin`);
  } catch (e) {
    res.json(e);
    //   res.render("admin-about/new", { standings: standings });
  }
});

router.delete("/:id", isAuth, async (req, res, next) => {
  const postId = mongoose.Types.ObjectId(req.params.id);
  try {
    await HomeInfo.findByIdAndDelete(postId);
    console.log("Deleted post: " + postId);
    res.redirect("/admin/home");
  } catch (e) {
    res.send("error", e);
  }
});

function savePostAndRedirect(path) {
  return async (req, res) => {
    let post = req.post;
    post.title = req.body.title;
    post.description = req.body.description;
    try {
      post = await post.save();
      res.redirect(`/admin/home/${post.id}`);
    } catch (e) {
      console.log(e);
    }
  };
}

module.exports = router;
