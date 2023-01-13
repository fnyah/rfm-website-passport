const router = require("express").Router();
const connection = require("../../config/database");
const Projects = connection.models.Projects;
const isAuth = require("../authMiddleware").isAuth;
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const path = require("path");
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
        // console.log(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.get("/", isAuth, async (req, res, next) => {
  const projects = await Projects.find().sort({ information: "desc" });
  res.render("admin-projects/controlPanel", { projects: projects });
});

router.get("/new", isAuth, (req, res, next) => {
  res.render("admin-projects/new", { projects: new Projects() });
});

router.get("/:id", isAuth, async (req, res) => {
  let projects = await Projects.findById(req.params.id);
  res.render("admin-projects/show", { projects: projects });
});

router.get("/edit/:id", isAuth, async (req, res) => {
  let projects = await Projects.findById(req.params.id);
  res.render("admin-projects/edit", { projects: projects });
});

router.put(
  "/:id",
  isAuth,
  async (req, res, next) => {
    req.project = await Projects.findById(req.params.id);
    next();
  },
  saveProjectAndRedirect("edit")
);

router.post("/", isAuth, async (req, res) => {
  if (req.body.file.length > 1) {
    upload.array("file", req.body.file.length)(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(req.body.file)
      }
      let projects = new Projects({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        filename: req.body.file,
        createdAt: new Date(),
      });
      try {
        projects.save();
        res.redirect(`projects/${projects.id}`);
        // res.redirect(`/admin`);
      }
      catch (e) {
        console.log(e);
        res.render("admin-projects/new", { projects: projects });
      }
      console.log(projects);
    });
  } else if (req.body.file) {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(req.body.file);
      }
    });
    let projects = new Projects({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      filename: req.body.file,
      createdAt: new Date(),
    });
    try {
      await projects.save();
      res.redirect(`projects/${projects.id}`);
      // res.redirect(`/admin`);
    } catch (e) {
      console.log(e);
      res.render("admin-projects/new", { projects: projects });
    }
    console.log(projects);
  } else {
    let projects = new Projects({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      createdAt: new Date(),
    });
    console.log(projects);
    try {
      await projects.save();
      res.redirect(`projects/${projects.id}`);
      // res.redirect(`/admin`);
    } catch (e) {
      console.log(e);
      res.render("admin-projects/new", { projects: projects });
    }
  }
});

router.delete("/:id", isAuth, async (req, res, next) => {
  const projectId = mongoose.Types.ObjectId(req.params.id);
  try {
    await Projects.findByIdAndDelete(projectId);
    console.log("Deleted project: " + projectId);
    res.redirect("/admin/projects");
  } catch (e) {
    res.send("error", e);
  }
});

function saveProjectAndRedirect(path) {
  return async (req, res) => {
    let project = req.project;
    project.title = req.body.title;
    project.author = req.body.author;
    project.description = req.body.description;
    try {
      project = await project.save();
      res.redirect(`/admin/projects/${project.id}`);
    } catch (e) {
      console.log(e);
    }
  };
}

module.exports = router;
