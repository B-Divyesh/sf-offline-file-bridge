# Adversarial first-read review 4

- **Product:** Offline File Bridge
- **Reviewed:** 29 August 2026 UTC
- **Live URL:** <https://offline-file-bridge.sociobot.in>
- **Candidate:** `335534324dddfba8fd67c93e93963b999a3e06c7`
- **Verdict:** **FAIL**

The first screen, demo, browser behavior, accessibility, and visual identity pass. The review still fails because four required Android claim commands reject this candidate, the paid-price test does not verify the billed amount or purchase type, an earlier terminology finding has regressed, and three privacy deletion promises are unlisted. PASS requires zero findings and no untested claim.

## Cold first read

Fresh Chromium contexts opened the live home page at 390 × 844 and 1440 × 1000. Nothing was scrolled before this check.

- **What it does:** It keeps a folder ready offline and lets an Android user open its files in another app.
- **For whom:** Android users who need cloud files in another app when the network disappears.
- **What to click first:** **Try it with sample data**. The adjacent text says, “A ready folder opens. Nothing is saved.”

All three answers are visible on the first screen at both sizes. The exact headline is “Keep approved folders ready offline,” and the exact audience sentence is “For Android users who need cloud files in another app when the network disappears.” The 390 px page has no horizontal overflow. Both cold loads returned 200, made only same-origin requests, and logged no console or page errors.

## Findings

### Blocking

#### F-3-1 — The scoped-folder Android claim has regressed at the candidate boundary

- **Exact quote / location:** Landing: “Android asks which folder this app may read. No broad storage permission is requested.” Claim `scoped-folder-access` runs `npm run test:android-claim -- scoped-folder-access`.
- **Evidence:** From a fresh clone at `3355343…`, the exact command fails: “Release tag v0.1.10 resolves to babaeb944e64b61706e0816d7f643cb8199e90f2, not candidate 335534324dddfba8fd67c93e93963b999a3e06c7.” The installed-APK result is therefore not accepted as evidence for this candidate.
- **Why:** This is the same Android outcome-test defect raised in review 3. The implementation may be unchanged, but the declared test fails from the reviewed clean commit. A visitor cannot rely on the scoped-access promise under the claims contract.
- **Concrete fix:** Publish a new candidate-bound Android release and `ANDROID-CLAIMS.json`, then make the exact command pass against that APK's digest, commit, payload fingerprint, and named picker/permission JUnit result.

#### F-3-2 — The failed-refresh Android claim has regressed at the candidate boundary

- **Exact quote / location:** Landing: “A failed Android refresh keeps that date” and “After a failed Android refresh, it keeps the last ready time.” Claim `native-refresh-safety` runs `npm run test:android-claim -- native-refresh-safety`.
- **Evidence:** The command fails with the same `v0.1.10` tag mismatch: released commit `babaeb9…`, candidate `3355343…`.
- **Why:** No candidate-bound installed-APK result is accepted for the promised failed-refresh behavior.
- **Concrete fix:** Release the current candidate and publish the named staged-failure JUnit result bound to its APK digest and web payload; then rerun the exact command successfully.

#### F-3-3 — The Android removal claim has regressed at the candidate boundary

- **Exact quote / location:** Landing: “On Android, you can remove a folder mirror at any time.” Privacy: “Remove a folder mirror to delete its files.” Claim `consent-removal` runs `npm run test:android-claim -- consent-removal`.
- **Evidence:** The command fails with the same released-commit/candidate-commit mismatch before it can accept the public installed-APK evidence.
- **Why:** The reviewed candidate has no passing exact test for deletion of the private mirror and release of folder access.
- **Concrete fix:** Publish candidate-bound removal evidence from the installed release APK and make the declared command pass.

#### F-3-4 — The Android app-chooser claim has regressed at the candidate boundary

- **Exact quote / location:** Landing: “Pick the local app that should receive the file, even while offline.” README: “It opens a ready file in Android's app chooser.” Claim `native-handoff` runs `npm run test:android-claim -- native-handoff`.
- **Evidence:** The command fails with the same `babaeb9…` versus `3355343…` mismatch.
- **Why:** The reviewed candidate has no accepted installed-APK evidence for the chooser intent, content URI, MIME type, and read grant.
- **Concrete fix:** Publish the current candidate's APK and candidate-bound named chooser result, then make the exact command pass.

