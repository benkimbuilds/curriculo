import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";

const root = path.resolve("content");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "odin/inventory.json"), "utf8")) as { curriculumCommit: string; items: { id: string; title: string; sourcePath: string }[] };
const mappings = fs.readdirSync(path.join(root, "odin/mappings")).filter(file => file.endsWith(".json")).flatMap(file => JSON.parse(fs.readFileSync(path.join(root, "odin/mappings", file), "utf8")) as { id: string; week: number }[]);
for (const locale of ["en", "es-MX"]) for (let week = 1; week <= 12; week += 1) {
  const filename = path.join(root, "weeks", locale, `week-${String(week).padStart(2, "0")}.mdx`);
  const source = fs.readFileSync(filename, "utf8");
  const parsed = matter(source, { engines: { yaml: value => parseYaml(value) } });
  const ids = mappings.filter(item => item.week === week).map(item => item.id);
  const references = inventory.items.filter(item => ids.includes(item.id));
  // The AI extension is original instruction built on API and testing prerequisites.
  const extensionPrerequisites = inventory.items.filter(item => ["API Basics", "API Security", "Testing Basics"].includes(item.title));
  parsed.data.provenance.upstreamCommit = inventory.curriculumCommit;
  parsed.data.provenance.upstreamPaths = [...new Set((references.length ? references : extensionPrerequisites).map(item => item.sourcePath))];
  parsed.data.provenance.editor = "Ruta curriculum adaptation";
  if (locale === "es-MX") parsed.data.provenance.translator = "Adaptación al español asistida por IA";
  const frontmatterEnd = source.indexOf("\n---", 4) + 4;
  fs.writeFileSync(filename, `---\n${JSON.stringify(parsed.data, null, 2)}\n---${source.slice(frontmatterEnd)}`);
}
console.log(`Updated core provenance to ${inventory.curriculumCommit}; stable learning IDs and version retained.`);
