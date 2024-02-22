const asyncHandler = require('../middleware/asyncHandler');
const { streamFile } = require('../utils/gridfsUtility');
const Projects = require('../models/Projects');

exports.displayProjectImage = asyncHandler( async (req, res) => {
  const filename = req.params.filename;
  streamFile(req, res, 'projectphotos', filename); 
});

exports.getProjectsData = asyncHandler( async (req, res) => {
  const projects = await Projects.find().sort({ createdAt: -1 });
  res.render("projects", { projects: projects });
}); 



