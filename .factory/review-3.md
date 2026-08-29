# Adversarial first-read review 3

- **Product:** Offline File Bridge
- **Reviewed:** 29 August 2026 UTC
- **Live URL:** <https://offline-file-bridge.sociobot.in>
- **Candidate:** `03b92280012a638b912a3a54751b0227c980ca54`
- **Verdict:** **FAIL**

The cold first screen and live demo pass. The review still fails because five
declared claims do not have outcome tests, an earlier terminology finding is
only partly fixed, and five smaller copy or structure defects remain. A zero-finding PASS is
therefore not available.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 1000. Nothing was
scrolled before this check.

- **What it does:** keeps an approved folder available offline, then lets an
  Android user open its files in another app.
- **For whom:** Android users who need a cloud file in another app when their
  network disappears.
- **What to click first:** **Try it with sample data**. The adjacent copy says,
  “A ready folder opens. Nothing is saved.”

All three answers are present on the first screen at both sizes. The 390 px page
has no horizontal overflow. Cold loads made only same-origin requests and
logged no console or page errors.

## Findings

### Blocking

#### F-1-4 — The refund and license-revocation promise is still not tested

- **Exact quote / location:** `/terms`: “Refunds are handled by Sociobot/Dodo
  Payments. A refunded purchase revokes its license automatically.”
  `.factory/claims.json` → `billing-legal`; `tests/site.spec.ts:169`.
- **Why this remains open:** the listed command passes, but its test only checks
  that the quoted sentences are rendered. It never creates a purchase, applies
  a refund fixture, or confirms that the license becomes invalid. This is the
  same unsupported paid-feature promise raised in review 1, now accompanied by
  a tautological text test rather than an outcome test.
- **Concrete fix:** use a Sociobot billing sandbox or recorded billing fixture
  to create an active license, apply a refund event, and assert that the verify
  endpoint rejects the license. Verify the merchant-of-record field from the
  hosted checkout response. Otherwise remove the operational refund and
  automatic-revocation claims.

#### F-1-11 — “Folder mirror” and “local copy” still name the same object

- **Exact quotes / locations:** landing diagram, “folder → local copy → your
  app”; landing step, “Refresh its local copy”; README, “It copies files from an
  approved folder into a folder mirror.”
- **Why this remains open:** the product's own terminology table chooses
  **folder mirror**, but the live landing page still gives that object a second
  name. This is the unresolved portion of the terminology finding from review
  1. A first-time reader must infer whether a local copy and a folder mirror are
  different things.
- **Concrete fix:** use **folder mirror** throughout. Suggested landing copy:
  “approved folder → folder mirror → another app” and “Refresh the folder
  mirror.”

#### F-3-1 — The scoped-folder claim test checks source text, not Android behavior

- **Exact claim / location:** `scoped-folder-access`: “Android uses the system
  folder picker without broad storage permission.” The listed test at
  `tests/claims.spec.ts:87` reads two source files and searches for
  `ACTION_OPEN_DOCUMENT_TREE` and permission strings.
- **Why:** source tokens do not prove that the built APK exposes the system
  picker or omits broad permissions. The claim contract requires the promised
  result to happen in the sandbox.
- **Concrete fix:** make the exact `claims.json` command build/install the APK
  and run `installedApkUsesScopedFolderPickerAndNoBroadStoragePermission` from
  `OfflineBridgeInstrumentedTest.java`. Assert the installed package manifest
  and launched picker intent.

#### F-3-2 — The failed-refresh claim test never performs a failed refresh

- **Exact claim / location:** `native-refresh-safety`: “A failed Android
  refresh keeps the previous ready local mirror.” The listed test at
  `unit/android-regressions.test.ts:11` only checks for selected Java source
  strings and their order.
- **Why:** the command can pass while file operations, error handling, or the
  built APK are broken. It does not stage a partial replacement, fail, and read
  the previous ready file.
- **Concrete fix:** point the claim to an executable JVM or installed-APK test
  that writes a completed mirror, abandons a partial staging copy, and confirms
  the previous bytes and ready timestamp remain unchanged. The repository
  already contains relevant Java tests; the declared command must run them.

#### F-3-3 — The consent-removal claim test never removes data or folder access

- **Exact claim / location:** `consent-removal`: “Removing an Android mirror
  deletes its local copy and releases its folder access.” The listed test at
  `unit/android-regressions.test.ts:26` only searches source for deletion,
  release, and preference calls.
- **Why:** call order in source is not evidence that files are deleted and the
  persisted SAF grant is released on Android.
