const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo"); // Updated import for newer versions
// const helmet = require("helmet");


// Configuration and routes
require("dotenv").config();
require("./config/passport"); // Passport configuration
const indexRouter = require("./routes/index");
const standingsRouter = require("./routes/admin/standings");
const homeRouter = require("./routes/admin/home");
const projectsRouter = require("./routes/admin/projects");
const educatorsRouter = require("./routes/admin/for-educators");

// Express application setup
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use(express.static(path.join(__dirname, "client")));
app.use(methodOverride("_method"));

// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );

const mongoUri = process.env.MONGO_URI

// Session setup with connect-mongo
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: mongoUri, collectionName: "sessions" }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Simplified maxAge calculation
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Route middleware
app.use("/", indexRouter);
app.use("/admin/standings", standingsRouter);
app.use("/admin/home", homeRouter);
app.use("/admin/projects", projectsRouter);
app.use("/admin/for-educators", educatorsRouter);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
