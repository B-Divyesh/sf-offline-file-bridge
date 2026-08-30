# Adversarial first-read review 7

- **Product:** Offline File Bridge
- **Reviewed:** 30 August 2026 UTC
- **Live URL:** <https://offline-file-bridge.sociobot.in>
- **Candidate:** `dd88f49b36f32166b095970e97e485b4e53a63a2`
- **Verdict:** **PASS**

No finding remains. The cold first screen is clear at both requested widths, the
one-click demo starts with useful sample data, all 18 declared claim commands
pass independently from a clean clone, every earlier finding is closed, and the
live site passes the routing, copy, privacy, accessibility, and identity checks.

## Cold first read

Fresh Chromium contexts opened the live home page at 390 × 844 and 1440 × 900.
Nothing was scrolled before recording these answers.

- **What it does:** It keeps approved folders ready offline so their files can
  open in another Android app.
- **For whom:** Android users who need cloud files in another app when the
  network disappears.
- **What to click first:** **Try it with sample data**. The adjacent explanation
  says, “A ready folder opens. Nothing is saved.”

All three answers are visible above the fold at both sizes. The exact headline
is “Keep approved folders ready offline.” The exact audience sentence is “For
Android users who need cloud files in another app when the network disappears.”
The primary action, its result, three facts, APK check, and install link are also
visible without scrolling. Both cold loads returned 200, had no horizontal
overflow, made only same-origin requests, and logged no console or page error.

## Findings

None. There are no blocking or minor findings and therefore no `F-7-k` IDs.

## Copy audit

Counts use whitespace-delimited words; contractions, hyphenated terms, file
names, paths, URLs, and versions count as one word. Punctuation-only arrows and
separators do not count. Every visible landing sentence, reachable landing state
sentence, README sentence, heading, control, label, and list fragment is below.
No item exceeds 22 words. No banned marketing adjective, jargon, metaphor or
mood heading, inconsistent product term, or non-result-naming control was found.

### Landing page sentences

| Exact copy | Words | Result |
| --- | ---: | --- |
| For Android users who need cloud files in another app when the network disappears. | 14 | Clear audience and situation |
| A ready folder opens. | 4 | `demo-ready-sample` |
| Nothing is saved. | 3 | `demo-sandbox` |
| One folder is free. | 4 | `free-tier` |
| Files stay on your device. | 5 | `local-only` |
| Works after the first visit. | 5 | `offline-reload` |
| A paper folder crosses a small bridge into a phone-shaped tray. | 11 | Informative image alternative |
| Every folder mirror shows its last successful refresh. | 8 | `freshness` |
| A failed Android refresh keeps that date. | 7 | `native-refresh-safety` |
| Android asks which folder this app may read. | 8 | `scoped-folder-access` |
| No broad storage permission is requested. | 6 | `scoped-folder-access` |
| The folder mirror records its successful refresh time, file count, and storage size. | 13 | `freshness` |
| Pick the local app that should receive the file, even while offline. | 12 | `native-handoff`, `file-handoff` |
| You approve each source folder. | 5 | `scoped-folder-access` |
| Folder mirror files stay in app storage. | 7 | `local-only` |
| On Android, you can remove a folder mirror at any time. | 11 | `consent-removal` |
| It does not replace your storage service. | 7 | Clear product boundary |
| It does not crawl unapproved folders. | 6 | `scoped-folder-access` |
| After a failed Android refresh, it keeps the last ready time. | 11 | `native-refresh-safety` |
| Bridge Pro adds up to eight folder mirrors and keeps 30 refresh records per folder. | 15 | `free-tier` |
| The free version keeps one folder mirror. | 7 | `free-tier` |
| Paste the token from your purchase email. | 7 | Useful form instruction |
| Spaces alone are not a token. | 6 | Useful validation rule |
| This Android release records this site's exact commit and verified payload fingerprint. | 12 | `apk-payload-match` |
| A matching APK is not ready yet. | 7 | Tested unavailable state |
| Check again later. | 3 | Clear recovery |
| This license is no longer active. | 6 | Tested license state |
| Buy a new license or restore another. | 7 | Clear recovery |
| Bridge Pro is active on this device. | 7 | Tested license state |
| Enter the license token from your purchase email, then verify it. | 11 | Clear validation recovery |
| That license is not active. | 5 | Tested verification state |
| Check the token and try again. | 6 | Clear recovery |
| Keep approved folders ready offline. | 5 | Footer summary |

The 33 landing sentences average 7.6 words; the longest has 15 words.

