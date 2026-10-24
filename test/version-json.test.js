// version.json is public: it may hold only the commit sha. This test builds the site in a temporary folder with tokens set the way
// a codespace or GitHub Actions sets them, and fails if anything else ends up in version.json. It never prints a value it finds.
// scripts/build.js arrives in class 7; until then this test is skipped.
const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ALLOWED = ["sha"];
const TOKEN = /(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{8,}|github_pat_[A-Za-z0-9_]{8,}/;
const root = path.join(__dirname, "..");

// Pretend tokens, made at run time so no token-shaped text sits in this file.
const fake = (prefix) => prefix + "_" + "Ab1".repeat(12);
const pretend = {
  GITHUB_TOKEN: fake("ghu"),
  GH_TOKEN: fake("gho"),
  GITHUB_PAT: fake("ghp"),
  MY_TOKEN: fake("github_pat"),
  GITHUB_SHA: "0123456789abcdef0123456789abcdef01234567",
};

test("version.json holds only the commit sha", (t) => {
  if (!fs.existsSync(path.join(root, "scripts", "build.js"))) {
    t.skip("scripts/build.js arrives in class 7");
    return;
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "version-json-"));
  try {
    for (const folder of ["scripts", "src"]) fs.cpSync(path.join(root, folder), path.join(dir, folder), { recursive: true });
    execFileSync(process.execPath, [path.join(dir, "scripts", "build.js")], { cwd: dir, env: { ...process.env, ...pretend }, stdio: "pipe" });
    const text = fs.readFileSync(path.join(dir, "dist", "version.json"), "utf8");
    const info = JSON.parse(text);
    assert.ok(info && typeof info === "object" && !Array.isArray(info), "version.json must be one JSON object");
    const extra = Object.keys(info).filter((key) => !ALLOWED.includes(key));
    assert.deepEqual(extra, [], "version.json may hold only: " + ALLOWED.join(", "));
    assert.ok(!TOKEN.test(text), "version.json contains something that looks like a GitHub token");
    assert.equal(info.sha, pretend.GITHUB_SHA);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
