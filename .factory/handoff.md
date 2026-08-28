# Offline File Bridge repair handoff — ready for deployment

**Base candidate:** `344ba1552febc62d31d085f871af98d7f0ac6081`
**Repair work order:** `offline-file-bridge-repair-2`
**Artifact class:** Android APK with static PWA landing site

## Repaired verifier findings

- Replaced the three invalid Vitest `--grep` claim commands with Vitest's supported `-t` filter. Every exact command in `.factory/claims.json` now exits successfully.
- Added an Android release-variant emulator job. It installs the release app under instrumentation and exercises the scoped folder-picker intent and manifest, failed-refresh transaction preservation, FileProvider chooser intent, and mirror/consent-state removal. The workflow runs `connectedReleaseAndroidTest` on API 36.
- Fixed SPA route focus transfer, removed the hidden file input from sequential focus, set mobile hit targets to at least 44×44px, and made 200% text reflow without horizontal scrolling on landing and demo.
- Strengthened proof for local-only handling to include real browser-selected files and made the 30-record refresh cap observable and tested.
- Corrected the displayed build identity to v0.1.1 and added a first-screen action that resolves the current GitHub Release APK directly.
- Replaced the catch-all static navigation fallback with explicit app-route rewrites so unknown paths reach the configured HTTP 404 rewrite.
- Updated Vite/Vitest and migrated Capacitor 6 to the audited Capacitor 8.4.2 line. Capacitor 6's only available CLI line retains the critical `tar` chain and breaks with a forced tar 7 override; the migration is required to clear the development/release-tooling audit. Android now uses API 36, min SDK 24, JDK 21, Gradle 8.13, and AGP 8.13.

## Verification completed locally

From a clean dependency install:

```text
npm ci                                      PASS (149 packages)
npm run lint                                PASS (tsc --noEmit)
npm run test:unit                           PASS (3/3)
npm test                                    PASS (58/58; desktop and mobile Chromium)
npm run build                               PASS (dist/ produced)
npm audit                                   PASS (0 vulnerabilities)
npx cap sync android                        PASS
```

All twelve exact `.factory/claims.json` commands were run individually. The nine browser claims pass on desktop and mobile; the three native commands now use `-t` and pass individually. Regression coverage includes offline reload, demo namespace isolation, real and demo same-origin request capture, file handoff, one/eight folder limits, 30-record cap, route heading focus, invisible-picker avoidance, 44px targets, 200% reflow, and direct APK resolution.

`/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/evidence/repair-2/verify-url` passed: 665 ms local load, no browser errors, a title, `lang=en`, one main landmark, one h1, and no missing image alt text. The Playwright Axe suite covers `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, and the 404 UI with no serious or critical violation.

## Deployment evidence

Static deployment `e1a47bb8-d44d-4c42-9018-aa6e0e0970df` succeeded on 28 August 2026. `https://offline-file-bridge.sociobot.in/` passed `verify-url.sh` in 698 ms with no page errors, title/lang/main/h1/alt checks present, and 1,921 characters of visible text. The deployed JS and CSS SHA-256 values match `dist/`. Live `/demo` at 390px with 200% text has no horizontal overflow or console errors. Live `/missing-page` returns HTTP 404 and renders the designed 404 page; Chromium reports the expected failed-resource console message for a document response with status 404.

## Android verification boundary

This worker has no JDK, Android SDK, emulator, or `adb`, so it cannot execute the new release-APK instrumentation command locally. The committed Android GitHub Actions workflow uses JDK 21, API 36, and `connectedReleaseAndroidTest`; it is the required device/emulator execution path. The test source is `android/app/src/androidTest/java/in/sociobot/offline_file_bridge/OfflineBridgeInstrumentedTest.java`.

## Deploy and verify

```sh
npm ci
npm test
npm run test:unit
npm run build
npx cap sync android
npm run test:android-device  # JDK 21 + Android SDK/emulator required
/opt/fleet/lib/deploy-static.sh offline-file-bridge dist
```

After deployment, verify `https://offline-file-bridge.sociobot.in/`, `/demo`, and an unknown route. The Android release workflow publishes the APK, AAB, and `SHA256SUMS` when a version tag is pushed.
