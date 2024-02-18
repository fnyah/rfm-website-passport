const router = require("express").Router();
const Standings = require("../../models/Standings");
const Events = require("../../models/Events");
const isAuth = require("../authMiddleware").isAuth;
const asyncHandler = require("../../middleware/asyncHandler");
const { 
    getStandingsAndEvents, 
    editStandings, 
    deleteStanding, 
    newStanding, 
    newEvent 
} = require("../../controllers/admin-controllers/adminStandingsController");

// Combined view routes
router.get('/', isAuth, asyncHandler(getStandingsAndEvents));
router.get("/new", isAuth, (req, res) => res.render("admin-about/new", { standings: new Standings() }));
router.get("/new-event", isAuth, (req, res) => res.render("admin-about/events/new"));

// Dynamic resource routes
router.route("/:id")
  .get(isAuth, async (req, res) => {
    const standings = await Standings.findById(req.params.id);
    res.render("admin-about/show", { standings });
  })
  .put(isAuth, asyncHandler(editStandings))
  .delete(isAuth, asyncHandler(deleteStanding));

router.get("/edit/:id", isAuth, async (req, res) => {
  const standings = await Standings.findById(req.params.id);
  res.render("admin-about/edit", { standings });
});

// Action routes
router.post("/", isAuth, asyncHandler(newStanding));
router.post("/events/upload", isAuth, asyncHandler(newEvent));

module.exports = router;
