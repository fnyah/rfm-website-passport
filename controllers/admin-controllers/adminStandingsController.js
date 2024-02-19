const Standings = require("../../models/Standings");
const Events = require("../../models/Events");
const asyncHandler = require("../../middleware/asyncHandler");

// Refines saving and error handling for both new and existing documents
const handleDocumentSave = async (doc, redirectPath, res, renderOptions = {}, renderPath = null) => {
  try {
    const savedDoc = await doc.save();
    res.redirect(redirectPath.replace(':id', savedDoc.id)); // Use dynamic path replacement for ID
  } catch (error) {
    console.error("Error saving document:", error);
    if (renderPath) {
      res.render(renderPath, { ...renderOptions, error });
    } else {
      res.status(400).json({ error: error.message });
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
  if (!standing) return res.status(404).send("Standing not found.");
  standing.information = req.body.information;
  await handleDocumentSave(standing, `/admin/standings/:id`, res, { standing }, "admin-about/edit");
});

exports.deleteStanding = asyncHandler(async (req, res) => {
  await Standings.findByIdAndDelete(req.params.id);
  res.redirect("/admin/standings");
});

exports.newStanding = asyncHandler(async (req, res) => {
  const standing = new Standings({ information: req.body.information });
  await handleDocumentSave(standing, `/admin/standings/:id`, res, { standing }, "admin-about/new");
});

exports.newEvent = asyncHandler(async (req, res) => {
  const event = new Events({ information: req.body.information, eventDate: req.body.eventDate });
  await handleDocumentSave(event, "/admin/standings", res, { event }, "admin-about/events/new");
});
