# Independent verification 6 — PASS

- **Candidate:** `e8debdc51c78ef81bb09a1f2c9b0c32b0eb0b951` (`main`, `v0.1.3`)
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Verified:** 29 August 2026 UTC
- **Artifact class:** Android APK with PWA landing/demo

## Release decision

**PASS.** Fresh evidence closes verification 5's release blocker. The live site, candidate production build, public release record, and web payload embedded in the downloadable `v0.1.3` APK all identify commit `e8debdc…` and payload SHA-256 `812262f72da58bd45ca1ad106fb6ebb68a0b511b6043daf3e02788f89daf38e2`. No release-blocking or material product defect was found.

## Mandatory first-read and demo gate

**PASS** in fresh desktop and 390 × 844 browser contexts.

- What it does: **“Keep approved folders ready offline.”**
- Who it serves: **“For Android users who need cloud files in another app when the network disappears.”**
- First action: **“Try it with sample data.”** The adjacent note says a ready folder opens and nothing is saved.
- One click opens `/demo` with the persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, Start for real, a ready Field notes mirror, and three realistic files.

The cold landing and first demo click produced no console or page errors. Screenshots are in `verification-artifacts/verification-6/`.

## Claims gate

`.factory/claims.json` exists with 17 entries. After `npm ci`, every listed command was run independently from this candidate. Every id has exactly one matching `@claim:<id>` declaration.

| Claim | Result | Fresh evidence |
| --- | --- | --- |
| `billing-legal` | PASS | 2/2 desktop/mobile; merchant-of-record and automatic refund-revocation text |
| `apk-payload-match` | PASS | 2/2 mocked identity cases plus public consumer verification |
| `offline-reload` | PASS | 2/2; offline reload and ready sample open |
| `demo-sandbox` | PASS | 2/2; demo-prefixed localStorage only and no real IndexedDB |
| `demo-ready-sample` | PASS | 2/2; one click opens the ready three-file mirror |
| `demo-reset` | PASS | 2/2; seed and focus restored without reload |
| `local-only` | PASS | 2/2; no selected/demo file content request |
| `freshness` | PASS | 2/2; refresh changes the visible success time |
| `file-handoff` | PASS | 2/2; `handoff-notes.md` downloads |
| `scoped-folder-access` | PASS | 2/2; SAF picker and no broad storage permission |
| `free-tier` | PASS | 2/2; one/eight limits, 30 records, and $14 price |
| `browser-persistence` | PASS | 2/2; both selected files survive reload |
| `native-refresh-safety` | PASS | 1/1 native transaction regression |
| `license-verification-privacy` | PASS | 2/2; fixture token goes only to Sociobot |
| `checkout` | PASS | 2/2; 303 to hosted Dodo checkout |
| `consent-removal` | PASS | 1/1 native deletion and grant-release regression |
| `native-handoff` | PASS | 1/1 private FileProvider and Android chooser regression |

The live copy and README were cross-checked against the list. No unsupported or contradictory product claim was found.

## Clean-checkout quality gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 148 packages installed, 149 audited, zero vulnerabilities |
| Every exact command in `.factory/claims.json` | PASS |
| `npm test` | PASS — 76/76 Playwright tests |
| `npm run test:unit` | PASS — 7/7 Vitest tests |
| `npm run lint` | PASS — TypeScript no-emit check |
| `npm run build` | PASS — exact production build created `dist/` |
| `npm audit --omit=dev` | PASS — zero vulnerabilities |
| `npm run test:release-artifact` | PASS — public `v0.1.3` APK payload matches candidate |
| `npm run test:android` | Environment limitation — no Java executable in this verifier image |
| `npm run test:android-device` | Environment limitation — no Java/SDK/emulator in this verifier image |

Production output is 39.67 KB JavaScript (14.00 KB gzip), 14.43 KB CSS (4.45 KB gzip), a 74,932-byte self-hosted font, and an 83,164-byte hero image. These meet the stated budgets.

## Candidate, deployment, and Android artifact identity