- **Concrete fix:** make the claim command run an Android test that seeds a
  private mirror and a real persisted test grant, invokes removal, then asserts
  the files, preference entries, and grant are gone. Do not substitute source
  matching for the unavailable grant assertion.

#### F-3-4 — The native handoff claim test never opens the Android chooser

- **Exact claim / location:** `native-handoff`: “Android opens ready private
  copies through the system app chooser.” The listed test at
  `unit/android-regressions.test.ts:38` searches for `FileProvider`,
  `ACTION_VIEW`, and chooser strings.
- **Why:** those tokens can exist even when the installed intent, URI authority,
  MIME type, or read grant is wrong.
- **Concrete fix:** make the exact claim command run
  `readyPrivateCopyUsesSystemChooserAndReadOnlyFileProviderUri` against the
  installed APK and assert the chooser intent, content URI, MIME type, and
  read-only grant.

### Minor

#### F-3-5 — The landing download button does not perform its named result

- **Exact quote / location:** landing button, “Download the latest APK.”
- **Why:** its first click only queries GitHub and replaces itself with a second
  download link. A visitor expecting a download receives no download.
- **Concrete fix:** label the first control **Check latest APK**. After a match,
  show **Download APK v0.1.8** as the result-naming link; or validate first and
  start the download from the original click.

#### F-3-6 — “Secure checkout” is an unlisted marketing claim

- **Exact quote / location:** landing, screen-reader text on **Buy Bridge Pro**:
  “at the external secure checkout.”
- **Why:** `checkout` proves a redirect to a hosted Dodo session, not the broad
  adjective “secure.” Sighted visitors do not see the claim, but screen-reader
  users hear it.
- **Concrete fix:** use “at the Sociobot checkout (external site)” and keep the
  existing redirect test.

#### F-3-7 — The README uses unexplained Storage Access Framework jargon

- **Exact quote / location:** README, What v1 includes: “An Android Storage
  Access Framework picker with persisted, folder-scoped read access.”
- **Why:** this is implementation vocabulary in the user-facing feature list.
- **Concrete rewrite:** “Android's folder picker remembers read access only for
  folders you approve.”

#### F-3-8 — The README uses unexplained FileProvider jargon

- **Exact quote / location:** README, What v1 includes: “Android open-with
  handoff through a narrow `FileProvider`.”
- **Why:** “narrow” is vague, and `FileProvider` does not tell a reader what they
  can do.
- **Concrete rewrite:** “Open a ready file in another Android app.” Move the
  `FileProvider` detail to the Android developer section if needed.

#### F-3-9 — The Terms h1 does not identify the page

- **Exact quote / location:** `/terms` h1, “Use the bridge with files you
  control.”
- **Why:** “the bridge” depends on product lore, and a heading list does not say
  that this is the terms page.
- **Concrete rewrite:** “Terms for Offline File Bridge.”

## Copy audit

