const router = require("express").Router();
const connection = require("../../config/database");
const Projects = connection.models.Projects;
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

router.post("/", upload.any("file"), isAuth, async (req, res) => {
  // filesnames to array
  const filenames = req.files.map((file) => file.filename);
  const projects = new Projects({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    filename: filenames,
  });
  try {
    await projects.save();
    console.log("Saved Project: " + projects);
    res.redirect("/admin/projects");
  } catch (err) {
    console.log(err);
    res.render("admin-projects/new", { projects: projects });
  }
});

router.get("/", isAuth, async (req, res, next) => {
  // const projects = await Projects.find().sort({ information: "desc" });
  // res.render("admin-projects/controlPanel", { projects: projects });
  try {
    const projects = await Projects.find().sort({ createdAt: "desc" });
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render("admin-projects/controlPanel", {
          files: false,
          projects: projects,
        });
      } else {
        files.map((file) => {
          if (
            file.contentType === "image/jpeg" ||
            file.contentType === "image/png"
          ) {
            file.isImage = true;
          }
        });
        res.render("admin-projects/controlPanel", {
          files: files,
          projects: projects,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
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

// edit project photos
router.post("/:id", isAuth, async (req, res, next) => {
  let photos = req.body;
  const project = await Projects.findById(req.params.id);
  const files = project.filename;
  // find the difference between the two arrays
  const difference = files.filter((x) => !photos.includes(x));
  console.log(difference);

  const editedProject = await Projects.findByIdAndUpdate(req.params.id, {
    filename: difference,
  });
  try {
    await editedProject.save();
    console.log("Saved Project: " + editedProject);
    res.sendStatus(200);
  } catch (e) {
    res.json(e);
  }
});

function saveProjectAndRedirect(path) {
  return async (req, res) => {
    console.log(req.body);
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
