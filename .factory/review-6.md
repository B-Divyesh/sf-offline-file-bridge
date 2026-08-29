# Adversarial first-read review 6

- **Product:** Offline File Bridge
- **Reviewed:** 29 August 2026 UTC
- **Live URL:** <https://offline-file-bridge.sociobot.in>
- **Repository candidate:** `bc537802f61ba014c4cc6b1e6b00292fe4b13dc1`
- **Live product / release commit:** `86adec43943a62c5d037ab191bfec357b332d48f` (`v0.1.13`)
- **Verdict:** **FAIL**

The landing page is clear, the mobile demo is immediately useful, and the
browser product passes its quality checks. This review still fails because
four mandatory Android claim commands reject the reviewed commit. A passing
aggregate browser suite does not replace those declared installed-APK tests.

## Cold first read

Fresh Chromium contexts opened the live home page at 390 × 844 and 1440 × 900.
Nothing was scrolled before this check.

- **What it does:** It keeps an approved folder ready offline and lets an
  Android user open its files in another app.
- **For whom:** Android users who need cloud files in another app when their
  network disappears.
- **What to click first:** **Try it with sample data**. Its adjacent result is
  “A ready folder opens. Nothing is saved.”

The exact h1 is “Keep approved folders ready offline.” The exact audience
sentence is “For Android users who need cloud files in another app when the
network disappears.” Both viewports show the primary action and its result
before scrolling. The 390 px page has no horizontal overflow. Both cold loads
returned 200, made only same-origin requests, and logged no console or page
errors. This gate passes. Evidence: [mobile](verification-artifacts/review-6-live-home-mobile.png)
and [desktop](verification-artifacts/review-6-live-home-desktop.png).

## Findings

### Blocking

#### F-6-1 — Scoped-folder claim rejects this candidate (recurrence of F-5-1 and F-3-1)

- **Exact quote / location:** Landing: “Android asks which folder this app may
  read. No broad storage permission is requested.” README: “Android's folder
  picker remembers read access only for folders you approve.” Claim
  `scoped-folder-access` runs
  `npm run test:android-claim -- scoped-folder-access`.
- **Evidence:** The exact command fails from the fresh clone: “Release tag
  v0.1.13 resolves to `86adec43943a62c5d037ab191bfec357b332d48f`, not
  candidate `bc537802f61ba014c4cc6b1e6b00292fe4b13dc1`.”
- **Why:** A failing declared claim is blocking. The published picker and
  permission result belongs to a different commit, even though the intervening
  commit records verification documentation.
- **Concrete fix:** Publish the accepted candidate and candidate-bound
  `ANDROID-CLAIMS.json`, then make the literal command pass against that APK's
  digest, payload fingerprint, and named Android 35 picker/permission result.

#### F-6-2 — Failed-refresh claim rejects this candidate (recurrence of F-5-2 and F-3-2)

- **Exact quote / location:** Landing: “A failed Android refresh keeps that
  date” and “After a failed Android refresh, it keeps the last ready time.”
  Claim `native-refresh-safety` runs
  `npm run test:android-claim -- native-refresh-safety`.
- **Evidence:** The command fails with the same release/candidate mismatch:
  `86adec4…` versus `bc53780…`.
- **Why:** There is no accepted installed-release result for this commit's
  staged-refresh behavior.
- **Concrete fix:** Publish the current candidate's APK and named staged-failure
  evidence, bind both to this commit, and rerun the declared command.

#### F-6-3 — Android removal claim rejects this candidate (recurrence of F-5-3 and F-3-3)

- **Exact quote / location:** Landing: “On Android, you can remove a folder
  mirror at any time.” Privacy: “On Android, remove a folder mirror to delete
  its private files and release folder access.” README: “It copies selected
  files into private app storage.” Claim `consent-removal` runs
  `npm run test:android-claim -- consent-removal`.
- **Evidence:** The command fails before accepting the public removal result
  because `v0.1.13` resolves to `86adec4…`, not `bc53780…`.
