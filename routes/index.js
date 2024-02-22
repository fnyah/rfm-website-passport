require("dotenv").config();
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const router = express.Router();
const { initializeGridFS } = require("../utils/gridfsUtility");

// Middleware and Controllers
const isAuth = require("./authMiddleware").isAuth;
const asyncHandler = require("../middleware/asyncHandler");
const { getBlogData, displayBlogImage } = require("../controllers/blogController");
const { getProjectsData, displayProjectImage } = require("../controllers/projectsController");
const { getHomeData, displayHomeImage } = require("../controllers/fileController");
const { getAboutData } = require("../controllers/aboutController");
const { registerUser, logoutUser, registerUserPage } = require("../controllers/indexController");

// MongoDB connection and GridFS initialization
async function setupMongoDBAndGridFS() {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/yourDatabase";
    try {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB");

      const bucketNames = ['uploads', 'projectphotos', 'blogphotos'];

      for (const bucketName of bucketNames) {
        await initializeGridFS(mongoUri, bucketName);
        console.log(`Initialized GridFS bucket: ${bucketName}`);
      }
      
      console.log("All GridFS buckets initialized successfully.");
    } catch (error) {
      console.error("Failed to connect to MongoDB or initialize GridFS buckets:", error);
    }
  }

// Call the setup function
setupMongoDBAndGridFS().catch(console.error);

// Authentication Routes
router.post("/login", passport.authenticate("local", { failureRedirect: "/login-failure", successRedirect: "/admin/home" }));
router.get("/logout", isAuth, asyncHandler(logoutUser));
router.get("/login-failure", (_, res) => res.send("Invalid username or password."));
router.route('/register')
    .get(isAuth, asyncHandler(registerUserPage))
    .post(isAuth, asyncHandler(registerUser));

// Public Routes
router.get(["/", "/home"], asyncHandler(getHomeData));
router.get("/about", asyncHandler(getAboutData));
router.get("/projects", asyncHandler(getProjectsData));
router.get("/blog", asyncHandler(getBlogData));
router.get("/login", (_, res) => res.render("admin-panel/loginpage"));

// Image Display Routes
router.get("/image/:filename", displayHomeImage);
router.get("/projectimages/:filename", displayProjectImage);
router.get("/blogimages/:filename", displayBlogImage);

module.exports = router;
