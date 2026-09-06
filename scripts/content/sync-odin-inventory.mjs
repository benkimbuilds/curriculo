import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const [curriculumRoot, appRoot] = process.argv.slice(2);
if (!curriculumRoot || !appRoot) throw new Error("Usage: node scripts/content/sync-odin-inventory.mjs CURRICULUM_CHECKOUT APP_CHECKOUT");
const sha = (root) => execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const curriculumCommit = sha(curriculumRoot);
const orderingCommit = sha(appRoot);
for (const root of [curriculumRoot, appRoot]) {
  if (execFileSync("git", ["-C", root, "status", "--porcelain"], { encoding: "utf8" }).trim()) throw new Error(`Upstream checkout must be clean: ${root}`);
}
const sources = new Map();
const quoted = "(?:'((?:\\\\.|[^'])*)'|\"((?:\\\\.|[^\"])*)\")";
const decode = (a, b) => (a ?? b).replace(/\\(['"\\])/g, "$1");
for (const file of fs.readdirSync(path.join(appRoot, "db/fixtures/lessons"))) {
  if (!file.endsWith(".rb")) continue;
  const raw = fs.readFileSync(path.join(appRoot, "db/fixtures/lessons", file), "utf8");
  const collection = raw.match(/def (\w+)/)?.[1];
  const entries = new RegExp(`^    ${quoted} => \\{([\\s\\S]*?)^    \\},?`, "gm");
  for (const match of raw.matchAll(entries)) {
    const body = match[3];
    const sourcePath = body.match(/github_path: ['"]\/?([^'"]+)/)?.[1];
    const uuid = body.match(/identifier_uuid: ['"]([^'"]+)/)?.[1];
    if (!sourcePath || !uuid) throw new Error(`Missing source in ${file}: ${match[1]}`);
    sources.set(`${collection}:${decode(match[1], match[2])}`, { sourcePath, uuid, kind: /is_project: true/.test(body) ? "project" : "lesson" });
  }
}

const courses = [
  ["foundations", "Foundations", "db/fixtures/paths/foundations/seed.rb"],
  ...[["intermediate-html-css", "Intermediate HTML and CSS", "intermediate_html_css"], ["javascript", "JavaScript", "javascript"], ["advanced-html-css", "Advanced HTML and CSS", "advanced_html_css"], ["react", "React", "react"], ["databases", "Databases", "databases"], ["node-js", "NodeJS", "node_js"], ["getting-hired", "Getting Hired", "getting_hired"]].map(([id, title, file]) => [id, title, `db/fixtures/paths/full_stack_javascript/courses/${file}.rb`]),
];
const outputRoot = path.resolve("content/odin");
const items = [];
const courseRecords = [];
for (const [course, title, fixture] of courses) {
  const fixtureText = fs.readFileSync(path.join(appRoot, fixture), "utf8");
  fs.mkdirSync(path.join(outputRoot, "ordering", path.dirname(fixture)), { recursive: true });
  fs.copyFileSync(path.join(appRoot, fixture), path.join(outputRoot, "ordering", fixture));
  let courseOrder = 0;
  for (const match of fixtureText.matchAll(new RegExp(`(\\w+_lessons)\\.fetch\\(${quoted}\\)`, "g"))) {
    const sourceTitle = decode(match[2], match[3]);
    const source = sources.get(`${match[1]}:${sourceTitle}`);
    if (!source) throw new Error(`Missing mapping: ${match[1]}:${sourceTitle}`);
    const bytes = fs.readFileSync(path.join(curriculumRoot, source.sourcePath));
    const id = `odin-${course}-${source.uuid.slice(0, 8)}`;
    fs.mkdirSync(path.join(outputRoot, "upstream", path.dirname(source.sourcePath)), { recursive: true });
    fs.copyFileSync(path.join(curriculumRoot, source.sourcePath), path.join(outputRoot, "upstream", source.sourcePath));
    items.push({ id, course, title: sourceTitle, collection: match[1], kind: source.kind, order: items.length + 1, courseOrder: ++courseOrder, sourcePath: source.sourcePath, upstreamUuid: source.uuid, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), sourceUrl: `https://github.com/TheOdinProject/curriculum/blob/${curriculumCommit}/${source.sourcePath}` });
  }
  courseRecords.push({ id: course, title, fixture, count: courseOrder });
}
fs.copyFileSync(path.join(curriculumRoot, "license.md"), path.join(outputRoot, "LICENSE-UPSTREAM.md"));
fs.mkdirSync(path.join(outputRoot, "ordering", "db/fixtures/lessons"), { recursive: true });
for (const file of fs.readdirSync(path.join(appRoot, "db/fixtures/lessons"))) {
  if (file.endsWith(".rb") && !file.includes("ruby")) fs.copyFileSync(path.join(appRoot, "db/fixtures/lessons", file), path.join(outputRoot, "ordering", "db/fixtures/lessons", file));
}
const inventory = { schemaVersion: 1, curriculumCommit, orderingCommit, scope: "Foundations and Full Stack JavaScript; excludes Ruby/Rails and archived courses", courses: courseRecords, items };
fs.writeFileSync(path.join(outputRoot, "inventory.json"), JSON.stringify(inventory, null, 2) + "\n");
console.log(JSON.stringify({ courses: courseRecords, items: items.length, projects: items.filter(x => x.kind === "project").length }, null, 2));
