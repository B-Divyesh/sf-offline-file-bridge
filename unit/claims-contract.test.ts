import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";
import { ANDROID_CLAIM_METHODS } from "../scripts/android-claim-contract.mjs";

type Claim = { id: string; claim: string; where: string; test: string; sandbox: string };

describe("claim manifest contract", () => {
  test("every claim id is unique and has one executable outcome test", async () => {
    const claims = JSON.parse(await readFile(".factory/claims.json", "utf8")) as Claim[];
    const browserTests = await Promise.all([
      readFile("tests/accessibility.spec.ts", "utf8"),
      readFile("tests/claims.spec.ts", "utf8"),
      readFile("tests/site.spec.ts", "utf8")
    ]);
    const browserSource = browserTests.join("\n");
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);

    for (const claim of claims) {
      expect(claim.claim.trim()).not.toBe("");
      expect(claim.where.trim()).not.toBe("");
      expect(claim.sandbox.trim()).not.toBe("");
      const browserCommand = `npm test -- --grep @claim:${claim.id}`;
      const androidCommand = `npm run test:android-claim -- ${claim.id}`;
      if (claim.test === browserCommand) {
        expect(browserSource.split(`@claim:${claim.id}`).length - 1, claim.id).toBe(1);
      } else {
        expect(claim.test, claim.id).toBe(androidCommand);
        expect(ANDROID_CLAIM_METHODS, claim.id).toHaveProperty(claim.id);
      }
    }

    const declared = new Set(claims.map(({ id }) => id));
    const tagged = [...browserSource.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
    expect(tagged.filter((id) => !declared.has(id))).toEqual([]);
    expect(Object.keys(ANDROID_CLAIM_METHODS).filter((id) => !declared.has(id))).toEqual([]);
  });
});
