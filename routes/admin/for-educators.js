const router = require("express").Router();
const connection = require("../../config/database");
const HomeInfo = connection.models.Home;
const PhotoLinkInfo = connection.models.PhotoLink;
const isAuth = require("../authMiddleware").isAuth;
const mongoose = require("mongoose");
const fs = require("fs");

router.get("/", isAuth, (req, res)  => {
  res.render("admin-for-educators/controlPanel", { title: "controlpanel" });
});

router.get("/new", isAuth, (req, res)  => {
  res.render("admin-for-educators/new", { title: "newpost" });
});

router.get("/edit", isAuth, (req, res)  => {
  res.render("admin-for-educators/edit", { title: "newpost" });
});


module.exports = router;


