# Independent verification 3 — FAIL

**Candidate:** `dba1d1d698284101de482dc83d57dcc524f731a0`
**Live URL:** <https://offline-file-bridge.sociobot.in/>
**Verified:** 2026-08-29 UTC
**Artifact class:** Android APK with PWA landing/demo

## Release decision

**FAIL — release-blocking APK/candidate mismatch.** The live PWA is the tested candidate, but the APK offered by that PWA is an older build. An Android APK is the promised product artifact, so a matching web deployment alone cannot accept this candidate.

## First read and demo gate

Cold-load first screen says: “Keep approved folders ready offline,” identifies “Android users who need cloud files in another app when the network disappears,” and presents **Try it with sample data**. One click opens `/demo`, immediately showing the Field notes mirror and the persistent “Demo — sample data, nothing is saved” banner. **PASS.**

## Claims gate — PASS

`.factory/claims.json` exists and all twelve exact commands were run after `npm ci` from this checkout:

| Claim | Result |
| --- | --- |
| `offline-reload` | PASS |
| `demo-sandbox` | PASS |
| `local-only` | PASS |
| `freshness` | PASS |
| `file-handoff` | PASS |
| `scoped-folder-access` | PASS |
| `free-tier` | PASS |
| `browser-persistence` | PASS |
| `native-refresh-safety` | PASS |
| `checkout` | PASS |
| `consent-removal` | PASS |
| `native-handoff` | PASS |

The three native commands use `npm run test:unit -- -t @claim:…` and each passed. The nine Playwright claim tests pass in Chromium and mobile Chromium; the complete `npm test` run records `test-results/.last-run.json` as `{"status":"passed","failedTests":[]}`.

## Local and production checks

| Check | Result / evidence |
| --- | --- |
| `npm ci` | PASS; 149 packages, 0 audit vulnerabilities |
| `npm test` | PASS; complete 58-test Playwright suite |
| `npm run test:unit` | PASS; 3/3 |
| `npm run lint` | PASS (`tsc --noEmit`) |
| `npm run build` | PASS; `dist/` produced; initial JS 36,576 B / 13.12 kB gzip and CSS 14,198 B / 4.39 kB gzip |
| Android local test/release build | **Not runnable in this verifier image:** `npm run test:android` stops before Gradle with `JAVA_HOME is not set and no 'java' command could be found`. No JDK/Android SDK is installed. |
| Live PWA identity | PASS: live `index-DS3MQ5EE.js` SHA-256 `545ffca3…7c337c97` and CSS `afd6b4f5…219b4a9` exactly equal the fresh candidate build. |
| `verify-url.sh` | PASS: 200, 1,170 ms, no errors, title/lang/one h1/main/alt checks present. |
| Live desktop and 390 px mobile | PASS: no unexpected console/page errors; 390 px width equals scroll width; 44 px controls and keyboard primary-action path work. |
| Reduced motion | PASS: emulated `prefers-reduced-motion: reduce` reports no running document animations. |
| Axe | PASS: 0 serious/critical findings on `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, and `/missing-page`. |
| PWA offline | PASS: live `/demo` obtained `offline-file-bridge-v2`, then reloaded offline and opened `ridge-route.pdf`. The worker is active; its source has versioned cache, `skipWaiting`, `clients.claim`, and update notice handling. |

End-to-end browser exercises passed on the live PWA: refresh changes the ready time, a sample opens and downloads, demo reset succeeds, imported browser folder data survives reload, the one-folder limit reports a recovery action, removal confirms/deletes the mirror, and a later import succeeds.

## Privacy, headers, and request allowance

- During the complete live demo flow (entry, refresh, open, reset), **all requests were same-origin**. Demo storage was only `demo:offline-file-bridge`; no real IndexedDB database was opened.
- Real browser-folder import/open/remove/re-import likewise made no foreign requests. The only declared non-local operations are GitHub Release lookup after its explicit download action and Sociobot billing/license actions.
- Live headers include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, referrer policy, and permissions policy. Hashed JS/CSS use `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- Fresh allowance test against the documented Sociobot license-verify endpoint: 35 concurrent invalid-license requests resulted in **30 × 200 and 5 × 429**. Each sampled 429 had `Retry-After: 4` (also `x-ratelimit-after: 4`). Observed burst allowance: 30 requests. Checkout currently returns 303 to hosted Dodo checkout.

## APK inspection and blocker

The current landing page resolves the GitHub `v0.1.1` APK (7,403,321 bytes). It downloads, unzips, and SHA-256 exactly matches the published `SHA256SUMS`:

```text
edd01b824744d78e0f8d12a1995fed934c4ff70380f9526f57cbfd871cca1d75  offline-file-bridge-v0.1.1.apk
```

However it is not the candidate artifact:

1. Its embedded web shell imports `index-Ctd228YQ.js` and `index-eALpEu6Q.css`; candidate/live PWA imports `index-DS3MQ5EE.js` and `index-CsmKatw_.css`.
2. The APK source map’s `src/main.ts` differs from the candidate in the post-release fixes: the APK footer says `v0.1.0`, lacks the first-screen release action, lacks the 30-record history display, leaves the hidden file input in sequential keyboard navigation, and has the prior route-focus behavior. Candidate/live source has those fixes and says `v0.1.1`.
3. APK metadata reports Android Gradle Plugin **8.2.1**; candidate specifies **8.13.0**, Gradle 8.13, min SDK 24 and target SDK 36. The candidate’s post-release commits also add the release-variant instrumentation workflow/tests.

This is fresh, direct artifact evidence, not a deployment inference. The release was published at 2026-08-28T16:47:47Z, before candidate commit `dba1d1d` at 18:13:25Z.

## Defects

### P0 — downloadable Android APK is not candidate `dba1d1d`

The only offered APK is an older web/native build packaged as `v0.1.1`. It does not contain the candidate’s tested accessibility, build-identity, release-action, history, Android toolchain, and release-variant instrumentation changes. This invalidates the Android artifact acceptance and prevents verification of the real candidate APK.

**Required remediation:** build/sync/sign the Android wrapper from `dba1d1d`, publish a new uniquely versioned APK/AAB and SHA256SUMS, update the landing release lookup, then re-run installed-APK instrumentation and artifact-to-commit comparison.

### Verification environment gap — Android execution unavailable locally

The verifier container lacks Java/Android SDK, so `./gradlew test`, `assembleRelease`, and emulator instrumentation could not be independently executed here. This is recorded separately from the P0 artifact mismatch; the matching CI/device run remains required after publishing the rebuilt artifact.
