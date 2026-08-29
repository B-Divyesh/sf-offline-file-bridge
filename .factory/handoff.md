# Offline File Bridge — repair 5 handoff

- **Result:** repaired and ready for release publication
- **Release version:** `0.1.3` (`versionCode 3`)
- **Artifact class:** Android APK with PWA landing/demo
- **Base verifier report:** [verification-5.md](verification-5.md)

## What changed

1. Fixed the root cause of P0: a web candidate now identifies `HEAD` (or the explicit CI SHA), never an older same-version tag. Version `0.1.3` is required for this release.
2. The build now writes a SHA-256 fingerprint over every deployable web file except the self-referential identity record. The Android workflow compares every extracted APK web file to `dist/`, verifies the embedded fingerprint, writes it to `BUILD-PROVENANCE.json`, and publishes the same immutable record in the GitHub Release body.
3. The landing page enables APK download only if the release tag commit and published payload fingerprint exactly equal its local `build-identity.json`. It now says: “This Android release records this site's exact commit and verified payload fingerprint.” It no longer makes the false APK-match statement.
4. Added an exact regression that reproduces verification 5’s failure shape: a right tag/commit paired with a stale payload fingerprint leaves the download disabled. A post-release consumer check downloads the APK, extracts every web file, and compares it to the candidate `dist/` plus published provenance.
5. Restored the Terms disclosure: Sociobot/Dodo Payments is merchant of record; refunds are handled there and automatically revoke the license.
6. The restore form has a visible, persistent **Restore a Bridge Pro license** label. Whitespace-only input now keeps focus in the field and announces: “Enter the license token from your purchase email, then verify it.” No verification request is made.

## Verification evidence

From a clean `npm ci` (149 packages, zero vulnerabilities):

- `npm test` — 76 Playwright tests passed across desktop Chromium and 390px mobile. This covers all browser claims, real/demo flows, keyboard, responsive reflow, privacy request recording, offline reload, service-worker behavior, routing, dark and light axe scans, and the new APK identity, billing legal, and whitespace recovery regressions.
- `npm run test:unit` — 7/7 passed, including native mirror safety, consent removal, chooser handoff, candidate-first identity, version matching, and workflow provenance contract checks.
- `npm run lint` — passed.
- `npm run build` — passed and created `dist/`. Current output is 39.67 KB JS (14.00 KB gzip) and 14.43 KB CSS (4.45 KB gzip).
- `npm audit --omit=dev` — zero vulnerabilities.
- `npx cap sync android` — passed; it copied the exact `dist/` payload into Capacitor’s Android assets.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174/ .factory/evidence/repair-5/local-verify` — passed: HTTP 200, title, `lang=en`, one main, one H1, all image alt text, and no console errors. Evidence is in [local-verify](evidence/repair-5/local-verify/).
- The repository’s Playwright Axe integration passed zero serious/critical findings on `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, and `/missing-page` in both light and dark modes, on desktop and mobile.

`npx @axe-core/cli@4.11.0` was attempted after the URL check but cannot locate a Selenium Chrome binary in this worker. This does not affect the Playwright Axe run, which uses the preinstalled Playwright Chromium and passed the same accessibility scans.

## Android release and deployment procedure

The worker has no Java/JDK (`npm run test:android` fails before Gradle with `JAVA_HOME is not set`), so it cannot build an Android package locally. This product’s required Android build path is the checked-in GitHub Actions workflow.

After the `v0.1.3` tag is pushed, `.github/workflows/android.yml` will:

1. build the candidate web payload and run Capacitor sync;
2. run Android 36 installed-APK instrumentation and Gradle unit tests;
3. build APK and AAB;
4. extract and byte-compare the APK web payload with `dist/`, then emit `BUILD-PROVENANCE.json` with commit and payload fingerprint;
5. attach the APK, AAB, provenance, and `SHA256SUMS` to GitHub Release `v0.1.3`.

Run `npm run test:release-artifact` after the release is public. It fetches the public APK and provenance, extracts the APK, compares every web file with a clean local candidate build, and checks every published provenance field. Its passing output is the final consumer proof for `@claim:apk-payload-match`.

Pushing `main` is the configured static deployment trigger. The post-deploy live check must confirm the site has the new build identity, leaves download disabled until the `v0.1.3` release is present, then enables it only with the matching release record.

## Known gap

No local Java/Android SDK is present. The GitHub Actions run is therefore the authoritative Android Gradle, installed-APK, APK/AAB, and extraction verification. No product behavior is knowingly deferred.
