# Adversarial first-read review 1

- **Product:** Offline File Bridge
- **Reviewed:** 29 August 2026 UTC
- **Live URL:** <https://offline-file-bridge.sociobot.in>
- **Verdict:** **FAIL**

The first screen is clear and the sample is realistic, but Reset leaves the displayed demo stale. Copy also contains promises without exact claim tests, metaphoric headings, and inconsistent terms. PASS requires zero findings.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 1000 before scrolling. At both sizes, I understood: it keeps an approved Android folder ready offline so its files can open in another app; it is for Android users who need cloud files in another app without a network; click **Try it with sample data** first. The headline is “Keep approved folders ready offline”; the audience sentence is 14 words; the action note says “A ready folder opens. Nothing is saved.” This check passes. First load made only same-origin requests and logged no console errors.

## Findings

### Blocking

#### F-1-1 — Demo Reset changes stored data but leaves the displayed sample stale

- **Location / quote:** `/demo` banner “Demo — sample data, nothing is saved” and **Reset demo**; folder status “Ready · synced just now”.
- **Evidence:** After refreshing *Field notes*, its status became “synced just now”. Clicking Reset replaced `demo:offline-file-bridge` with the seed timestamp (720,008 ms old), but the page still said “synced just now”. Reloading changed it to “synced 12 min ago”.
- **Why:** The visitor cannot confirm Reset and sees a status that no longer describes the sample. This is a half-working required sandbox control.
- **Fix:** Re-render after reset while retaining a “Sample data was reset” notice. Test refresh → Reset without reload → visible seeded time and notice.

#### F-1-2 — Ready-demo promise has no matching listed claim

- **Location / quote:** Landing: “A ready folder opens. Nothing is saved.”
- **Why:** `demo-sandbox` tests isolation, not the promised first post-click state: a ready folder with realistic sample files.
- **Fix:** Add `demo-ready-sample`, tested from a fresh context by clicking the landing action and asserting banner, *Field notes*, three files, readiness, and no real DB; or remove the promise.

#### F-1-3 — Failed-refresh copy is broader than its test

- **Location / quote:** “A failed refresh never changes that date.”
- **Why:** `native-refresh-safety` only proves a staged **Android** replacement preserves the prior mirror. The landing statement includes browser/PWA refreshes, so it is an unlisted broader claim.
- **Fix:** Qualify it as Android-only, or add a browser failure-path test which proves the visible successful-refresh time remains intact.

#### F-1-4 — Paid-tier promises are unlisted and untested

- **Location / quotes:** “One-time license for your devices”; “Core file export stays free”; “Sociobot handles checkout and refunds”.
- **Why:** `free-tier` proves price and limits and `checkout` proves a redirect. They do not prove multi-device licensing, free export, or refunds.
- **Fix:** Add a separately tagged observable claim for each (including a recorded billing fixture for refund state), give an exact device limit, or remove the lines.

#### F-1-5 — README claims untested browser capability

- **Location / quote:** README, “A browser/PWA path backed by IndexedDB and the File System Access API”.
- **Why:** `browser-persistence` proves folder-input persistence, not File System Access API selection/read/refresh.
- **Fix:** Add a directory-picker fixture claim for selection, refresh and persistence, or rewrite to the tested fact: “In supported browsers, selected folder files stay available after reload.”

#### F-1-6 — README makes untested release-process promises

- **Location / quotes:** “The workflow generates a temporary debug keystore and publishes release `v0.1.2`.” “It compares every built web file inside the APK with `dist/`, records the source commit in `BUILD-PROVENANCE.json`, and checksums the APK, AAB, and provenance file.” “The release workflow also starts an Android 36 emulator and runs the release-variant installed-APK tests.”
- **Why:** No claims entry downloads/verifies the public artefacts or workflow. Local source tests do not prove the published-release claims.
- **Fix:** Move implementation detail out of the visitor README, or add a release-artifact claim that verifies published provenance, checksums, embedded `dist/`, and the public workflow result.

