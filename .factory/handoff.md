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

Every entry in `.factory/claims.json` is an exact command. The four Android
commands require the public `v0.1.11` release evidence after the tag workflow
finishes:

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
- The release and matching APK are checked at
  <https://github.com/B-Divyesh/sf-offline-file-bridge/releases/tag/v0.1.11>.
- Production re-check targets: <https://offline-file-bridge.sociobot.in/>,
  <https://offline-file-bridge.sociobot.in/demo>,
  <https://offline-file-bridge.sociobot.in/privacy>, and
  <https://offline-file-bridge.sociobot.in/missing-page>.

## Known gaps

None. The Android claim commands are deliberately candidate-bound and must be
run only after the tagged release is published.