Counts treat hyphenated terms, versions, paths, URLs, and code identifiers as
one word. Labels and fragments are included so controls and headings are not
silently omitted. No item exceeds 22 words and no banned plain-words adjective
appears. The flagged items are F-1-11 and F-3-5 through F-3-8.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Offline File Bridge | 3 | Product label |
| Demo | 1 | Clear navigation label |
| Open folders | 2 | Clear action |
| Install | 1 | Clear navigation label |
| Privacy | 1 | Clear navigation label |
| Keep approved folders ready offline | 5 | Clear h1 |
| For Android users who need cloud files in another app when the network disappears. | 14 | Clear audience and situation |
| Try it with sample data | 6 | Clear primary action |
| A ready folder opens. | 4 | `demo-ready-sample` |
| Nothing is saved. | 3 | `demo-sandbox` |
| One folder is free. | 4 | `free-tier` |
| Files stay on your device. | 5 | `local-only` |
| Works after the first visit. | 5 | `offline-reload` |
| Download the latest APK | 4 | **F-3-5** |
| Install steps | 2 | Clear action |
| A paper folder crosses a small bridge into a phone-shaped tray. | 11 | Useful image alt |
| folder → local copy → your app | 5 | **F-1-11** |
| See what is ready before you leave | 8 | Useful section heading |
| Every folder mirror shows its last successful refresh. | 8 | `freshness` |
| A failed Android refresh keeps that date. | 8 | `native-refresh-safety`; test defect F-3-2 |
| Open the working sample | 4 | Clear action |
| Field notes | 2 | Sample name |
| OpenCloud / Research · 3 files · 280.0 KB | 6 | Sample metadata |
| Ready · synced 12 min ago | 5 | Sample status |
| ridge-route.pdf / 277.3 KB / Ready | 1 / 2 / 1 | Sample file metadata |
| specimen-log.csv / 1.8 KB / Ready | 1 / 2 / 1 | Sample file metadata |
| Open sample | 2 | Clear action |
| How to keep a folder ready offline | 7 | Useful section heading |
| Choose a folder | 3 | Clear step heading |
| Android asks which folder this app may read. | 8 | `scoped-folder-access`; test defect F-3-1 |
| No broad storage permission is requested. | 6 | `scoped-folder-access`; test defect F-3-1 |
| Refresh its local copy | 4 | **F-1-11** |
| The folder mirror records its successful refresh time, file count, and storage size. | 13 | `freshness` |
| Open a ready file | 4 | Clear step heading |
| Pick the local app that should receive the file, even while offline. | 12 | `native-handoff`, `offline-reload`; test defect F-3-4 |
| Your folder stays under your control | 6 | Understandable privacy heading |
| You approve each source folder. | 5 | `scoped-folder-access`; test defect F-3-1 |
| Folder mirror files stay in app storage. | 7 | `local-only` |
| On Android, you can remove a folder mirror at any time. | 11 | `consent-removal`; test defect F-3-3 |
| What it does not do | 5 | Useful boundary heading |
| It does not replace your storage service. | 7 | Product boundary |
| It does not crawl unapproved folders. | 6 | `scoped-folder-access`; test defect F-3-1 |
| After a failed Android refresh, it keeps the last ready time. | 11 | `native-refresh-safety`; test defect F-3-2 |
| Read the privacy note | 4 | Clear action |
| $14 one-time purchase | 3 | `free-tier` |
| Keep more folder mirrors | 4 | Useful pricing heading |
| Bridge Pro adds up to eight folder mirrors and keeps 30 refresh records per folder. | 15 | `free-tier` |
| The free version keeps one folder mirror. | 7 | `free-tier` |
| Buy Bridge Pro | 3 | Clear action; `checkout` |
| at the external secure checkout | 5 | **F-3-6** |
| Restore a Bridge Pro license | 5 | Clear form label |
| Paste your license token | 4 | Clear placeholder; persistent label is present |
| Verify license | 2 | Clear action |
| Paste the token from your purchase email. | 7 | Useful help |
| Spaces alone are not a token. | 6 | Useful validation rule |
| This Android release records this site's exact commit and verified payload fingerprint. | 12 | `apk-payload-match` |
| Download SHA256SUMS | 2 | Clear verified-state action |
| APK v0.1.8 is being published | 5 | Clear unavailable-state label |
| A matching APK is not ready yet. | 7 | Clear unavailable state |
| Check again later. | 3 | Clear recovery action |
| Keep approved folders ready offline. | 5 | Footer summary |
| Built by Param Factory | 4 | Attribution |
| v0.1.8 · Generated artwork | 3 | Version and provenance label |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Offline File Bridge | 3 | Clear title |
| Keep an approved folder ready offline, see when it last refreshed, and open its files in another Android app. | 19 | `offline-reload`, `freshness`, `native-handoff` |
| Offline File Bridge is for Android users who need a cloud file in another local app. | 16 | Clear audience |
| It copies files from an approved folder into a folder mirror. | 11 | `scoped-folder-access`, `local-only` |
| Live site | 2 | Clear link label |
| One-click demo | 2 | Clear link label |
| What v1 includes | 3 | Clear heading |
| An Android Storage Access Framework picker with persisted, folder-scoped read access | 11 | **F-3-7** |
| Folder mirrors stored on the device | 6 | `local-only` |
| Visible file counts, storage sizes, and last successful refresh times | 9 | `freshness` |
| Android open-with handoff through a narrow FileProvider | 7 | **F-3-8** |
| In supported browsers, selected folder files stay available after reload | 10 | `browser-persistence` |
| A separate, resettable sample-data sandbox | 5 | `demo-sandbox`, `demo-reset` |
| A free one-folder-mirror tier and a $14 Bridge Pro license for up to eight folder mirrors | 16 | `free-tier` |
| The product does not replace a cloud provider or crawl unapproved folders. | 12 | Product boundary and `scoped-folder-access` |
| Run locally | 2 | Clear heading |
| Requirements: Node.js 20 or newer. | 5 | Clear prerequisite |
| Open `http://localhost:5173/` or go straight to `http://localhost:5173/demo`. | 8 | Clear instruction |
| Test and build | 3 | Clear heading |
| The exact production command is `npm run build`. | 8 | Clear instruction |
| It writes the deployable static site to `dist/`, with `dist/index.html` at the root. | 13 | Clear build result |
| `npm test` runs the browser claims on desktop and mobile Chromium. | 11 | Accurate test description |
| It removes only a stale preview process from this repository before Playwright starts and closes its own server. | 18 | Specific test behavior |
| `npm run test:unit` runs the three native source regressions; together they run every command listed in `.factory/claims.json`. | 19 | Accurate, but exposes the source-test limitation in F-3-2–F-3-4 |
| Run one claim with: | 4 | Clear instruction |
| Android project | 2 | Clear developer heading |
| The Capacitor 8 project lives in `android/` with app id `in.sociobot.offline_file_bridge`. | 11 | Useful developer detail |
| The custom `OfflineBridgePlugin` opens Android's folder picker. | 7 | `scoped-folder-access`; test defect F-3-1 |
| It copies selected files into private app storage. | 8 | `local-only` |
| It hands a chosen copy to Android's app chooser. | 9 | `native-handoff`; test defect F-3-4 |
| Privacy and licenses | 3 | Clear heading |
| Real browser mirrors use the `offline-file-bridge-real` IndexedDB database. | 8 | Exact storage disclosure |
| Demo state uses only the `demo:offline-file-bridge` localStorage key. | 8 | `demo-sandbox` |
| The app sends no file contents to a server. | 9 | `local-only` |
| License verification sends a token only to the Sociobot billing API. | 10 | `license-verification-privacy` |
| See Privacy, Terms, and demo details. | 6 | Clear links |
| Source code is available under the MIT License. | 8 | Confirmed by `LICENSE` |
| Generated visual assets and their prompts are documented in `.factory/design.md`. | 10 | Confirmed in repository |