#### F-1-4 — The $14 one-time price is still tested as copy, not as a billing outcome

- **Exact quote / location:** Landing: “$14 one-time purchase” and “Bridge Pro adds up to eight folder mirrors”; README: “A free one-folder-mirror tier and a $14 Bridge Pro license for up to eight folder mirrors.”
- **Evidence:** `@claim:free-tier` proves the one/eight-folder limits and 30-record cap, but its price check only asserts that `$14` is rendered and that the checkout URL exists. `@claim:checkout` proves a 303 redirect to Dodo; neither test reads billing product/session data to verify USD 14 or one-time rather than recurring billing.
- **Why:** A purchaser can rely on the exact amount and purchase type. Repeating the page's own number is not an outcome test. This reopens the paid-promise finding from reviews 1 and 3.
- **Concrete fix:** In a recorded Sociobot billing fixture or non-spending checkout inspection, assert amount `1400`, currency `USD`, and one-time mode for `offline-file-bridge`; keep the existing local feature-limit assertions. Otherwise remove the exact price and “one-time” claim.

#### F-1-11 — “Folder mirror” still regresses to “local copy” outside the visible body

- **Exact quote / location:** Live `/app` meta description: “Choose approved folders, refresh local copies, and preview ready files.” `.factory/demo.md`: “Use **Refresh local copy**,” while the real button says **Refresh folder mirror**.
- **Evidence:** The live metadata and source at `src/main.ts:282` use “local copies.” The demo guide at `.factory/demo.md:15` names a control that does not exist. The landing body and README otherwise use “folder mirror.”
- **Why:** Search/share copy and verifier documentation rename the same object and action. This is the same terminology finding from reviews 1 and 3, so the prior repair is incomplete.
- **Concrete fix:** Change the `/app` description to “Choose approved folders, refresh folder mirrors, and preview ready files.” Change the guide to **Refresh folder mirror** and add assertions for route metadata and documented control labels.

#### F-4-1 — Privacy deletion claims are unlisted and not tested

- **Exact quote / location:** `/privacy`, Deletion: “Remove a folder mirror to delete its files. Clearing this site's storage also removes browser files. Uninstalling the Android app removes its private files.”
- **Evidence:** `claims.json` has an Android `consent-removal` claim for the in-app remove action only. It has no browser-removal, browser-storage-clearing, or Android-uninstall claim. The existing browser tests never remove a real browser mirror or clear site storage; the installed-APK evidence never uninstalls the app and checks its private files.
- **Why:** These are privacy and deletion outcomes a visitor can rely on. The broad first sentence also covers browser mirrors, while its listed Android test does not.
- **Concrete fix:** Add separate outcome claims: remove a seeded browser mirror and verify its blobs are gone; clear the origin and verify the browser database is gone; install, seed, uninstall, and verify Android private storage is removed. Alternatively narrow the first sentence to Android and delete the two untested platform promises.

### Minor

#### F-4-2 — README test instructions use unexplained internal jargon

- **Exact quote / location:** README: “`npm run test:unit` checks release and native-source contracts.” “Clean machines verify that APK's digest and public JUnit result.”
- **Why:** “native-source contracts” and “JUnit result” do not tell a new contributor what is checked. The latter is especially confusing while the documented clean-candidate commands fail.
- **Concrete rewrite:** “`npm run test:unit` checks release metadata and Android source safeguards. Android outcome tests run on the released app. A clean checkout checks the app file's checksum and the published Android test result.”

## Copy audit

Counts treat hyphenated terms, commands, paths, URLs, versions, and `$14` as one word. No landing or README sentence exceeds 22 words and no banned marketing adjective appears. Findings are identified below; all other headings make sense out of context, and all controls name an action or result.

### Landing page sentences