- **Why:** This candidate has no accepted proof that removal deletes its private
  mirror and releases folder access.
- **Concrete fix:** Publish this candidate's APK and named removal result with
  matching APK and payload digests, then make the literal command pass.

#### F-6-4 — Android app-chooser claim rejects this candidate (recurrence of F-5-4 and F-3-4)

- **Exact quote / location:** Landing: “Pick the local app that should receive
  the file, even while offline.” README: “It opens a ready file in Android's app
  chooser.” Claim `native-handoff` runs
  `npm run test:android-claim -- native-handoff`.
- **Evidence:** The command fails with the same `86adec4…` versus `bc53780…`
  release/candidate mismatch.
- **Why:** The chooser intent, content URI, MIME type, and read grant result is
  not accepted for this reviewed commit.
- **Concrete fix:** Bind the named chooser result and released APK to the exact
  accepted candidate, then make the declared command pass from a clean clone.

No minor finding is recorded. The four failures above are independently
blocking.

## Copy audit

Counts treat contractions, hyphenated terms, versions, commands, URLs, and file
names as one word. Punctuation-only arrows and separators are not words. No
sentence exceeds 22 words. No banned adjective, unexplained user-facing jargon,
metaphoric heading, inconsistent product term, or non-result button was found.
The four flags below concern failed evidence, not unclear copy.

### Landing page sentences and state copy

| Exact copy | Words | Result |
| --- | ---: | --- |
| For Android users who need cloud files in another app when the network disappears. | 14 | Clear audience and situation |
| A ready folder opens. | 4 | `demo-ready-sample` passes |
| Nothing is saved. | 3 | `demo-sandbox` passes |
| One folder is free. | 4 | `free-tier` passes |
| Files stay on your device. | 5 | `local-only` passes |
| Works after the first visit. | 5 | `offline-reload` passes |
| A paper folder crosses a small bridge into a phone-shaped tray. | 11 | Informative image alt |
| Every folder mirror shows its last successful refresh. | 8 | `freshness` passes |
| A failed Android refresh keeps that date. | 7 | **F-6-2** |
| Android asks which folder this app may read. | 8 | **F-6-1** |
| No broad storage permission is requested. | 6 | **F-6-1** |
| The folder mirror records its successful refresh time, file count, and storage size. | 13 | `freshness` passes |
| Pick the local app that should receive the file, even while offline. | 12 | **F-6-4**; browser/offline parts pass |
| You approve each source folder. | 5 | **F-6-1** |
| Folder mirror files stay in app storage. | 7 | `local-only` passes |
| On Android, you can remove a folder mirror at any time. | 11 | **F-6-3** |
| It does not replace your storage service. | 7 | Clear product boundary |
| It does not crawl unapproved folders. | 6 | **F-6-1** |
| After a failed Android refresh, it keeps the last ready time. | 11 | **F-6-2** |
| Bridge Pro adds up to eight folder mirrors and keeps 30 refresh records per folder. | 15 | `free-tier` passes |
| The free version keeps one folder mirror. | 7 | `free-tier` passes |
| Paste the token from your purchase email. | 7 | Useful form instruction |
| Spaces alone are not a token. | 6 | Useful validation rule |
| This Android release records this site's exact commit and verified payload fingerprint. | 12 | `apk-payload-match` passes both branches |
| A matching APK is not ready yet. | 7 | Tested unavailable state |
| Check again later. | 3 | Clear recovery action |
| This license is no longer active. | 6 | Clear license state |
| Buy a new license or restore another. | 7 | Clear recovery action |
| Bridge Pro is active on this device. | 7 | Clear license state |
| Enter the license token from your purchase email, then verify it. | 11 | Clear validation recovery |
| That license is not active. | 5 | Clear verification state |
| Check the token and try again. | 6 | Clear recovery action |
| Keep approved folders ready offline. | 5 | Footer summary |

### Landing headings, controls, labels, and sample fragments

