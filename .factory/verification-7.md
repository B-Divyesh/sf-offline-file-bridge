# Independent verification 7 — FAIL

- **Candidate:** `d94a0b04cbead4df7d7f26065dc1baa0764d486d` (`main`, version `0.1.3`)
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Verified:** 29 August 2026 UTC
- **Artifact class:** Android APK with PWA landing/demo

## Release decision

**FAIL — P0 release blocker.** The deployed PWA is exactly the candidate, but the downloadable Android release is from an older commit. The live landing detects that mismatch and disables the APK download, so the required Android artifact is not available for this candidate.

## Mandatory first-read and demo gate

**PASS.** A cold live desktop page says it keeps approved folders ready offline, identifies Android users who need cloud files in another app when the network disappears, and puts **Try it with sample data** first. One click opens `/demo` with the persistent **Demo — sample data, nothing is saved** banner, Reset demo, Start for real, the ready Field notes mirror, and three realistic files.

## Claims gate

`.factory/claims.json` exists with 17 entries. After `npm ci`, I executed every exact command listed there from this checkout through the demo entry point. All completed successfully; the aggregate browser suite also exercised every browser claim on desktop and 390px mobile, and the source-native claims passed in Vitest.

| Claim IDs | Result | Evidence |
| --- | --- | --- |
| `billing-legal`, `apk-payload-match`, `offline-reload`, `demo-sandbox`, `demo-ready-sample`, `demo-reset`, `local-only`, `freshness`, `file-handoff`, `scoped-folder-access`, `free-tier`, `browser-persistence`, `license-verification-privacy`, `checkout` | PASS | `npm test`: 76/76 Playwright checks across Chromium desktop and 390px mobile |
| `native-refresh-safety`, `consent-removal`, `native-handoff` | PASS | `npm run test:unit`: 7/7 Vitest checks |

The landing/README claims were also cross-checked against the manifest. No unlisted relied-on product claim was found.

## Clean-checkout quality gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 148 packages installed; audit found zero vulnerabilities |
| every exact command in `.factory/claims.json` | PASS — 17/17 commands |
| `npm test` | PASS — 76/76 Playwright tests (2m 12s) |
| `npm run test:unit` | PASS — 7/7 Vitest tests |
| `npm run lint` | PASS — TypeScript no-emit check |
| `npm run build` | PASS — writes `dist/` |
| `npm audit --omit=dev` | PASS — zero vulnerabilities |
| `npm run test:release-artifact` | **FAIL** — `APK web file differs from dist: 404.html.` |
| `npm run test:android` | Not executable in this verifier: no `JAVA_HOME`/`java` |
| `npm run test:android-device` | Not executable in this verifier: no `JAVA_HOME`/`java` or emulator |

Fresh production output is 39.28 KB JS (13.82 KB gzip), 14.43 KB CSS (4.45 KB gzip), and a 74,932-byte self-hosted font, within the static budgets.

## Live deployment, privacy, accessibility, and PWA

- Live `assets/index-DUAG-yx_.js` SHA-256 is `2fd74f4a69f3f17f56f6a47453cedc9e7151e0f3ef60dd99704dd525e2bcd3d2`, byte-identical to candidate `dist`.
- Live `build-identity.json` is byte-identical to candidate output and records commit `d94a0b04cbead4df7d7f26065dc1baa0764d486d`, 17 payload files, and payload SHA-256 `2513572abaaada0ac32cf46b4d763891a44f95d371e999e2741403f807103130`.
- Cold live `/` made only same-origin requests (document, self-hosted font, JS, CSS, and artwork) and had no console or page errors. Live demo refresh/preview/offline reload likewise made no foreign request.
- A fresh live visit gained a service-worker controller; after setting the browser offline, `/demo` reloaded and visibly reported **Offline — ready files still open**.
- Live desktop and 390px `/demo` have one H1, one main landmark, no horizontal overflow, visible 3px focus outlines, keyboard-reachable controls, and zero axe serious/critical findings. Reduced-motion context had zero running document animations.
- HTML headers include CSP with header-delivered `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and restrictive permissions policy. Hashed JS/CSS/font have one-year immutable caching; `sw.js` is `no-cache`; HTML revalidates after 30 seconds.
- Live routes `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, and `/sw.js` returned 200; an unknown route returned 404.
- No sign-in or product-owned backend applies. A fresh 35-request single-client burst to the documented Sociobot license-verify endpoint observed **30 × 200, then 5 × 429**; sampled 429 responses included `Retry-After: 4`. Observed allowance: 30 requests.

## Android artifact finding

### P0 — published APK does not match the candidate and cannot be downloaded

`npm run test:release-artifact` downloaded the public `v0.1.3` APK and failed its byte-for-byte payload contract at `404.html`.

- Candidate/live build identity: commit `d94a0b04cbead4df7d7f26065dc1baa0764d486d`, payload tree `2513572abaaada0ac32cf46b4d763891a44f95d371e999e2741403f807103130`.
- GitHub release `v0.1.3` provenance and APK `assets/public/build-identity.json`: commit `e8debdc51c78ef81bb09a1f2c9b0c32b0eb0b951`, payload tree `812262f72da58bd45ca1ad106fb6ebb68a0b511b6043daf3e02788f89daf38e2`.
- Released APK: 7,587,133 bytes (7.3 MiB), SHA-256 `dc5764d23cf38b3e130f9d99c94e39f797f66162b1143496f0c8aa0fd2b72e08`; it contains `AndroidManifest.xml` and an older `assets/public/` web payload. Its embedded `404.html` SHA-256 is `7fd59cffd9116bf3d9b951db8e5161a2d698481cd1af346c254701a8daf9c5ca`, versus candidate `1974acffe2da8173dd50986c8c77c28cfd08595042dab6dc210a0d5058acdec0`.
- Fresh live interaction clicked **Download the latest APK**, then received disabled **APK v0.1.3 is being published** and **A matching APK is not ready yet. Check again later.** No stale APK URL was exposed.

The mismatch guard is correct, but it does not satisfy the Android APK delivery contract or permit end-to-end Android verification. Publish a new APK/AAB/provenance for this exact candidate (or deploy the matching static candidate for the released APK), then rerun `npm run test:release-artifact` and native CI/device tests.

## Verification limitations

This disposable verifier has no Java, Android SDK, ADB, or emulator, so Gradle unit/device tests could not run locally. This is separate from the P0: public APK identity was independently inspected and conclusively fails the candidate contract.

## Evidence locations

Command logs retained during this run: `/tmp/offline-file-bridge-npm-test.log`, `/tmp/offline-file-bridge-release-artifact.log`, `/tmp/offline-file-bridge-android-test.log`, `/tmp/offline-file-bridge-android-device.log`, `/tmp/offline-file-bridge-live-cold.json`, and `/tmp/offline-file-bridge-live-audit.json`.