### Landing headings, controls, labels, and sample fragments

| Exact copy | Words | Result |
| --- | ---: | --- |
| Skip to main content / Offline File Bridge | 4 / 3 | Clear action / product name |
| Demo / Open folders / Install / Privacy | 1 / 2 / 1 / 1 | Clear destinations |
| Keep approved folders ready offline | 5 | Job-naming h1 |
| Try it with sample data | 5 | Result-naming primary action |
| Check latest APK / Install steps | 3 / 2 | Clear check action / destination |
| approved folder → folder mirror → another app | 6 | Informative diagram caption |
| See what is ready before you leave | 7 | Descriptive preview heading |
| Open the working sample / Open sample | 4 / 2 | Result-naming links |
| Field notes | 2 | Realistic sample name |
| OpenCloud / Research · 3 files · 280.0 KB | 6 | Sample metadata |
| Ready · synced 12 min ago | 5 | Sample status |
| ridge-route.pdf / 277.3 KB / Ready | 1 / 2 / 1 | Sample file data |
| specimen-log.csv / 1.8 KB / Ready | 1 / 2 / 1 | Sample file data |
| How to keep a folder ready offline | 7 | Functional workflow heading |
| Choose a folder / Refresh the folder mirror / Open a ready file | 3 / 4 / 4 | Result-naming steps |
| Your folder stays under your control / What it does not do | 6 / 5 | Descriptive scope headings |
| Read the privacy note | 4 | Result-naming link |
| $14 / one-time purchase | 1 / 2 | `free-tier` |
| Keep more folder mirrors | 4 | Descriptive paid-tier heading |
| Buy Bridge Pro / at the Sociobot checkout (external site) | 3 / 6 | Action and destination |
| Restore a Bridge Pro license / Paste your license token / Verify license | 5 / 4 / 2 | Label, hint, and action |
| Download APK v0.1.14 / Download SHA256SUMS | 3 / 2 | Verified release results |
| Built by Param Factory / v0.1.14 · Generated artwork | 4 / 3 | Attribution and version |

### README sentences

| Exact copy | Words | Result |
| --- | ---: | --- |
| Keep an approved folder ready offline, see when it last refreshed, and open its files in another Android app. | 19 | Product job; listed claims |
| Offline File Bridge is for Android users who need a cloud file in another local app. | 16 | Clear audience |
| It copies files from an approved folder into a folder mirror. | 11 | Consistent product term |
| The product does not replace a cloud provider or crawl unapproved folders. | 12 | Clear boundary |
| Requirements: Node.js 20 or newer. | 5 | Clear prerequisite |
| Open `http://localhost:5173/` or go straight to `http://localhost:5173/?demo=1`. | 7 | Clear instruction |
| The production command is `npm run build`. | 7 | Verified instruction |
| It writes the static site to `dist/`. | 7 | Verified build result |
| The root file is `dist/index.html`. | 5 | Verified build result |
| `npm test` runs browser claims on desktop and mobile Chromium. | 10 | Verified command scope |
| It removes only this repository's stale preview process. | 8 | Specific test behavior |
| Playwright starts and closes its server. | 6 | Specific test behavior |
| `npm run test:unit` checks release metadata and Android source safeguards. | 10 | Verified by 19 unit tests |
| Android outcome claims run against an installed release APK in the release workflow. | 13 | Verified release method |
| A clean checkout checks the app checksum and published Android result. | 11 | Verified by four exact commands |
| Evidence-only commits may reuse that release; any product, claim, test, README, or configuration change requires a new one. | 18 | Verified release boundary |
| Run one with `npm run test:android-claim -- <claim-id>`. | 8 | Clear command |
| The Capacitor 8 project lives in `android/` with app id `in.sociobot.offline_file_bridge`. | 11 | Developer detail |
| The Android plugin opens the approved-folder picker. | 7 | `scoped-folder-access` |
| It copies selected files into private app storage. | 8 | `local-only` |
| It opens a ready file in Android's app chooser. | 9 | `native-handoff` |
| Real browser mirrors use the `offline-file-bridge-real` IndexedDB database. | 8 | Confirmed by code and tests |
| Demo state uses only the `demo:offline-file-bridge` localStorage key. | 8 | `demo-sandbox` |
| The app sends no file contents to a server. | 9 | `local-only` |
| License verification sends a token only to the Sociobot billing API. | 11 | `license-verification-privacy` |
| See Privacy, Terms, and demo details. | 6 | Clear pointers |
| Source code is available under the MIT License. | 8 | Repository fact confirmed |
| Generated visual assets and their prompts are documented in `.factory/design.md`. | 10 | Repository fact confirmed |

