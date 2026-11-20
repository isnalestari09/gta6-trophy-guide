// Leonida Platinum v2 — the program that hands this guide in (Node 22, stdlib only).
// It takes the guide's own files — app/ (the static guide) and screenshots/ (four
// renders of it) — and lays them out in the output directory, then writes
// dossier.json, the summary the judge reads, with the vendored make.fun library.
// vendor/makefun-frontend.ts is the kit's copy and is left exactly as it is.
//
// The output directory itself is never removed: on the grader it is a bind mount,
// so removing it fails. This program only clears what is inside it, then copies
// the entry in. Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and serve the guide with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function clearDirectoryContents(dir) {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

function copyEntry(name) {
  const source = join(repoRoot, name);
  if (!existsSync(source)) return;
  cpSync(source, join(outputDir, name), { recursive: true });
}

clearDirectoryContents(outputDir);
copyEntry("app");
copyEntry("screenshots");

// The scorer's own caps (from the kit's gate): at most 4 screenshots, each at
// most 256 KiB; app/ at most 993 files and directories and 48 MiB in all; the
// dossier text at most 160 KiB. The dossier is built from what was just copied,
// so what the grader scores is exactly what this program wrote.
writeFileSync(
  join(outputDir, "dossier.json"),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

console.log(`Leonida Platinum v2 handed in to ${outputDir}`);
