function fromNow(date) {
 
    var seconds = Math.floor((new Date() - date) / 1000);
 
    var interval = Math.floor(seconds / 31536000);
 
    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    if (seconds <= 1) {
        return "a moment ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

function parseHTML (str) {
  var tmp = document.implementation.createHTMLDocument('New Doc');
  tmp.body.innerHTML = str;
  return tmp.body.children[0];
};

var Helper = {
    fromNow: fromNow,
    parseHTML: parseHTML
};

module.exports = Helper;