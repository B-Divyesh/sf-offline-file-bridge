# Offline File Bridge candidate handoff — FAIL

**Candidate:** `344ba1552febc62d31d085f871af98d7f0ac6081`

**Live URL:** <https://offline-file-bridge.sociobot.in>

**Independent verification:** 28 August 2026

**Release decision:** **FAIL — do not release this candidate.**

The earlier deployment failures are repaired. The v0.1.1 APK/AAB/checksum are public and valid, the install screen resolves the APK, checkout returns `303` to Dodo, and live static assets match the candidate build. Fresh verification still found release blockers.

## Release blockers

1. Three exact commands in `.factory/claims.json` fail because Vitest 3 rejects `--grep`: `native-refresh-safety`, `consent-removal`, and `native-handoff`. The aggregate unit suite passes, but the mandatory claims gate is 9 pass / 3 fail.
2. The Android product has no device/emulator end-to-end test of SAF selection, offline mirroring, second-app chooser handoff, and permission revocation. The published workflow runs JVM/source regressions only, so the real Android job and 95% success measure are not established.
3. Manual accessibility checks fail required behavior: SPA link navigation leaves focus on `<body>`, the transparent file input creates an invisible Tab stop, mobile header/footer targets are below 44px, and 200% text causes horizontal overflow on `/` and `/demo`.

## Other defects

- Claims do not observably prove the advertised 30-record cap or several native/privacy/payment promises.
- `npm audit` reports five dev dependency vulnerabilities (1 moderate, 2 high, 2 critical); production audit is clean.
- Live footer says v0.1.0 while the release/APK is v0.1.1.
- No direct landing-page **Download APK** action exists; install requires three clicks from the landing page.
- Unknown routes render the 404 design with HTTP 200.

## Passing evidence

- First-read and one-click demo gate: PASS.
- `npm test`: 46/46 PASS; `npm run test:unit`: 3/3 PASS; TypeScript/build: PASS.
- Live demo and real browser files persist and open offline; demo storage isolation and same-origin privacy check pass.
- APK 7,403,321 bytes, SHA-256 `edd01b824744d78e0f8d12a1995fed934c4ff70380f9526f57cbfd871cca1d75`; manifest package `in.sociobot.offline_file_bridge`, version 0.1.1, no broad storage permission.
- Axe serious/critical: 0 across desktop/light and 390px mobile/dark routes; reduced motion and dialog focus pass.
- Lighthouse mobile: 98 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.8 s, TBT 160 ms, CLS 0.
- Rate limit: 80 concurrent verify calls produced 30 × 200 and 50 × 429; 429 responses included `Retry-After: 4`.

Full commands, route evidence, artifact inspection, headers, performance, and defects are in [verification-2.md](verification-2.md). Browser evidence is under `evidence/verification-2/`.

## How to reproduce

```sh
npm ci
npm test
npm run test:unit
npm run build
npm run test:unit -- --grep @claim:native-refresh-safety
npm run test:unit -- --grep @claim:consent-removal
npm run test:unit -- --grep @claim:native-handoff
```

The first three targeted commands exit 1 with `CACError: Unknown option --grep`.
