const router = require("express").Router();
const connection = require("../../config/database");
const Standings = connection.models.Standings;
const isAuth = require("../authMiddleware").isAuth;
const Mongoose = require("mongoose");


router.get("/admin", isAuth, async (req, res, next) => {
  const standings = await Standings.find().sort({ information: "desc" });
  res.render("admin-about/controlPanel", { standings: standings });
});
  
router.get("/new", isAuth, (req, res, next) => {
    res.render("admin-about/new", { standings: new Standings() });
  });
  
  router.get("/:id", isAuth, async (req, res) => {
    let standings = await Standings.findById(req.params.id);
    res.render("admin-about/show", { standings: standings });
  });
  
  router.get("/edit/:id", isAuth, async (req, res) => {
    let standings = await Standings.findById(req.params.id);
    res.render("admin-about/edit", { standings: standings });
  });
  
  router.post("/", isAuth, async (req, res) => {
    let standings = new Standings({
      information: req.body.information,
      createdAt: new Date(),
    });
    try {
      await standings.save();
      res.redirect(`standings/${standings.id}`);
      // res.redirect(`/admin`);
    } catch (e) {
      res.render("admin-about/new", { standings: standings });
    }
  });
  
  router.delete("/:id", isAuth, async (req, res, next) => {
    
    const standingId = Mongoose.Types.ObjectId(req.params.id);
    try {
      await Standings.findByIdAndDelete(standingId);
      console.log("Deleted standing: " + standingId)
      res.redirect("/admin");
    } catch (e) {
      res.send("error", e);
    }
  });

  module.exports = router;