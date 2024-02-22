const Standings = require("../../models/Standings");
const Events = require("../../models/Events");
const asyncHandler = require("../../middleware/asyncHandler");

exports.getStandingsAndEvents = asyncHandler(async (req, res) => {
  const standings = await Standings.find();
  const events = await Events.find();
  res.render("admin-about/controlPanel", { standings, events });
});

exports.newStanding = asyncHandler(async (req, res) => {
  let standings = new Standings(req.body);
  await standings.save();
  res.redirect(`/admin/standings`);
}); 

exports.editStandings = asyncHandler(async (req, res) => {
  let standings = await Standings.findById(req.params.id);
  standings = Object.assign(standings, req.body);
  await standings.save();
  res.redirect(`/admin/standings`);
}); 

exports.deleteStanding = asyncHandler(async (req, res) => {
  await Standings.findByIdAndDelete(req.params.id);
  res.redirect("/admin/standings");
}); 

exports.newEvent = asyncHandler(async (req, res) => {
  let events = new Events(req.body);
  await events.save();
  res.redirect(`/admin/standings`);
}); 

exports.editEvent = asyncHandler(async (req, res) => {
  let events = await Events.findById(req.params.id);
  events = Object.assign(events, req.body);
  await events.save();
  res.redirect(`/admin/standings`);
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  await Events.findByIdAndDelete(req.params.id);
  res.redirect("/admin/standings");
});






