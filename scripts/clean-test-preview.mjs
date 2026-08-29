import { readdir, readFile, realpath } from "node:fs/promises";

const port = process.argv[2] || "4173";
const repo = await realpath(process.cwd());
const matches = [];

for (const entry of await readdir("/proc", { withFileTypes: true })) {
  if (!/^\d+$/.test(entry.name)) continue;
  const pid = Number(entry.name);
  if (pid === process.pid) continue;

  try {
    const [cwd, command] = await Promise.all([
      realpath(`/proc/${pid}/cwd`),
      readFile(`/proc/${pid}/cmdline`, "utf8")
    ]);
    const words = command.replaceAll("\0", " ");
    // The Playwright web-server shell contains the future `vite preview`
    // command in its command line. Never mistake that parent shell for a
    // running preview while this preflight is executing.
    const isThisPreview = !words.includes("clean-test-preview.mjs")
      && cwd === repo
      && /(?:^|\s)(?:[^\s]*\/)?vite(?:\s|$)/.test(words)
      && /(?:^|\s)preview(?:\s|$)/.test(words)
      && new RegExp(`(?:--port\\s+|--port=)${port}(?:\\s|$)`).test(words);
    if (isThisPreview) matches.push(pid);
  } catch {
    // A process may exit while it is being inspected.
  }
}

if (!matches.length) {
  console.log(`No stale Offline File Bridge preview server on port ${port}.`);
  process.exit(0);
}

console.log(`Stopping stale Offline File Bridge preview server${matches.length === 1 ? "" : "s"}: ${matches.join(", ")}`);
for (const pid of matches) process.kill(pid, "SIGTERM");

const alive = (pid) => {
  try { process.kill(pid, 0); return true; } catch { return false; }
};

for (let attempt = 0; attempt < 30 && matches.some(alive); attempt += 1) {
  await new Promise((resolve) => setTimeout(resolve, 100));
}
for (const pid of matches.filter(alive)) process.kill(pid, "SIGKILL");
