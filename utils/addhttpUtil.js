// function that adds https:// to links if it's not there and www. if it's not there
function addHttp(link) {
    // remove whitespace
    link = link.trim();

    if (link.includes("https://")) {
        return link;
    } else if (link.includes("http://")) {
        return link;
    } else if (link.includes("www.")) {
        return "https://" + link;
    } else {
        return "https://www." + link;
    }
}

module.exports = { addHttp };