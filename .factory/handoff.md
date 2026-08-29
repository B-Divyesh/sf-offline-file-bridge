# Offline File Bridge repair 3 handoff

**Work order:** `offline-file-bridge-repair-3`
**Verifier base:** `479f18b596ef548eab53fc31b3201e23fa85e863`
**Artifact class:** Android APK with static PWA landing/demo
**Release:** `v0.1.2`

## Release blocker repaired

Independent verification found that the live site offered a `v0.1.1` APK built before candidate `dba1d1d`. The site trusted the latest release label and had no artifact-to-source proof.

The repair increments the web and Android version to `0.1.2` and Android `versionCode` to 2. Each build now embeds `build-identity.json` with the product, version, and source commit. The tag workflow rejects a mismatched source version, compares every file in `dist/` byte-for-byte with the APK's embedded web shell, and publishes `BUILD-PROVENANCE.json` plus checksums. The landing page offers a download only when the latest tag is `v0.1.2`, has the exact expected assets, and resolves to the same commit embedded in the site. Otherwise it shows a non-downloadable publishing state. This closes the reported stale-artifact path at build time and at download time.

Exact regressions cover a valid source/tag contract, rejection of the old `v0.1.1` tag, required pre-publish APK verification, an exact matching release response, and refusal of the prior candidate's APK.

## Local verification

Run from a clean dependency install on 29 August 2026 UTC:

```text
npm ci                         PASS — 149 packages, 0 vulnerabilities
npm run lint                   PASS — TypeScript no-emit check
npm run test:unit              PASS — 6/6
npm test                       PASS — 62/62 desktop and mobile Chromium
npm run build                  PASS — dist/ produced
npx cap sync android           PASS
git diff --check               PASS
```

All twelve commands in `.factory/claims.json` were also run separately and passed: nine browser claims in both Chromium projects and three native source claims in Vitest.

Production payload: initial JS 37.22 kB raw / 13.33 kB gzip; CSS 14.20 kB raw / 4.39 kB gzip. Local mobile Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100, LCP 2.1 s, CLS 0, TBT 0 ms. `/opt/fleet/lib/verify-url.sh` passed in 649 ms with no console errors, one H1, one main landmark, `lang=en`, a descriptive title, and no missing alt text. Evidence is under `.factory/evidence/repair-3/`.

The Playwright matrix covers desktop and 390 px-class mobile behavior, keyboard focus and route transfer, 44 px targets, 200% text reflow, serious/critical axe findings on every route, reduced-motion behavior, isolated demo storage, same-origin file flows, offline reload/open, update-worker registration, and the release mismatch regression.

## Android and release evidence

GitHub Actions is the required Android build environment because this worker has no JDK, Android SDK, or emulator. Tag `v0.1.2` runs JDK 21, Android API 36 release-variant instrumentation, Gradle unit tests, signed-with-generated-debug-key APK/AAB builds, byte-for-byte web payload verification, and release publication. Final workflow, artifact hashes, live download, and deployment evidence are recorded after publication below.

## Deploy and verify

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build
npx cap sync android
git tag v0.1.2
git push origin main v0.1.2
/opt/fleet/lib/deploy-static.sh offline-file-bridge dist
```

The generated debug signing key is suitable for direct test installation. A store listing still needs the owner's stable upload key; no signing secret is committed.
