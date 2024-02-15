const HomeInfo = require("../../models/Home");
const asyncHandler = require("../../middleware/asyncHandler");
const PhotoLinkInfo = require("../../models/Photos");


exports.createTextPost = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    const post = new HomeInfo({
        title,
        description,
    });

    await post.save();
    res.redirect(`/admin/home/${post.id}`);
});

exports.editTextPost = asyncHandler(async (req, res) => {
    const post = await HomeInfo.findById(req.params.id);
    post.title = req.body.title;
    post.description = req.body.description;
    await post.save();
    res.redirect(`/admin/home/${post.id}`);
});

exports.deleteTextPost = asyncHandler(async (req, res) => {
    console.log("Deleting post ID:", req.params.id); // Add this line
    await HomeInfo.findByIdAndDelete(req.params.id);
    res.redirect("/admin/home");
});

exports.getPhotos = asyncHandler(async (req, res) => {
    const files = await PhotoLinkInfo.find({});
    res.render("admin-home/controlPanel", { files });
});

exports.uploadPhoto = asyncHandler(async (req, res) => {
    let trimmedlink = req.body.link ? req.body.link.replace(/(^\w+:|^)\/\//, "") : null;
    let fixedLink = trimmedlink ? "https://" + trimmedlink : null;

    let photoLink = new PhotoLinkInfo({
        link: fixedLink,
        description: req.body.description,
        filename: req.file.filename,
    });

    try {
        await photoLink.save();
        console.log("Saved photo link: " + photoLink);
        res.redirect(`/admin/home`);
    } catch (e) {
        res.json(e);
    }
});

exports.editPhotoPost = asyncHandler(async (req, res) => {
    let trimmedlink = req.body.link.replace(/(^\w+:|^)\/\//, "");
    let fixedLink = "https://" + trimmedlink;

    const updateData = {
        link: fixedLink,
        description: req.body.description,
    };

    if (req.file) {
        updateData.filename = req.file.filename;
    }

    const editedPhotoLink = await PhotoLinkInfo.findByIdAndUpdate(
        req.params.id,
        updateData
    );

    try {
        await editedPhotoLink.save();
        res.redirect(`/admin/home`);
    } catch (e) {
        res.json(e);
    }
});

