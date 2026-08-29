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
npm run test:unit              PASS — 7/7
npm test                       PASS — 62/62 desktop and mobile Chromium
npm run build                  PASS — dist/ produced
npx cap sync android           PASS
git diff --check               PASS
```

All twelve commands in `.factory/claims.json` were also run separately and passed: nine browser claims in both Chromium projects and three native source claims in Vitest.

Production payload: initial JS 37.22 kB raw / 13.33 kB gzip; CSS 14.20 kB raw / 4.39 kB gzip. Local mobile Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100, LCP 2.1 s, CLS 0, TBT 0 ms. `/opt/fleet/lib/verify-url.sh` passed in 649 ms with no console errors, one H1, one main landmark, `lang=en`, a descriptive title, and no missing alt text. Evidence is under `.factory/evidence/repair-3/`.

The Playwright matrix covers desktop and 390 px-class mobile behavior, keyboard focus and route transfer, 44 px targets, 200% text reflow, serious/critical axe findings on every route, reduced-motion behavior, isolated demo storage, same-origin file flows, offline reload/open, update-worker registration, and the release mismatch regression.

## Android and release evidence

GitHub Actions is the required Android build environment because this worker has no JDK, Android SDK, or emulator. [Run 33229112667](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33229112667) completed successfully. Its Android API 36 installed-release instrumentation, Gradle unit tests, APK/AAB build, byte-for-byte web payload verification, and release upload all passed.

Public release `v0.1.2` resolves to source commit `85b6c082837b07fdc85c58be7f977b1542d27fc2`. A fresh consumer download produced:

```text
offline-file-bridge-v0.1.2.apk  7,584,941 bytes  SHA-256 24972b5c04731f96d36a22eaf52ed21432e03011b5604603e7cc50312d3c7e3e
offline-file-bridge-v0.1.2.aab  7,475,967 bytes
SHA256SUMS                     282 bytes
BUILD-PROVENANCE.json          391 bytes
```

`sha256sum -c SHA256SUMS` passed for the APK, AAB, and provenance file. The APK embeds version `0.1.2` and commit `85b6c082…`. A separate consumer run of `release-contract.mjs` confirmed all 18 embedded web files equal local `dist/` byte-for-byte; its calculated provenance exactly matched the published file. Web-tree SHA-256: `e62fb7fcc9eca061970ef64db71a9db29e2af748adcc0fecd77a9a29e939670b`.

## Deployment and live verification

Static deployment `61ff3990-3620-4513-b41a-e43ebf7257f6` succeeded. The live `build-identity.json` reports version `0.1.2` and the same release commit `85b6c082…`. The landing action resolves the public `v0.1.2` APK and says “This APK matches this site.” All four release assets return 200 with their published sizes.

Live `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/install` return 200; `/missing-page` returns the designed 404. `verify-url.sh` passed in 920 ms with no console errors. Live browser checks at desktop and 390 px passed offline reload/open, cache `offline-file-bridge-v3`, same-origin-only demo traffic, keyboard entry, no mobile overflow, reduced motion, and zero serious/critical axe findings. The response has CSP, HSTS, `nosniff`, referrer, and permissions-policy headers; hashed assets have a one-year immutable cache policy.

The checkout returns 303 to hosted Dodo checkout. A fresh 35-request invalid-license burst returned 30 × 200 and 5 × 429; each 429 included `Retry-After: 4` and `x-ratelimit-after: 4`.

Evidence, including desktop/mobile screenshots and verifier output, is under `.factory/evidence/repair-3/`.

## Commands

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

The generated debug signing key is suitable for direct test installation. A store listing still needs the owner's stable upload key; no signing secret is committed. No other known release blocker remains.
