module.exports = function addHttp(link) {
  // Trim whitespace from the link
  link = link.trim();

  // Check if the link already starts with "http://" or "https://"
  if (!/^https?:\/\//.test(link)) {
    // Prepend "https://www." if it doesn't start with "www."
    link = link.startsWith("www.") ? "https://" + link : "https://www." + link;
  }

  return link;
} 
