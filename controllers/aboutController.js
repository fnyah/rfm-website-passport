const asyncHandler = require('../middleware/asyncHandler');
const Standings = require('../models/Standings');
const Events = require('../models/Events');

exports.getAboutData = asyncHandler(async (req, res) => {
    const standings = await Standings.find().sort({ createdAt: -1 });
    const events = await Events.find().sort({ createdAt: -1 });
    res.render("about", { standings: standings, events: events});
});





