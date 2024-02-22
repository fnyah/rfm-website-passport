const asyncHandler = require('../middleware/asyncHandler');
const genPassword = require('../utils/passwordUtils').genPassword;

exports.registerUser = asyncHandler(async (req, res) => {
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

exports.logoutUser = asyncHandler(async (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login')
    });
});

exports.registerUserPage = asyncHandler(async (req, res) => {
    const form = '<h1>Register Page</h1><form method="post" action="register">\
    Enter Username:<br><input type="text" name="uname">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
}); 
