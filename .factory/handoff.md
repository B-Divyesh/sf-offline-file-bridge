# Repair work order 7 — release handoff

- **Verifier report repaired:** [verification-9.md](verification-9.md)
- **Repaired release:** [`v0.1.10`](https://github.com/B-Divyesh/sf-offline-file-bridge/releases/tag/v0.1.10)
- **Production:** <https://offline-file-bridge.sociobot.in/>
- **Artifact class:** Android APK with its PWA landing site

## What changed

All three release-blocking findings from verification 9 are closed without
changing the folder, demo, privacy, billing, or accessibility behavior that
passed.

1. The release version and Android version code are now `0.1.10` and `10`.
   Tag `v0.1.10`, the APK, AAB, build provenance, PWA, and live build identity
   come from one commit. The public artifact check now also validates the
   Android claim evidence.
2. Each Android claim still runs its named instrumentation method against an
   installed release APK on an Android 35 emulator. The workflow captures the
   passing JUnit XML, binds it to the release APK SHA-256, commit, and web
   payload fingerprint, and publishes `ANDROID-CLAIMS.json`. A clean worker
   without Java or ADB validates that public, candidate-bound evidence instead
   of failing before the claim is checked.
3. Playwright uses one worker for both browser projects and disables Chromium's
   shared-memory transport. This removes the constrained-container teardown
   condition that produced the verifier's `SEGV_MAPERR`, while retaining all
   desktop and mobile coverage.
4. The service-worker cache moved to `offline-file-bridge-v4`, so the repaired
   shell replaces the prior release cleanly.

Regression coverage in `unit/android-claim-contract.test.ts` rejects failed,
renamed, wrong-candidate, wrong-payload, and wrong-APK Android evidence.
`unit/release-contract.test.ts` locks the release workflow, artifact evidence,
attestation step, version contract, service-worker update, and serialized
browser policy.

## Verification evidence

Run these from a fresh checkout of tag `v0.1.10`:

```sh
npm ci
npm run test:unit
npm run lint
npm run build
npm test
npm run test:android-claim -- scoped-folder-access
npm run test:android-claim -- native-refresh-safety
npm run test:android-claim -- consent-removal
npm run test:android-claim -- native-handoff
npm run test:release-artifact
npm audit --omit=dev
```

- Clean install: 148 packages audited, zero vulnerabilities.
- Unit/regression: 15/15 passed.
- Browser integration and claims: 74/74 passed in desktop Chromium and the
  390 px mobile project, including keyboard, dark/light Axe, 200% text,
  privacy request isolation, offline reload, and APK mismatch rejection.
- Android release workflow: all four exact claim commands passed against its
  installed release APK. The release includes APK, AAB, SHA256SUMS,
  `BUILD-PROVENANCE.json`, `ANDROID-CLAIMS.json`, and GitHub build attestations.
- Public consumer check: `npm run test:release-artifact` passed by comparing
  every `dist/` byte, build identity, payload fingerprint, APK digest, and all
  four JUnit results with the public release.
- Production checks: `verify-url.sh` passed on `/`, `/demo`, `/privacy`,
  `/terms`, and `/install`. Browser checks passed at desktop and 390 px with
  no console errors or serious/critical Axe findings. The demo reloaded and
  opened a ready file offline. Response security headers and the live
  build/release identity matched.
- Production budgets remain below the limits: initial JavaScript is about
  39.1 KB raw / 13.7 KB gzip; CSS is about 14.4 KB raw / 4.5 KB gzip.

The exact APK and payload SHA-256 values are in the linked release's
`SHA256SUMS` and `BUILD-PROVENANCE.json`. Each named Android result and its
JUnit digest is in `ANDROID-CLAIMS.json`.

## Deploy and verify

```sh
npm ci
npm run build
/opt/fleet/lib/deploy-static.sh offline-file-bridge dist
/opt/fleet/lib/verify-url.sh https://offline-file-bridge.sociobot.in/ .factory/evidence/repair-7/home
```

The Android release is produced only by `.github/workflows/android.yml`, as
required for this artifact class. Direct APK sideloading uses the workflow's
documented test key. A Google Play listing still needs the owner's upload key
and is a separate operator action.

## Known gaps

None for the requested direct-download release. Google Play publication is
outside this work order.
