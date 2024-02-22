module.exports = function prepVideoLink(videoLink) {
    if (!videoLink) return;
    // separate the video links into an array
    const videoLinks = videoLink.split(",");
    // create an array to hold the embed links
    const embedLinks = [];
    // loop through the video links and create the embed links
    videoLinks.forEach((link) => {
      if (link.includes ("youtube.com/watch?v=")) {
        const videoId = link.split('v=')[1].split('&')[0]; // Extract the video ID
        embedLinks.push(`https://www.youtube.com/embed/${videoId}?controls=0`);
      } else if (link.includes("youtu.be/")) {
        const videoId = link.split("youtu.be/")[1].split('?')[0]; // Extract the video ID
        embedLinks.push(`https://www.youtube.com/embed/${videoId}?controls=0`);
      } else if (link.includes ("youtube.com/embed/")) {
        embedLinks.push(link.includes("?") ? link + "&controls=0" : link + "?controls=0");
      } 
    });
    return embedLinks;
}