#### F-1-7 — README license-data disclosure lacks an exact privacy test

- **Location / quote:** “License verification sends the pasted token to the Sociobot billing API.”
- **Why:** `local-only` records demo and file-selection requests only; it never enters a token or asserts its destination.
- **Fix:** Add a fixture-token request-interception claim proving the token goes only to the named API, or remove the sentence.

### Minor

#### F-1-8 — Information-free hero mood line

- **Quote:** “A clear path out of app storage”.
- **Why:** “Path” is a metaphor; it neither names a section nor tells the visitor a useful fact.
- **Fix:** Delete it.

#### F-1-9 — Metaphoric how-it-works heading

- **Quote:** “Move a folder across the boundary”.
- **Why:** A screen-reader heading list does not explain the section; “boundary” does not name the workflow.
- **Fix:** “How to keep a folder ready offline”.

#### F-1-10 — Decorative labels convey no information

- **Quotes:** “field check 04”; “advanced field kit”.
- **Why:** They are invented notebook lore, not section names.
- **Fix:** Delete them or use “Sample folder status” and “Bridge Pro price”.

#### F-1-11 — Terminology changes among mirror, folder bridge, and bridge

- **Quotes:** “Every mirror…”; “1 folder bridge”; “Open bridge”; “Keep more folder bridges”.
- **Why:** The repository’s own terminology table defines the object as a mirror. A visitor must infer whether these are separate things.
- **Fix:** Use **folder mirror** consistently: “Open my folder mirrors” and “Keep more folder mirrors”.

#### F-1-12 — Buttons do not clearly name their result

- **Quotes:** “Open bridge”; “Share / open”.
- **Why:** The first is jargon; the second gives two outcomes without saying what happens first. The demo really opens a preview then offers Save.
- **Fix:** “Open my folders” and “Preview handoff-notes.md” (or “Open handoff-notes.md”), retaining a separate “Save sample”.

#### F-1-13 — 404 h1 is metaphorical

- **Quote:** “This path ends at the page edge”.
- **Why:** It does not say page not found to a first-time visitor or heading-list user.
- **Fix:** H1: “Page not found”; retain “The address may be old or incomplete.” below it.

#### F-1-14 — Unknown URLs publish their own invalid canonical URL

- **Evidence:** `/missing-page` returns the designed 404 and title “Page not found — Offline File Bridge”, but canonical is `https://offline-file-bridge.sociobot.in/missing-page`.
- **Why:** A typo is not canonical content.
- **Fix:** Resolve unknown paths to `/404` before `updateCanonical`, or omit canonical on 404.

## Copy audit

