# Polish round 1 — completed

- **Released candidate reviewed:** `5888fa3ee5647c18f6c4716a3dfa4507bb70128a`
- **Repair commit:** `02f2a795d77c1404ed3783bc994fb7b585c8fae4`
- **Live deployment:** `e2470841-1f66-4333-b929-b9ae35a5806d`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>

Every finding in [review-1.md](review-1.md) is resolved in the shipped product. The last repair makes browser QA repeatable: `npm test` first terminates only a stale Vite preview whose process cwd is this repository and whose command is this product's port-4173 preview; Playwright then owns and closes its own server. A deliberately stranded product-local preview was removed by this command, the targeted claim passed, and port 4173 was closed afterward.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Reset reseeds, rerenders, announces “Sample data was reset,” and restores Reset-demo focus. | `@claim:demo-reset`; live reset check; [mobile screenshot](verification-artifacts/polish-1-retry/live-demo-reset-mobile-390.png). |
| F-1-2 | The landing action opens `/demo` directly with the isolated Field notes mirror and three ready files. | `@claim:demo-ready-sample`; live demo check; [mobile screenshot](verification-artifacts/polish-1-retry/live-demo-reset-mobile-390.png). |
| F-1-3 | Failed-refresh wording is explicitly Android-only and is backed by the transactional native regression. | `@claim:native-refresh-safety`; live landing check. |
| F-1-4 | Removed the untestable multi-device, free-export, and refund promises; price, limits, and hosted checkout remain tested. | `@claim:free-tier`, `@claim:checkout`; live landing check. |
| F-1-5 | README now states the tested supported-browser reload behavior, not unsupported API selection behavior. | `@claim:browser-persistence`; clean-clone README check. |
| F-1-6 | Removed public-release and emulator-process promises that were not independently observable from the visitor README. | clean-clone README check; live `/install` returned 200. |
| F-1-7 | Added a fixture-token test that records the sole Sociobot verification request. | `@claim:license-verification-privacy`; live `/privacy` returned 200. |
| F-1-8 | Removed the information-free hero mood line. | cold live landing check; [first screen](verification-artifacts/polish-1-retry/live-home-mobile-390.png). |
| F-1-9 | Renamed the workflow section “How to keep a folder ready offline.” | full browser accessibility suite; cold live landing check. |
| F-1-10 | Removed the decorative “field check 04” and “advanced field kit” labels. | cold live landing check; copy audit. |
| F-1-11 | Standardized the visible product term as “folder mirror.” | `copy-audit.md`; full browser suite; live demo check. |
| F-1-12 | Replaced ambiguous bridge and handoff controls with “Open folders” and file-specific Preview labels. | `@claim:file-handoff`, `@claim:local-only`; live demo check. |
| F-1-13 | The designed 404 heading is “Page not found.” | route/title test; live [`/missing-page`](https://offline-file-bridge.sociobot.in/missing-page) check; [screenshot](verification-artifacts/polish-1-retry/live-404-mobile-390.png). |
| F-1-14 | Unknown URLs remove their canonical element, while known routes set route-specific canonical metadata. | `known routes have their own canonical URL and an unknown URL has none`; live `/missing-page` check. |

## Verification

- Fresh clone at repair commit: `npm ci` succeeded with 0 vulnerabilities; all **15** exact commands in `claims.json` passed separately.
- Fresh clone aggregate: `npm test` **72/72**, `npm run test:unit` **7/7**, `npm run lint`, `npm run build`, `npm audit --omit=dev`, and `git diff --check` passed. This includes desktop and Pixel 5 tests, offline reload, privacy request interception, demo isolation/reset, keyboard/focus, 200% reflow, route titles/metadata/canonical handling, and Playwright Axe checks for every route.
- Live cold check: `verify-url.sh` passed with 818 ms load, no console errors, correct title/lang/H1/main/alt coverage; evidence is in [live-url](verification-artifacts/polish-1-retry/live-url/verify.json). The direct live mobile test passed demo isolation/reset, no horizontal overflow, zero serious/critical Axe findings on `/demo` and `/missing-page`, and captured the screenshots above.
- Live routes: `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/install` returned 200; `/missing-page` returned 404. CSP, `nosniff`, referrer policy, permissions policy, and HSTS are present.
- Bundle output: 38.32 KB JavaScript (13.53 KB gzip) and 14.18 KB CSS (4.38 KB gzip). Browser tests leave no listener on `127.0.0.1:4173`.

The worker has no Java or Android SDK, so local Gradle/device execution is unavailable. The Android project and release workflow are unchanged; its GitHub Actions workflow remains the mandated APK/AAB build path.
