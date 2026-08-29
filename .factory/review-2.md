# Adversarial first-read review 2

- **Product:** Offline File Bridge
- **Reviewed:** 29 August 2026 UTC
- **Live URL:** <https://offline-file-bridge.sociobot.in>
- **Verdict:** **FAIL**

The core product is clear and the live demo works. This review fails because release-status and release-process statements remain in visitor copy without entries and exact sandbox tests in `.factory/claims.json`. One of those statements is a recurrence of the earlier release-process finding.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 1000. No scrolling occurred before this check. Both screens answered the three required questions:

- **What it does:** It keeps an approved Android folder ready offline so a file can open in another local app.
- **For whom:** Android users who need cloud files in another app when their network disappears.
- **First click:** **Try it with sample data**; its adjacent text says, “A ready folder opens. Nothing is saved.”

The mobile first screen had no horizontal overflow. Both cold loads had no application console errors or third-party requests. This check passes.

## Findings

### Blocking

#### F-1-6 — Release-process promise has regressed (retained earlier identifier)

- **Location / quote:** README, “GitHub Actions builds Android release artifacts with JDK 21”.
- **Why:** Review 1 required release-process promises to be removed from visitor documentation or covered by an exact claim test. This is a new unlisted process promise of the same kind. The 17 claim entries do not test the GitHub Actions build, JDK version, or released artifact workflow. A first-time reader cannot use this as verified product information.
- **Concrete fix:** Delete the sentence. Keep local prerequisites and reproducible local commands in the developer README. If the release workflow must be promised publicly, add a distinct `release-workflow` claim whose clean-sandbox test verifies the public run and the published artifacts.

#### F-2-1 — Live install availability and package assertions are unlisted claims

- **Location / quotes:** Landing, “Not on Google Play yet”; `/install`, “The APK is not on Google Play yet. GitHub Releases publishes the signed test build and its checksum.”; “The PWA is ready now.”; and “The release contains an APK for direct install and an AAB for store submission.”
- **Why:** These are reliance-worthy distribution and package assertions. None has an entry in `.factory/claims.json`; `apk-payload-match` tests that an offered download matches a mocked release record, not Play-store absence, PWA install availability, signing, checksum publication, or AAB availability. The claims contract requires every such sentence to be tested or removed.
- **Concrete fix:** Remove the Play-store status, signing/checksum, PWA-readiness, and AAB statements from visitor copy, leaving the tested action “Download APK”. If retained, add one claim per promise with a clean-sandbox public-release/manifest assertion and a stable Play listing check where applicable.

### Minor

#### F-2-2 — The install page exposes unexplained build jargon

- **Location / quote:** `/install`, “The factory build uses a generated debug keystore. A store release needs the owner's upload key.”
- **Why:** “debug keystore” and “upload key” do not help a person install the app. The section is not an installation step and reads like internal build lore.
- **Concrete fix:** Delete both sentences. The user-facing replacement, if needed, is: “This download is an Android app file you can install directly.”

## Copy audit