| Exact copy | Words | Result |
| --- | ---: | --- |
| For Android users who need cloud files in another app when the network disappears. | 14 | Clear audience and situation |
| A ready folder opens. | 4 | `demo-ready-sample` |
| Nothing is saved. | 3 | `demo-sandbox` |
| One folder is free. | 4 | `free-tier` |
| Files stay on your device. | 5 | `local-only` |
| Works after the first visit. | 5 | `offline-reload` |
| A paper folder crosses a small bridge into a phone-shaped tray. | 11 | Useful image alt |
| Every folder mirror shows its last successful refresh. | 8 | `freshness` |
| A failed Android refresh keeps that date. | 7 | F-3-2 |
| Android asks which folder this app may read. | 8 | F-3-1 |
| No broad storage permission is requested. | 6 | F-3-1 |
| The folder mirror records its successful refresh time, file count, and storage size. | 13 | `freshness` |
| Pick the local app that should receive the file, even while offline. | 12 | `offline-reload`, F-3-4 |
| You approve each source folder. | 5 | F-3-1 |
| Folder mirror files stay in app storage. | 7 | `local-only` |
| On Android, you can remove a folder mirror at any time. | 11 | F-3-3 |
| It does not replace your storage service. | 7 | Clear scope |
| It does not crawl unapproved folders. | 6 | F-3-1 |
| After a failed Android refresh, it keeps the last ready time. | 11 | F-3-2 |
| Bridge Pro adds up to eight folder mirrors and keeps 30 refresh records per folder. | 15 | Limits pass; price context is F-1-4 |
| The free version keeps one folder mirror. | 7 | `free-tier` |
| Paste the token from your purchase email. | 7 | Useful field help |
| Spaces alone are not a token. | 6 | Useful validation help |
| This Android release records this site's exact commit and verified payload fingerprint. | 12 | `apk-payload-match`; live check succeeded |
| Keep approved folders ready offline. | 5 | Footer summary |

### Landing headings, controls, labels, and sample data

| Exact copy | Words | Result |
| --- | ---: | --- |
| Skip to main content / Offline File Bridge | 3 / 3 | Clear skip link / product label |
| Demo / Open folders / Install / Privacy | 1 / 2 / 1 / 1 | Clear navigation |
| Keep approved folders ready offline | 5 | Clear h1 |
| Try it with sample data | 6 | Result-naming primary action |
| Check latest APK / Install steps | 3 / 2 | Clear actions |
| approved folder → folder mirror → another app | 6 | Clear diagram caption |
| See what is ready before you leave | 8 | Useful preview heading |
| Open the working sample | 4 | Clear action |
| Field notes | 2 | Realistic sample name |
| OpenCloud / Research · 3 files · 280.0 KB | 5 | Sample metadata |
| Ready · synced 12 min ago | 5 | Sample status |
| ridge-route.pdf / 277.3 KB / Ready | 1 / 2 / 1 | Sample file data |
| specimen-log.csv / 1.8 KB / Ready | 1 / 2 / 1 | Sample file data |
| Open sample | 2 | Clear action |
| How to keep a folder ready offline | 7 | Clear workflow heading |
| Choose a folder / Refresh the folder mirror / Open a ready file | 3 / 4 / 4 | Clear step headings |
| Your folder stays under your control / What it does not do | 6 / 5 | Clear privacy/scope headings |
| Read the privacy note | 4 | Clear action |
| $14 / one-time purchase | 1 / 2 | F-1-4 |
| Keep more folder mirrors | 4 | Paid-tier heading |
| Buy Bridge Pro / at the Sociobot checkout (external site) | 3 / 6 | `checkout` destination |
| Restore a Bridge Pro license / Paste your license token / Verify license | 5 / 4 / 2 | Clear label, placeholder, action |
| Download APK v0.1.10 / Download SHA256SUMS | 3 / 2 | Live verified-result actions |
| Built by Param Factory / v0.1.10 · Generated artwork | 4 / 3 | Attribution and version |

### README sentences and fragments

