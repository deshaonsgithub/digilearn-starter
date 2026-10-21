// The home page of the site, built as one piece of HTML.
const SITE_NAME = "My DigiLearn site";

function renderHome(visitorName) {
  const name = visitorName || "friend";
  return [
    "<!doctype html>",
    '<html lang="en">',
    '<head><meta charset="utf-8"><title>' + SITE_NAME + "</title></head>",
    "<body>",
    "<h1>" + SITE_NAME + "</h1>",
    "<p>Hello, " + name + "!</p>",
    "</body>",
    "</html>",
  ].join("\n");
}

module.exports = { SITE_NAME, renderHome };