Word counts use words rather than punctuation tokens. Labels, file names, and prices are included where they carry visitor-facing meaning; sample metadata is identified as sample data. No sentence exceeds 22 words. Claims already listed in `claims.json` are marked **covered**; the two release-copy groups above are the exceptions.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Keep approved folders ready offline | 5 | Clear h1 |
| For Android users who need cloud files in another app when the network disappears. | 14 | Clear audience |
| Try it with sample data | 6 | Result-naming action |
| A ready folder opens. | 4 | **covered** (`demo-ready-sample`) |
| Nothing is saved. | 3 | **covered** (`demo-sandbox`) |
| One folder is free. | 4 | **covered** (`free-tier`) |
| Files stay on your device. | 5 | **covered** (`local-only`) |
| Works after the first visit. | 5 | **covered** (`offline-reload`) |
| Download the latest APK | 4 | Tested release action, but availability copy is F-2-1 |
| Install steps | 2 | Clear link label |
| Not on Google Play yet | 5 | **F-2-1** unlisted status claim |
| folder → local copy → your app | 6 | Clear diagram caption; same object is called a folder mirror elsewhere |
| See what is ready before you leave | 8 | Useful preview heading |
| Every folder mirror shows its last successful refresh. | 7 | **covered** (`freshness`) |
| A failed Android refresh keeps that date. | 8 | **covered** (`native-refresh-safety`) |
| Open the working sample | 4 | Clear link action |
| Field notes | 2 | Realistic sample folder name |
| OpenCloud / Research · 3 files · 280.0 KB | 5 | Realistic sample metadata |
| Ready · synced 12 min ago | 5 | **covered** (`freshness`) |
| How to keep a folder ready offline | 7 | Clear section heading |
| Choose a folder | 3 | Clear step heading |
| Android asks which folder this app may read. | 8 | **covered** (`scoped-folder-access`) |
| No broad storage permission is requested. | 6 | **covered** (`scoped-folder-access`) |
| Refresh its local copy | 4 | Clear step heading |
| The folder mirror records its successful refresh time, file count, and storage size. | 12 | **covered** (`freshness`) |
| Open a ready file | 4 | Clear step heading |
| Pick the local app that should receive the file, even while offline. | 12 | **covered** (`file-handoff`, `offline-reload`) |
| Your folder stays under your control | 6 | Clear privacy heading |
| You approve each source folder. | 5 | **covered** (`scoped-folder-access`) |
| Folder mirror files stay in app storage. | 7 | **covered** (`local-only`) |
| On Android, you can remove a folder mirror at any time. | 10 | **covered** (`consent-removal`) |
| What it does not do | 5 | Clear boundary heading |
| It does not replace your storage service. | 7 | Product boundary, not a performance promise |
| It does not crawl unapproved folders. | 6 | **covered** (`scoped-folder-access`) |
| After a failed Android refresh, it keeps the last ready time. | 10 | **covered** (`native-refresh-safety`) |
| Read the privacy note | 4 | Clear link action |
| Keep more folder mirrors | 4 | Clear price heading |
| Bridge Pro adds up to eight folder mirrors and keeps 30 refresh records per folder. | 14 | **covered** (`free-tier`) |
| The free version keeps one folder mirror. | 6 | **covered** (`free-tier`) |
| Buy Bridge Pro | 3 | Result-naming action |
| Paste the token from your purchase email. | 7 | Clear field help |
| Spaces alone are not a token. | 6 | Clear validation help |
| Keep approved folders ready offline. | 5 | Clear footer one-liner |
| Built by Param Factory | 4 | Attribution |
| v0.1.3 · Generated artwork | 3 | Build/asset label |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Keep an approved folder ready offline, see when it last refreshed, and open its files in another Android app. | 19 | **covered** (`freshness`, `file-handoff`) |
| Offline File Bridge is for Android users who need a cloud file in another local app. | 15 | Clear audience |
| It copies files from an approved folder into a folder mirror. | 10 | **covered** (`local-only`, `scoped-folder-access`) |
| An Android Storage Access Framework picker with persisted, folder-scoped read access | 11 | **covered** (`scoped-folder-access`) |
| Folder mirrors stored on the device | 6 | **covered** (`local-only`) |
| Visible file counts, storage sizes, and last successful refresh times | 9 | **covered** (`freshness`) |
| Android open-with handoff through a narrow FileProvider | 7 | **covered** (`native-handoff`) |
| In supported browsers, selected folder files stay available after reload | 10 | **covered** (`browser-persistence`) |
| A separate, resettable sample-data sandbox | 5 | **covered** (`demo-sandbox`, `demo-reset`) |
| A free one-folder-mirror tier and a $14 Bridge Pro license for up to eight folder mirrors | 15 | **covered** (`free-tier`) |
| The product does not replace a cloud provider or crawl unapproved folders. | 12 | Product boundary / **covered** for folder scope |
| Requirements: Node.js 20 or newer. | 5 | Clear prerequisite |
| Open http://localhost:5173/ or go straight to http://localhost:5173/demo. | 8 | Clear local entry points |
| The exact production command is npm run build. | 8 | Clear build instruction |
| It writes the deployable static site to dist/, with dist/index.html at the root. | 13 | Clear build outcome |
| npm test runs the browser claims on desktop and mobile Chromium. | 10 | Clear test scope |
| It removes only a stale preview process from this repository before Playwright starts and closes its own server. | 18 | Technical but specific test behavior |
| npm run test:unit runs the three native source regressions; together they run every command listed in .factory/claims.json. | 17 | Clear test coverage |
| The Capacitor 8 project lives in android/ with app id in.sociobot.offline_file_bridge. | 10 | Developer implementation note |
| The custom OfflineBridgePlugin opens Android's folder picker. | 6 | **covered** (`scoped-folder-access`) |
| It copies selected files into private app storage. | 8 | **covered** (`local-only`) |
| It hands a chosen copy to Android's app chooser. | 9 | **covered** (`native-handoff`) |
| GitHub Actions builds Android release artifacts with JDK 21. | 8 | **F-1-6** unlisted release-process claim |
| For a public store release, use the owner's upload key. | 10 | Developer-only jargon; see F-2-2 analogue |
| Real browser mirrors use the offline-file-bridge-real IndexedDB database. | 8 | Storage implementation detail |
| Demo state uses only the demo:offline-file-bridge localStorage key. | 7 | **covered** (`demo-sandbox`) |
| The app sends no file contents to a server. | 9 | **covered** (`local-only`) |
| License verification sends a token only to the Sociobot billing API. | 10 | **covered** (`license-verification-privacy`) |
| Source code is available under the MIT License. | 8 | Verifiable repository fact |
| Generated visual assets and their prompts are documented in .factory/design.md. | 9 | Verifiable repository fact |

