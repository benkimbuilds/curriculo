import fs from "node:fs";
import path from "node:path";
import { countWords } from "../../src/modules/curriculum/compiler";
import { normalizeOdinMarkdown } from "../../src/modules/curriculum/odin-markdown";

const root = path.resolve("content/odin");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "inventory.json"), "utf8")) as { items: { id: string; course: string; sourcePath: string; title: string; sourceUrl: string }[] };
for (const item of inventory.items) {
  if (process.argv[2] && item.course !== process.argv[2]) continue;
  const sourceWords = countWords(fs.readFileSync(path.join(root, "upstream", item.sourcePath), "utf8"));
  const file = path.join(root, "es-MX", `${item.id}.md`);
  const words = fs.existsSync(file) ? countWords(normalizeOdinMarkdown(fs.readFileSync(file, "utf8").replace(/^# [^\n]+\n/, ""), item.sourceUrl)) : 0;
  const floor = Math.max(60, Math.round(sourceWords * .6));
  if (words < floor) console.log(`${item.id}\t${words}/${sourceWords} words\tminimum=${floor}\t${item.title}`);
}
