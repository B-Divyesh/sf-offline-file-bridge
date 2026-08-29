# Adversarial first-read review 5

- **Product:** Offline File Bridge
- **Reviewed:** 29 August 2026 UTC
- **Live URL:** <https://offline-file-bridge.sociobot.in>
- **Repository candidate:** `eada27e9a014159013c4e8161fa3e8f1ee29b882`
- **Live product commit:** `0a87d5e1276a6ec24e25751b1882885e6c772f55` (`v0.1.12`)
- **Verdict:** **FAIL**

The landing page explains the product within one screen, and the demo is isolated and functional. This round still fails. Four exact Android claim commands reject the reviewed commit, one declared claim omits its required negative case, and the 390 px demo keeps every realistic sample name below the first viewport. PASS requires zero findings and no failed or incomplete claim test.

## Cold first read

Fresh Chromium contexts opened the live home page at 390 × 844 and 1440 × 1000. Nothing was scrolled before this check.

- **What it does:** It keeps an approved folder ready offline and lets an Android user open its files in another app.
- **For whom:** Android users who need cloud files in another app when their network disappears.
- **What to click first:** **Try it with sample data**. The adjacent result says, “A ready folder opens. Nothing is saved.”

The exact headline is “Keep approved folders ready offline.” The exact audience sentence is “For Android users who need cloud files in another app when the network disappears.” Both viewports show the primary action and its result before scrolling. The 390 px page has no horizontal overflow. Both cold loads returned 200, made only same-origin requests, and logged no console or page errors. The first-read check passes.

## Findings

### Blocking

#### F-5-1 — Scoped-folder claim rejects the reviewed candidate (recurrence of F-3-1)

- **Exact quote / location:** Landing: “Android asks which folder this app may read. No broad storage permission is requested.” Claim `scoped-folder-access` runs `npm run test:android-claim -- scoped-folder-access`.
- **Evidence:** The exact command fails from the clean clone: “Release tag v0.1.12 resolves to `0a87d5e1276a6ec24e25751b1882885e6c772f55`, not candidate `eada27e9a014159013c4e8161fa3e8f1ee29b882`.”
- **Why:** The claims contract makes a failed listed test blocking. The installed-APK result is bound to a different commit, even though the intervening repository changes are documentation and evidence files.
- **Concrete fix:** Publish a release and `ANDROID-CLAIMS.json` bound to the exact accepted candidate, then make this literal command pass against the released APK digest, payload fingerprint, and named Android 35 picker/permission test.

#### F-5-2 — Failed-refresh claim rejects the reviewed candidate (recurrence of F-3-2)

- **Exact quote / location:** Landing: “A failed Android refresh keeps that date” and “After a failed Android refresh, it keeps the last ready time.” Claim `native-refresh-safety` runs `npm run test:android-claim -- native-refresh-safety`.
- **Evidence:** The command fails with the same `v0.1.12` commit mismatch: `0a87d5e…` versus `eada27e…`.
- **Why:** No passing exact test binds the staged-failure result to this reviewed commit.
- **Concrete fix:** Publish candidate-bound installed-release evidence for the failed-refresh test and make the declared command pass from a clean checkout.

#### F-5-3 — Android removal claim rejects the reviewed candidate (recurrence of F-3-3)

- **Exact quote / location:** Landing: “On Android, you can remove a folder mirror at any time.” Privacy: “On Android, remove a folder mirror to delete its private files and release folder access.” Claim `consent-removal` runs `npm run test:android-claim -- consent-removal`.
- **Evidence:** The command fails before accepting the published removal result because the release tag names `0a87d5e…`, not `eada27e…`.
- **Why:** The current candidate has no accepted installed-APK proof for deletion of the private mirror and release of folder access.
- **Concrete fix:** Publish the exact candidate’s APK and named removal evidence, then rerun the declared command successfully.

#### F-5-4 — Android app-chooser claim rejects the reviewed candidate (recurrence of F-3-4)

- **Exact quote / location:** Landing: “Pick the local app that should receive the file, even while offline.” README: “It opens a ready file in Android’s app chooser.” Claim `native-handoff` runs `npm run test:android-claim -- native-handoff`.
- **Evidence:** The command fails with the same release/candidate mismatch.
- **Why:** This candidate has no accepted installed-release result for the chooser intent, content URI, MIME type, and read grant.
- **Concrete fix:** Bind the named chooser result and APK digest to the exact accepted candidate and make the literal claim command pass.

