# Independent verification 9 — FAIL

- **Candidate:** `edfc5ceb6532b3bab78c8671ba4ed8285749feb4`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Verified:** 2026-08-29 UTC
- **Artifact class:** Android APK, with a PWA landing page and demo

## Release decision

**FAIL — release-blocking artifact and claim-gate failures.** The live web
deployment is the requested candidate, but the downloadable Android release is
not. The public `v0.1.9` tag and APK provenance name commit
`85e25facf1ababf7d6ad0bc4f0a9f0be9f77b9a0`, whereas the live page and fresh
candidate build identity name `edfc5ceb6532b3bab78c8671ba4ed8285749feb4`.
The candidate's own public-artifact verifier fails on the release APK.

This also fails the mandatory claims gate in this clean verifier: four listed
Android claim commands exit 1 before exercising an installed APK because this
environment has no Java, Android SDK, ADB, or emulator. The claims contract
explicitly says any failing listed claim test is release-blocking. This is not
accepted as a passing substitute for device evidence.

## Mandatory claims and first-read gates

`.factory/claims.json` exists and contains 16 claims. After `npm ci`, every
listed command was invoked. `apk-payload-match` passed locally (2/2
desktop/mobile mocked cases); the browser commands were also invoked from the
clean install. The following required exact commands failed with exit 1:

| Claim | Exact command | Result / evidence |
| --- | --- | --- |
| `scoped-folder-access` | `npm run test:android-claim -- scoped-folder-access` | **FAIL** — `JAVA_HOME is not set and no 'java' command could be found`; runner then reports that a connected Android emulator/device is required. |
| `native-refresh-safety` | `npm run test:android-claim -- native-refresh-safety` | **FAIL** — same missing Java/emulator prerequisite. |
| `consent-removal` | `npm run test:android-claim -- consent-removal` | **FAIL** — same missing Java/emulator prerequisite. |
| `native-handoff` | `npm run test:android-claim -- native-handoff` | **FAIL** — same missing Java/emulator prerequisite. |

The cold live first-read gate itself passes. The first screen says **“Keep
approved folders ready offline”**, says it is **“For Android users who need
cloud files in another app when the network disappears”**, and gives one-click
**“Try it with sample data”** with the adjacent result **“A ready folder opens.
Nothing is saved.”** No console/page error was produced on the cold load.

Fresh live demo evidence: `/demo` has the persistent “Demo — sample data,
nothing is saved” banner; only `demo:offline-file-bridge` is in localStorage;
no real IndexedDB database exists; an offline reload after worker control shows
“Offline — ready files still open” and the ready PDF preview action. Initial
demo load made four requests, all to the product origin, with no console error.

## Clean-checkout quality gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 148 packages installed; 149 audited; zero vulnerabilities |
| `npm run test:unit` | PASS — 8/8 |
| `npm run lint` | PASS — TypeScript no-emit |
| `npm run build` | PASS — `dist/` produced; JS 39.13 KB / 13.71 KB gzip; CSS 14.43 KB / 4.45 KB gzip |
| `npm audit --omit=dev` | PASS — zero vulnerabilities |
| `npm test` | **FAIL** — one test failed when Chromium headless shell crashed with `SEGV_MAPERR` while closing a context after the terms/checkout test. The failure trace indicates a browser process crash rather than an assertion failure; it is nevertheless a failed required suite. |
| `npm run test:release-artifact` | **FAIL** — `Error: APK web file differs from dist: 404.html.` |
| `npm run test:android` / `npm run test:android-device` | Cannot run — no Java/Android SDK/ADB/emulator in this verifier. |

## Deployment and APK identity

- Fresh local and live `/build-identity.json` are byte-identical: version
  `0.1.9`, candidate commit `edfc5ce…`, 17 payload files, and payload SHA-256
  `8815929f1dacae1e5672d6ebb61959c27476282c0f61746a480a50bf503be13d`.
- The public latest release is `v0.1.9`, published 2026-08-29T15:06:01Z. Its
  tag resolves to `85e25fac…`, not the candidate. Its published provenance
  reports the same older commit and a different payload hash
  `b51748856622c5b68c610fd78047c4a475dd434ef370df52b6c41777da358263`.
- The release APK is checksummed as
  `854bcae671e0e232ba11f3bcd17f44dc482aa90d8ee890104fc7cc9555713130` in the
  published `SHA256SUMS`, but it cannot be accepted as this candidate's APK.
- The live product safely refuses to expose it: after **Check latest APK**, it
  shows **“A matching APK is not ready yet. Check again later.”** and exposes
  no Download APK link. This is correct failure behaviour, but confirms that
  the required Android artifact is absent for this candidate.

## Live web checks that passed

- Desktop cold load and 390 px mobile first screen are clear; mobile has no
  horizontal overflow. Keyboard Tab reaches the visible skip link with a
  3px `rgb(7, 92, 115)` outline and 3px offset; activating it focuses the H1.
- Fresh Axe on live `/demo` found zero serious/critical violations. The cold
  page has `lang=en`, one H1, and one main landmark.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, strict
  origin referrer policy, Permissions-Policy, and a header CSP with
  `frame-ancestors 'none'`. HTML revalidates at 30 seconds; `sw.js` is
  `no-cache`.
- No third-party scripts/fonts/analytics were observed in the cold/demo request
  log. License verification is the only intended product cross-origin path.
- The documented license endpoint enforces a 30-request burst allowance:
  fresh invalid-token requests yielded 30 × 200 then 5 × 429; request 31 was
  the first 429 and every sampled 429 included `Retry-After: 4`.

## Defects by severity

### P0 — published Android artifact does not match the candidate

The current live PWA identifies `edfc5ce…`; public tag `v0.1.9`, APK, and
provenance identify `85e25fa…`. The repository's own public artifact verifier
fails at the first byte mismatch (`404.html`). Publish a new APK/AAB/provenance
whose tag resolves to this candidate (or deploy the same commit as the APK),
then rerun `npm run test:release-artifact` successfully.

### P0 — mandatory installed-APK claims do not pass from this clean verifier

Four declared claims require `connectedReleaseAndroidTest` but fail because no
Android runtime/toolchain is available. Provide a clean verifier image with
JDK, Android SDK, an emulator and ADB (or run and attach fresh independent
installed-release-APK evidence in such an image) before acceptance. The
current browser/PWA evidence cannot prove SAF picker behavior, native atomic
refresh, consent release, or chooser handoff.

### P1 — aggregate browser suite is not stable in this verifier

`npm test` ended failed after Chromium headless shell SIGSEGV during context
closure. Re-run in a clean browser runtime and retain the passing result; do
not use the prior builder report as replacement evidence.

## Recommended next verification

1. Publish candidate-matching Android artifacts and provenance under a tag
   resolving to `edfc5ce…` (or deploy the tag commit consistently).
2. Verify the new artifact with `npm run test:release-artifact`.
3. Run the four exact Android claim commands on an installed release APK in an
   emulator-equipped clean environment, then rerun `npm test` without a
   browser-process crash.
