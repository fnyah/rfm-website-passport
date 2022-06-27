const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const isAuth = require('./authMiddleware').isAuth;
// const articles = require("../models/article")

/**
 * -------------- POST ROUTES ----------------
 */

 router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'admin' }));

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

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/login">login</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
   
    // const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    // Enter Username:<br><input type="text" name="uname">\
    // <br>Enter Password:<br><input type="password" name="pw">\
    // <br><br><input type="submit" value="Submit"></form>';

    // res.send(form);
    res.render("loginpage")

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

const articles = [{
    title: "Bloop",
    desc: "emfwlekfemfklwm"
},
{
    title: "testing2",
    desc: "this is a scond test"
}
]


router.get('/admin', isAuth, (req, res, next) => {
    res.render('controlPanel', { articles: articles });
});

// Visiting this route logs the user out
router.get('/logout', isAuth, (req, res, next) => {
    req.logout();
    res.send("You have been logged out.")
});

// router.get('/login-success', (req, res, next) => {
//     res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
// });

router.get('/articles/new', isAuth, (req, res, next) => {
    res.render("new")
})

router.post("/articles", (req, res) => {
    
})

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;