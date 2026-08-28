# Offline File Bridge v0.1.1 handoff — PASS

Repair release: `b00b303868da2883be14bcb32601cb473fa69ba4` (plus `383545688cef9869ac11cf9e72fd5bfc58360eaf`) on `main`.
Published Android tag: [`v0.1.1`](https://github.com/B-Divyesh/sf-offline-file-bridge/releases/tag/v0.1.1).
Live site: <https://offline-file-bridge.sociobot.in>.

## Release-blocker repairs

- Published the Android artifact through GitHub Actions. The release contains `offline-file-bridge-v0.1.1.apk`, `offline-file-bridge-v0.1.1.aab`, and `SHA256SUMS`.
- Registered the $14 one-time **Offline File Bridge Pro** product in the Sociobot factory billing registry, with live and test Dodo products. `GET https://api.sociobot.in/api/v1/products/offline-file-bridge/checkout` now returns `303` to a hosted Dodo checkout session.
- Made Android refresh transactional. `OfflineBridgePlugin` copies to an app-private staging directory and commits it only after the full copy succeeds. A failed source read only removes the staging directory; the prior ready mirror remains intact.
- Made Android removal delete the private mirror first, then release the exact stored persisted SAF read grant; an already-revoked Android grant is safely tolerated.
- Repaired `npm run test:unit` by explicitly including Vitest unit tests only, rather than attempting to collect Playwright specs. Added Android JVM tests for atomic mirror behavior and source-level regression checks for staging, SAF revocation, and narrow chooser handoff.
- Updated the Android workflow to execute `./gradlew test` before building artifacts, and to name release files from the pushed tag.

## Verification evidence

Run locally:

```sh
npm ci
npm run test:unit
npm test
npm audit --omit=dev
npm run build
```

Results on 28 August 2026:

- `npm ci`: pass.
- `npm run test:unit`: pass, 3 Vitest native-regression checks.
- `npm test`: pass, 46 Playwright checks in Chromium desktop and Pixel 5 emulation. This covers the 12 claims, demo isolation, offline reload, refresh, download handoff, browser persistence, keyboard navigation, 390px overflow, and desktop/mobile axe serious/critical checks.
- `npm audit --omit=dev`: 0 production vulnerabilities.
- `npm run build`: pass; `dist/` generated. Initial JS is 37.00 KB raw / 13.26 KB gzip and CSS is 13.43 KB raw / 4.25 KB gzip.
- GitHub Action [run 33191438619](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33191438619): pass. It ran Android JVM tests, `assembleRelease`, and `bundleRelease`, then published the assets.
- Released APK: 7,403,321 bytes; SHA-256 `edd01b824744d78e0f8d12a1995fed934c4ff70380f9526f57cbfd871cca1d75`, matching `SHA256SUMS`. `aapt dump badging` confirms app id `in.sociobot.offline_file_bridge`, version `0.1.1`, target SDK 34, and only `INTERNET` plus Android's generated receiver permission.
- Live deployment: Azure Static Web Apps deployment `673c141b-d918-466c-b601-b46acecbb434` succeeded. `/opt/fleet/lib/verify-url.sh` on the live landing page reported a 1,261 ms load, no console errors, one h1/main, `lang=en`, and no images missing `alt`.
- Final live browser smoke: `/`, `/demo`, `/privacy`, `/terms`, and `/install` each had one h1/main, route-correct title, no console errors, and 0 Axe serious/critical findings. At 390px there was no horizontal overflow; `/demo` reloaded offline under its service worker and showed `Offline — ready files still open`.
- Live `/install` at 390px: **Check latest APK** resolves to the v0.1.1 APK URL with no browser console errors. The live checkout endpoint returned `303` to `checkout.dodopayments.com`.

The standalone `@axe-core/cli` Selenium launcher could not start Chrome in this container, even when pointed at the installed Playwright Chromium. The shipped Playwright AxeBuilder checks passed on `/`, `/demo`, `/privacy`, and `/terms` in both desktop and mobile profiles; these are the accessibility results relied on above.

## Product boundaries and known gaps

- Android SAF selection, a deliberately unreadable provider entry, permission removal, and chooser delivery need a final physical-device smoke on supported Android versions before Play Store submission. The APK is a signed-with-generated-debug-keystore direct-test release, not a Play Store upload key.
- The PWA remains fully usable offline after first load. The Android bridge intentionally performs user-requested refreshes only; it does not promise background cloud synchronization.
- No analytics, tracking, third-party runtime fonts, or file-content upload was added. License verification sends only the license token to Sociobot billing.

## References

- Claims: `.factory/claims.json`
- Demo contract: `.factory/demo.md`
- Design/provenance: `.factory/design.md`
- Original independent report: `.factory/verification-1.md`
- Android release workflow: `.github/workflows/android.yml`