The 28 README sentences average 9.6 words; the longest has 19 words.

### README headings and list fragments

| Exact copy | Words | Result |
| --- | ---: | --- |
| Offline File Bridge | 3 | Product title |
| Live site / One-click demo / What v1 includes | 2 / 2 / 3 | Clear labels and heading |
| Android's folder picker remembers read access only for folders you approve | 11 | `scoped-folder-access` |
| Folder mirrors stored on the device | 6 | `local-only` |
| Visible file counts, storage sizes, and last successful refresh times | 10 | `freshness` |
| Open a ready file in another Android app | 8 | `native-handoff` |
| In supported browsers, selected folder files stay available after reload | 10 | `browser-persistence` |
| A separate, resettable sample-data sandbox | 5 | Demo claims |
| A free one-folder-mirror tier and a $14 Bridge Pro license for up to eight folder mirrors | 16 | `free-tier` |
| Run locally / Test and build / Run one claim with | 2 / 3 / 4 | Clear instructions |
| Android project / Privacy and licenses | 2 / 3 | Clear section headings |

Terminology is consistent: the approved offline object is a **folder mirror**;
copying updates is **refresh**; a completed copy is **ready**; the paid tier is
**Bridge Pro**; and viewing a sample file is **preview**.

## Demo and sandbox behavior

- The first-screen action reaches `/?demo=1` in one click. At 390 × 844, the
  first resulting screen already shows **Field notes**, its source, three-file
  count, 280.0 KB size, ready time, history count, and the complete first file
  name and Preview control.
- The persistent banner says **Demo — sample data, nothing is saved** and has
  working **Reset demo** and **Start for real** controls.
- Refresh changes the ready time to **synced just now**. Reset restores **synced
  12 min ago**, one history record, and announces **Sample data was reset**.
- A seeded real IndexedDB value and an unrelated localStorage sentinel remained
  unchanged through demo use. Demo state used only
  `demo:offline-file-bridge`. The clean claim test also confirms that a fresh
  demo never creates the real product database.
- Offline reload retained all three sample files, showed **Offline — ready files
  still open**, and opened the bundled `handoff-notes.md` preview.
- The complete demo, refresh, reset, and offline flow made only same-origin
  requests and logged no application or CSP errors.

The demo is useful immediately, Reset works, and real data remains isolated.

## Claims audit

The repository was cloned from GitHub into a fresh temporary directory. Its
HEAD was exactly `dd88f49b36f32166b095970e97e485b4e53a63a2`. After `npm ci`,
every literal `test` command in `.factory/claims.json` was run independently.

| Claim | Exact command result | Observable coverage |
| --- | --- | --- |
| `apk-payload-match` | PASS, 2 browser projects | Exact release enables download; matching-tag stale payload is rejected |
| `offline-reload` | PASS, 2 browser projects | Fresh demo reloads and opens a ready file offline |
| `demo-sandbox` | PASS, 2 browser projects | Demo namespace, controls, and absent real database |
| `demo-ready-sample` | PASS, 2 browser projects | One click, three files, ready state, and mobile above-fold placement |
| `demo-reset` | PASS, 2 browser projects | Refresh then reset without reload |
| `local-only` | PASS, 2 browser projects | Demo and imported-file request logs stay local |
| `freshness` | PASS, 2 browser projects | Time, count, size, and changed refresh time |
| `file-handoff` | PASS, 2 browser projects | Preview and correctly named sample download |
| `scoped-folder-access` | PASS | Published installed-release picker and permission evidence for v0.1.14 |
| `free-tier` | PASS, 2 browser projects | One/eight limits, 30 records, USD 14.00, 1400 cents, and one-time checkout |
| `browser-persistence` | PASS, 2 browser projects | Two selected files survive reload |
| `browser-mirror-removal` | PASS, 2 browser projects | Removing a mirror deletes its saved records |
| `browser-storage-clearing` | PASS, 2 browser projects | Clearing origin storage removes the browser database |
| `native-refresh-safety` | PASS | Published installed-release staged-failure evidence for v0.1.14 |
| `license-verification-privacy` | PASS, 2 browser projects | Sole foreign request is the documented Sociobot endpoint |
| `checkout` | PASS, 2 browser projects | Registered endpoint returns 303 to hosted Dodo checkout |
| `consent-removal` | PASS | Published installed-release private-file and access-record deletion evidence |
| `native-handoff` | PASS | Published installed-release chooser, URI, MIME, and read-grant evidence |

