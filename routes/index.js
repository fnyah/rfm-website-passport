const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const connection = require("../config/database");
const User = connection.models.User;
const Article = connection.models.Article;
const Standings = connection.models.Standings;
const isAuth = require("./authMiddleware").isAuth;

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

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get("/login", (req, res, next) => {
  // const form = '<h1>Login Page</h1><form method="POST" action="/login">\
  // Enter Username:<br><input type="text" name="uname">\
  // <br>Enter Password:<br><input type="password" name="pw">\
  // <br><br><input type="submit" value="Submit"></form>';

  // res.send(form);
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

// const articles = [{
//     title: "Bloop",
//     desc: "emfwlekfemfklwm"
// },
// {
//     title: "testing2",
//     desc: "this is a scond test"
// }
// ]

router.get("/admin", isAuth, async (req, res, next) => {
  const standings = await Standings.find().sort({ information: "desc" });
  res.render("admin-about/controlPanel", { standings: standings });
});

// router.get("/admin", isAuth, async (req, res, next) => {
//   const article = await Article.find().sort({ title: "desc" });
//   res.render("admin-about/controlPanel", { article: article });
// });

// router.get("/admin/standings", isAuth, async (req, res, next) => {
//     const article = await Standings.find().sort({ title: "desc" });
//     res.render("admin-about/controlPanel", { article: article });
//   });

// Visiting this route logs the user out
router.get("/logout", isAuth, (req, res, next) => {
  req.logout();
  res.send("You have been logged out.");
});

// router.get('/login-success', (req, res, next) => {
//     res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
// });

router.get("/articles/new", isAuth, (req, res, next) => {
  res.render("admin-panel/new", { article: new Article() });
});

// router.post("/articles", isAuth, async (req, res) => {
//   const article = new Article({
//     title: req.body.title,
//     description: req.body.description,
//   });
//   console.log(article);
//   try {
//     await article.save();
//     res.redirect(`/articles/${article.id}`);
//   } catch (e) {
//     console.log("nOoooo ur article didnt save");
//   }
// });

router.get("/standings/new", isAuth, (req, res, next) => {
  res.render("admin-about/new", { standings: new Standings() });
});

router.get("/standings/:id", isAuth, async (req, res) => {
  const standing = await Standings.findById(req.params.id);
  res.send(standing.id);
});

router.get("standings/edit/:id", async (req, res) => {
  const standings = await Article.findById(req.params.id);
  res.render("admin-about/edit", { standings: standings });
});

router.post("/standings", isAuth, async (req, res) => {
  const standings = new Standings({
    information: req.body.information,
    createdAt: new Date(),
  });
  try {
    await standings.save();
    res.redirect(`standings/${standings.id}`);
    // res.redirect(`/admin`);
  } catch (e) {
    res.render("standings/new", { standings: standings });
    console.log("nOoooo ur article didnt save");
  }
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
