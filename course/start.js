// Starts the change a class gives you, on a new branch with one commit: node course/start.js 5
// Classes 5, 6 and 7 use it. It never pushes; you push and open the pull request yourself.
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function stop(message) {
  console.error(message);
  process.exit(1);
}

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

const n = String(process.argv[2] || "").replace(/^0+/, "");
const file = path.join(__dirname, "steps", "class-" + n + ".json");
if (!fs.existsSync(file)) stop("There is no change for class " + (n || "?") + ". Use 5, 6 or 7, like this: node course/start.js 5");
const change = JSON.parse(fs.readFileSync(file, "utf8"));

const root = git("rev-parse", "--show-toplevel");
if (git("status", "--porcelain")) stop("You have changes that are not committed. Run git status to see them, then commit them or put them back first.");
if (git("branch", "--show-current") !== "main") stop("Switch to main first: git switch main, then git pull.");
if (git("branch", "--list", change.branch)) stop("The branch " + change.branch + " already exists. Switch to it with: git switch " + change.branch);

git("switch", "-c", change.branch);
for (const [name, text] of Object.entries(change.files)) {
  const target = path.join(root, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}
git("add", "--", ...Object.keys(change.files));
git("commit", "-q", "-m", change.title, "-m", change.description);

console.log("Made the branch " + change.branch + " with one commit: " + change.title);
console.log("Files: " + Object.keys(change.files).join(", "));
console.log("Next: git push -u origin " + change.branch);
