// In addhttp.js
module.exports = function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "http://" + url;
    }
    return url;
  };
  