Terminology is consistent for the principal object: **folder mirror**. The primary visitor controls use result-naming verbs: “Try”, “Download”, “Choose”, “Refresh”, “Preview”, “Remove”, “Buy”, and “Verify”. The current headings are functional rather than metaphoric.

## Demo, claims, sandbox, and quality checks

- **Demo:** Fresh 390px live flow: the landing action opened `/demo` in one click; the first app screen showed *Field notes*, three named realistic files, readiness, count, and size. The persistent banner said “Demo — sample data, nothing is saved” with **Reset demo** and **Start for real**.
- **Isolation:** The flow used `demo:offline-file-bridge`; `offline-file-bridge-real` was absent. Refreshing and resetting restored “Ready · synced 12 min ago,” displayed “Sample data was reset,” and kept focus on Reset. Recorded requests during landing → demo → refresh → reset were all same-origin. An offline reload after the first visit retained the ready sample and opened its file content.
- **Claim gate:** A fresh clone received `npm ci` with zero vulnerabilities. Every one of the 17 exact commands in `.factory/claims.json` passed independently. Each id has exactly one matching `@claim:` tag.
- **Quality gate:** `npm test` passed 76/76; `npm run test:unit` passed 7/7; `npm run lint`, `npm run build`, and `npm audit --omit=dev` passed. The build produced `dist/`.
- **Privacy / AI:** No analytics, CDN fonts/scripts, or file-content transfer appeared in the cold/demo request logs. The brief does not imply an AI task; adding one would not improve consented offline mirroring and handoff.

## Structure and accessibility

Live `/`, `/demo`, `/app`, `/install`, `/privacy`, `/terms`, and the designed unknown-route 404 were checked in desktop light and 390px dark contexts. Valid routes have route-specific titles, one h1, one main landmark, descriptions, canonical links, favicon, OG/Twitter metadata, and no serious or critical Axe findings. The unknown 404 has no canonical, a “Page not found” h1, and a route back home. Its browser console reports the expected failed main-resource 404, not an application exception.

`robots.txt`, `sitemap.xml`, favicon, apple touch icon, and manifest returned 200. The sitemap lists all six public routes. The header/footer are consistent, include skip navigation and Privacy/Terms, and the Wordmark returns home. Browser navigation and Back moved focus to the destination h1. All collected internal links returned 200 (the intentional test 404 returned 404); the checkout returned a 303 to its hosted Dodo session and `mailto:` links were explicit. CSP, HSTS, nosniff, referrer policy, and permissions policy were present. The handwritten notebook treatment remains product-specific rather than a generic SaaS template.

## Earlier-review history

| Earlier finding | Live and code confirmation | Result |
| --- | --- | --- |
| F-1-1 Reset display | Reset rerenders seed, announces it, and restores Reset focus. | Fixed |
| F-1-2 Ready sample | One click opens isolated *Field notes* with three files. | Fixed |
| F-1-3 Failed refresh wording | Wording is Android-specific; native transaction claim passes. | Fixed |
| F-1-4 Paid promises | Unsupported multi-device, export, and refund wording was removed; remaining price/checkout statements are claimed. | Fixed |
| F-1-5 Browser API wording | README now states tested reload persistence. | Fixed |
| F-1-6 Release-process promises | New unlisted GitHub Actions/JDK sentence appears in README. | **Regressed; blocking** |
| F-1-7 License privacy | Fixture-token request test records the Sociobot-only destination. | Fixed |
| F-1-8 to F-1-10 Mood/metaphor labels | Removed; workflow heading is functional. | Fixed |
| F-1-11 Terminology | Principal object is consistently “folder mirror”. | Fixed |
| F-1-12 Button naming | “Open folders” and file-specific Preview controls are present. | Fixed |
| F-1-13 404 heading | “Page not found” is the h1. | Fixed |
| F-1-14 404 canonical | Unknown route has no canonical element. | Fixed |

## What would make this perfect

Remove the four untestable installation/release-status statements and the README GitHub Actions promise, or give each an exact declared claim test. Remove the keystore/upload-key prose from the visitor installation page. With that copy hygiene complete, the clear first screen, isolated working demo, verified local-first behavior, accessibility, and distinctive visual system would leave no finding.
