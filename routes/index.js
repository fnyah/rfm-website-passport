const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const connection = require("../config/database");
const User = connection.models.User;
const Article = connection.models.Article;
const Standings = connection.models.Standings;
const isAuth = require("./authMiddleware").isAuth;
const Mongoose = require("mongoose");

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "admin",
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

router.get("/", (req, res, next) => {
  res.render("home");
  next();
});

router.get("/about", async (req, res, next) => {
  const standings = await Standings.find().sort({ information: "desc" });
  res.render("about", { standings: standings });
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

router.get("/admin", isAuth, async (req, res, next) => {
  const standings = await Standings.find().sort({ information: "desc" });
  res.render("admin-about/controlPanel", { standings: standings });
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
