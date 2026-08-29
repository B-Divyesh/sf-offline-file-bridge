# Independent verification 11

**Result: FAIL — release blocked**

- Candidate: `152ae420b0f17bce2a42a8ba156928df6c865d09`
- Live URL: <https://offline-file-bridge.sociobot.in>
- Verified: 29 August 2026 UTC, from a clean `npm ci` checkout.

## Critical release-blocking defect

This Android APK candidate has no candidate-bound public APK or installed-APK
claim evidence. The published `v0.1.11` tag resolves to
`303a4bf5045199e954805b89c7bb8af80d03f442`, not candidate `152ae420...`.
All four required Android claim commands exited 1 with that exact mismatch:

```text
npm run test:android-claim -- scoped-folder-access     FAIL
npm run test:android-claim -- native-refresh-safety    FAIL
npm run test:android-claim -- consent-removal          FAIL
npm run test:android-claim -- native-handoff           FAIL
```

`npm run test:release-artifact` fails for the same reason. The live `/install`
page independently behaves safely: after **Check latest APK** it says **“APK
v0.1.11 is being published”** and **“A matching APK is not ready yet. Check
again later.”**; it offers no APK link.

The existing APK is not evidence for this candidate. It is 7,586,621 bytes
with SHA-256 `e8422ba8224bbaa9cf06a1501f5d1977963888bfb54865d2358fb27c5a3cd9fb`;
its embedded build identity records commit `303a4bf...` and payload tree
`d33abd40cfde0d12649205d256a8a7b101f49f5d50f10ecd6e68ea7b2445e863`.

Remediation: publish an APK/AAB, `BUILD-PROVENANCE.json`, and
`ANDROID-CLAIMS.json` whose tag, commit, APK digest, and payload bind to
`152ae420b0f17bce2a42a8ba156928df6c865d09`, then rerun the four commands.

## Required claims gate

`.factory/claims.json` is present and contains 18 claims. Every exact command
was run from this clean checkout through its declared demo entry point.

| Claims | Command | Result |
| --- | --- | --- |
| `apk-payload-match`, `offline-reload`, `demo-sandbox`, `demo-ready-sample`, `demo-reset`, `local-only`, `freshness`, `file-handoff`, `free-tier`, `browser-persistence`, `browser-mirror-removal`, `browser-storage-clearing`, `license-verification-privacy`, `checkout` | `npm test -- --grep @claim:<id>` (each id) | PASS — all 14 commands completed. |
| `scoped-folder-access`, `native-refresh-safety`, `consent-removal`, `native-handoff` | `npm run test:android-claim -- <id>` (each id) | FAIL — release tag is bound to `303a4bf...`, not candidate. |

Any failed claim is release-blocking under the acceptance contract.

## First read and product exercise

A cold desktop visit passes the first-read gate: it says **“Keep approved
folders ready offline”**, names **Android users who need cloud files in another
app when the network disappears**, and shows **“Try it with sample data”** with
**“A ready folder opens. Nothing is saved.”**

Fresh `/demo` testing passed: the persistent demo banner appeared; only
`demo:offline-file-bridge` was in localStorage; IndexedDB was empty; Field
notes had its three realistic ready files; refresh changed freshness to `synced
just now`; the Markdown sample previewed and downloaded as `handoff-notes.md`;
and Reset restored `synced 12 min ago`. With the active service worker, an
online visit followed by offline reload showed **“Offline — ready files still
open”** and still previewed `ridge-route.pdf`.

Evidence images:

- `verification-artifacts/verification-11-live-home-cold.png`
- `verification-artifacts/verification-11-live-demo-desktop.png`
- `verification-artifacts/verification-11-live-home-desktop.png`
- `verification-artifacts/verification-11-live-home-mobile390.png`
- `verification-artifacts/verification-11-focus-desktop.png`
- `verification-artifacts/verification-11-focus-mobile.png`

## Quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 148 packages; audit reported 0 vulnerabilities. |
| `npm run lint` | PASS. |
| `npm run test:unit` | PASS — 16 tests in 4 files. |
| `npm test` | PASS — 80 Playwright tests; `test-results/.last-run.json` records `passed`. |
| `npm run build` | PASS — produces `dist/`. |
| `npm run test:release-artifact` | FAIL — tag commit mismatch above. |
| `npm run test:android` | Not runnable: this worker has no `JAVA_HOME` or `java`. This does not replace the failed published installed-release evidence. |

Initial production assets meet the static budgets: JavaScript 39,198 B
(13.71 KB gzip), CSS 14,431 B (4.45 KB gzip), and self-hosted font 74,932 B.

## Live deployment, privacy, accessibility, and resilience

The live **static web payload does match** the candidate exactly: local and
live `build-identity.json` both report version `0.1.11`, candidate commit,
17 files, and payload tree
`61030319f5cbe290e6694dfcf91e3385fa4b41346892a817268fe95dc77eedb8`.
That does not cure the missing matching APK.

- Cold landing and exercised demo request logs contained only same-origin
  product requests; no demo or selected file data left the device. The only
  permitted foreign request in the fixture license flow is the Sociobot
  verification endpoint.
- Production response headers include HSTS, CSP with `frame-ancestors 'none'`,
  nosniff, strict referrer policy, and disabled camera/microphone/geolocation.
  Hashed assets are immutable for one year; `sw.js` is `no-cache`.
- Fresh axe scans at 390 px found zero serious/critical issues on `/`, `/demo`,
  `/app`, `/install`, `/privacy`, `/terms`, and the 404. The six supported
  routes had one h1/main, correct titles, no overflow, and no console/page
  errors. The 404 document's expected HTTP-404 console resource message is
  limited to that intentionally missing route.
- Keyboard Tab reaches the skip link with a visible 3 px focus ring. Reduced
  motion settles without running animations. The active versioned service
  worker uses `skipWaiting` and `clients.claim`; offline demo reload passed.
- Non-spending invalid-license rate-limit exercise: 30 sequential requests
  returned 200; request 31 returned `429` with `Retry-After: 4`. The observed
  allowance is 30 requests in the active window and enforcement is present.

## Defects by severity

- **Critical:** no candidate-bound Android release artifact; all four native
  outcome claims fail.
- **High / Medium / Low:** no additional independent defects found.
