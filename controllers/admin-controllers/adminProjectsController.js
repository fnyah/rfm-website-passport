const asyncHandler = require("../../middleware/asyncHandler");
const prepVideoLink = require("../../middleware/prepVideoLink");
const Projects = require("../../models/Projects");

// Simplifies handling of project data, including files and video links
const prepareProjectData = async (req, existingProject = null) => {
  const filenames = req.files?.map(file => file.filename) || [];

  // Check if video link input is provided and not empty
  let videoEmbedLinks = req.body.videolink ? prepVideoLink(req.body.videolink) : [];

  if (existingProject && !req.body.videolink) {
    videoEmbedLinks = []; // Clear existing video links if input is empty
  }

  const combinedFilenames = existingProject ? [...existingProject.filename, ...filenames] : filenames;

  return {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description.trim(),
    filename: combinedFilenames,
    videoLink: videoEmbedLinks, // This will now be empty if input is empty, clearing old links
  };
};

exports.getProjects = asyncHandler(async (req, res) => {
  const projects = await Projects.find().sort({ createdAt: -1 });
  res.render("admin-projects/controlPanel", { projects });
});

exports.uploadProject = asyncHandler(async (req, res) => {
  const embedLink = prepVideoLink(req.body.videolink);
  const filenames = req.files.map((file) => file.filename);

  const projectData = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    filename: filenames,
    videoLink: embedLink,
  };

  try {
    const project = await Projects.create(projectData);
    res.redirect("/admin/projects");
  } catch (err) {
    console.log(err);
    res.render("admin-projects/new", { projects: projectData });
  }
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
  const photosToRemove = req.body; // Assuming this is an array of photo filenames to remove
  const projectId = req.params.id;

  // Retrieve the current project
  const project = await Projects.findById(projectId);
  if (!project) {
    return res.status(404).send('Project not found');
  }

  // Filter out the photos to remove
  const updatedPhotos = project.filename.filter(photo => !photosToRemove.includes(photo));

  // Update the project's photo array without the need to call save() afterward
  await Projects.findByIdAndUpdate(projectId, { filename: updatedPhotos });

  // If successful, send back a success status
  res.sendStatus(200);
});
