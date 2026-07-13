const fs = require("fs");
const path = require("path");

const dir = process.argv[2];

function extractSharedStrings(xml) {
  const strings = [];
  const siRegex = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = siRegex.exec(xml))) {
    const inner = m[1];
    const texts = [...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]);
    strings.push(
      texts
        .join("")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'"),
    );
  }
  return strings;
}

function colToIndex(col) {
  let idx = 0;
  for (const ch of col) idx = idx * 26 + (ch.charCodeAt(0) - 64);
  return idx - 1;
}

function readSheet(sheetPath, sharedStrings) {
  const xml = fs.readFileSync(sheetPath, "utf-8");
  const rows = [];
  const rowRegex = /<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  let rm;
  while ((rm = rowRegex.exec(xml))) {
    const rowNum = parseInt(rm[1], 10);
    const rowXml = rm[2];
    const cellRegex = /<c ([^>]*)(?:\/>|>(?:<f>[\s\S]*?<\/f>)?(?:<v>([\s\S]*?)<\/v>)?(?:<is>([\s\S]*?)<\/is>)?<\/c>)/g;
    let cm;
    const rowData = [];
    while ((cm = cellRegex.exec(rowXml))) {
      const attrs = cm[1];
      const colMatch = attrs.match(/r="([A-Z]+)\d+"/);
      const typeMatch = attrs.match(/\bt="([a-z]+)"/);
      const col = colMatch ? colMatch[1] : null;
      const type = typeMatch ? typeMatch[1] : null;
      const v = cm[2];
      const isInline = cm[3];
      if (!col) continue;
      let val = "";
      if (isInline) {
        val = [...isInline.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join("");
      } else if (v !== undefined) {
        if (type === "s") {
          val = sharedStrings[parseInt(v, 10)] ?? "";
        } else {
          val = v;
        }
      }
      rowData[colToIndex(col)] = val;
    }
    rows[rowNum] = rowData;
  }
  return rows;
}

const sharedStringsXml = fs.readFileSync(path.join(dir, "xl/sharedStrings.xml"), "utf-8");
const sharedStrings = extractSharedStrings(sharedStringsXml);

const sheetFiles = fs
  .readdirSync(path.join(dir, "xl/worksheets"))
  .filter((f) => f.endsWith(".xml"))
  .sort();

const workbookXml = fs.readFileSync(path.join(dir, "xl/workbook.xml"), "utf-8");
const sheetNames = [...workbookXml.matchAll(/<sheet name="([^"]+)"/g)].map((m) => m[1]);

sheetFiles.forEach((f, i) => {
  console.log(`\n===== Sheet: ${sheetNames[i] ?? f} (${f}) =====`);
  const rows = readSheet(path.join(dir, "xl/worksheets", f), sharedStrings);
  rows.forEach((row, rowNum) => {
    if (!row) return;
    const cells = row.map((c) => (c === undefined ? "" : c));
    if (cells.some((c) => c !== "")) {
      console.log(`R${rowNum}: ${cells.join(" | ")}`);
    }
  });
});