#### F-5-5 — The mobile demo’s first screen does not show realistic sample data

- **Exact quote / location:** Landing action note: “A ready folder opens.” On `/demo` at 390 × 844, the first viewport shows “1 folder mirror,” “3 ready files,” and “280.0 KB,” but no sample folder or filename. **Field notes** begins at y=944 and `ridge-route.pdf` begins at y=1164, below the 844 px viewport.
- **Why:** The required first screen after one click must already show the product in use with realistic sample data. Generic counts do not identify the sample or show a file a visitor can try. Desktop passes; phone visitors must scroll before they can see that the sample exists.
- **Concrete fix:** On 390 px screens, place the **Field notes** card and at least one named file above the fold. Compact the demo banner/header and summary or move the sample card ahead of the summary. Extend `@claim:demo-ready-sample` with 390 × 844 bounding-box assertions that the folder name and first filename are inside the initial viewport without scrolling.

#### F-5-6 — The exact APK claim command omits its required stale-payload case

- **Exact quote / location:** Claim `apk-payload-match`: “The Android download is offered only when its published release record has this site’s exact commit and verified payload fingerprint.” Its sandbox requires an exact record and “a matching-tag stale payload fingerprint” that leaves the download disabled.
- **Evidence:** `npm test -- --grep @claim:apk-payload-match --list` selects only `tests/site.spec.ts:114`, whose body exercises the positive exact-match record. The stale-payload scenario is a separate untagged test at `tests/site.spec.ts:139`, so the literal command declared in `claims.json` does not run it.
- **Why:** A passing positive case cannot prove “only when.” The exact claim command can pass even if a matching tag with a stale payload enables a download.
- **Concrete fix:** Move the stale-payload setup and disabled-download assertion into the single tagged `@claim:apk-payload-match` test. Keep the exact-match enable assertion in that same test, then confirm the literal `claims.json` command exercises both branches.

No minor findings are recorded; the six blocking findings are sufficient for FAIL.

## Copy audit

Counts treat contractions, hyphenated terms, versions, file names, paths, URLs, and commands as one word. Punctuation-only arrows and separators are not words. Repeated header/footer labels are listed once and marked. No landing or README sentence exceeds 22 words. No banned marketing adjective, unexplained user-facing implementation jargon, inconsistent product term, metaphor heading, or non-result button label was found. F-5-1 through F-5-4 identify failed evidence, F-5-5 identifies layout, and F-5-6 identifies incomplete claim coverage rather than unclear wording.

### Landing page

