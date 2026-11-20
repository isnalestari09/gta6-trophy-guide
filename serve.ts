// A tiny static server for the guide's app/ folder (Node 22, stdlib only).
// Run `node serve.ts` and open http://localhost:8080 (or --port <n> for another
// port). It serves only files inside app/, sends the right MIME type for each,
// and does nothing else — a local convenience for trying the guide, not a
// production server.
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(fileURLToPath(new URL("./app", import.meta.url)));
const args = process.argv.slice(2);
const portFlag = args.indexOf("--port");
const wanted = portFlag === -1 ? 8080 : Number(args[portFlag + 1]);
const port = Number.isInteger(wanted) && wanted > 0 && wanted < 65536 ? wanted : 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const server = createServer((request, response) => {
  let pathname = "/";
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("bad request");
    return;
  }
  if (pathname.endsWith("/")) pathname += "index.html";
  const file = resolve(join(appRoot, normalize(pathname)));
  if (file !== appRoot && !file.startsWith(appRoot + sep)) {
    response.writeHead(403).end("forbidden");
    return;
  }
  let size = 0;
  try {
    const stats = statSync(file);
    if (!stats.isFile()) throw new Error("not a file");
    size = stats.size;
  } catch {
    response.writeHead(404).end("not found");
    return;
  }
  response.writeHead(200, {
    "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "content-length": size,
    "cache-control": "no-store",
  });
  createReadStream(file).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Leonida Platinum is on http://localhost:${port}`);
});
