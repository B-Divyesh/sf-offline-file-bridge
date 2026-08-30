# Polish round 6 — complete finding ledger

Product commit: `9d532df0109ff37b34195de6db9628d57c57cd2f` · Android release: [`v0.1.14`](https://github.com/B-Divyesh/sf-offline-file-bridge/releases/tag/v0.1.14) · live site: <https://offline-file-bridge.sociobot.in/>

Every current and earlier finding was rechecked. The common live record is [live-browser-check.json](verification-artifacts/polish-6/live-browser-check.json); Android evidence comes from [workflow run 33281413327](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33281413327).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Reset reseeds, rerenders, announces success, restores the 12-minute state, and returns focus. | `@claim:demo-reset`; [query demo](verification-artifacts/polish-6/live-demo-query-mobile-390.png); live `/?demo=1`. |
| F-1-2 | The first-screen action now opens the isolated `/?demo=1` sample with three ready files. | `@claim:demo-ready-sample`; [query demo](verification-artifacts/polish-6/live-demo-query-mobile-390.png); live `/?demo=1`. |
| F-1-3 | Failed-refresh wording remains Android-specific and matches installed-app behavior. | `@claim:native-refresh-safety`; workflow run; live `/`. |
| F-1-4 | Unsupported refund, device-count, and free-export promises remain absent; exact price, mode, and limits are tested. | `@claim:free-tier`, `@claim:checkout`; [mobile home](verification-artifacts/polish-6/live-home-mobile-390.png); live `/terms`. |
| F-1-5 | README describes tested supported-browser persistence without promising an untested API path. | `@claim:browser-persistence`; live `/app`; [app route record](verification-artifacts/polish-6/live-browser-check.json). |
| F-1-6 | Visitor-facing JDK, signing, emulator, and publication promises remain removed. | Copy audit; [Install check](verification-artifacts/polish-6/live-install/verify.json); live `/install`. |
| F-1-7 | License-token interception proves the only foreign request is the Sociobot verify endpoint. | `@claim:license-verification-privacy`; [Privacy check](verification-artifacts/polish-6/live-privacy/verify.json); live `/privacy`. |
| F-1-8 | The information-free hero mood line remains absent. | Copy audit; [mobile home](verification-artifacts/polish-6/live-home-mobile-390.png); live `/`. |
| F-1-9 | The workflow heading remains “How to keep a folder ready offline.” | Route browser test; [mobile home](verification-artifacts/polish-6/live-home-mobile-390.png); live `/`. |
| F-1-10 | Invented notebook labels remain absent while the visual notebook treatment stays intact. | Copy audit; [mobile home](verification-artifacts/polish-6/live-home-mobile-390.png); live `/`. |
| F-1-11 | **Folder mirror** remains the only term in body copy, metadata, README, and demo instructions. | `copy-contract.test.ts`; metadata browser test; live `/app`. |
| F-1-12 | Folder and file controls name their results, including file-specific Preview actions. | `@claim:file-handoff`; [query demo](verification-artifacts/polish-6/live-demo-query-mobile-390.png); live `/?demo=1`. |
| F-1-13 | The designed 404 h1 remains **Page not found**. | Route browser test; [404 screenshot](verification-artifacts/polish-6/live-404-mobile-390.png); live `/missing-polish-6`. |
| F-1-14 | Unknown routes omit canonical metadata and return a real 404. | Canonical route test; [live route record](verification-artifacts/polish-6/live-browser-check.json); live `/missing-polish-6`. |
| F-2-1 | Untested store, signing, PWA-ready, and AAB visitor assertions remain removed; only a verified APK is offered. | `@claim:apk-payload-match`; [Install check](verification-artifacts/polish-6/live-install/verify.json); live `/install`. |
| F-2-2 | Internal keystore and upload-key jargon remains absent from Install. | Copy audit; [Install check](verification-artifacts/polish-6/live-install/verify.json); live `/install`. |
| F-3-1 | The system-picker/no-broad-permission claim runs on the installed release APK and is bound to its digest. | `@claim:scoped-folder-access`; workflow run; release `v0.1.14`. |
| F-3-2 | The failed-refresh claim stages a failed replacement and reads the preserved ready bytes. | `@claim:native-refresh-safety`; workflow run; release `v0.1.14`. |
| F-3-3 | The removal claim deletes private files and its saved folder-access record. | `@claim:consent-removal`; workflow run; release `v0.1.14`. |
| F-3-4 | The handoff claim checks the chooser, URI, MIME type, and read grant on the installed app. | `@claim:native-handoff`; workflow run; release `v0.1.14`. |
| F-3-5 | The first control says **Check latest APK** and exposes a versioned download only after identity checks. | `@claim:apk-payload-match`; [live release record](verification-artifacts/polish-6/live-browser-check.json); live `/install`. |
| F-3-6 | Checkout copy names Sociobot and the external destination without “secure.” | `@claim:checkout`; [mobile home](verification-artifacts/polish-6/live-home-mobile-390.png); live `/`. |
| F-3-7 | README uses the plain term “Android's folder picker.” | `@claim:scoped-folder-access`; copy audit; live `/`. |
| F-3-8 | README uses the plain result “Open a ready file in another Android app.” | `@claim:native-handoff`; copy audit; live `/install`. |
| F-3-9 | The Terms h1 remains **Terms for Offline File Bridge**. | Route browser test; [Terms check](verification-artifacts/polish-6/live-terms/verify.json); live `/terms`. |
| F-4-1 | Browser removal, browser-data clearing, and Android removal retain separate outcome claims. | `@claim:browser-mirror-removal`, `@claim:browser-storage-clearing`, `@claim:consent-removal`; live `/privacy`. |
| F-4-2 | README explains checksum and Android result checks in plain words. | `copy-contract.test.ts`; clean-clone unit suite; live `/`. |
| F-5-1 | Picker evidence now belongs to the exact released product source, while later evidence-only records cannot invalidate it. | `@claim:scoped-folder-access`; `post-release evidence cannot hide product or claim changes`; release `v0.1.14`. |
| F-5-2 | Failed-refresh evidence uses the same durable source/release boundary. | `@claim:native-refresh-safety`; release-contract unit test; release `v0.1.14`. |
| F-5-3 | Android removal evidence uses the same durable source/release boundary. | `@claim:consent-removal`; release-contract unit test; release `v0.1.14`. |
| F-5-4 | Android chooser evidence uses the same durable source/release boundary. | `@claim:native-handoff`; release-contract unit test; release `v0.1.14`. |
| F-5-5 | The demo keeps **Field notes** and the complete first filename above the 390 × 844 fold. | `@claim:demo-ready-sample`; [query demo](verification-artifacts/polish-6/live-demo-query-mobile-390.png); live `/?demo=1`. |
| F-5-6 | The one tagged APK test exercises both exact-match enablement and stale-payload rejection. | `@claim:apk-payload-match`; clean-clone claim run; live `/install`. |
| F-6-1 | Release verification accepts only the exact tag or descendants containing evidence files alone; product or claim drift still fails. | `@claim:scoped-folder-access`; `post-release evidence cannot hide product or claim changes`; release `v0.1.14`. |
| F-6-2 | The durable boundary now keeps installed failed-refresh evidence valid after handoff/polish records are committed. | `@claim:native-refresh-safety`; release-contract unit test; release `v0.1.14`. |
| F-6-3 | The durable boundary now keeps installed removal evidence valid after handoff/polish records are committed. | `@claim:consent-removal`; release-contract unit test; release `v0.1.14`. |
| F-6-4 | The durable boundary now keeps installed chooser evidence valid after handoff/polish records are committed. | `@claim:native-handoff`; release-contract unit test; release `v0.1.14`. |

## Final evidence

- Fresh clone: `npm ci`, all 18 literal claim commands, `npm run lint`, `npm run test:unit` (19/19), `npm test` (80/80), `npm run build`, `npm run test:release-artifact`, `npm audit --omit=dev`, and `git diff --check` passed.
- Live routes, titles, h1s, canonicals, focus, legal links, offline behavior, demo isolation/reset/exit, release link, mobile reflow, reduced motion, and Axe results are recorded in [live-browser-check.json](verification-artifacts/polish-6/live-browser-check.json).
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; see [lighthouse-live.json](verification-artifacts/polish-6/lighthouse-live.json).
- The distinct graph-paper field notebook, generated bridge art, handwritten type, stamped states, and asymmetric paper cards remain unchanged.
