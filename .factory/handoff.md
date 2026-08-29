# Review 4 repair handoff

## What changed

- Prepared Android release candidate `v0.1.11` with matching web and Android
  version numbers. The release workflow binds the APK, web payload, and four
  installed-APK claims to the tagged candidate.
- Made the `$14` one-time Bridge Pro statement a real billing outcome check.
  The claim opens a non-spending Sociobot checkout session and asserts the
  product name, USD, $14.00 / 1400 cents, and one-time text.
- Replaced the remaining `local copy` terminology in `/app` metadata and the
  demo guide with `folder mirror`, with source and rendered-metadata tests.
- Split the deletion policy into two browser claims with observable IndexedDB
  deletion checks. The Android statement stays limited to the installed-APK
  removal claim; the untested uninstall statement was removed.
- Rewrote the two README test instructions in plain language, retained the
  isolated one-click demo, and advanced the service-worker cache name so
  existing installs receive this build.

## How to run and verify

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build
```

Every entry in `.factory/claims.json` is an exact command. All 18 commands
were run from a clean clone at candidate commit
`303a4bf5045199e954805b89c7bb8af80d03f442`: 14 browser/PWA claims and the
four public Android claims below. The complete browser suite passed 80 tests;
the unit suite passed 16 tests.

```sh
npm run test:android-claim -- scoped-folder-access
npm run test:android-claim -- native-refresh-safety
npm run test:android-claim -- consent-removal
npm run test:android-claim -- native-handoff
npm run test:release-artifact
```

The demo entry points are `/demo` and `/?demo=1`. They use only the
`demo:offline-file-bridge` localStorage key; **Reset demo** reseeds it and
**Start for real** discards it.

## Evidence

- Local visual records: `evidence/polish-4/home-desktop.png`,
  `demo-mobile.png`, `privacy-desktop.png`, and `404-mobile.png`.
- GitHub Actions run
  [33268257935](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33268257935)
  passed on 2026-08-29. It ran Android 35 installed-APK instrumentation,
  Gradle unit tests, release APK/AAB build, claim evidence, and provenance.
- The published
  [v0.1.11 release](https://github.com/B-Divyesh/sf-offline-file-bridge/releases/tag/v0.1.11)
  contains the 7,586,621-byte APK, AAB, SHA256SUMS, BUILD-PROVENANCE.json, and
  ANDROID-CLAIMS.json. `npm run test:release-artifact` passed its matching
  payload fingerprint `d33abd40cfde0d12649205d256a8a7b101f49f5d50f10ecd6e68ea7b2445e863`.
- Static deployment `c2265d87-47e1-4bf7-aac7-489461dcae80` is live at
  <https://offline-file-bridge.sociobot.in/>. Its `build-identity.json`
  reports v0.1.11 and commit `303a4bf5045199e954805b89c7bb8af80d03f442`.
- Cold production checks passed for `/`, `/demo`, `/app`, `/privacy`, `/terms`,
  `/install`, `?demo=1`, offline demo reload, the v0.1.11 APK link, and the
  real 404. `verify-url.sh` found no console errors on the five 200 routes.
  Axe found zero serious or critical issues across all seven routes in light
  and dark modes. Lighthouse measured 100 performance, 100 accessibility, 100
  best practices, 100 SEO; LCP was 1.7 s and CLS was 0.

## Known gaps

None.