| Exact copy | Words | Result |
| --- | ---: | --- |
| Skip to main content / Offline File Bridge | 4 / 3 | Clear action / product label |
| Demo / Open folders / Install / Privacy | 1 / 2 / 1 / 1 | Clear navigation |
| Keep approved folders ready offline | 5 | Plain h1 |
| Try it with sample data | 5 | Result-naming primary action |
| Check latest APK / Install steps | 3 / 2 | Clear check action and destination |
| approved folder → folder mirror → another app | 6 | Consistent diagram caption |
| See what is ready before you leave | 7 | Descriptive preview heading |
| Open the working sample / Open sample | 4 / 2 | Result-naming links |
| Field notes | 2 | Realistic sample name |
| OpenCloud / Research · 3 files · 280.0 KB | 6 | Sample metadata |
| Ready · synced 12 min ago | 5 | Sample state |
| ridge-route.pdf / 277.3 KB / Ready | 1 / 2 / 1 | Sample file data |
| specimen-log.csv / 1.8 KB / Ready | 1 / 2 / 1 | Sample file data |
| How to keep a folder ready offline | 7 | Functional workflow heading |
| Choose a folder / Refresh the folder mirror / Open a ready file | 3 / 4 / 4 | Clear step headings |
| Your folder stays under your control / What it does not do | 6 / 5 | Descriptive headings |
| Read the privacy note | 4 | Result-naming link |
| $14 / one-time purchase | 1 / 2 | `free-tier` passes billing inspection |
| Keep more folder mirrors | 4 | Descriptive price heading |
| Buy Bridge Pro / at the Sociobot checkout (external site) | 3 / 6 | Clear action and destination |
| Restore a Bridge Pro license / Paste your license token / Verify license | 5 / 4 / 2 | Persistent label, hint, and action |
| Built by Param Factory / v0.1.13 · Generated artwork | 4 / 3 | Attribution and version |

### README sentences and fragments

| Exact copy | Words | Result |
| --- | ---: | --- |
| Offline File Bridge | 3 | Clear title |
| Keep an approved folder ready offline, see when it last refreshed, and open its files in another Android app. | 19 | **F-6-4** affects the Android handoff evidence |
| Offline File Bridge is for Android users who need a cloud file in another local app. | 16 | Clear audience |
| It copies files from an approved folder into a folder mirror. | 11 | Consistent product term |
| Live site / One-click demo / What v1 includes | 2 / 2 / 3 | Clear labels and heading |
| Android's folder picker remembers read access only for folders you approve | 11 | **F-6-1** |
| Folder mirrors stored on the device | 6 | `local-only` passes |
| Visible file counts, storage sizes, and last successful refresh times | 10 | `freshness` passes |
| Open a ready file in another Android app | 8 | **F-6-4** |
| In supported browsers, selected folder files stay available after reload | 10 | `browser-persistence` passes |
| A separate, resettable sample-data sandbox | 5 | Demo claims pass |
| A free one-folder-mirror tier and a $14 Bridge Pro license for up to eight folder mirrors | 16 | `free-tier` passes |
| The product does not replace a cloud provider or crawl unapproved folders. | 12 | Clear boundary; scoped behavior is F-6-1 |
| Run locally / Test and build / Android project / Privacy and licenses | 2 / 3 / 2 / 3 | Functional headings |
| Requirements: Node.js 20 or newer. | 5 | Clear prerequisite |
| Open `http://localhost:5173/` or go straight to `http://localhost:5173/demo`. | 7 | Clear instruction |
| The production command is `npm run build`. | 7 | Verified instruction |
| It writes the static site to `dist/`. | 7 | Verified build result |
| The root file is `dist/index.html`. | 5 | Verified build result |
| `npm test` runs browser claims on desktop and mobile Chromium. | 10 | Verified command scope |
| It removes only this repository's stale preview process. | 8 | Verified by the clean run |
| Playwright starts and closes its server. | 6 | Verified by the clean run |
| `npm run test:unit` checks release metadata and Android source safeguards. | 10 | Verified by 17 passing unit tests |
| Android outcome claims run against an installed release APK in the release workflow. | 13 | Intended method; this candidate is rejected by F-6-1–F-6-4 |
| A clean checkout checks the app file's checksum and the published Android test result. | 14 | Command runs, but rejects this candidate in F-6-1–F-6-4 |
| Run one with `npm run test:android-claim -- <claim-id>`. | 7 | Clear command |
| Run one claim with: | 4 | Clear instruction |
| The Capacitor 8 project lives in `android/` with app id `in.sociobot.offline_file_bridge`. | 11 | Developer detail |
| The Android plugin opens the approved-folder picker. | 7 | **F-6-1** |
| It copies selected files into private app storage. | 8 | Android evidence is candidate-bound |
| It opens a ready file in Android's app chooser. | 9 | **F-6-4** |
| Real browser mirrors use the `offline-file-bridge-real` IndexedDB database. | 8 | Confirmed by code and browser tests |
| Demo state uses only the `demo:offline-file-bridge` localStorage key. | 8 | `demo-sandbox` passes |
| The app sends no file contents to a server. | 9 | `local-only` passes |
| License verification sends a token only to the Sociobot billing API. | 11 | `license-verification-privacy` passes |
| See Privacy, Terms, and demo details. | 6 | Clear pointers |
| Source code is available under the MIT License. | 8 | Repository fact confirmed |
| Generated visual assets and their prompts are documented in `.factory/design.md`. | 10 | Repository fact confirmed |