| Exact copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Clear action |
| Offline File Bridge | 3 | Product label |
| Demo / Open folders / Install / Privacy | 1 / 2 / 1 / 1 | Clear navigation; Privacy repeats in footer |
| Keep approved folders ready offline | 5 | Clear h1 |
| For Android users who need cloud files in another app when the network disappears. | 14 | Clear audience and situation |
| Try it with sample data | 5 | Clear primary action |
| A ready folder opens. | 4 | `demo-ready-sample`; viewport defect is F-5-5 |
| Nothing is saved. | 3 | `demo-sandbox` |
| One folder is free. | 4 | `free-tier` |
| Files stay on your device. | 5 | `local-only` |
| Works after the first visit. | 5 | `offline-reload` |
| Check latest APK / Install steps | 3 / 2 | Clear actions |
| A paper folder crosses a small bridge into a phone-shaped tray. | 11 | Informative image alt |
| approved folder → folder mirror → another app | 6 | Clear diagram caption |
| See what is ready before you leave | 7 | Section names the readiness preview |
| Every folder mirror shows its last successful refresh. | 8 | `freshness` |
| A failed Android refresh keeps that date. | 7 | `native-refresh-safety`; F-5-2 |
| Open the working sample | 4 | Clear action |
| Field notes | 2 | Realistic sample name |
| OpenCloud / Research · 3 files · 280.0 KB | 6 | Sample metadata |
| Ready · synced 12 min ago | 5 | Sample state |
| ridge-route.pdf / 277.3 KB / Ready | 1 / 2 / 1 | Sample file data |
| specimen-log.csv / 1.8 KB / Ready | 1 / 2 / 1 | Sample file data |
| Open sample | 2 | Clear action |
| How to keep a folder ready offline | 7 | Clear workflow heading |
| Choose a folder | 3 | Clear step heading |
| Android asks which folder this app may read. | 8 | `scoped-folder-access`; F-5-1 |
| No broad storage permission is requested. | 6 | `scoped-folder-access`; F-5-1 |
| Refresh the folder mirror | 4 | Clear step heading |
| The folder mirror records its successful refresh time, file count, and storage size. | 13 | `freshness` |
| Open a ready file | 4 | Clear step heading |
| Pick the local app that should receive the file, even while offline. | 12 | `offline-reload`, `file-handoff`, `native-handoff`; F-5-4 |
| Your folder stays under your control | 6 | Clear permissions section heading |
| You approve each source folder. | 5 | `scoped-folder-access`; F-5-1 |
| Folder mirror files stay in app storage. | 7 | `local-only` |
| On Android, you can remove a folder mirror at any time. | 11 | `consent-removal`; F-5-3 |
| What it does not do | 5 | Clear scope heading |
| It does not replace your storage service. | 7 | Clear product boundary |
| It does not crawl unapproved folders. | 6 | `scoped-folder-access`; F-5-1 |
| After a failed Android refresh, it keeps the last ready time. | 11 | `native-refresh-safety`; F-5-2 |
| Read the privacy note | 4 | Clear action |
| $14 / one-time purchase | 1 / 2 | `free-tier` |
| Keep more folder mirrors | 4 | Clear pricing heading |
| Bridge Pro adds up to eight folder mirrors and keeps 30 refresh records per folder. | 15 | `free-tier` |
| The free version keeps one folder mirror. | 7 | `free-tier` |
| Buy Bridge Pro / at the Sociobot checkout (external site) | 3 / 6 | `checkout` and clear destination |
| Restore a Bridge Pro license / Paste your license token / Verify license | 5 / 4 / 2 | Clear form label, placeholder, and action |
| Paste the token from your purchase email. | 7 | Useful form help |
| Spaces alone are not a token. | 6 | Useful validation rule |
| This Android release records this site’s exact commit and verified payload fingerprint. | 12 | `apk-payload-match` |
| Download APK v0.1.12 / Download SHA256SUMS | 3 / 2 | Clear verified-result actions |
| APK v0.1.12 is being published | 5 | Tested release-mismatch state |
| A matching APK is not ready yet. / Check again later. | 7 / 3 | Tested recovery state |
| This license is no longer active. / Buy a new license or restore another. | 6 / 7 | Clear license recovery state |
| Bridge Pro is active on this device. | 7 | Clear license state |
| Enter the license token from your purchase email, then verify it. | 11 | Clear validation recovery |
| That license is not active. / Check the token and try again. | 5 / 6 | Clear verification recovery |
| Keep approved folders ready offline. | 5 | Footer summary |
| Terms / Built by Param Factory / (external site) | 1 / 4 / 2 | Clear footer labels |
| v0.1.12 · Generated artwork | 3 | Version and provenance label |

### README

