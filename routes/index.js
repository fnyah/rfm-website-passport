require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../utils/passwordUtils").genPassword; // Only used for creating new user from /register route
const User = require("../models/User");
const Standings = require("../models/Standings");
const isAuth = require("./authMiddleware").isAuth;
const HomeInfo = require("../models/Home");
const PhotoLinkInfo = require("../models/Photos");
const Events = require("../models/Events");
const Blog = require("../models/Blog");
const Projects = require("../models/Projects"); 

const mongoURI = process.env.MONGO_URI;


const mongoose = require("mongoose");

const { displayHomeImage } = require('../controllers/fileController');
const { displayProjectImage } = require('../controllers/projectsController'); 
const { initializeGridFS } = require('../utils/gridfsUtility');
const { displayBlogImage } = require("../controllers/blogController");

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/admin/home",
  })
);

const bucketNames = ['uploads', 'projectphotos', 'blogphotos']; // Example bucket names
bucketNames.forEach(bucketName => initializeGridFS(mongoURI, bucketName));

router.get("/files", async (req, res) => {
  const files = await PhotoLinkInfo.find({});
  res.json(files);
});


router.get("/image/:filename", displayHomeImage);

router.get("/projectimages", async (req, res) => {
  const projects = await Projects.find();
  res.json(projects);
});


router.get("/projectimages/:filename", displayProjectImage);

router.get("/blogimages", async (req, res) => {
  const blog = await Blog.find({});
  res.json(blog);
});
 

router.get("/blogimages/:filename", displayBlogImage)
        

// End of routes to display images from database ~~~~~~~~~~~~~~~~~~~~

//  router.post('/register', (req, res, next) => {
//     const saltHash = genPassword(req.body.pw);

//     const salt = saltHash.salt;
//     const hash = saltHash.hash;

//     const newUser = new User({
//         username: req.body.uname,
//         hash: hash,
//         salt: salt,
//         admin: true
//     });

//     newUser.save()
//         .then((user) => {
//             console.log(user);
//         });

//     res.redirect('/login');
//  });

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

router.get("/blog", async (req, res, next) => {
  const blog = await Blog.find().sort({ createdAt: -1 });
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