The shell blocks are executable instructions rather than sentences. No
unlisted product claim-like sentence was found on the landing page or in the
README. Terminology remains consistent: approved offline object → **folder
mirror**; operation → **refresh**; completed state → **ready**; paid tier →
**Bridge Pro**; sample inspection → **preview**.

## Demo and sandbox behavior

- The landing action reaches `/demo` in one click. At 390 × 844, **Field notes**
  is at y=529–562 and **Preview ridge-route.pdf** is at y=787–831, with no
  scroll. The first screen therefore shows a real folder, source, count, size,
  ready time, filename, and action. Evidence: [mobile demo](verification-artifacts/review-6-live-demo-mobile.png).
- The persistent banner says **Demo — sample data, nothing is saved** and has
  **Reset demo** and **Start for real**.
- Refresh changes the state to **synced just now**. Reset restores **synced 12
  min ago**, announces **Sample data was reset**, and returns focus to Reset.
- A `real:review-6-sentinel` value and an unrelated `review-6-sentinel`
  IndexedDB database remained unchanged. Demo created only
  `demo:offline-file-bridge`; it did not open `offline-file-bridge-real`.
  **Start for real** removed the demo key, preserved the real sentinel, and
  opened `/app`.
- Once controlled by the service worker, a live offline reload showed
  **Offline — ready files still open**, retained `ridge-route.pdf`, and opened
  its bundled route-sheet text. No request failed and no foreign request was
  made.

The demo and sandbox requirements pass.

## Claims audit

The repository was cloned without hard links to
`/tmp/offline-file-bridge-review6.8oS9mp/clean`. `npm ci` installed the pinned
dependencies with zero vulnerabilities. Every literal `test` command in
`.factory/claims.json` was run independently.

| Claim | Exact command result | Evidence assessment |
| --- | --- | --- |
| `apk-payload-match` | PASS | Exact-match enable and stale-payload rejection run in the one tagged test |
| `offline-reload` | PASS | Offline reload and ready sample preview exercised |
| `demo-sandbox` | PASS | Demo namespace and absent real product DB asserted |
| `demo-ready-sample` | PASS | One-click sample and mobile above-fold positions asserted |
| `demo-reset` | PASS | Refresh then reset without reload asserted |
| `local-only` | PASS | Demo and imported-file request logs asserted |
| `freshness` | PASS | Time, file count, and storage size asserted |
| `file-handoff` | PASS | Preview and named file download asserted |
| `scoped-folder-access` | **FAIL** | Release commit differs from candidate — F-6-1 |
| `free-tier` | PASS | One/eight limits, 30 records, USD 14.00, 1400 cents, and one-time checkout text asserted |
| `browser-persistence` | PASS | Two selected files survive reload |
| `browser-mirror-removal` | PASS | Saved browser mirror records are deleted |
| `browser-storage-clearing` | PASS | Clearing origin storage removes the browser DB |
| `native-refresh-safety` | **FAIL** | Release commit differs from candidate — F-6-2 |
| `license-verification-privacy` | PASS | Sole foreign request is the documented Sociobot endpoint |
| `checkout` | PASS | Endpoint redirects to a hosted Dodo checkout |
| `consent-removal` | **FAIL** | Release commit differs from candidate — F-6-3 |
| `native-handoff` | **FAIL** | Release commit differs from candidate — F-6-4 |

