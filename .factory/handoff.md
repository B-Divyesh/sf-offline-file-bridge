# Offline File Bridge — independent verification 4 handoff

- **Result:** PASS
- **Candidate:** `5888fa3ee5647c18f6c4716a3dfa4507bb70128a`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Verified:** 29 August 2026 UTC

The previously reported release mismatch is closed. A fresh candidate build, every publicly served deployable file, and all 18 web files embedded in the public `v0.1.2` APK match byte-for-byte. The APK/AAB/provenance checksums pass, the live download action resolves the matching package, and public Android release CI completed successfully.

All 12 `.factory/claims.json` commands pass. Full local gates pass: `npm ci` (0 vulnerabilities), `npm run lint`, `npm run test:unit` (7/7), `npm test` (62/62), and `npm run build`. Live desktop and 390 px flows pass demo, real import/persistence/handoff, error recovery, privacy, keyboard, reduced-motion, dark-mode axe, PWA offline/update, headers, caching, and release-download checks. Fresh Lighthouse scores are 100 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP is 1.81 s and CLS is 0.

The Sociobot license endpoint allowed 30 requests in a fresh burst, then returned 429 for the next five; every 429 included `Retry-After: 4`.

No release-blocking or material defect was found. One non-blocking P3 remains: several secondary mobile labels render at 12.48–14.72 px, below the design baseline, although contrast, zoom/reflow, target size, and axe checks pass. The verifier image has no Java/Android SDK, so local Gradle/emulator execution was unavailable. The public tagged GitHub Actions run passed installed-release Android 36 instrumentation and packaging; the downloaded APK was independently inspected and matched to the candidate output. A physical-device smoke and owner-key signing remain operator steps before store distribution.

Full evidence and commands: [.factory/verification-4.md](verification-4.md). Screenshots and URL verifier output: `.factory/verification-artifacts/`.

---

# Review 1 handoff — 29 August 2026

- **Result:** FAIL
- **Scope:** Read-only adversarial first-read review of the live product and supplied repository. No product code changed.

I opened the live product in fresh 390 px and desktop contexts; exercised demo refresh, open/save, reset, isolation, request logging, and offline behaviour; read the brief, source, claims, README, design, and earlier records; and checked routes, metadata, headers, 404, and links.

`npm ci` completed with 0 vulnerabilities. Every exact claims command passed, as did `npm test` (62/62), `npm run test:unit` (7/7), `npm run lint`, and `npm run build`.

The authoritative report is [review-1.md](review-1.md). Blocking work remains: **F-1-1** (Reset does not update displayed demo state), plus **F-1-2–F-1-7** (visitor promises with no exact listed claim/test or a broader scope than their test). Minor copy, terminology, button-label, 404-heading, and 404-canonical findings are **F-1-8–F-1-14**.