- All 17 served payload files were compared byte-for-byte with fresh `dist/`; there were zero mismatches. The deployment-only `staticwebapp.config.json` was excluded.
- Live `/build-identity.json` is byte-identical to the candidate output and records version `0.1.3`, candidate commit `e8debdc…`, 17 payload files, and payload SHA-256 `812262f…`.
- Public release `v0.1.3` was published on 29 August 2026. Its annotated tag resolves to this candidate.
- APK: 7,587,133 bytes, SHA-256 `dc5764d23cf38b3e130f9d99c94e39f797f66162b1143496f0c8aa0fd2b72e08`.
- AAB: 7,478,153 bytes, SHA-256 `7336fffa2fd07ff41648f0bbfd2e6a1b55d0fee3dd1bee412a987d1fa9443ef3`.
- Fresh downloads of the APK, AAB, and provenance all pass the published `SHA256SUMS`.
- The APK contains an Android signing block, app id `in.sociobot.offline_file_bridge`, the custom native classes, compiled manifest, icons, and the complete candidate web shell.
- GitHub Actions run `33236898414` completed successfully for this exact commit. Its Android 36 installed-APK instrumentation, Gradle tests, APK/AAB build, payload verification, and publication steps each report success.
- The live landing and Install pages enable `Download APK v0.1.3` only after the release commit and payload record match.

## Independent end-to-end exercise

Fresh live contexts covered normal, boundary, invalid, and recovery paths:

- Demo refresh updates the ready time; all three files are present; Markdown opens and downloads with the correct filename.
- Dialog initial focus, Escape close, and trigger-focus restoration work.
- Reset restores the seeded time and focus. Leaving demo deletes the demo key and opens the real-data namespace.
- A two-file browser folder imports, persists after reload, and downloads locally. It also survives an offline reload and still opens.
- A zero-byte file renders as `0 B`. An HTML-like filename remains inert text.
- A second free folder is blocked with a specific recovery action.
- A browser mirror without a reopenable source reports the limitation and preserves the ready copy.
- Canceling removal preserves the mirror; confirming removes it and returns to the useful empty state.
- Whitespace-only license input stays local, focuses the field, and shows corrective text. A real invalid token returns `{valid:false, reason:"invalid"}` and shows the inactive-license recovery notice.
- Checkout returns 303 to `checkout.dodopayments.com/session/...`.
- All valid routes and rendered links resolve. The designed missing route returns HTTP 404 with a way home.

No sign-in is required. Library/CLI packaging, a product-owned backend, and AI behavior are not applicable.

## Privacy, requests, headers, and rate limiting

- Cold landing, complete demo refresh/preview/reset, and real folder import/open/remove made only same-origin file/app requests.
- No analytics, tracking, third-party font/script, or file-content request was observed.
- License verification sent the entered token only to the documented Sociobot endpoint. Release lookup occurred only after the explicit APK action and used GitHub's public API.
- Successful verification responses use `Cache-Control: no-store` and CORS permits the live origin.
- A fresh sequential burst of 40 verification requests produced **30 × 200, then 10 × 429**. Request 31 was the first 429; it and the remaining throttled responses included `Retry-After: 4`. Observed burst allowance: **30 requests**.
- Live HTML sends CSP with header-only `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation restrictions.
- Hashed JS/CSS use one-year immutable caching; `sw.js` uses `no-cache`; HTML and build identity revalidate after 30 seconds.

## Accessibility, mobile, PWA, and performance

- Live `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, and the designed 404 each have `lang=en`, one H1, one main landmark, route-specific titles, and no image missing alt text.
- Axe found zero serious/critical findings on all seven routes in desktop light and 390px dark profiles.
- Keyboard-only use starts at the visible skip link, reaches and activates the sample action, and moves focus to the new H1. The focus ring is a 3px accent outline with 3px offset.
- The file dialog has a name/role, receives initial focus, closes with Escape, and restores focus.
- At 390px there is no horizontal overflow, visible controls meet 44px targets, and all routes reflow at 200% text size.
- Reduced motion leaves zero running animations and reduces motion durations to 0.01ms.
- Chromium parses the manifest without errors. The live worker controls the demo with cache `offline-file-bridge-v3`; a cache-independent offline reload keeps the sample usable.
- A versioned-worker simulation displayed the update notice, activated the replacement, removed the old cache, and reloaded offline successfully.
- `/opt/fleet/lib/verify-url.sh`: PASS in 966ms with no console errors.
- Fresh mobile Lighthouse: **Performance 99, Accessibility 100, Best Practices 100, SEO 100**; FCP 1.0s, LCP 1.7s, TBT 130ms, CLS 0, total transfer 197,023 bytes.

## Defects and limitations

### Release blockers

None.

### Material defects

None found.

### Verification limitation

This disposable verifier has no Java, Android SDK, ADB, or emulator, so it could not rerun Gradle or install the APK locally. The mobile-native contract assigns package production to GitHub Actions. Fresh public artifacts, checksums, compiled identity, embedded payload, release provenance, and the exact successful installed-APK workflow were independently checked. A physical-device smoke remains advisable before a store release signed with the owner's upload key.

## Evidence

Screenshots, URL-verifier output, and the full Lighthouse JSON are in `.factory/verification-artifacts/verification-6/`.
