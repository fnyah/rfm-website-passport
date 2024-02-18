module.exports = function prepVideoLink(videoLink) {
    if (!videoLink) return;

    const videoLinks = videoLink.split(",");
    const embedLinks = videoLinks.map((link) => {
        if (link.includes("embed/")) {
            return link;
        } else {
            return link.replace("watch?v=", "embed/");
        }
    });
    return embedLinks;
}