| Exact copy | Words | Result |
| --- | ---: | --- |
| Offline File Bridge | 3 | Clear title |
| Keep an approved folder ready offline, see when it last refreshed, and open its files in another Android app. | 19 | `offline-reload`, `freshness`, F-3-4 |
| Offline File Bridge is for Android users who need a cloud file in another local app. | 16 | Clear audience |
| It copies files from an approved folder into a folder mirror. | 11 | Consistent term |
| Live site / One-click demo / What v1 includes | 2 / 2 / 3 | Clear labels and heading |
| Android's folder picker remembers read access only for folders you approve | 11 | F-3-1 |
| Folder mirrors stored on the device | 6 | `local-only` |
| Visible file counts, storage sizes, and last successful refresh times | 9 | `freshness` |
| Open a ready file in another Android app | 8 | F-3-4 |
| In supported browsers, selected folder files stay available after reload | 10 | `browser-persistence` |
| A separate, resettable sample-data sandbox | 5 | `demo-sandbox`, `demo-reset` |
| A free one-folder-mirror tier and a $14 Bridge Pro license for up to eight folder mirrors | 16 | Limits pass; price is F-1-4 |
| The product does not replace a cloud provider or crawl unapproved folders. | 12 | Clear scope / F-3-1 |
| Run locally / Test and build / Android project / Privacy and licenses | 2 / 3 / 2 / 3 | Clear headings |
| Requirements: Node.js 20 or newer. | 5 | Clear prerequisite |
| Open `http://localhost:5173/` or go straight to `http://localhost:5173/demo`. | 7 | Clear instruction |
| The production command is `npm run build`. | 7 | Clear instruction |
| It writes the static site to `dist/`. | 7 | Clear build result |
| The root file is `dist/index.html`. | 5 | Clear build result |
| `npm test` runs browser claims on desktop and mobile Chromium. | 10 | Accurate command scope |
| It removes only this repository's stale preview process. | 8 | Specific test behavior |
| Playwright starts and closes its server. | 6 | Specific test behavior |
| `npm run test:unit` checks release and native-source contracts. | 8 | **F-4-2 jargon** |
| Android outcome claims run against an installed release APK in the release workflow. | 13 | Intended scope; exact commands fail for this candidate |
| Clean machines verify that APK's digest and public JUnit result. | 10 | **F-4-2 jargon; contradicted for this candidate by F-3-1–F-3-4** |
| Run one with `npm run test:android-claim -- <claim-id>`. | 8 | Clear command |
| Run one claim with: | 4 | Clear instruction |
| The Capacitor 8 project lives in `android/` with app id `in.sociobot.offline_file_bridge`. | 11 | Developer detail |
| The Android plugin opens the approved-folder picker. | 7 | F-3-1 |
| It copies selected files into private app storage. | 8 | `local-only` |
| It opens a ready file in Android's app chooser. | 9 | F-3-4 |
| Real browser mirrors use the `offline-file-bridge-real` IndexedDB database. | 8 | Exact storage disclosure |
| Demo state uses only the `demo:offline-file-bridge` localStorage key. | 8 | `demo-sandbox` |
| The app sends no file contents to a server. | 9 | `local-only` |
| License verification sends a token only to the Sociobot billing API. | 10 | `license-verification-privacy` |
| See Privacy, Terms, and demo details. | 6 | Clear pointers |
| Source code is available under the MIT License. | 8 | Repository fact confirmed |
| Generated visual assets and their prompts are documented in `.factory/design.md`. | 10 | Repository fact confirmed |

Terminology should be: approved offline object → **folder mirror**; operation → **refresh**; completed state → **ready**; paid tier → **Bridge Pro**; sample inspection → **preview**. F-1-11 identifies the two remaining “local copy” regressions.

## Demo and sandbox

- The live landing action reaches `/demo` in one click. The settled first screen already shows **Field notes**, three named files, 280.0 KB, a ready time, and one refresh record.
- The persistent banner says **Demo — sample data, nothing is saved** and includes **Reset demo** and **Start for real**.
- Refresh changes the state to **synced just now**. Reset restores **synced 12 min ago**, one history record, the “Sample data was reset” notice, and focus on Reset.
- A `real:sentinel` localStorage value and an unrelated IndexedDB database remained unchanged. Demo mode created only `demo:offline-file-bridge` and did not open `offline-file-bridge-real`.
- **Start for real** deleted the demo key, kept the real sentinel, and opened `/app`.
- `handoff-notes.md` downloaded with the correct name. After the first visit, offline reload showed **Offline — ready files still open** with all three files.
- The complete cold/demo/refresh/reset/download/offline flow made no foreign request and logged no console or page error.

