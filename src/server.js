// Runs the site on your own computer: open http://localhost:3000 after npm start.
const http = require("node:http");
const { renderHome } = require("./site");

const port = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(renderHome(url.searchParams.get("name")));
    return;
  }
  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(port, () => console.log("Site running at http://localhost:" + port));
