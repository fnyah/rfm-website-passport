const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword; // Only used for creating new user from /register route
const connection = require("../config/database");
const User = connection.models.User;
const Standings = connection.models.Standings;
const isAuth = require("./authMiddleware").isAuth;
const HomeInfo = connection.models.Home;
const Projects = connection.models.Projects;

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
  res.render("home", { posts: posts });
  next();
});

router.get("/about", async (req, res, next) => {
  const standings = await Standings.find().sort({ information: "desc" });
  res.render("about", { standings: standings });
  next();
});

router.get("/projects", async (req, res, next) => {
  const projects = await Projects.find().sort({ information: "desc" });
  res.render("projects", { projects: projects });
  next();
});

router.get("/login", (req, res, next) => {
  res.render("admin-panel/loginpage");
});

// When you visit http://localhost:3000/register, you will see "Register Page"
// router.get('/register', (req, res, next) => {

//     const form = '<h1>Register Page</h1><form method="post" action="register">\
//                     Enter Username:<br><input type="text" name="uname">\
//                     <br>Enter Password:<br><input type="password" name="pw">\
//                     <br><br><input type="submit" value="Submit"></form>';

//     res.send(form);

// });

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

// const posts = [
//   {
//     title: "Testing 1",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   },
//   {
//     title: "Testing 2",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   },
//   {
//     title: "Testing 3",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   },

// ];

router.get("/admin/home", isAuth, async (req, res, next) => {
  const posts = await HomeInfo.find().sort({ information: "desc" });
  res.render("admin-home/controlPanel", { posts: posts });
});

router.get("/admin", isAuth, async (req, res, next) => {
  res.redirect("/admin/home");
});

router.get("/login-failure", (req, res, next) => {
  res.send("Invalid user name or password.");
});

module.exports = router;
