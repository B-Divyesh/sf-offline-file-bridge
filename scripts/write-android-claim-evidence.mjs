import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  ANDROID_CLAIM_METHODS,
  createLocalClaimResult,
  invariant
} from "./android-claim-contract.mjs";

const [provenanceInput, evidenceOutput] = process.argv.slice(2);
invariant(provenanceInput && evidenceOutput,
  "Usage: write-android-claim-evidence.mjs <BUILD-PROVENANCE.json> <ANDROID-CLAIMS.json>");

const resultDirectory = resolve(process.env.ANDROID_CLAIM_RESULTS_DIR || ".android-claim-results");
const provenance = JSON.parse(await readFile(resolve(provenanceInput), "utf8"));
const claims = {};

for (const claim of Object.keys(ANDROID_CLAIM_METHODS)) {
  const result = JSON.parse(await readFile(resolve(resultDirectory, `${claim}.json`), "utf8"));
  const checked = createLocalClaimResult(claim, result.junitXml, result.executedAt);
  invariant(result.junitSha256 === checked.junitSha256, `Stored JUnit digest is invalid for ${claim}.`);
  claims[claim] = checked;
}

const evidence = {
  schema: 1,
  product: provenance.product,
  tag: provenance.tag,
  version: provenance.version,
  commit: provenance.commit,
  packageId: "in.sociobot.offline_file_bridge",
  buildType: "release",
  androidApi: Number(process.env.ANDROID_API_LEVEL || "35"),
  apk: { name: provenance.apk, sha256: provenance.apkSha256 },
  payloadTreeSha256: provenance.payloadTreeSha256,
  claims
};

await writeFile(resolve(evidenceOutput), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`Wrote installed-release evidence for ${Object.keys(claims).length} Android claims.`);
