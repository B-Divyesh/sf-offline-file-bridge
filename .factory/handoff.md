# Independent verification 9 handoff — FAIL

- **Candidate:** `edfc5ceb6532b3bab78c8671ba4ed8285749feb4`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Verification report:** [verification-9.md](verification-9.md)

## Release status

**FAIL.** The live PWA identity matches the candidate, but the Android APK
artifact does not: public `v0.1.9` resolves to `85e25fac…`, not `edfc5ce…`,
and `npm run test:release-artifact` fails with `APK web file differs from dist:
404.html`. The live page correctly refuses to offer that nonmatching APK.

The mandatory Android claims also fail in this clean verifier because the
required JDK/SDK/ADB/emulator is absent. All four exact
`npm run test:android-claim -- <id>` commands exit 1. Do not release until a
candidate-matching APK/AAB/provenance is published and those installed-release
APK claim commands pass in a clean emulator-capable verifier.

Local passes: `npm ci`, `npm run test:unit` (8/8), `npm run lint`, `npm run
build`, and `npm audit --omit=dev`. `npm test` also ended failed after a
Chromium SIGSEGV during context closure and must be rerun cleanly.

The cold live first-read/demo, offline demo reload, privacy request log,
headers, keyboard skip link, 390px reflow, and live `/demo` Axe
serious/critical scan passed. License verification was rate-limited at 30
requests per burst, with 429 responses carrying `Retry-After: 4`.

---

# Previous polish round 3 handoff — superseded by verification 9

- **Repair commit:** `85e25facf1ababf7d6ad0bc4f0a9f0be9f77b9a0`
- **Pushed branch:** `main`
- **Android release:** [`v0.1.9`](https://github.com/B-Divyesh/sf-offline-file-bridge/releases/tag/v0.1.9)
- **Deployment:** <https://offline-file-bridge.sociobot.in/>
- **Live identity:** commit `85e25facf1ababf7d6ad0bc4f0a9f0be9f77b9a0`; payload SHA-256 `b51748856622c5b68c610fd78047c4a475dd434ef370df52b6c41777da358263`.

## Done

Closed every finding from adversarial reviews 1–3. The repair standardizes
**folder mirror**, gives the APK availability control an honest first-click
label, removes unsupported refund/revocation and release-process promises,
rewrites the README and Terms heading in plain language, and preserves the
notebook visual identity.

The demo remains isolated under `demo:offline-file-bridge`. It works from
`/demo` and `/?demo=1`, has its persistent banner, visibly resets to the seed,
and never opens real browser storage while active.

The claims contract now has 16 claims. Four Android claims run named
instrumentation methods against an installed release APK through
`npm run test:android-claim -- <claim-id>`; they are no longer source-token
checks. The release workflow invokes each exact command on its Android 35
emulator before publishing artifacts.

## Verification

- Clean clone `/tmp/offline-file-bridge-clean.1RArmV`: `npm ci` (0 vulnerabilities), `npm run lint`, `npm run test:unit` (**8/8**), `npm run build`, every browser claim command separately, and `npm test` (**74/74**) passed.
- GitHub Actions [run 33258293074](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33258293074): all four exact Android claim commands passed on an installed release APK; APK/AAB, provenance, and SHA256SUMS published.
- Local `npm run test:release-artifact`: PASS against public `v0.1.9`; embedded web payload and published provenance match `dist/`.
- Local `npm audit --omit=dev`: PASS; `git diff --check`: PASS.
- Production `verify-url.sh`: PASS for `/`, `/demo`, `/privacy`, `/terms`, and `/install`; no console errors. Evidence: `.factory/evidence/polish-3/*/verify.json`.
- Production browser/Axe check: zero serious or critical violations across all real routes plus the designed 404; deep links, route titles, h1/main, canonical handling, first click, direct demo reset, and verified APK link passed. Evidence: [live-browser-check.json](evidence/polish-3/live-browser-check.json).
- Production offline demo reload and ready-file preview: PASS. Evidence: [live-offline-check.json](evidence/polish-3/live-offline-check.json).
- Production mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s and CLS 0. Evidence: [lighthouse-live.json](evidence/polish-3/lighthouse-live.json).

See [polish-3.md](polish-3.md) for the finding-by-finding repair map.

## Known gaps

None.
