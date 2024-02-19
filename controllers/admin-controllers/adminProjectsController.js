const asyncHandler = require("../../middleware/asyncHandler");
const prepVideoLink = require("../../middleware/prepVideoLink");
const Projects = require("../../models/Projects");

// Simplifies handling of project data, including files and video links
const prepareProjectData = async (req, existingProject = null) => {
  const filenames = req.files?.map(file => file.filename) || [];
  const videoEmbedLinks = prepVideoLink(req.body.videolink);

  // Combine existing filenames with new ones if updating an existing project
  const combinedFilenames = existingProject ? [...existingProject.filename, ...filenames] : filenames;

  return {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description.trim(),
    filename: combinedFilenames,
    videoLink: videoEmbedLinks,
  };
};

exports.getProjects = asyncHandler(async (req, res) => {
  const projects = await Projects.find().sort({ createdAt: -1 });
  res.render("admin-projects/controlPanel", { projects });
});

exports.uploadProject = asyncHandler(async (req, res) => {
  const projectData = await prepareProjectData(req);
  const newProject = new Projects(projectData);
  await newProject.save();
  res.redirect("/admin/projects");
});

exports.editProject = asyncHandler(async (req, res) => {
  const existingProject = await Projects.findById(req.params.id);
  if (!existingProject) {
    return res.status(404).send("Project not found");
  }

  const projectData = await prepareProjectData(req, existingProject);
  await Projects.findByIdAndUpdate(req.params.id, projectData);
  res.redirect("/admin/projects");
});

exports.deleteProject = asyncHandler(async (req, res) => {
  await Projects.findByIdAndDelete(req.params.id);
  res.redirect("/admin/projects");
});

exports.editProjectPhotos = asyncHandler(async (req, res) => {
  const project = await Projects.findById(req.params.id);
  if (!project) {
    return res.status(404).send("Project not found");
  }

  // Assuming `req.body.photos` is an array of filenames to remove
  const updatedFilenames = project.filename.filter(filename => !req.body.photos.includes(filename));
  await Projects.findByIdAndUpdate(req.params.id, { filename: updatedFilenames });
  res.sendStatus(200);
});
