# Polish round 4 — complete finding ledger

Candidate release: `v0.1.11` · live site:
<https://offline-file-bridge.sociobot.in>

The notebook visual system, isolated demo, routes, and accessibility structure
are retained. Each row maps the cumulative review finding to the product change
and its repeatable evidence. Local visual records are in
`evidence/polish-4/`; live checks use the URL in the last column.

| Finding | Change made | Evidence | Live check |
| --- | --- | --- | --- |
| F-1-1 | Reset reseeds, rerenders, announces success, and restores button focus. | `@claim:demo-reset`; `demo-mobile.png` | `/demo` |
| F-1-2 | First-screen action opens the isolated ready Field notes sample with three files. | `@claim:demo-ready-sample`; `demo-mobile.png` | `/demo` |
| F-1-3 | Failed-refresh wording is Android-specific. | `@claim:native-refresh-safety` | `/` |
| F-1-4 | USD 14.00 / 1400 cents and one-time mode are read from a non-spending hosted checkout. | `@claim:free-tier`; `home-desktop.png` | `/`, `/terms` |
| F-1-5 | README limits browser wording to tested reload persistence. | `@claim:browser-persistence` | `/app` |
| F-1-6 | Untested visitor release-process promises remain removed. | README copy audit | `/install` |
| F-1-7 | Fixture-token test records the Sociobot-only verification request. | `@claim:license-verification-privacy` | `/privacy` |
| F-1-8 | Removed the information-free hero mood line. | copy audit; `home-desktop.png` | `/` |
| F-1-9 | Uses the functional workflow heading. | route heading test; `home-desktop.png` | `/` |
| F-1-10 | Removed invented notebook labels from visitor copy. | copy audit; `home-desktop.png` | `/` |
| F-1-11 | `/app` metadata and demo instructions now say `folder mirror`; a source and rendered check guard it. | `copy-contract.test.ts`; site metadata test | `/app`, `/demo` |
| F-1-12 | Folder and file actions name their outcome. | `@claim:file-handoff`; `demo-mobile.png` | `/demo` |
| F-1-13 | The designed 404 h1 is `Page not found`. | route test; `404-mobile.png` | `/missing-page` |
| F-1-14 | Unknown routes have no canonical element. | canonical route test; `404-mobile.png` | `/missing-page` |
| F-2-1 | Untested Play-store, signing, PWA, and AAB visitor assertions remain removed. | README/install copy audit | `/install` |
| F-2-2 | Removed internal signing jargon from install copy. | README/install copy audit | `/install` |
| F-3-1 | Candidate-bound release runs the installed picker and permission test. | `npm run test:android-claim -- scoped-folder-access` | release `v0.1.11` |
| F-3-2 | Candidate-bound release runs the staged-failure mirror test. | `npm run test:android-claim -- native-refresh-safety` | release `v0.1.11` |
| F-3-3 | Candidate-bound release runs the private-file deletion and access-release test. | `npm run test:android-claim -- consent-removal` | release `v0.1.11` |
| F-3-4 | Candidate-bound release runs the chooser, URI, MIME, and grant test. | `npm run test:android-claim -- native-handoff` | release `v0.1.11` |
| F-3-5 | APK starts as `Check latest APK` and becomes a download only after identity checks. | `@claim:apk-payload-match`; `home-desktop.png` | `/` |
| F-3-6 | Checkout copy says Sociobot checkout and marks the external destination. | `@claim:checkout` | `/`, `/terms` |
| F-3-7 | README names Android's folder picker in plain words. | README copy audit; `@claim:scoped-folder-access` | `/` |
| F-3-8 | README names Android's app chooser in plain words. | README copy audit; `@claim:native-handoff` | `/install` |
| F-3-9 | Terms h1 names the product. | route test | `/terms` |
| F-4-1 | Browser removal and browser-site-data clearing now have separate observable claims; Android copy is limited to its removal claim. | `@claim:browser-mirror-removal`, `@claim:browser-storage-clearing`, `@claim:consent-removal`; `privacy-desktop.png` | `/privacy` |
| F-4-2 | README test instructions now explain the checked outcome without internal jargon. | README copy audit | `/` |

## Required quality evidence

- `npm run lint`, `npm run test:unit`, `npm test`, and `npm run build` run
  locally from the pinned lockfile.
- All claim commands run separately from a clean clone; the Android and public
  APK checks passed after release `v0.1.11` published its candidate-bound
  evidence. The clean-clone run had 16 unit tests and 80 browser tests pass.
- Cold route checks cover `/`, `/demo`, `/app`, `/privacy`, `/terms`,
  `/install`, and a designed 404. Axe scans passed with zero serious or
  critical issues across both color schemes; the live Lighthouse audit scored
  100/100/100/100 (performance/accessibility/best practices/SEO).

## Final release evidence

- Candidate commit: `303a4bf5045199e954805b89c7bb8af80d03f442`; tag:
  [`v0.1.11`](https://github.com/B-Divyesh/sf-offline-file-bridge/releases/tag/v0.1.11).
- Android workflow:
  [33268257935](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33268257935),
  successful with installed-APK instrumentation and Gradle unit tests.
- Static deployment: `c2265d87-47e1-4bf7-aac7-489461dcae80`; live identity
  matches the candidate commit and payload fingerprint.
- Final cold live check: one-click demo, `?demo=1`, reset, isolation, offline
  reload, privacy wording, metadata, titles, APK provenance, and 404 all pass.
