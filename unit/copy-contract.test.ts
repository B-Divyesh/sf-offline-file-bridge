import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";

test("demo instructions and app metadata use the visible folder-mirror control name", async () => {
  const [demo, app] = await Promise.all([
    readFile(".factory/demo.md", "utf8"),
    readFile("src/main.ts", "utf8")
  ]);
  expect(demo).toContain("**Refresh folder mirror**");
  expect(demo).not.toContain("Refresh local copy");
  expect(app).toContain('"/app": "Choose approved folders, refresh folder mirrors, and preview ready files."');
  expect(app).not.toContain("refresh local copies");
});
