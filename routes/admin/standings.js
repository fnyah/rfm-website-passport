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

// --------------------------- General Standings Routes ---------------------------
// Combined view for standings and events
router.get('/', isAuth, asyncHandler(getStandingsAndEvents));

// New standing form
router.get("/new", isAuth, (req, res) => res.render("admin-about/new", { standings: new Standings() }));

// Standings CRUD operations
router.route("/:id")
  .get(isAuth, async (req, res) => { // Show specific standing
    const standings = await Standings.findById(req.params.id);
    res.render("admin-about/show", { standings });
  })
  .put(isAuth, asyncHandler(editStandings)) // Edit specific standing
  .delete(isAuth, asyncHandler(deleteStanding)); // Delete specific standing

// Edit standing form
router.get("/edit/:id", isAuth, async (req, res) => {
  const standings = await Standings.findById(req.params.id);
  res.render("admin-about/edit", { standings });
});

// Create a new standing
router.post("/", isAuth, asyncHandler(newStanding));

// --------------------------- Event-specific Routes ---------------------------
// New event form
router.get("/events/new-event", isAuth, (req, res) => res.render("admin-about/events/new"));

// Edit event form
router.get("/events/edit/:id", isAuth, async (req, res) => {
  const events = await Events.findById(req.params.id);
  res.render("admin-about/events/edit", { events });
});

// Event CRUD operations
router.post("/events/upload", isAuth, asyncHandler(newEvent)); // Create a new event

router.route("/events/:id")
  .delete(isAuth, asyncHandler(deleteEvent)) // Delete specific event
  .put(isAuth, asyncHandler(editEvent)); // Edit specific event

module.exports = router;
