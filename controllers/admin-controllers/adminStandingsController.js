const Standings = require("../../models/Standings");
const Events = require("../../models/Events");
const asyncHandler = require("../../middleware/asyncHandler");

// Consolidated error handling for saving documents and redirecting or rendering
const saveDocument = async (doc, redirectPath, renderPath, res, renderOptions = {}) => {
  try {
    await doc.save();
    return res.redirect(redirectPath);
  } catch (e) {
    if (renderPath) {
      return res.render(renderPath, { ...renderOptions, error: e });
    } else {
      return res.status(400).json({ error: e.toString() });
    }
  }
};

exports.getStandingsAndEvents = asyncHandler(async (req, res) => {
  const [standings, events] = await Promise.all([
    Standings.find().sort({ createdAt: -1 }),
    Events.find().sort({ eventDate: -1 })
  ]);
  res.render("admin-about/controlPanel", { standings, events });
});

exports.editStandings = asyncHandler(async (req, res) => {
  const standing = await Standings.findById(req.params.id);
  standing.information = req.body.information;
  await saveDocument(standing, `/admin/standings/${standing.id}`, "admin-about/edit", res, { standing });
});

exports.deleteStanding = asyncHandler(async (req, res) => {
  await Standings.findByIdAndDelete(req.params.id);
  res.redirect("/admin/standings");
});

exports.newStanding = asyncHandler(async (req, res) => {
  const standing = new Standings({
    information: req.body.information,
    createdAt: new Date(),
  });
  await saveDocument(standing, `standings/${standing.id}`, "admin-about/new", res, { standing });
});

exports.newEvent = asyncHandler(async (req, res) => {
  const event = new Events({
    information: req.body.information,
    eventDate: req.body.eventDate,
  });
  await saveDocument(event, "/admin/standings", "admin-about/events/new", res, { event });
});