Counts treat contractions, hyphenated terms, commands, paths, and versions as one word. Labels/fragments are included for completeness. The two README sentences marked **>22** exceed the hard cap.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Offline File Bridge | 3 | Label |
| Demo / Open bridge / Install / Privacy | 1 / 2 / 1 / 1 | F-1-11/F-1-12 only for Open bridge |
| A clear path out of app storage | 7 | F-1-8 |
| Keep approved folders ready offline | 5 | Pass |
| For Android users who need cloud files in another app when the network disappears. | 14 | Pass |
| Try it with sample data | 6 | Pass |
| A ready folder opens. / Nothing is saved. | 4 / 3 | F-1-2 |
| One folder is free. / Files stay on your device. / Works after the first visit. | 4 / 5 / 5 | Covered (`free-tier`, `local-only`, `offline-reload`) |
| Download the latest APK / Install steps / Not on Google Play yet | 4 / 2 / 5 | Last is unlisted status claim |
| folder → local copy → your app | 6 | Clear diagram caption; use mirror terminology |
| See what is ready before you leave | 8 | Pass |
| field check 04 | 3 | F-1-10 |
| Every mirror shows its last successful refresh. | 7 | `freshness` |
| A failed refresh never changes that date. | 7 | F-1-3 |
| Open the working sample / Field notes / Open sample | 4 / 2 / 2 | Clear; use one “sample” term |
| OpenCloud / Research · 3 files · 280.0 KB | 5 | Sample metadata |
| Ready · synced 12 min ago / ridge-route.pdf / specimen-log.csv | 5 / 1 / 1 | Sample status/files |
| Move a folder across the boundary | 7 | F-1-9 |
| Choose a folder / Refresh its local copy / Open a ready file | 3 / 4 / 4 | Clear actions |
| Android asks which folder this app may read. / No broad storage permission is requested. | 8 / 6 | `scoped-folder-access` |
| The bridge records a successful time, file count, and storage size. | 11 | Time covered; count/size unlisted |
| Pick the local app that should receive the file, even while offline. | 12 | Handoff claims |
| Your folder stays under your control / What it does not do | 6 / 5 | Clear headings |
| You approve each source folder. / Mirrored files stay in app storage. | 5 / 6 | Scoped/local claims |
| You can remove a mirror at any time. | 8 | Android covered; browser scope unlisted |
| It does not replace your storage service. / It does not crawl unapproved folders. / It does not call stale files current. | 7 / 6 / 7 | Boundary statements; add a stale-state test if relied on |
| Read the privacy note | 4 | Clear |
| advanced field kit | 3 | F-1-10 |
| $14 one-time purchase | 3 | `free-tier` |
| Keep more folder bridges | 4 | F-1-11 |
| Bridge Pro adds up to eight folders and keeps 30 refresh records per folder. / The free version keeps one folder. | 14 / 6 | `free-tier` |
| One-time license for your devices / Core file export stays free / Sociobot handles checkout and refunds | 5 / 5 / 5 | F-1-4 |
| Buy Bridge Pro / Verify license | 3 / 2 | Clear actions |
| Keep approved folders ready offline. / Built by Param Factory / v0.1.2 · Generated artwork | 5 / 4 / 3 | Footer |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Offline File Bridge | 3 | Title |
| Keep an approved folder ready offline, see when it last refreshed, and open its files in another Android app. | 19 | Summary; freshness/handoff covered |
| Offline File Bridge is for Android users of self-hosted or privacy-first storage. | 12 | Audience |
| It handles the gap between a provider's offline cache and the local viewer or editor that needs a file. | 19 | Abstract; say it copies approved files for another app |
| Live site / One-click demo / What v1 includes | 2 / 2 / 3 | Clear labels |
| An Android Storage Access Framework picker with persisted, folder-scoped read access | 11 | `scoped-folder-access` |
| Private local mirrors in app storage | 6 | `local-only` |
| Visible file counts, storage sizes, and last successful refresh times | 9 | Time covered; count/size unlisted |
| Android open-with handoff through a narrow `FileProvider` | 7 | `native-handoff` |
| A browser/PWA path backed by IndexedDB and the File System Access API | 11 | F-1-5 |
| A separate, resettable sample-data sandbox | 5 | F-1-1 until Reset visibly works |
| A free one-folder tier and a $14 Bridge Pro license for up to eight folders | 15 | `free-tier` |
| The product does not replace a cloud provider, crawl unapproved folders, or claim a file is current after a failed refresh. | 18 | Last clause needs browser failure proof if relied on |
| Run locally / Requirements: Node.js 20 or newer. / Open `http://localhost:5173/` or go straight to `http://localhost:5173/demo`. | 2 / 5 / 8 | Clear instructions |
| Test and build / The exact production command is `npm run build`. / It writes the deployable static site to `dist/`, with `dist/index.html` at the root. | 3 / 8 / 13 | Clear instructions |
| `npm test` runs the browser claims on desktop and mobile Chromium. / `npm run test:unit` runs the three native source regressions; together they run every command listed in `.factory/claims.json`. / Run one claim with: | 10 / 17 / 4 | Clear instructions |
| Android project / The Capacitor 8 project lives in `android/` with app id `in.sociobot.offline_file_bridge`. | 2 / 10 | Clear implementation note |
| The custom `OfflineBridgePlugin` opens Android's folder picker, copies selected files into private app storage, and hands a chosen copy to Android's app chooser. | 23 | **>22**; split after “private app storage.” |
| The worker image does not include a JDK or Android SDK. / GitHub Actions builds the release artifacts with JDK 21. | 11 / 9 | Build detail/jargon, not visitor value |
| The workflow generates a temporary debug keystore and publishes release `v0.1.2`. | 10 | F-1-6 |
| It compares every built web file inside the APK with `dist/`, records the source commit in `BUILD-PROVENANCE.json`, and checksums the APK, AAB, and provenance file. | 23 | **>22**, F-1-6 |
| A public store release must use the owner's upload key. | 9 | Build detail |
| The release workflow also starts an Android 36 emulator and runs the release-variant installed-APK tests. | 14 | F-1-6 |
| They cover the scoped picker intent and manifest permissions, failed-refresh preservation, private `FileProvider` chooser handoff, and local-copy/consent removal. | 16 | Unsupported release-process claim |
| Privacy and licenses / Real browser mirrors use the `offline-file-bridge-real` IndexedDB database. / Demo state uses only the `demo:offline-file-bridge` localStorage key. | 3 / 8 / 7 | Heading; browser/demo claims |
| The app sends no file contents to a server. | 9 | `local-only` |
| License verification sends the pasted token to the Sociobot billing API. | 10 | F-1-7 |
| See Privacy, Terms, and demo details. / Source code is available under the MIT License. / Generated visual assets and their prompts are documented in `.factory/design.md`. | 6 / 8 / 9 | Clear pointers |

