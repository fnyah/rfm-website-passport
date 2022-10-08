const router = require("express").Router();
const connection = require("../../config/database");
const Projects = connection.models.Projects;
const isAuth = require("../authMiddleware").isAuth;
const Mongoose = require("mongoose");


router.get("/", isAuth, async (req, res, next) => {
  const projects = await Projects.find().sort({ information: "desc" });
  res.render("admin-projects/controlPanel", { projects: projects });
});
  
router.get("/new", isAuth, (req, res, next) => {
    res.render("admin-projects/new", { projects: new Projects() });
  });
  
  router.get("/:id", isAuth, async (req, res) => {
    let projects = await Projects.findById(req.params.id);
    res.render("admin-projects/show", { projects: projects });
  });
  
  router.get("/edit/:id", isAuth, async (req, res) => {
    let projects = await Projects.findById(req.params.id);
    res.render("admin-projects/edit", { projects: projects });
  });

  router.put("/:id", isAuth, async (req, res, next) => {
      console.log("pinged the put id route")
      req.project = await Projects.findById(req.params.id)
      next();
  }, saveStandingAndRedirect('edit'))
  
  router.post("/", isAuth, async (req, res) => {
    let projects = new Projects({
      information: req.body.information,
      createdAt: new Date(),
    });
    try {
      await projects.save();
      res.redirect(`projects/${projects.id}`);
      // res.redirect(`/admin`);
    } catch (e) {
      res.render("admin-projects/new", { projects: projects });
    }
  });
  
  router.delete("/:id", isAuth, async (req, res, next) => {
    const projectId = Mongoose.Types.ObjectId(req.params.id);
    try {
      await Projects.findByIdAndDelete(projectId);
      console.log("Deleted standing: " + projectId)
      res.redirect("/admin/projects");
    } catch (e) {
      res.send("error", e);
    }
  });

  function saveStandingAndRedirect(path) {
    return async (req, res) => {
      let project = req.project
      project.information = req.body.information
      console.log(project)
      try {
        project = await project.save()
        res.redirect(`/admin/standings/${project.id}`)
      } catch (e) {
        console.log("succ")
      }
    }
  }

  module.exports = router;