The demo behavior passes. The documentation label regression is F-1-11.

## Claims audit

The repository was cloned without hard links to `/tmp/offline-file-bridge-review4.E1SpW8/clean`; `npm ci` installed 148 packages with zero vulnerabilities. Every literal `test` command in `.factory/claims.json` was run separately from that clone.

| Claim | Exact command result | Coverage assessment |
| --- | --- | --- |
| `apk-payload-match` | PASS, 2 browser projects | Matching and stale payload records exercised; live release check offered v0.1.10 |
| `offline-reload` | PASS, 2 browser projects | Offline reload and ready-file preview exercised |
| `demo-sandbox` | PASS, 2 browser projects | Demo namespace and absent real product DB asserted |
| `demo-ready-sample` | PASS, 2 browser projects | One-click ready three-file sample asserted |
| `demo-reset` | PASS, 2 browser projects | Refresh then reset without reload asserted |
| `local-only` | PASS, 2 browser projects | Demo and browser-selected file request logs asserted |
| `freshness` | PASS, 2 browser projects | Count, size, and changed refresh time asserted |
| `file-handoff` | PASS, 2 browser projects | Preview and named sample download asserted |
| `scoped-folder-access` | **FAIL** | Released commit is `babaeb9…`, not candidate `3355343…` — F-3-1 |
| `free-tier` | Command PASS, coverage **FAIL** | Limits are exercised; billing amount/mode are only page text — F-1-4 |
| `browser-persistence` | PASS, 2 browser projects | Two selected files survive reload |
| `native-refresh-safety` | **FAIL** | Released commit is not the candidate — F-3-2 |
| `license-verification-privacy` | PASS, 2 browser projects | Sole foreign request is the documented Sociobot verify endpoint |
| `checkout` | PASS, 2 browser projects | Live endpoint returns 303 to hosted Dodo checkout |
| `consent-removal` | **FAIL** | Released commit is not the candidate — F-3-3; broader privacy copy is F-4-1 |
| `native-handoff` | **FAIL** | Released commit is not the candidate — F-3-4 |

Additional gates from the clean clone: `npm test` passed 74/74, `npm run test:unit` passed 15/15, `npm run lint` passed, `npm run build` produced `dist/` with 13.71 KB gzip JavaScript, and `npm audit --omit=dev` found zero vulnerabilities. `npm run test:release-artifact` also fails on the `babaeb9…` versus `3355343…` mismatch.

The live `/build-identity.json` reports v0.1.10, commit `babaeb944e64b61706e0816d7f643cb8199e90f2`, 17 payload files, and payload SHA-256 `53b36b823c8c569ab1347a8d09af25dd55a2f1038bb94bd2cd71ed7f034b9e77`. The reviewed commit adds verification documentation after that release, but the exact-candidate contract intentionally rejects even documentation-only drift.

## Structure, links, accessibility, and visual identity

- Live `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/install` return 200. `/missing-review-4` returns the designed 404 with h1 **Page not found**, no canonical, and **Return home**.
- Every route has `lang="en"`, one h1, one main landmark, a route-specific title and description, canonical metadata on known routes, Open Graph/Twitter metadata, favicon, consistent header/footer, Privacy, and Terms. F-1-11 is the sole metadata-copy defect.
- `robots.txt`, `sitemap.xml`, favicon, apple-touch icon, manifest, and the 1200 × 630 OG image return 200. The sitemap lists all six public routes.
- All discovered internal links return 200 except the intentional 404's self skip-link. Param Factory returns 200. The checkout returns 303 to a Dodo session. The dynamically offered APK and SHA256SUMS links return GitHub asset redirects.
- Deep links load the requested route. In-app navigation and Back update the title, announce the route, scroll to the top, and focus the destination h1.
- The home response sends CSP, HSTS, `nosniff`, referrer policy, and permissions policy headers. There are no inline CSP errors.
- `/opt/fleet/lib/verify-url.sh` passed the live home page in 657 ms with title, language, one h1, main, complete alt text, and no console errors. Live Playwright Axe scans at 390 px found zero violations on all seven checked routes. The local suite also passes keyboard navigation, 44 px targets, 200% text reflow, dark/light checks, and reduced motion.
- The graph-paper notebook, handwritten display face, original folder/bridge art, stamped states, asymmetric cards, and restrained ink-trace motion match `.factory/design.md`. The result is recognizably product-specific, not a generic SaaS template.

