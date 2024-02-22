const HomeInfo = require("../../models/Home");
const PhotoLinkInfo = require("../../models/Photos");
const asyncHandler = require("../../middleware/asyncHandler");
const addHttp = require("../../middleware/addhttp");
const { streamFile } = require("../../utils/gridfsUtility");

// Handles the creation of text posts
exports.createTextPost = asyncHandler(async (req, res) => {
    const newPost = new HomeInfo(req.body);
    await newPost.save();
    res.redirect(`/admin/home/${newPost.id}`);
});

// Handles editing of text posts
exports.editTextPost = asyncHandler(async (req, res) => {
    await HomeInfo.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/admin/home/${req.params.id}`);
});

// Deletes a text post
exports.deleteTextPost = asyncHandler(async (req, res) => {
    await HomeInfo.findByIdAndDelete(req.params.id);
    res.redirect("/admin/home");
});

// Fetches and displays all photos
exports.getPhotos = asyncHandler(async (req, res) => {
    const files = await PhotoLinkInfo.find({});
    res.render("admin-home/controlPanel", { files });
});

// Uploads a new photo
exports.uploadPhoto = asyncHandler(async (req, res) => {
    const link = req.body.link ? "https://" + req.body.link.replace(/(^\w+:|^)\/\//, "") : null;
    const newPhotoLink = new PhotoLinkInfo({
        link,
        description: req.body.description,
        filename: req.file.filename,
    });
    await newPhotoLink.save();
    res.redirect(`/admin/home`);
});

// Edits an existing photo post
exports.editPhotoPost = asyncHandler(async (req, res) => {
    let updateData = { ...req.body };

    // Check if link is provided and not empty
    if (req.body.link && req.body.link.trim()) {
        // Correctly use addHttp to modify and assign the link
        updateData.link = addHttp(req.body.link);
    }

    if (req.file) {
        updateData.filename = req.file.filename;
    }

    await PhotoLinkInfo.findByIdAndUpdate(req.params.id, updateData);
    res.redirect(`/admin/home`);
});


// Fetches and displays home content
exports.getHomeContent = asyncHandler(async (req, res) => {
    const [posts, photolinks] = await Promise.all([HomeInfo.find({}), PhotoLinkInfo.find({})]);
    res.render("admin-home/controlPanel", { posts, photolinks });
});

// Streams a file by its filename
exports.getImageByFilename = (req, res) => {
    streamFile(req, res, 'uploads', req.params.filename);
};

// Deletes a photo link
exports.deletePhotoLink = asyncHandler(async (req, res) => {
    await PhotoLinkInfo.findByIdAndDelete(req.params.id);
    res.redirect("/admin/home");
});
