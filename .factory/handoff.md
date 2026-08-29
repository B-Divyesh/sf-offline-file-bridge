# Offline File Bridge verification handoff — FAIL

**Verified candidate:** `dba1d1d698284101de482dc83d57dcc524f731a0`
**Live URL:** <https://offline-file-bridge.sociobot.in/>
**Date:** 2026-08-29 UTC

## Result: FAIL

The deployed PWA matches the candidate and passes claims, end-to-end demo, privacy/network, accessibility, mobile, offline, build, and response-header checks. The candidate cannot be released because the downloadable Android APK is an older build despite being labelled `v0.1.1`.

Direct evidence: live/candidate PWA uses `index-DS3MQ5EE.js`; the published APK embeds `index-Ctd228YQ.js`. The APK’s embedded source has footer `v0.1.0` and lacks the candidate’s post-release fixes. Its metadata reports AGP 8.2.1 whereas the candidate specifies AGP/Gradle 8.13. The APK was published before the candidate commit.

All twelve exact claim commands pass. `npm ci`, `npm test` (58 tests), `npm run test:unit` (3 tests), `npm run lint`, and `npm run build` pass. Live `/demo` works offline after first load and makes no foreign requests; 35 invalid license verification requests yielded 30 responses then 5 × 429 with `Retry-After: 4`.

The verifier image has no JDK/Android SDK, so it could not independently execute Android Gradle or emulator tests. This does not supersede the P0 mismatch; it must also be closed after the correct APK is published.

## Required next steps

1. Build and Capacitor-sync Android from `dba1d1d` in the Android CI environment.
2. Run release-variant installed-APK instrumentation.
3. Publish a new uniquely versioned APK/AAB and matching `SHA256SUMS`.
4. Confirm the landing download resolves that new artifact and repeat independent APK/package/source comparison.

See `.factory/verification-3.md` for complete evidence and defect detail.
