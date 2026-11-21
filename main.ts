// Leonida Platinum — GTA VI trophy guide (gta6-trophy-guide-01). Node 22, standard library only.
// Copies app/ and screenshots/ from beside this file into /output (or $MAKEFUN_OUTPUT_DIR
// outside the grader) and writes /output/dossier.json with the vendored make.fun library.
// It NEVER removes the output directory itself: it only clears the contents of out/app
// and out/screenshots, so it also succeeds when /output is a grader bind mount, and a
// second run into the same directory leaves no stale files behind.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function clearContents(dir: string): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) rmSync(join(dir, entry), { recursive: true, force: true });
}

mkdirSync(out, { recursive: true });
const appOut = join(out, 'app');
const shotsOut = join(out, 'screenshots');
mkdirSync(appOut, { recursive: true });
mkdirSync(shotsOut, { recursive: true });
clearContents(appOut);
clearContents(shotsOut);
cpSync(join(here, 'app'), appOut, { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), shotsOut, { recursive: true });

// The scorer's caps (reference/gate.json): text_max_bytes shapes the dossier bytes;
// the others refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files/dirs in app/ or 48 MiB of app files).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
