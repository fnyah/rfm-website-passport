require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

// Utils
const { genPassword } = require("../utils/passwordUtils");
const { initializeGridFS } = require('../utils/gridfsUtility');

// Models
const User = require("../models/User");
const Standings = require("../models/Standings");
const HomeInfo = require("../models/Home");
const PhotoLinkInfo = require("../models/Photos");
const Events = require("../models/Events");
const Blog = require("../models/Blog");
const Projects = require("../models/Projects");

const { getBlogData, displayBlogImage } = require('../controllers/blogController');
const { getProjectsData, displayProjectImage } = require('../controllers/projectsController');
const { registerUser, logoutUser, registerUserPage } = require('../controllers/indexController');
const { getAboutData } = require('../controllers/aboutController');
const { getHomeData, displayHomeImage } = require('../controllers/fileController');


// Middleware
const isAuth = require("./authMiddleware").isAuth;
const asyncHandler = require("../middleware/asyncHandler");

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize GridFS buckets
const bucketNames = ['uploads', 'projectphotos', 'blogphotos'];
bucketNames.forEach(bucketName => initializeGridFS(process.env.MONGO_URI, bucketName));

// Auth routes
router.post("/login", passport.authenticate("local", { failureRedirect: "/login-failure", successRedirect: "/admin/home" }));
router.get("/logout", isAuth, asyncHandler(logoutUser));
router.get("/login-failure", (req, res) => res.send("Invalid username or password."));
router.get('/register', isAuth, asyncHandler(registerUserPage));
router.post("/register", isAuth, asyncHandler(registerUser));

// Public routes
router.get(["/", "/home"], asyncHandler(getHomeData));
router.get("/about", asyncHandler(getAboutData));
router.get("/projects", asyncHandler(getProjectsData));
router.get("/blog", asyncHandler(getBlogData));
router.get("/login", (req, res) => res.render("admin-panel/loginpage"));

// Image display routes
router.get("/image/:filename", displayHomeImage);
router.get("/projectimages/:filename", displayProjectImage);
router.get("/blogimages/:filename", displayBlogImage);

module.exports = router;
