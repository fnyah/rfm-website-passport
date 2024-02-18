const asyncHandler = require("../../middleware/asyncHandler");
const { prepVideoLink } = require("../../middleware/prepVideoLink");
const Projects = require("../../models/Projects");

// Utility function for handling project file uploads
const handleProjectFiles = (req, existingProject = null) => {
    const filenames = req.files.map(file => file.filename);
    const videoEmbedLinks = prepVideoLink(req.body.videolink);
    const projectData = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description.trim(),
        filename: existingProject ? [...existingProject.filename, ...filenames] : filenames,
        videoLink: videoEmbedLinks,
    };
    return projectData;
};

exports.getProjects = asyncHandler(async (req, res) => {
    const projects = await Projects.find().sort({ createdAt: -1 });
    res.render("admin-projects/controlPanel", { projects });
});

exports.uploadProject = asyncHandler(async (req, res) => {
    const projectData = handleProjectFiles(req);
    try {
        const newProject = new Projects(projectData);
        await newProject.save();
        console.log("Saved Project:", newProject);
        res.redirect("/admin/projects");
    } catch (err) {
        console.error(err);
        res.render("admin-projects/new", { projects: projectData, error: err.message });
    }
});

exports.editProject = asyncHandler(async (req, res) => {
    const projectData = handleProjectFiles(req, await Projects.findById(req.params.id));
    try {
        const editedProject = await Projects.findByIdAndUpdate(req.params.id, projectData, { new: true });
        console.log("Edited project:", editedProject);
        res.redirect("/admin/projects");
    } catch (err) {
        console.error(err);
        res.render("admin-projects/edit", { projects: projectData, error: err.message });
    }
});

exports.deleteProject = asyncHandler(async (req, res) => {
    await Projects.findByIdAndDelete(req.params.id);
    res.redirect("/admin/projects");
});

exports.editProjectPhotos = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const photosToRemove = req.body.photos; // Assuming the body contains an array of filenames to remove
    const project = await Projects.findById(id);
    const updatedFilenames = project.filename.filter(filename => !photosToRemove.includes(filename));
    await Projects.findByIdAndUpdate(id, { filename: updatedFilenames });
    res.redirect(`/admin/projects/edit/${id}`);
});