Result: **14/18 claim commands pass; 4/18 fail**. The independent
`npm run test:release-artifact` check fails on the same commit mismatch. The
general clean-clone gates pass: `npm run lint`, `npm run test:unit` (**17/17**),
`npm test` (**78/78**), and `npm run build`. The build produces `dist/`; its
JavaScript is 39.26 KB raw and 13.75 KB gzip.

Privacy, Terms, and Install were also reread for claim-like copy. Their storage,
deletion, billing, freshness, release-check, folder-access, and chooser
statements map to the listed claims above; the remaining text is legal scope,
contact information, or installation instruction. No additional unlisted
claim was found.

## Structure, links, accessibility, and visual identity

| Route | Status | Title | H1 | Result |
| --- | ---: | --- | --- | --- |
| `/` | 200 | Offline File Bridge — keep folders ready offline | Keep approved folders ready offline | Pass |
| `/demo` | 200 | Demo — Offline File Bridge | Open your offline folders | Pass |
| `/app` | 200 | Folder mirrors — Offline File Bridge | Open your offline folders | Pass |
| `/privacy` | 200 | Privacy — Offline File Bridge | Your files stay on your device | Pass |
| `/terms` | 200 | Terms — Offline File Bridge | Terms for Offline File Bridge | Pass |
| `/install` | 200 | Install — Offline File Bridge | Install Offline File Bridge | Pass |
| unknown | 404 | Page not found — Offline File Bridge | Page not found | Pass |

- Every route has `lang="en"`, one h1, one main landmark, a route-specific
  description, favicon, apple-touch icon, 1200 × 630 OG image, Twitter card,
  consistent header/footer, and Privacy/Terms links. Known routes have their
  own canonical; the 404 has none.
- `robots.txt`, `sitemap.xml`, the manifest, icons, art, and all six public
  routes return 200. The sitemap lists all six routes. Every discovered link
  resolves: internal links and Param Factory return 200, checkout returns 303
  to its hosted session, and mail links are explicit.
- Deep links load the requested state. In-app navigation and Back update the
  title, scroll position, polite announcer, and focus the destination h1.
- Live Axe scans found zero violations on all seven checked routes at 390 px in
  both light and dark modes. The clean suite also passes keyboard access, 44 px
  targets, 200% reflow, and reduced motion.
- The live response sends CSP, HSTS, `nosniff`, referrer policy, and permissions
  policy headers. No application or CSP console error was observed.
- The graph-paper notebook, original folder/bridge art, handwritten display
  face, taped diagram, stamped states, and asymmetric paper cards match
  `.factory/design.md`. This is a product-specific identity, not a generic SaaS
  template.

## Earlier-review history

Every finding in reviews 1–5 and polish rounds 1–5 was checked against current
code and the live site rather than accepted from its status label.