Result: **18/18 exact claim commands pass**. Landing, README, Privacy, Terms,
Install, metadata, controls, and reachable states were reread for claim-like
copy. Every product promise maps to one of those claims; the remaining copy is
scope, legal language, contact information, or an instruction. No unlisted or
untested claim was found.

The broader clean-clone gates also pass:

| Gate | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS, 19/19 |
| `npm test` | PASS, 80/80 across desktop and mobile Chromium |
| `npm run build` | PASS; `dist/` produced, JavaScript 39.30 KB raw / 13.77 KB gzip |
| `npm run test:release-artifact` | PASS; v0.1.14 payload fingerprint matched |
| `npm audit --omit=dev` | PASS; zero vulnerabilities |

## Earlier-review history

Every finding in reviews 1–6 and every polish/handoff claim was checked against
the current live site and source, not accepted from its earlier status label.

| Earlier finding | Live confirmation | Code/test confirmation | Result |
| --- | --- | --- | --- |
| F-1-1 Reset display | Reset visibly restores the seeded time and notice | `@claim:demo-reset` rerenders and restores focus | Fixed |
| F-1-2 Ready sample claim | One click shows Field notes and three files | `demo-ready-sample` is listed and passes | Fixed |
| F-1-3 Failed-refresh scope | Both statements say **Android refresh** | Installed staged-failure claim passes | Fixed |
| F-1-4 Paid promises | Only tested price, mode, limits, and checkout remain | `free-tier` and `checkout` pass billing checks | Fixed |
| F-1-5 Browser capability | README limits the promise to supported-browser reload | `browser-persistence` passes | Fixed |
| F-1-6 Release-process promises | No JDK, signing, emulator, or publication promise is visitor-facing | Copy contract and source search pass | Fixed |
| F-1-7 License privacy | Privacy names only the Sociobot billing API | Intercepted-token request test passes | Fixed |
| F-1-8 Hero mood line | No information-free hero line appears | Old copy is absent from source | Fixed |
| F-1-9 Metaphoric workflow heading | Live heading is “How to keep a folder ready offline” | Copy contract retains the functional heading | Fixed |
| F-1-10 Decorative labels | Old “field check” and “advanced field kit” labels are absent | Source search confirms removal | Fixed |
| F-1-11 Folder terminology | Landing, app metadata, and demo use **folder mirror** | Copy contract and source search pass | Fixed |
| F-1-12 Ambiguous controls | Controls name Try, Open, Check, Preview, Refresh, Remove, Buy, or Verify results | Interaction tests exercise those controls | Fixed |
| F-1-13 404 h1 | Unknown URL shows “Page not found” | Route test asserts one named h1 | Fixed |
| F-1-14 404 canonical | Unknown URL has no canonical | Canonical route test passes | Fixed |
| F-2-1 Install assertions | No Play Store, signing, PWA-ready, or AAB assertion appears | Only exact verified APK is exposed | Fixed |
| F-2-2 Install jargon | Install page uses plain Android instructions | Old jargon is absent from source | Fixed |
| F-3-1 Scoped Android outcome | Landing promise remains Android-specific | Installed v0.1.14 picker/permission command passes | Fixed |
| F-3-2 Failed-refresh outcome | Live copy retains the last successful ready time | Installed v0.1.14 staged-failure command passes | Fixed |
| F-3-3 Removal outcome | Privacy gives platform-specific deletion results | Installed v0.1.14 removal command passes | Fixed |
| F-3-4 Native handoff outcome | Install and landing describe Android chooser handoff | Installed v0.1.14 chooser command passes | Fixed |
| F-3-5 APK button result | “Check latest APK” becomes “Download APK v0.1.14” after verification | Exact and stale payload branches pass | Fixed |
| F-3-6 Secure-checkout claim | Copy says “Sociobot checkout (external site)” | Checkout outcome claim passes | Fixed |
| F-3-7 Storage Access Framework jargon | README says “Android's folder picker” | Old user-facing term is absent | Fixed |
| F-3-8 FileProvider jargon | README says “Android's app chooser” | Old user-facing term is absent | Fixed |
| F-3-9 Terms h1 | Live h1 is “Terms for Offline File Bridge” | Route test passes | Fixed |
| F-4-1 Privacy deletion claims | Browser and Android deletion wording is platform-specific | Three separate removal/clearing claims pass | Fixed |
| F-4-2 README test jargon | README says checksum and published Android result | Copy contract passes | Fixed |
| F-5-1 Candidate-bound picker evidence | v0.1.14 is the offered live release | Published picker evidence matches accepted release source | Fixed |
| F-5-2 Candidate-bound refresh evidence | v0.1.14 is the offered live release | Published refresh evidence matches accepted release source | Fixed |
| F-5-3 Candidate-bound removal evidence | v0.1.14 is the offered live release | Published removal evidence matches accepted release source | Fixed |
| F-5-4 Candidate-bound chooser evidence | v0.1.14 is the offered live release | Published chooser evidence matches accepted release source | Fixed |
| F-5-5 Mobile demo first viewport | Field notes and full ridge-route.pdf action appear above 844 px | Mobile position assertion passes | Fixed |
| F-5-6 Stale APK case | Live exact release produces download links | One tagged test covers enablement and stale rejection | Fixed |
| F-6-1 Scoped claim candidate rejection | Live release check offers matching v0.1.14 | Exact clean-clone command now passes | Fixed |
| F-6-2 Refresh claim candidate rejection | Live release check offers matching v0.1.14 | Exact clean-clone command now passes | Fixed |
| F-6-3 Removal claim candidate rejection | Live release check offers matching v0.1.14 | Exact clean-clone command now passes | Fixed |
| F-6-4 Chooser claim candidate rejection | Live release check offers matching v0.1.14 | Exact clean-clone command now passes | Fixed |

