const router = require("express").Router();
const HomeInfo = require("../../models/Home");
const PhotoLinkInfo = require("../../models/Photos");
const isAuth = require("../authMiddleware").isAuth;
const mongoose = require("mongoose");
const fs = require("fs");

// Testing vvvvvvvvvvvvvvvvvvvvvvvvvvvv
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const e = require("express");

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

router.get("/photos/new", isAuth, (req, res, next) => {
  res.render("admin-home/home-photo-link/newPhotoLink");
});

// @route POST /upload
// @desc  Uploads file to DB
router.post("/upload", upload.single("file"), isAuth, async (req, res) => {
  if (req.body.link) {
    let trimmedlink = req.body.link.replace(/(^\w+:|^)\/\//, "");
    let fixedLink = "https://" + trimmedlink;
    let photoLink = new PhotoLinkInfo({
      link: fixedLink,
      description: req.body.description,
      filename: req.file.filename,
    });
    try {
      await photoLink.save();
      console.log("Saved photo link: " + photoLink);
      res.redirect(`/admin/home`);
    } catch (e) {
      res.json(e);
      //   res.render("admin-about/new", { standings: standings });
    }
  } else {
    let photoLink = new PhotoLinkInfo({
      description: req.body.description,
      filename: req.file.filename,
    });

    try {
      await photoLink.save();
      console.log("Saved photo link: " + photoLink);
      res.redirect(`/admin/home`);
    } catch (e) {
      res.json(e);
      //   res.render("admin-about/new", { standings: standings });
    }
  }
});

router.get("/photos/edit/:id", isAuth, async (req, res) => {
  let photos = await PhotoLinkInfo.findById(req.params.id);
  res.render("admin-home/home-photo-link/photoLinkEdit", { photos: photos });
});

router.put(
  "/photos/edit/:id",
  upload.single("file"),
  isAuth,
  async (req, res, next) => {
    let trimmedlink = req.body.link.replace(/(^\w+:|^)\/\//, "");
    let fixedLink = "https://" + trimmedlink;
    if (req.file) {
      const editedPhotoLink = await PhotoLinkInfo.findByIdAndUpdate(
        req.params.id,
        {
          link: fixedLink,
          description: req.body.description,
          filename: req.file.filename,
        }
      );
      try {
        await editedPhotoLink.save();
        res.redirect(`/admin/home`);
      } catch (e) {
        res.json(e);
        //   res.render("admin-about/new", { standings: standings });
      }
    } else {
      const editedPhotoLink = await PhotoLinkInfo.findByIdAndUpdate(
        req.params.id,
        {
          link: fixedLink,
          description: req.body.description,
        }
      );
      try {
        await editedPhotoLink.save();
        res.redirect(`/admin/home`);
      } catch (e) {
        res.json(e);
        //   res.render("admin-about/new", { standings: standings });
      }
    }
  }
);

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

router.get("/files", async (req, res) => {
  const files = await PhotoLinkInfo.find({});
  res.json(files);
});

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
