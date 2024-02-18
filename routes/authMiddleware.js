// need to move this to a middleware folder and update the require statements in the files that use it

module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send("Please login.")
    }
}

