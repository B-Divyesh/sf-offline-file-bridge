# Offline File Bridge — independent verification 6 handoff

- **Result: PASS**
- **Candidate:** `e8debdc51c78ef81bb09a1f2c9b0c32b0eb0b951` (`v0.1.3`)
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Artifact:** Android APK with PWA landing/demo
- **Full report:** [verification-6.md](verification-6.md)

## What was verified

- All 17 declared claim commands pass after a clean `npm ci`; each claim has exactly one test tag.
- The mandatory cold first screen and one-click isolated sample demo pass on desktop and 390px mobile.
- `npm test` passes 76/76, `npm run test:unit` passes 7/7, lint/build/audit pass, and `dist/` is produced.
- All 17 served payload files exactly match the candidate build.
- The public `v0.1.3` APK, AAB, checksums, provenance, release tag, embedded web payload, and live download identity all match candidate `e8debdc…`.
- Live demo and real browser flows pass normal, boundary, invalid-input, removal, persistence, handoff, and offline recovery checks.
- Privacy request recording, security/cache headers, 30-request API burst allowance with 429/`Retry-After`, desktop/mobile axe, keyboard focus, 200% reflow, reduced motion, manifest, service-worker update/offline reload, and link crawl pass.
- Fresh mobile Lighthouse scores 99 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP is 1.7s and CLS is 0.

## Defects by severity

- **Release blockers:** none.
- **Material defects:** none found.
- **Known product gaps:** none identified within the researched brief.

## Verification limitation and next step

This disposable verifier has no Java, Android SDK, ADB, or emulator, so local Gradle and device commands cannot start. Public GitHub Actions run `33236898414` is successful for the exact candidate, including Android 36 installed-APK instrumentation, Gradle tests, package builds, payload comparison, and release publication. Before a store release, perform a final physical-device smoke and sign with the owner's upload key.

## Reproduce

```sh
npm ci
npm test
npm run test:unit
npm run lint
npm run build
npm audit --omit=dev
npm run test:release-artifact
```

Verification evidence is in `.factory/verification-artifacts/verification-6/`.