| Earlier finding | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 Reset display | Live Reset rerenders the seed, announces success, and restores focus. | Fixed |
| F-1-2 Ready sample | One click shows Field notes and three ready files in the demo namespace. | Fixed |
| F-1-3 Failed-refresh scope | Both landing statements remain Android-specific. | Fixed as copy; evidence regresses in F-6-2 |
| F-1-4 Paid promises | Unsupported refund/device/export copy is absent; checkout inspection verifies price and one-time text. | Fixed |
| F-1-5 Browser API wording | README states the tested supported-browser reload behavior. | Fixed |
| F-1-6 Release-process copy | Visitor-facing JDK, signing, emulator, and publication promises remain absent. | Fixed |
| F-1-7 License privacy | Fixture-token interception proves the Sociobot-only destination. | Fixed |
| F-1-8 Hero mood line | Absent from live copy and source. | Fixed |
| F-1-9 Metaphoric workflow heading | Live heading is “How to keep a folder ready offline.” | Fixed |
| F-1-10 Decorative notebook labels | “field check” and “advanced field kit” remain absent. | Fixed |
| F-1-11 Folder terminology | Landing, metadata, README, and demo guide consistently use **folder mirror**. | Fixed |
| F-1-12 Ambiguous controls | Controls name Open, Check, Preview, Refresh, Remove, Buy, or Verify results. | Fixed |
| F-1-13 404 h1 | Live h1 is “Page not found.” | Fixed |
| F-1-14 404 canonical | Unknown routes have no canonical element. | Fixed |
| F-2-1 Install/release assertions | Play Store, signing, PWA-ready, and AAB assertions remain absent. | Fixed |
| F-2-2 Install jargon | Debug-keystore and upload-key prose remains absent. | Fixed |
| F-3-1 Scoped installed-APK outcome | Exact command rejects this candidate. | **Regressed as F-6-1 / F-5-1** |
| F-3-2 Failed-refresh installed-APK outcome | Exact command rejects this candidate. | **Regressed as F-6-2 / F-5-2** |
| F-3-3 Removal installed-APK outcome | Exact command rejects this candidate. | **Regressed as F-6-3 / F-5-3** |
| F-3-4 Chooser installed-APK outcome | Exact command rejects this candidate. | **Regressed as F-6-4 / F-5-4** |
| F-3-5 Download control result | First control says Check latest APK; success produces a versioned download. | Fixed |
| F-3-6 “Secure checkout” | Copy names the Sociobot checkout and external destination without “secure.” | Fixed |
| F-3-7 Storage Access Framework jargon | README says “Android's folder picker.” | Fixed |
| F-3-8 FileProvider jargon | README says “Android's app chooser.” | Fixed |
| F-3-9 Terms h1 | Live h1 is “Terms for Offline File Bridge.” | Fixed |
| F-4-1 Privacy deletion claims | Browser removal/clearing claims are listed and pass; Android claim is listed but currently fails as F-6-3. | Fixed as listing; current evidence failure recorded |
| F-4-2 README test jargon | README uses release metadata, checksum, and published test result in plain language. | Fixed |
| F-5-1 Candidate-bound picker evidence | `v0.1.13` binds to `86adec4…`, not this candidate. | **Regressed; F-6-1** |
| F-5-2 Candidate-bound refresh evidence | Same commit mismatch. | **Regressed; F-6-2** |
| F-5-3 Candidate-bound removal evidence | Same commit mismatch. | **Regressed; F-6-3** |
| F-5-4 Candidate-bound chooser evidence | Same commit mismatch. | **Regressed; F-6-4** |
| F-5-5 Mobile demo first viewport | Field notes and ridge-route.pdf are fully visible at 390 × 844. | Fixed |
| F-5-6 Stale APK payload branch | The one tagged test exercises exact and stale payload records. | Fixed |

## Missed leverage

No AI feature is justified. This is deterministic, privacy-sensitive local
file mirroring and Android handoff; sending filenames or contents to a model
would weaken the offline premise. The product already includes the brief's
folder selection/import, manual refresh/sync, freshness status, removal, and
handoff paths. No additional AI, import/export, or sync finding is raised.

## What would make this perfect

Publish and deploy one candidate-bound Android release for
`bc537802f61ba014c4cc6b1e6b00292fe4b13dc1`, including matching APK provenance
and all four named Android 35 results. Then rerun all 18 literal claim commands
from a fresh clone. If they all pass, the present first screen, demo, copy,
privacy behavior, routing, accessibility, and visual identity leave nothing
else to fix.
