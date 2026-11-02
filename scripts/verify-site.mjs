import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { content, projectCopy } from "../src/content.js";
import { readerSections } from "../src/reader-sections.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(readFileSync(`${root}src/case-pages.json`, "utf8"));
const shape = (value) =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, shape(value[key])]),
        )
      : typeof value;
assert.deepEqual(
  shape(content.zh),
  shape(content.en),
  "Translation structure differs",
);
for (const [id, count] of [
  ["live", 26],
  ["mall", 12],
]) {
  const document = manifest[id];
  assert.equal(document.pageCount, count);
  assert.equal(document.pages.length, count);
  assert.equal(readerSections[id][0].page, 1);
  readerSections[id].forEach((section, index) => {
    assert.ok(section.title.zh && section.title.en && section.page <= count);
    if (index) assert.ok(section.page > readerSections[id][index - 1].page);
  });
  assert.deepEqual(shape(projectCopy[id].zh), shape(projectCopy[id].en));
  document.pages.forEach((page, index) => {
    assert.equal(page.page, index + 1);
    assert.ok(
      page.title.zh && page.title.en && page.width > 0 && page.height > 0,
    );
    for (const asset of [page.src, page.thumb]) {
      assert.ok(!asset.includes("..") && asset.endsWith(".webp"));
      const path = `${root}public/${asset}`;
      assert.ok(statSync(path).size > 100, `Missing artwork: ${asset}`);
      const bytes = readFileSync(path);
      assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    }
  });
}
const files = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(`${directory}/${entry.name}`)
      : [`${directory}/${entry.name}`],
  );
const pdfs = files(`${root}public`).filter((path) => /\.pdf$/i.test(path));
assert.deepEqual(
  pdfs,
  [`${root}public/downloads/bai-luping-resume-zh.pdf`],
  "Only the résumé may be published as a PDF",
);
assert.equal(readFileSync(pdfs[0]).toString("ascii", 0, 5), "%PDF-");
assert.match(content.zh.hero.cohort, /2028/);
assert.equal(content.zh.experience.internships.length, 3);
assert.equal(content.zh.experience.campus.length, 2);
assert.equal(
  content.zh.awards.groups.flatMap((group) => group.items).length,
  18,
);
console.log(
  "Verified: 38 artwork pages, bilingual content, 2028 cohort; only the résumé PDF is public.",
);
