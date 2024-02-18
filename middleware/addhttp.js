module.exports = function addHttp(link) {
    link = link.trim();

    if (link.startsWith("https://") || link.startsWith("http://")) {
        return link;
    } else if (link.startsWith("www.")) {
        return "https://" + link;
    } else {
        return "https://www." + link;
    }
}