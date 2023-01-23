const router = require("express").Router();
const connection = require("../../config/database");
const HomeInfo = connection.models.Home;
const PhotoLinkInfo = connection.models.PhotoLink;
const isAuth = require("../authMiddleware").isAuth;
const mongoose = require("mongoose");
const fs = require("fs");

router.get("/", (req, res) => {
  res.render("admin-for-educators/controlPanel", { title: "For Educators" });
});

module.exports = router;