## Demo, claims, structure, and history

- **Demo:** One click reaches `/demo`; the first screen immediately shows *Field notes*, three realistic files, readiness, size, and history. Banner exists. Demo used only `demo:offline-file-bridge` and no IndexedDB database; code enters demo before `loadMirrors`. Its Reset defect is F-1-1.
- **Privacy/offline:** Request log for demo refresh/open/save had only same-origin page/assets; no file data left the origin. Offline claim passed in fresh desktop and mobile contexts after first visit. No console error occurred.
- **All claims:** after `npm ci` (0 vulnerabilities), every exact command in `.factory/claims.json` passed: `offline-reload`, `demo-sandbox`, `local-only`, `freshness`, `file-handoff`, `scoped-folder-access`, `free-tier`, `browser-persistence`, `native-refresh-safety`, `checkout`, `consent-removal`, and `native-handoff`. Full gates passed: `npm test` 62/62, `npm run test:unit` 7/7, `npm run lint`, and `npm run build`. Passing listed tests does not close F-1-2–F-1-7.
- **Structure:** Checked `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, and unknown route: titles, one h1, descriptions, language, favicon, OG/Twitter data, skip link, landmarks, focus/back route handling, footer Privacy/Terms, headers, and reduced motion pass. The designed 404 returns HTTP 404 and gives a way home; F-1-13/F-1-14 remain. Public internal routes and `https://sociobot.in/` returned 200; mailto links are explicit. The notebook visual identity is product-specific, not generic SaaS.
- **Missed leverage:** No AI feature is appropriate: the brief’s core job is consented local mirroring and handoff, and the product already provides selection/import, refresh/sync, and file handoff.
- **History:** No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. The prior handoff’s small-label note was checked: current 390 px layout has no horizontal overflow, 44 px controls, and no serious axe findings. This review reran the full checklist.

## What would make this perfect

Make Reset visibly restore the seed immediately; attach one exact fresh-sandbox test to every promise; then remove notebook-lore labels and use **folder mirror** consistently. The strong first-screen explanation, realistic demo, local-first behaviour, and distinct notebook identity would then have no remaining first-read ambiguity.