## Earlier-review history

Each earlier finding was checked on the live site and in current code, not from its prior status label.

| Earlier finding | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 Demo Reset display | Live Reset rerenders the seed, restores 12 minutes/one record, announces success, and restores focus. | Fixed |
| F-1-2 Ready demo promise | One click opens isolated Field notes with three ready files. | Fixed |
| F-1-3 Failed-refresh scope | Both landing statements remain explicitly Android-specific. | Fixed as wording; F-3-2 is reopened for evidence |
| F-1-4 Paid promises | Unsupported refund/device/export copy remains absent, but the retained exact price is still a text-only billing check. | **Reopened; blocking** |
| F-1-5 Browser API wording | README states only the tested supported-browser reload persistence. | Fixed |
| F-1-6 Release-process promises | JDK, keystore, signing, emulator, and publication claims remain absent. Candidate-bound commands exist, though four currently fail. | Fixed as copy; see F-3-1–F-3-4 |
| F-1-7 License privacy | Fixture-token interception proves the only foreign request is the Sociobot verify endpoint. | Fixed |
| F-1-8 Hero mood line | Removed. | Fixed |
| F-1-9 Metaphoric workflow heading | Live heading is “How to keep a folder ready offline.” | Fixed |
| F-1-10 Decorative notebook labels | No “field check” or “advanced field kit” label remains. | Fixed |
| F-1-11 Folder terminology | Visible body and README are consistent, but `/app` metadata and the demo guide still say “local copy.” | **Reopened; blocking** |
| F-1-12 Ambiguous controls | Controls say Open folders, Check latest APK, file-specific Preview, and Refresh folder mirror. | Fixed |
| F-1-13 404 h1 | Live h1 is “Page not found.” | Fixed |
| F-1-14 404 canonical | Unknown live route has no canonical. | Fixed |
| F-2-1 Install/release assertions | Play-store, signing, PWA-ready, and AAB copy remains absent; current dynamic APK links resolve. | Fixed |
| F-2-2 Install jargon | Debug-keystore and upload-key prose remains absent. | Fixed |
| F-3-1 Scoped installed-APK outcome | Exact command rejects the reviewed candidate because the public result binds to `babaeb9…`. | **Regressed; blocking** |
| F-3-2 Failed-refresh installed-APK outcome | Exact command rejects the reviewed candidate for the same mismatch. | **Regressed; blocking** |
| F-3-3 Removal installed-APK outcome | Exact command rejects the reviewed candidate for the same mismatch. | **Regressed; blocking** |
| F-3-4 Chooser installed-APK outcome | Exact command rejects the reviewed candidate for the same mismatch. | **Regressed; blocking** |
| F-3-5 Download control result | First control says Check latest APK; success produces Download APK v0.1.10. | Fixed |
| F-3-6 “Secure checkout” | Replaced by “Sociobot checkout (external site).” | Fixed |
| F-3-7 Storage Access Framework jargon | README now describes Android's folder picker in plain words. | Fixed |
| F-3-8 FileProvider jargon | README now says a ready file opens in Android's app chooser. | Fixed |
| F-3-9 Terms h1 | Live h1 is “Terms for Offline File Bridge.” | Fixed |

The latest handoff's stated low-severity follow-up—rename “Refresh local copy” in `.factory/demo.md`—is still open and is included in reopened F-1-11.

## Missed leverage

No AI feature is justified. The job is deterministic, privacy-sensitive local mirroring and file handoff; sending names or contents to a model would weaken the product. The product already includes the brief's import/selection, manual refresh/sync, status, and handoff path. No additional AI, import/export, or sync finding is raised.

## What would make this perfect

Publish and deploy one candidate-bound Android release so all four exact Android claim commands and the public artifact check pass. Verify the actual $14 one-time billing configuration, replace every remaining “local copy” reference with “folder mirror,” and either test or remove each privacy deletion promise. Finally, replace the two README test-jargon phrases with plain outcomes and rerun this entire review from a fresh clone. Only a zero-finding result qualifies for PASS.
