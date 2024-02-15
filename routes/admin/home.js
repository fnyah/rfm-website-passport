const router = require("express").Router();
const HomeInfo = require("../../models/Home");
const PhotoLinkInfo = require("../../models/Photos");
const isAuth = require("../authMiddleware").isAuth;
const mongoose = require("mongoose");
const fs = require("fs");

const { createTextPost, editTextPost, deleteTextPost, getPhotos, uploadPhoto, editPhotoPost } = require("../../controllers/admin-controllers/adminHomeController");
const asyncHandler = require("../../middleware/asyncHandler");

// Testing vvvvvvvvvvvvvvvvvvvvvvvvvvvv
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const e = require("express");
const { makeGridFsStorage } = require("../../utils/gridfsStorageutil");


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
const storage = makeGridFsStorage(process.env.MONGO_URI, "uploads");
const upload = multer({ storage });


router.get("/photos/new", isAuth, (req, res, next) => {
  res.render("admin-home/home-photo-link/newPhotoLink");
});

router.post("/upload", upload.single("file"), isAuth, asyncHandler(uploadPhoto)); 

router.get("/photos/edit/:id", isAuth, async (req, res) => {
  let photos = await PhotoLinkInfo.findById(req.params.id);
  res.render("admin-home/home-photo-link/photoLinkEdit", { photos: photos });
});


router.put("/photos/edit/:id", upload.single("file"), isAuth, asyncHandler(editPhotoPost));


// route to delet photo link
router.delete("/photos/:id", isAuth, async (req, res) => {
  let photos = await PhotoLinkInfo.findById(req.params.id);
  console.log(photos);
  try {
    await photos.remove();
    res.redirect("/admin/home");
  } catch (e) {
    res.json(e);
  }
});

// Home page posts CRUD routes~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/", isAuth, async (req, res) => {
  try {
    const posts = await HomeInfo.find({});
    const photolinks = await PhotoLinkInfo.find({});
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render("admin-home/controlPanel", {
          files: false,
          posts: posts,
          photolinks: photolinks,
        });
        console.log("files not found");
      } else {
        files.map((file) => {
          if (
            file.contentType === "image/jpeg" ||
            file.contentType === "image/png"
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render("admin-home/controlPanel", {
          posts: posts,
          photolinks: photolinks,
          files: files,
        });
      }
    });
  } catch (e) {
    res.json(e);
  }
});

// router.get("/files", asyncHandler(getPhotos));

router.get("/files", asyncHandler( async (req, res) => {
  let homeInfo = await HomeInfo.find({});
  res.render("admin-home/controlPanel", { homeInfo });
}))

// route that displays the image by filename
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gridfsBucket.openDownloadStream(file._id);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
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


router.put("/:id", isAuth, asyncHandler(editTextPost));
router.post("/", isAuth, asyncHandler(createTextPost));
router.delete("/:id", isAuth, asyncHandler(deleteTextPost));

module.exports = router;
