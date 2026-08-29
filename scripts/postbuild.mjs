import { copyFile, readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { buildMetadata } from "./build-metadata.mjs";

const dist = new URL("../dist/", import.meta.url);
const index = join(dist.pathname, "index.html");
await copyFile(index, join(dist.pathname, "404.html"));
await writeFile(join(dist.pathname, "build-identity.json"), `${JSON.stringify(buildMetadata, null, 2)}\n`);

const swPath = join(dist.pathname, "sw.js");
let serviceWorker = await readFile(swPath, "utf8");
const html = await readFile(index, "utf8");
const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
serviceWorker = serviceWorker.replace(
  "const APP_SHELL = [",
  `const BUILD_ASSETS = ${JSON.stringify([...new Set(assets)])};\nconst APP_SHELL = [...BUILD_ASSETS, `
);
await writeFile(swPath, serviceWorker);

async function filesBelow(directory, prefix = "") {
  const entries = await readdir(join(directory, prefix), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const name = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(directory, name));
    else if (entry.isFile() && name.replaceAll("\\", "/") !== "build-identity.json") files.push(name.replaceAll("\\", "/"));
  }
  return files.sort();
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

// build-identity.json carries this value, so it is deliberately excluded from
// the manifest it signs. Every actual application file, including index,
// routes, worker, JS, CSS and assets, is covered.
const payloadFiles = await filesBelow(dist.pathname);
const payloadLines = await Promise.all(payloadFiles.map(async (file) => `${digest(await readFile(join(dist.pathname, file)))}  ${file}`));
const payloadTreeSha256 = digest(`${payloadLines.join("\n")}\n`);
await writeFile(join(dist.pathname, "build-identity.json"), `${JSON.stringify({
  ...buildMetadata,
  payloadFileCount: payloadFiles.length,
  payloadTreeSha256
}, null, 2)}\n`);
