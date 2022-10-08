const router = require("express").Router();
const connection = require("../../config/database");
const HomeInfo = connection.models.Home;
const isAuth = require("../authMiddleware").isAuth;
const Mongoose = require("mongoose");


router.get("/", isAuth, async (req, res, next) => {
  const posts = await HomeInfo.find().sort({ information: "desc" });
  res.render("admin-home/controlPanel", { posts: posts });
});
  
router.get("/new", isAuth, (req, res, next) => {
    res.render("admin-home/new", { posts: new HomeInfo() });
  });
  
  router.get("/:id", isAuth, async (req, res) => {
    let posts = await HomeInfo.findById(req.params.id);
    res.render("admin-home/show", { posts: posts });
  });
  
  router.get("/edit/:id/", isAuth, async (req, res) => {
    let posts = await HomeInfo.findById(req.params.id);
    res.render("admin-home/edit", { posts: posts });
  });

  router.put("/:id", isAuth, async (req, res, next) => {
    console.log("pinged the put id route")
    req.post = await HomeInfo.findById(req.params.id)
    next();
}, savePostAndRedirect('edit'))
  

  router.post("/", isAuth, async (req, res) => {
    let posts = new HomeInfo({
        title: req.body.title,
        description: req.body.description,
    });
    try {
      await posts.save();
      res.redirect(`/admin/home/${posts.id}`);
      // res.redirect(`/admin`);
    } catch (e) {
    //   res.render("admin-about/new", { standings: standings });
    }
  });
  
  router.delete("/:id", isAuth, async (req, res, next) => {
    const postId = Mongoose.Types.ObjectId(req.params.id);
    try {
      await HomeInfo.findByIdAndDelete(postId);
      console.log("Deleted post: " + postId)
      res.redirect("/admin/home");
    } catch (e) {
      res.send("error", e);
    }
  });

  function savePostAndRedirect(path) {
    return async (req, res) => {
      let post = req.post
      post.title = req.body.title
      post.description = req.body.description
      try {
        post = await post.save()
        res.redirect(`/admin/home/${post.id}`)
      } catch (e) {
        console.log("success")
      }
    }
  }

  module.exports = router;