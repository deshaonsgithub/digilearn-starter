const test = require("node:test");
const assert = require("node:assert/strict");
const { SITE_NAME, renderHome } = require("../src/site");

test("home page shows the site name", () => {
  assert.ok(renderHome().includes("<h1>" + SITE_NAME + "</h1>"));
});

test("home page greets the visitor by name", () => {
  assert.ok(renderHome("Ada").includes("Hello, Ada!"));
});
