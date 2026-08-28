import { copyFile, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url);
const index = join(dist.pathname, "index.html");
await copyFile(index, join(dist.pathname, "404.html"));

const swPath = join(dist.pathname, "sw.js");
let serviceWorker = await readFile(swPath, "utf8");
const html = await readFile(index, "utf8");
const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
serviceWorker = serviceWorker.replace(
  "const APP_SHELL = [",
  `const BUILD_ASSETS = ${JSON.stringify([...new Set(assets)])};\nconst APP_SHELL = [...BUILD_ASSETS, `
);
await writeFile(swPath, serviceWorker);