| Exact copy | Words | Result |
| --- | ---: | --- |
| Offline File Bridge | 3 | Clear title |
| Keep an approved folder ready offline, see when it last refreshed, and open its files in another Android app. | 19 | `freshness`, `native-handoff`; F-5-4 affects the latter test |
| Offline File Bridge is for Android users who need a cloud file in another local app. | 16 | Clear audience |
| It copies files from an approved folder into a folder mirror. | 11 | `scoped-folder-access`, `local-only` |
| Live site / One-click demo / What v1 includes | 2 / 2 / 3 | Clear labels and heading |
| Android’s folder picker remembers read access only for folders you approve | 11 | `scoped-folder-access`; F-5-1 |
| Folder mirrors stored on the device | 6 | `local-only` |
| Visible file counts, storage sizes, and last successful refresh times | 10 | `freshness` |
| Open a ready file in another Android app | 8 | `native-handoff`; F-5-4 |
| In supported browsers, selected folder files stay available after reload | 10 | `browser-persistence` |
| A separate, resettable sample-data sandbox | 5 | `demo-sandbox`, `demo-reset` |
| A free one-folder-mirror tier and a $14 Bridge Pro license for up to eight folder mirrors | 16 | `free-tier` |
| The product does not replace a cloud provider or crawl unapproved folders. | 12 | Clear boundary / `scoped-folder-access` |
| Run locally / Test and build / Android project / Privacy and licenses | 2 / 3 / 2 / 3 | Clear headings |
| Requirements: Node.js 20 or newer. | 5 | Clear prerequisite |
| Open `http://localhost:5173/` or go straight to `http://localhost:5173/demo`. | 7 | Clear instruction |
| The production command is `npm run build`. | 7 | Clear build instruction |
| It writes the static site to `dist/`. | 7 | Clear build result |
| The root file is `dist/index.html`. | 5 | Clear build result |
| `npm test` runs browser claims on desktop and mobile Chromium. | 10 | Clear test scope |
| It removes only this repository’s stale preview process. | 8 | Specific safety behavior |
| Playwright starts and closes its server. | 6 | Specific test behavior |
| `npm run test:unit` checks release metadata and Android source safeguards. | 10 | Clear developer instruction |
| Android outcome claims run against an installed release APK in the release workflow. | 13 | Clear intended scope; F-5-1 through F-5-4 fail at the candidate boundary |
| A clean checkout checks the app file’s checksum and the published Android test result. | 14 | Clear intended outcome; contradicted for this candidate by F-5-1 through F-5-4 |
| Run one with `npm run test:android-claim -- <claim-id>`. | 7 | Clear command |
| Run one claim with: | 4 | Clear instruction |
| The Capacitor 8 project lives in `android/` with app id `in.sociobot.offline_file_bridge`. | 11 | Developer detail in the Android section |
| The Android plugin opens the approved-folder picker. | 7 | `scoped-folder-access`; F-5-1 |
| It copies selected files into private app storage. | 8 | `local-only` |
| It opens a ready file in Android’s app chooser. | 9 | `native-handoff`; F-5-4 |
| Real browser mirrors use the `offline-file-bridge-real` IndexedDB database. | 8 | Exact storage disclosure |
| Demo state uses only the `demo:offline-file-bridge` localStorage key. | 8 | `demo-sandbox` |
| The app sends no file contents to a server. | 9 | `local-only` |
| License verification sends a token only to the Sociobot billing API. | 11 | `license-verification-privacy` |
| See Privacy, Terms, and demo details. | 6 | Clear pointers |
| Source code is available under the MIT License. | 8 | Repository fact confirmed |
| Generated visual assets and their prompts are documented in `.factory/design.md`. | 10 | Repository fact confirmed |

The shell command blocks are executable instructions rather than sentences; they were run where relevant. The terminology is consistent: approved offline object → **folder mirror**; operation → **refresh**; completed state → **ready**; paid tier → **Bridge Pro**; sample inspection → **preview**. No unlisted claim-like sentence was found on the landing page, README, Privacy, Terms, or Install page. The six findings concern failed or incomplete listed evidence and the required first-viewport demo presentation.

## Demo and sandbox behavior

- One click reaches `/demo`. Desktop immediately shows **Field notes** and named sample files. F-5-5 records the mobile first-viewport failure.
- The persistent banner says **Demo — sample data, nothing is saved** and provides **Reset demo** and **Start for real**.
- The seed contains **Field notes**, `ridge-route.pdf`, `specimen-log.csv`, and `handoff-notes.md`. Preview and the named download work.
- Refresh changes the visible state to **synced just now**. Reset restores **synced 12 min ago**, removes the new state, announces **Sample data was reset**, and restores focus to Reset.
- A real browser mirror with two files and a `real:review-5-sentinel` value was created before demo entry. Demo mode did not display it, change it, or delete it. During demo, only `demo:offline-file-bridge` changed. **Start for real** deleted the demo key and restored the unchanged real mirror view.
- After the first visit, an offline reload retained all three sample files and previewed `ridge-route.pdf`.
- Cold, demo, refresh, reset, preview, exit, and offline flows logged no application error. The demo/offline flows made no foreign request.

## Claims audit

The repository was cloned without local hard links to `/tmp/offline-file-bridge-review5.oY25fH/clean`. `npm ci` installed the pinned dependencies with zero vulnerabilities. Every literal `test` command in `.factory/claims.json` was run separately from that clean clone.

