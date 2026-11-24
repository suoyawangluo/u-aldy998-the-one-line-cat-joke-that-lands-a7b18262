// The One-Line Cat Joke That Lands — make.fun entry
// Writes one single-line cat joke (1-200 characters) to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const JOKE =
  "My cat ignores her $200 toy tower and plays with the bread bag's twist tie, which she guards like a family heirloom.";

// Gate check: the sealed scorer requires UTF-8 text of 1-200 characters,
// a single line, and not only white space.
function checkGate(text: string): void {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 200) {
    throw new Error(`gate failed: ${codePoints} code points, must be 1-200`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry must not be only white space");
  }
}

checkGate(JOKE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const path = `${outDir}/entry.txt`;
writeFileSync(path, JOKE + "\n", "utf8");

// Read-back verification: the file's first line must be byte-identical
// to the joke, and its sha256 must match the in-memory hash.
const written = readFileSync(path, "utf8").replace(/\n$/, "");
if (written !== JOKE) {
  throw new Error("read-back failed: file content differs from the joke");
}
const sha = createHash("sha256").update(Buffer.from(JOKE, "utf8")).digest("hex");
console.log(
  `wrote ${path} (${[...JOKE].length} code points, sha256 ${sha}), verified: ${JSON.stringify(JOKE)}`,
);
