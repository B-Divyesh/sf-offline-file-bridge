# Repair 8 handoff — Android artifact binding

## What changed

Verification 11 correctly blocked the prior candidate: the PWA built from
`152ae420…`, while the latest public APK tag (`v0.1.11`) pointed at
`303a4bf…`. The browser correctly withheld that APK, but the Android artifact
class still had no candidate-bound installable release or native-claim
evidence.

This repair creates the next immutable release as `v0.1.12` / Android
`versionCode 12`. The Android release workflow now:

1. builds the signed APK and AAB before emulator testing;
2. runs each of the four native claims against that installed release APK;
3. records the SHA-256 of that tested APK with every JUnit claim result; and
4. refuses to publish `ANDROID-CLAIMS.json` unless each recorded digest equals
   the APK copied to the GitHub Release.

The portable verifier now rejects otherwise-passing JUnit evidence if it came
from any other signed APK. This closes the provenance gap rather than treating
a tag or a source-only test as release evidence.

## Local evidence

Run from a clean dependency install on 29 August 2026 UTC:

- `npm ci` — 148 packages installed; `npm audit` reported 0 vulnerabilities.
- `npm run lint` — passed.
- `npm run test:unit` — 17 tests passed. This includes the regression that
  rejects an Android JUnit result whose APK SHA-256 differs from the published
  release APK, plus workflow ordering checks.
- `npm test` — 80 Playwright tests passed. It covers all declared browser/PWA
  claims, desktop and 390 px layouts, keyboard focus, 200% text reflow,
  reduced motion, axe serious/critical checks, privacy request logging,
  service-worker offline reload, demo reset, and checkout/response policy.
- `npm run build` — passed and produced `dist/`. Initial assets are 39.20 KB
  JavaScript (13.71 KB gzip), 14.43 KB CSS (4.45 KB gzip), and a 74,932-byte
  self-hosted font.
- The original failure was reproduced before the version bump:
  `npm run test:android-claim -- scoped-folder-access` rejected `v0.1.11`
  because it resolves to `303a4bf…`, not the candidate.

This worker has no local Java/Android SDK, so it cannot run Gradle or an
emulator. The repository’s Android 35 GitHub Actions job is the required
package and installed-APK execution environment.

## Release and deployment verification

The repair commit is released only by pushing its matching `v0.1.12` tag.
That tag runs `.github/workflows/android.yml`, which publishes:

- `offline-file-bridge-v0.1.12.apk` and `.aab`;
- `BUILD-PROVENANCE.json` binding the tag, commit, APK digest, and embedded
  PWA payload fingerprint; and
- `ANDROID-CLAIMS.json` binding all four Android 35 installed-release JUnit
  results to that exact APK digest.

After the tag workflow succeeds, verify the public release from a clean
checkout with:

```sh
npm run test:release-artifact
npm run test:android-claim -- scoped-folder-access
npm run test:android-claim -- native-refresh-safety
npm run test:android-claim -- consent-removal
npm run test:android-claim -- native-handoff
```

The static site is deployed from the same repair commit. Its install screen
uses the released provenance and will offer the download only when that
commit and payload fingerprint match.

## Known gaps and next steps

There are no known product-code gaps. A physical-device smoke test is still
advisable before Play Store distribution with the owner’s upload key. The
published release uses the documented workflow-generated test key and is for
direct APK distribution, not Play Store submission.