## Demo and sandbox

- One click from the live landing page opens `/demo`.
- The settled first mobile screen shows the demo banner, app h1, one folder
  mirror, three ready files, and 280.0 KB of realistic sample data.
- The persistent banner says **Demo — sample data, nothing is saved** and offers
  **Reset demo** and **Start for real**.
- Refresh changed the live status to **synced just now**. Reset restored one
  history record and **synced 12 min ago**, announced **Sample data was reset**,
  and returned focus to Reset.
- A real localStorage sentinel and an unrelated IndexedDB sentinel survived the
  demo unchanged. While the banner was present, only
  `demo:offline-file-bridge` was created; the real product database was not
  opened. Leaving the demo deleted the demo key.
- After the first visit, an offline reload showed **Offline — ready files still
  open** and previewed `handoff-notes.md` with its bundled content.
- Landing, demo, refresh, reset, offline preview, and exit emitted only
  same-origin product requests. No analytics, CDN font/script, file upload, or
  console error was observed.

## Claims audit

The repository was cloned without hard links to
`/tmp/offline-file-bridge-review3.h51D1x/clean`; `npm ci` installed 148 packages
with zero vulnerabilities. Every literal `test` command in
`.factory/claims.json` was run separately. All 17 commands exited 0. Exit status
does not cure the five non-outcome tests identified above.

| Claim | Command result | Coverage assessment |
| --- | --- | --- |
| `billing-legal` | PASS, 2 browser projects | **FAIL — repeats disclosure text; does not verify refund revocation (F-1-4)** |
| `apk-payload-match` | PASS, 2 browser projects | Matching and stale payload branches exercised |
| `offline-reload` | PASS, 2 browser projects | Offline reload and ready-file preview exercised |
| `demo-sandbox` | PASS, 2 browser projects | Demo namespace and absent real DB asserted |
| `demo-ready-sample` | PASS, 2 browser projects | One-click ready three-file sample asserted |
| `demo-reset` | PASS, 2 browser projects | Refresh then reset without reload asserted |
| `local-only` | PASS, 2 browser projects | Demo and browser-selected file request logs asserted |
| `freshness` | PASS, 2 browser projects | Count, size, and changed refresh time asserted |
| `file-handoff` | PASS, 2 browser projects | Preview and named file download asserted |
| `scoped-folder-access` | PASS, 2 browser projects | **FAIL — source tokens only (F-3-1)** |
| `free-tier` | PASS, 2 browser projects | Free and Pro limits, price, history cap, and checkout URL asserted |
| `browser-persistence` | PASS, 2 browser projects | Selected files survived reload |
| `native-refresh-safety` | PASS, 1 Vitest assertion | **FAIL — source tokens only (F-3-2)** |
| `license-verification-privacy` | PASS, 2 browser projects | Sole foreign request destination asserted |
| `checkout` | PASS, 2 browser projects | Live 303 to hosted Dodo session asserted |
| `consent-removal` | PASS, 1 Vitest assertion | **FAIL — source tokens only (F-3-3)** |
| `native-handoff` | PASS, 1 Vitest assertion | **FAIL — source tokens only (F-3-4)** |

