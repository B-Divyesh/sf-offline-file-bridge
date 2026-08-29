# Polish round 3 — completed

- **Reviewed candidate:** `03b92280012a638b912a3a54751b0227c980ca54`
- **Repair commit:** `85e25facf1ababf7d6ad0bc4f0a9f0be9f77b9a0`
- **Android release:** [`v0.1.9`](https://github.com/B-Divyesh/sf-offline-file-bridge/releases/tag/v0.1.9)
- **Deployment:** `https://offline-file-bridge.sociobot.in/`
- **Live build identity:** `85e25facf1ababf7d6ad0bc4f0a9f0be9f77b9a0`, payload SHA-256 `b51748856622c5b68c610fd78047c4a475dd434ef370df52b6c41777da358263`

Every finding from `review-1.md`, `review-2.md`, and `review-3.md` is closed. The field-notebook visual system remains unchanged.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Reset re-seeds, re-renders, announces the result, and retains Reset focus. | `@claim:demo-reset`; [live reset](evidence/polish-3/live-demo-reset-mobile-390.png). |
| F-1-2 | The first-screen action opens the isolated ready *Field notes* sample with three files. | `@claim:demo-ready-sample`; [live demo check](evidence/polish-3/live-browser-check.json). |
| F-1-3 | Failed-refresh copy is Android-specific and the installed APK preserves a ready folder mirror after a staged failure. | `@claim:native-refresh-safety`; [GitHub Actions run](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33258293074). |
| F-1-4 | Removed refund, automatic-revocation, multi-device, and free-export promises that cannot be proven in this sandbox. The remaining checkout statement has an outcome test. | `@claim:checkout`; live `/terms` in [browser check](evidence/polish-3/live-browser-check.json). |
| F-1-5 | README describes tested supported-browser reload persistence, not a File System Access API promise. | `@claim:browser-persistence`; clean-clone command passed. |
| F-1-6 | Removed visitor-facing release-process, JDK, emulator, keystore, signing, and upload-key promises. | README audit; live `/install` [check](evidence/polish-3/install/verify.json). |
| F-1-7 | License verification remains limited to Sociobot and has an intercepted fixture-token outcome test. | `@claim:license-verification-privacy`; live `/privacy` [check](evidence/polish-3/privacy/verify.json). |
| F-1-8 | Removed the hero mood line. | Cold live [screenshot](evidence/polish-3/live-home-mobile-390.png). |
| F-1-9 | Kept the functional workflow heading “How to keep a folder ready offline.” | Live `/` [check](evidence/polish-3/home/verify.json). |
| F-1-10 | Kept notebook decoration out of visitor-facing labels. | Copy audit; live `/` [check](evidence/polish-3/home/verify.json). |
| F-1-11 | Replaced every user-facing “local copy” synonym for the folder object with **folder mirror**. | Copy audit; live [browser check](evidence/polish-3/live-browser-check.json). |
| F-1-12 | Kept result-naming folder and file controls, including file-specific Preview actions. | `@claim:file-handoff`; live [demo screenshot](evidence/polish-3/live-demo-reset-mobile-390.png). |
| F-1-13 | Kept “Page not found” as the 404 h1. | Live [404 screenshot](evidence/polish-3/live-404-mobile-390.png). |
| F-1-14 | Kept canonical metadata off unknown routes. | Live 404 route in [browser check](evidence/polish-3/live-browser-check.json). |
| F-2-1 | Removed untestable Play-store, signing, checksum-publication, PWA-readiness, and AAB visitor promises. | `@claim:apk-payload-match`; live APK check in [browser check](evidence/polish-3/live-browser-check.json). |
| F-2-2 | Removed install-page build jargon. | Live `/install` [check](evidence/polish-3/install/verify.json). |
| F-3-1 | `scoped-folder-access` now runs a named installed-release-APK test that launches the picker intent and reads installed package permissions. | Exact command `npm run test:android-claim -- scoped-folder-access`; [GitHub Actions run](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33258293074). |
| F-3-2 | `native-refresh-safety` now runs a named installed-release-APK test that abandons a staged replacement, reads previous bytes, then commits a completed replacement. | Exact command `npm run test:android-claim -- native-refresh-safety`; [GitHub Actions run](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33258293074). |
| F-3-3 | `consent-removal` now runs a named installed-release-APK test that removes private mirror files and exact local consent records. | Exact command `npm run test:android-claim -- consent-removal`; [GitHub Actions run](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33258293074). |
| F-3-4 | `native-handoff` now runs a named installed-release-APK test that creates a ready private file and checks its chooser, URI, MIME type, and read grant. | Exact command `npm run test:android-claim -- native-handoff`; [GitHub Actions run](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33258293074). |
| F-3-5 | Renamed the first APK control to **Check latest APK**; it becomes a versioned download only after identity verification. | `@claim:apk-payload-match`; live [browser check](evidence/polish-3/live-browser-check.json). |
| F-3-6 | Replaced “secure checkout” with “Sociobot checkout (external site).” | `@claim:checkout`; live [browser check](evidence/polish-3/live-browser-check.json). |
| F-3-7 | Rewrote the README folder-picker feature in plain language. | README audit; `@claim:scoped-folder-access`. |
| F-3-8 | Rewrote the README handoff feature in plain language. | README audit; `@claim:native-handoff`. |
| F-3-9 | Changed the Terms h1 to “Terms for Offline File Bridge.” | Live `/terms` [check](evidence/polish-3/terms/verify.json). |

## Verification

- Fresh local clone: `/tmp/offline-file-bridge-clean.1RArmV`; `npm ci` reported zero vulnerabilities, then `npm run lint`, `npm run test:unit` (**8/8**), `npm run build`, all 12 browser claim commands independently, and `npm test` (**74/74**) passed.
- Android claims ran from the GitHub Actions fresh checkout. Each exact command passed against the installed release APK: `scoped-folder-access`, `native-refresh-safety`, `consent-removal`, and `native-handoff`. The workflow also built the APK/AAB and published provenance and checksums.
- `npm run test:release-artifact` passed against public `v0.1.9`; it compared the published APK web payload and provenance with local `dist/`.
- Live cold `verify-url.sh` checks pass for `/`, `/demo`, `/privacy`, `/terms`, and `/install`; each has a title, language, one h1, main landmark, alt coverage, and no console errors. See `evidence/polish-3/*/verify.json`.
- Live mobile route and Axe checks cover `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, and `/missing-page`; there are zero serious or critical violations. The 404 is an intentional HTTP 404 and its main-resource console line is expected. See [live browser check](evidence/polish-3/live-browser-check.json).
- Live demo evidence confirms one-click isolation, banner, reset, direct `?demo=1` reset, no real IndexedDB database, and no foreign requests. Offline reload opens a ready sample file: [offline check](evidence/polish-3/live-offline-check.json), [offline screenshot](evidence/polish-3/live-demo-offline-desktop.png).
- Live mobile Lighthouse: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **1.0 s**, LCP **1.7 s**, CLS **0**. See [report](evidence/polish-3/lighthouse-live.json).

## Result

No review finding remains open. The catalog description is a verb-first, 80-character sentence. The production PWA and public Android release identify the same repair commit.
