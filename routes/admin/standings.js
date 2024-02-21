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
    newEvent,
    editEvent,
    deleteEvent
} = require("../../controllers/admin-controllers/adminStandingsController");

// Combined view routes
router.get('/', isAuth, asyncHandler(getStandingsAndEvents));
router.get("/new", isAuth, (req, res) => res.render("admin-about/new", { standings: new Standings() }));
router.get("/events/new-event", isAuth, (req, res) => res.render("admin-about/events/new"));

// working on gettig events to edit
router.get("/events/edit/:id", isAuth, async (req, res) => {
  const events = await Events.findById(req.params.id);
  res.render("admin-about/events/edit", { events });
});


router.delete("/events/:id", isAuth, asyncHandler(deleteEvent));


router.get("/:id", isAuth, async (req, res) => {
  const standings = await Standings.findById(req.params.id);
  res.render("admin-about/show", { standings });
});
router.put("/:id", isAuth, asyncHandler(editStandings))
router.delete("/:id", isAuth, asyncHandler(deleteStanding)); 

router.get("/edit/:id", isAuth, async (req, res) => {
  const standings = await Standings.findById(req.params.id);
  res.render("admin-about/edit", { standings });
});



// Action routes
router.post("/", isAuth, asyncHandler(newStanding));

router.post("/events/upload", isAuth, asyncHandler(newEvent));
// route to edit event
router.put("/events/:id", isAuth, asyncHandler(async (req, res) => {
  let events = await Events.findById(req.params.id);
  events = Object.assign(events, req.body);
  console.log(events);
  await events.save();
  res.redirect(`/admin/standings`);
}));

module.exports = router;