| Claim | Exact command result | Evidence assessment |
| --- | --- | --- |
| `apk-payload-match` | Command PASS, coverage **FAIL** | Exact record is exercised; the required stale record is outside the tagged command — F-5-6 |
| `offline-reload` | PASS | Offline reload and sample preview exercised |
| `demo-sandbox` | PASS | Demo namespace and absent real database asserted in a clean context |
| `demo-ready-sample` | PASS | Seed and three files asserted in the DOM; missing first-viewport assertion is F-5-5 |
| `demo-reset` | PASS | Refresh then reset without reload asserted |
| `local-only` | PASS | Demo and selected-file request logs asserted |
| `freshness` | PASS | Ready time, count, and size asserted |
| `file-handoff` | PASS | Preview and named download asserted |
| `scoped-folder-access` | **FAIL** | Release commit differs from candidate — F-5-1 / recurrence F-3-1 |
| `free-tier` | PASS | One/eight limits, 30 records, USD 14.00, 1400 cents, and one-time checkout copy asserted |
| `browser-persistence` | PASS | Two selected files survive reload |
| `browser-mirror-removal` | PASS | Saved browser mirror records are deleted |
| `browser-storage-clearing` | PASS | Clearing origin storage removes the browser database |
| `native-refresh-safety` | **FAIL** | Release commit differs from candidate — F-5-2 / recurrence F-3-2 |
| `license-verification-privacy` | PASS | Sole foreign request is the documented Sociobot endpoint |
| `checkout` | PASS | Endpoint redirects to a hosted Dodo checkout |
| `consent-removal` | **FAIL** | Release commit differs from candidate — F-5-3 / recurrence F-3-3 |
| `native-handoff` | **FAIL** | Release commit differs from candidate — F-5-4 / recurrence F-3-4 |

Result: **14/18 claim commands exit successfully; 4/18 fail, and one of the 14 passing commands has incomplete coverage**. Therefore only 13 of 18 claims have adequate passing evidence. `npm run test:release-artifact` independently fails on the same `0a87d5e…` versus `eada27e…` mismatch. The general clean-clone gates still pass: `npm run lint`, `npm run test:unit`, `npm test`, and `npm run build`. The build produces `dist/`; JavaScript is 39.20 KB raw and 13.71 KB gzip.

## Structure, links, accessibility, and visual identity

| Route | Status | Title | H1 | Result |
| --- | ---: | --- | --- | --- |
| `/` | 200 | Offline File Bridge — keep folders ready offline | Keep approved folders ready offline | Pass |
| `/demo` | 200 | Demo — Offline File Bridge | Open your offline folders | Pass; F-5-5 is a viewport-order defect |
| `/app` | 200 | Folder mirrors — Offline File Bridge | Open your offline folders | Pass |
| `/privacy` | 200 | Privacy — Offline File Bridge | Your files stay on your device | Pass |
| `/terms` | 200 | Terms — Offline File Bridge | Terms for Offline File Bridge | Pass |
| `/install` | 200 | Install — Offline File Bridge | Install Offline File Bridge | Pass |
| unknown route | 404 | Page not found — Offline File Bridge | Page not found | Pass |

- Every route has `lang="en"`, one h1, one main landmark, ordered headings, a route-specific description, favicon, apple-touch icon, Open Graph data, Twitter card data, and consistent header/footer links. Known routes have their own canonical URL; the 404 has none.
- The Open Graph image is 1200 × 630, the apple-touch icon is 180 × 180, and all product assets are first-party.
- `robots.txt`, `sitemap.xml`, the manifest, icons, artwork, and all six public routes return 200. Every discovered site link resolves: internal routes, Param Factory, hosted checkout, APK, and checksum return 200 after redirects; `mailto:` links are explicit.
- The unknown route returns a designed 404 with **Page not found** and **Return home**. Its skip link targets the current page’s real `#main` landmark.
- A deep link to `/privacy` loads the correct route. In-app navigation and Back reset scroll, update title, move focus to the destination h1, and update the polite announcer.
- `/opt/fleet/lib/verify-url.sh` passes. Playwright Axe reports zero violations on all seven checked routes at 390 px in both light and dark themes. Keyboard, focus, 44 px targets, 200% reflow, and reduced-motion coverage also pass in the repository suite.
- The live response sends CSP, HSTS, `nosniff`, referrer policy, and permissions policy headers. No CSP or application console error was observed.
- The graph-paper field notebook, original folder/bridge art, handwritten display type, stamped states, asymmetric paper cards, and restrained ink-trace motion match `.factory/design.md`. The site is visually specific to this product, not a generic SaaS template.

## Earlier-review history

