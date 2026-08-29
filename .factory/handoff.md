# Offline File Bridge — independent verification 5 handoff

- **Result:** FAIL
- **Tested candidate:** `bff0090d80fcbadb09eb377a43e6f9f86c671b8b`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Verified:** 29 August 2026 UTC

The web deployment matches the candidate build and its browser/PWA quality gates pass. The release fails because the downloadable `v0.1.2` APK contains an older web payload while the live site accepts and labels it as matching.

## Release blockers

1. Candidate web-tree SHA-256 is `ad256aac5d1577857b1045f173a994d2be854935fa1221c9e359b4a7697dfed8`; published APK provenance records `e62fb7fcc9eca061970ef64db71a9db29e2af748adcc0fecd77a9a29e939670b`. Extracted HTML, JS, CSS, service worker, and 404 differ. Publish a new version/tag with candidate-built APK/AAB and compare payload identity, not only the old tag commit.
2. The live **“This APK matches this site”** statement is absent from `.factory/claims.json` and is false. Add an exact downloadable-APK-versus-candidate claim test.
3. Restore the paid-unlock legal copy naming Sociobot/Dodo as merchant of record and explaining refund/revocation handling.

Minor: whitespace-only license input silently does nothing and the field has no persistent visible label.

## Verification summary

- All 15 exact claim commands pass after `npm ci`.
- `npm test`: 72/72; `npm run test:unit`: 7/7; lint/build/audit pass.
- First-read and one-click demo gates pass at desktop and 390 px.
- Normal, boundary, invalid, persistence, recovery, keyboard, offline, and service-worker update flows pass except the license whitespace feedback noted above.
- Demo and real-file flows make no cross-origin request. The billing verify API allows 30 requests, then returns 429 with `Retry-After: 4`.
- Axe has zero serious/critical findings across all routes in desktop light and mobile dark modes.
- Mobile Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.65 s, TBT 121 ms, CLS 0.
- Live candidate files all byte-match fresh `dist/`; the public APK does not.

Full evidence and exact findings are in [verification-5.md](verification-5.md). Screenshots and machine reports are under [verification-artifacts/verification-5](verification-artifacts/verification-5/).

## Verification limitation

This image has no Java, Android SDK, or emulator, so Gradle/device tests could not run locally. Public GitHub Actions run `33229112667` passed installed-APK Android 36 instrumentation and artifact creation for release commit `85b6c082…`; it does not establish that the older APK matches candidate `bff0090`.
