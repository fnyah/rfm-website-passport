const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword; // Only used for creating new user from /register route
const connection = require("../config/database");
const User = connection.models.User;
const Standings = connection.models.Standings;
const isAuth = require("./authMiddleware").isAuth;
const HomeInfo = connection.models.Home;
const Projects = connection.models.Projects;
const PhotoLinkInfo = connection.models.PhotoLink;
const Events = connection.models.Events;
const Blog = connection.models.Blog;

const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
const Grid = require("gridfs-stream");

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/admin/home",
  })
);

// Routes to display images from database ~~~~~~~~~~~~~~~~~~~~
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

// gfs2 is for project images
let gfs2;
let gridfsBucket2;
conn.once("open", () => {
  gridfsBucket2 = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "projectphotos",
  });

  gfs2 = Grid(conn.db, mongoose.mongo);
  gfs2.collection("projectphotos");
});

// gfs3 is for blog images
let gfs3;
let gridfsBucket3;
conn.once("open", () => {
  gridfsBucket3 = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "blogphotos",
  });

  gfs3 = Grid(conn.db, mongoose.mongo);
  gfs3.collection("blogphotos");
});


router.get("/files", async (req, res) => {
  const files = await PhotoLinkInfo.find({});
  res.json(files);
});

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

router.get("/projectimages", async (req, res) => {
  const projects = await Projects.find({});
  res.json(projects);
});


// route to display the project images
router.get("/projectimages/:filename", async (req, res) => {
  const projects = await Projects.find({});
  const fileToFind = req.params.filename;
  projects.map((project) => {
    project.filename.map((filename) => {
      if (filename === fileToFind) {
        gfs2.files.findOne({ filename }).then((file) => {
          // Check if file
          if (!file || file.length === 0) {
            return res.status(404).json({
              err: "No file exists",
            });
          }
          // Check if image
          if (
            file.contentType === "image/jpeg" ||
            file.contentType === "image/png"
          ) {
            // Read output to browser
            const readstream = gridfsBucket2.openDownloadStream(file._id);
            readstream.pipe(res);
          } else {
            res.status(404).json({
              err: "Not an image",
            });
          }
        });
      }
    });
  });
});

router.get("/blogimages", async (req, res) => {
  const blog = await Blog.find({});
  res.json(blog);
});
 
// route to display the blog images
router.get("/blogimages/:filename", async (req, res) => {
  const blogPosts = await Blog.find({});
  const fileToFind = req.params.filename;
  blogPosts.map((blog) => {
    blog.filename.map((filename) => {
      if (filename === fileToFind) {
        gfs3.files.findOne({ filename }).then((file) => {
          // Check if file
          if (!file || file.length === 0) {
            return res.status(404).json({
              err: "No file exists",
            });
          }
          // Check if image
          if (
            file.contentType === "image/jpeg" ||
            file.contentType === "image/png"
          ) {
            // Read output to browser
            const readstream = gridfsBucket3.openDownloadStream(file._id);
            readstream.pipe(res);
          } else {
            res.status(404).json({
              err: "Not an image",
            });
          }
        });
      }
    });
  });
});
        
// gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//   // Check if file
//   if (!file || file.length === 0) {
//     return res.status(404).json({
//       err: "No file exists",
//     });
//   }

//   // Check if image
//   if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
//     // Read output to browser
//     const readstream = gridfsBucket.openDownloadStream(file._id);
//     readstream.pipe(res);
//   } else {
//     res.status(404).json({
//       err: "Not an image",
//     });
//   }
// });

// End of routes to display images from database ~~~~~~~~~~~~~~~~~~~~

 router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.pw);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.uname,
        hash: hash,
        salt: salt,
        admin: true
    });

    newUser.save()
        .then((user) => {
            console.log(user);
        });

    res.redirect('/login');
 });

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/", async (req, res, next) => {
  const posts = await HomeInfo.find().sort({ information: "desc" });
  const photolinks = await PhotoLinkInfo.find().sort({ information: "desc" });
  res.render("home", { posts: posts, photolinks: photolinks });
  next();
});

router.get("/about", async (req, res, next) => {
  const standings = await Standings.find().sort({ createdAt: -1 });
  const events = await Events.find().sort({ createdAt: -1 });
  res.render("about", { standings: standings, events: events });
  next();
});

router.get("/projects", async (req, res, next) => {
  const projects = await Projects.find().sort({ createdAt: -1 });
  res.render("projects", { projects: projects });
  next();
});

router.get("/for-educators", async (req, res, next) => {
  const blog = await Blog.find().sort({ createdAt: -1 });
  console.log(blog)
  res.render("for-educators", { blog: blog });
  next();
});

router.get("/login", (req, res, next) => {
  res.render("admin-panel/loginpage");
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="uname">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */

// Visiting this route logs the user out
router.get("/logout", isAuth, (req, res, next) => {
  req.logout();
  res.send("You have been logged out.");
});

// router.get("/admin/home", isAuth, async (req, res, next) => {
//   const posts = await HomeInfo.find().sort({ information: "desc" });
//   res.render("admin-home/controlPanel", { posts: posts });
// });

// router.get("/admin", isAuth, async (req, res, next) => {
//   res.redirect("/admin/home");
// });

router.get("/login-failure", (req, res, next) => {
  res.send("Invalid user name or password.");
});

module.exports = router;
