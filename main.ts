// Leonida Platinum v3 — entry program (Node 22, standard library only).
//
// What it does: copies this repository's app/ and screenshots/ into the
// grader's output directory and writes /output/dossier.json with the
// vendored make.fun library (vendor/makefun-frontend.ts, unchanged).
// It never deletes the output directory itself: on the grader /output is a
// bind mount, so removing it fails the run. Instead it clears only the
// contents of the two subdirectories it owns, then copies fresh files in.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Clear the contents of a directory we own, leaving the directory itself
// in place (the grader's /output must survive this step).
function clearContents(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

mkdirSync(outDir, { recursive: true });
mkdirSync(join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
clearContents(join(outDir, 'app'));
clearContents(join(outDir, 'screenshots'));

cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Dossier caps from the competition's gate: text at most 160 KiB, at most
// 4 screenshots of at most 256 KiB each, app/ at most 993 files / 48 MiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