The aggregate clean-clone gates also passed: `npm test` 76/76,
`npm run test:unit` 8/8, `npm run lint`, `npm run build`, and
`npm audit --omit=dev`. The build produced `dist/` and 39.28 KB of JavaScript
(13.82 KB gzip).

## Structure, links, accessibility, and visual identity

- Live `/`, `/demo`, `/app`, `/install`, `/privacy`, and `/terms` returned 200.
  The designed unknown route returned 404 with **Page not found**, no canonical,
  and a route home.
- Every checked route has `lang="en"`, one h1, one main landmark, its own plain
  title and description, favicon, OG/Twitter metadata, and the same header and
  footer with Privacy and Terms. F-3-9 is the remaining heading-copy defect.
- The sitemap lists all six real routes. `robots.txt`, sitemap, manifest,
  favicon, apple-touch icon, and the 1200 × 630 OG image return 200.
- Every discovered internal route returns 200. The intentional unknown-route
  skip target remains on the 404 response. Param Factory returns 200, checkout
  returns 303 to Dodo, and the live APK and checksum links return GitHub asset
  redirects. Mail links are explicit.
- Deep links load the correct route. In-page navigation and Back restore the
  route, scroll to the top, announce the h1, and focus the h1 after the async
  route render.
- Playwright Axe found zero serious or critical issues on every route at
  desktop size. The full suite also passed keyboard navigation, 44 px targets,
  200% text reflow, mobile overflow, and reduced motion. `verify-url.sh` passed
  with one h1, `lang`, main, complete image alt text, and no console errors.
- The graph-paper field notebook, hand-drawn type, folder/bridge illustration,
  stamped states, and asymmetric paper panels match `.factory/design.md` and
  are visually distinct from a generic SaaS template. Assets are local and
  provenance is recorded.

## Earlier-review history

| Earlier finding | Live and code confirmation | Result |
| --- | --- | --- |
| F-1-1 Reset display | Reset rerenders the seed, announces it, and restores focus. | Fixed |
| F-1-2 Ready sample | One click opens Field notes with three ready files in the demo namespace. | Fixed |
| F-1-3 Failed-refresh scope | Live wording is Android-specific. The separate adequacy defect is F-3-2. | Fixed as scoped |
| F-1-4 Paid promises | Refund/revocation wording returned with a text-only test. | **Not fixed; blocking** |
| F-1-5 Browser API wording | README now states the tested reload behavior. | Fixed |
| F-1-6 Release-process promises | Unsupported workflow/JDK prose is absent. | Fixed |
| F-1-7 License privacy | The fixture-token request test proves the Sociobot-only destination. | Fixed |
| F-1-8 Hero mood line | Removed. | Fixed |
| F-1-9 Metaphoric workflow heading | Replaced with “How to keep a folder ready offline.” | Fixed |
| F-1-10 Decorative notebook labels | Removed. | Fixed |
| F-1-11 Terminology | “Folder mirror” still alternates with “local copy.” | **Partly fixed; blocking** |
| F-1-12 Ambiguous bridge/file controls | “Open folders” and file-specific Preview controls are clear. | Fixed |
| F-1-13 404 h1 | The live h1 is “Page not found.” | Fixed |
| F-1-14 404 canonical | Unknown routes have no canonical. | Fixed |
| F-2-1 Install/release assertions | Play-store, signing, PWA-ready, and AAB prose is absent. | Fixed |
| F-2-2 Install jargon | Debug-keystore and upload-key prose is absent. | Fixed |

## Missed leverage

No missing AI feature is justified. The job is deterministic local file
copying, freshness, and Android handoff; sending filenames or file contents to
an AI service would weaken the offline/privacy premise. The product already has
the brief's import, refresh/sync, and handoff steps. No additional leverage
finding is raised.

## What would make this perfect

Run the existing Android behavior checks from the exact claim commands and add
a real sandbox refund-revocation test. Then standardize **folder mirror**, make
the first APK control say what its first click does, remove “secure,” replace
the two README implementation phrases with plain outcomes, and name the Terms
page in its h1. After those changes, rerun the entire live and clean-clone
review; nothing less qualifies for PASS.