The live JavaScript and CSS hashes equal the clean candidate build. The v0.1.14
tag predates only evidence documents, and the release-boundary test confirms
that evidence-only commits cannot conceal product, claim, test, README, or
configuration drift.

## Structure, links, accessibility, and identity

| Route | Status | Title | H1 | Result |
| --- | ---: | --- | --- | --- |
| `/` | 200 | Offline File Bridge — keep folders ready offline | Keep approved folders ready offline | Pass |
| `/demo` | 200 | Demo — Offline File Bridge | Open your offline folders | Pass |
| `/app` | 200 | Folder mirrors — Offline File Bridge | Open your offline folders | Pass |
| `/privacy` | 200 | Privacy — Offline File Bridge | Your files stay on your device | Pass |
| `/terms` | 200 | Terms — Offline File Bridge | Terms for Offline File Bridge | Pass |
| `/install` | 200 | Install — Offline File Bridge | Install Offline File Bridge | Pass |
| unknown | 404 | Page not found — Offline File Bridge | Page not found | Pass |

- Every route has `lang="en"`, one h1, one main landmark, a route-specific meta
  description, favicon, apple-touch icon, 1200 × 630 OG image, Twitter card,
  consistent header/footer, and Privacy/Terms links. Known routes have their own
  canonical; the 404 has none and includes **Return home**.
- `robots.txt`, `sitemap.xml`, manifest, icons, art, and all six public routes
  resolve. The sitemap lists all six routes. Every discovered internal and
  external link resolves; checkout returns its intended 303 to the hosted
  session, release assets redirect to their downloads, and mail links are
  explicit.
- Deep links open the requested state. In-app navigation and Back update title,
  scroll, focus the destination h1, and update the polite route announcer.
- The supplied URL verifier reports one title, `lang`, one h1, one main,
  complete image alternatives, labeled buttons, and zero errors on the home
  page. Axe reports no serious or critical violation across every route in
  light and dark modes on desktop and mobile. Keyboard access, 44 px targets,
  200% reflow, focus visibility, and reduced motion also pass.
- The live response supplies CSP, HSTS, `nosniff`, referrer policy, and
  permissions policy headers. No 200 route produced an application, CSP, or
  console error.
- The graph-paper notebook, original folder-and-bridge illustration,
  handwritten display face, taped caption, stamped states, asymmetric paper
  cards, documented palette, and restrained motion implement
  `.factory/design.md`. The result is recognizably product-specific rather than
  a generic SaaS template.

## Missed leverage

No finding. The brief calls for approved folder import, offline mirroring,
freshness, safe refresh, removal, and file handoff; all are present. A model
would add network and disclosure costs to a deterministic, privacy-sensitive
offline job, so no AI feature is justified. Manual refresh is the appropriate
sync action under Android folder-consent and battery constraints. No additional
import, export, or sync step is obviously required for the stated job.

## What would make this perfect

Nothing remains to change for this review. Preserve the current claim-to-test
contract, isolated demo namespace, route metadata, plain terminology, and
release-bound Android evidence in future product changes.