Every earlier finding was checked against the current code and live product rather than accepted from its polish status.

| Earlier finding | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 Demo Reset display | Live Reset rerenders the seed, announces success, removes the refreshed time, and restores focus. | Fixed |
| F-1-2 Ready demo promise | The listed claim now proves that the seed and three ready files load in one click. | Fixed; the distinct first-viewport presentation defect is F-5-5 |
| F-1-3 Failed-refresh scope | Landing copy remains explicitly Android-specific. | Fixed as copy; F-5-2 blocks its evidence |
| F-1-4 Paid promises | Unsupported refund/device/export claims remain absent; live non-spending checkout inspection verifies USD 14.00 and one-time wording. | Fixed |
| F-1-5 Browser API wording | README states only the tested supported-browser reload persistence. | Fixed |
| F-1-6 Release-process promises | Visitor-facing JDK, signing, emulator, and publication promises remain absent. | Fixed |
| F-1-7 License privacy | Fixture-token interception proves the only foreign request is the Sociobot verify endpoint. | Fixed |
| F-1-8 Hero mood line | Removed. | Fixed |
| F-1-9 Metaphoric workflow heading | Live heading remains “How to keep a folder ready offline.” | Fixed |
| F-1-10 Decorative notebook labels | “field check” and “advanced field kit” remain absent. | Fixed |
| F-1-11 Folder terminology | Landing, `/app` metadata, README, and `.factory/demo.md` consistently use **folder mirror**. | Fixed |
| F-1-12 Ambiguous controls | Controls use Open folders, Check latest APK, file-specific Preview, and Refresh folder mirror. | Fixed |
| F-1-13 404 h1 | Live h1 is “Page not found.” | Fixed |
| F-1-14 404 canonical | Unknown routes have no canonical element. | Fixed |
| F-2-1 Install/release assertions | Play-store, signing, PWA-ready, and AAB assertions remain absent; dynamic APK and checksum links resolve. | Fixed |
| F-2-2 Install jargon | Debug-keystore and upload-key prose remains absent. | Fixed |
| F-3-1 Scoped installed-APK outcome | Exact command rejects the current candidate/tag mismatch. | **Regressed; blocking as F-5-1** |
| F-3-2 Failed-refresh installed-APK outcome | Exact command rejects the current candidate/tag mismatch. | **Regressed; blocking as F-5-2** |
| F-3-3 Removal installed-APK outcome | Exact command rejects the current candidate/tag mismatch. | **Regressed; blocking as F-5-3** |
| F-3-4 Chooser installed-APK outcome | Exact command rejects the current candidate/tag mismatch. | **Regressed; blocking as F-5-4** |
| F-3-5 Download control result | First control says Check latest APK; a successful check produces Download APK v0.1.12. | Fixed |
| F-3-6 “Secure checkout” | Copy names the Sociobot checkout and external destination without “secure.” | Fixed |
| F-3-7 Storage Access Framework jargon | README uses “Android’s folder picker.” | Fixed |
| F-3-8 FileProvider jargon | README uses “Android’s app chooser.” | Fixed |
| F-3-9 Terms h1 | Live h1 is “Terms for Offline File Bridge.” | Fixed |
| F-4-1 Privacy deletion claims | Browser removal and storage-clearing commands pass; Android wording is mapped to `consent-removal`. | Fixed as listing/coverage; F-5-3 blocks the current Android evidence |
| F-4-2 README test jargon | README uses “release metadata,” “Android source safeguards,” “checksum,” and “published Android test result.” | Fixed |

The prior handoff’s physical-device/store-signing note remains a future distribution step, not a defect in the current direct-download scope.

## Missed leverage

No AI feature is justified. The core job is deterministic, privacy-sensitive folder mirroring and Android handoff; sending file names or contents to a model would weaken the offline premise. The product already has the brief’s import/selection, refresh/sync, freshness, removal, and handoff paths. No additional AI, import/export, or sync finding is raised.

## What would make this perfect

Publish one exact-candidate Android release so all four declared Android commands and the published-release verifier pass from a clean checkout. Put the stale-payload rejection inside the tagged APK claim test. Then reorder or compact the 390 px demo so **Field notes** and at least one real sample filename are visible before scrolling, with a viewport assertion in `@claim:demo-ready-sample`. Rerun the entire review after all three changes; only zero findings qualifies for PASS.
