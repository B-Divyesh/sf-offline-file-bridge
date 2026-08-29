# Independent verification 5 — FAIL

- **Candidate:** `bff0090d80fcbadb09eb377a43e6f9f86c671b8b`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Verified:** 29 August 2026 UTC
- **Artifact class:** Android APK with PWA landing/demo

## Release decision

**FAIL.** The live web deployment is byte-for-byte equal to the candidate build, but the APK offered by that deployment contains an older web payload. The site nevertheless enables the download and announces to assistive technology that the APK matches the site. This is a release-blocking artifact-identity defect and an unlisted, false claim.

The browser/PWA work is otherwise strong: the first-read gate, all 15 listed claim commands, aggregate tests, demo and real-data flows, privacy probes, accessibility checks, offline/update behavior, response headers, rate limiting, and performance budgets pass.

## Release-blocking findings

### P0 — the published APK does not contain the candidate web build

Fresh evidence:

- A clean `npm run build` at `bff0090` produces web-tree SHA-256 `ad256aac5d1577857b1045f173a994d2be854935fa1221c9e359b4a7697dfed8`.
- The public `v0.1.2` provenance records web-tree SHA-256 `e62fb7fcc9eca061970ef64db71a9db29e2af748adcc0fecd77a9a29e939670b` from commit `85b6c082837b07fdc85c58be7f977b1542d27fc2`.
- Direct extraction of `offline-file-bridge-v0.1.2.apk` shows a different `index.html`, JavaScript bundle, CSS bundle, service-worker asset list, and `404.html`.
- Candidate uses `index-Bt21ISq4.js` / `index-CVR1-fnr.css`; the APK contains `index-DID6180k.js` / `index-CsmKatw_.css`.
- Product code changed after the release tag: `src/main.ts` has 80 changed lines and `src/style.css` has 22. These include clearer terminology, 16 px secondary text, route metadata/404 fixes, reset-focus restoration, and other user-visible behavior.
- The live site's **Download the latest APK** action still enables that stale artifact and exposes the status text **“This APK matches this site.”**

Cause: `scripts/build-metadata.mjs` resolves the current package version's existing Git tag before `HEAD`. Candidate builds after the tag therefore keep advertising tag commit `85b6c082…`, allowing the old artifact even when deployable bytes changed.

Required release condition: publish a new version/tag and candidate-built APK/AAB, then make the download check compare immutable candidate/payload identity. A docs-only exception must not cover changes to `src/`, `public/`, build inputs, or Android assets.

### P0 — the APK-equivalence claim is absent from `claims.json`

The live product states **“This APK matches this site”**, but `.factory/claims.json` has no corresponding claim or sandbox test. The nearest release-contract unit test only checks source strings and tag-version rules; it does not compare the currently downloadable APK with the current candidate build. The claim is also false under the direct artifact comparison above. The claims contract makes an unlisted or failing claim release-blocking.

### P1 — required paid-purchase disclosure is missing

The current `/terms` page states the $14 price and feature limits, but no longer says that Sociobot/Dodo is merchant of record or that refunds are handled there and revoke the license. This disclosure existed in the released APK's older web payload but was removed from the current candidate. The attached paid-unlock contract requires it.

## Smaller finding

### P3 — whitespace-only license input gives no feedback

Entering spaces in the restore-license field and choosing **Verify license** makes no request and shows no error. HTML `required` treats the spaces as content, while the submit handler trims to empty and returns silently. A real invalid token does recover with **“This license is no longer active. Buy a new license or restore another.”** The field also uses its placeholder as its only visible label, contrary to the attached form guidance.

## Mandatory first-read and demo gate

**PASS** at desktop and 390 × 844 from fresh browser contexts.

- What: **“Keep approved folders ready offline.”**
- Who: **“For Android users who need cloud files in another app when the network disappears.”**
- First click: **“Try it with sample data.”** The adjacent text explains that a ready folder opens and nothing is saved.
- One click opens `/demo` with a ready **Field notes** mirror, three realistic files, and the sticky **Demo — sample data, nothing is saved** banner with **Reset demo** and **Start for real**.

No cold-load console or page error occurred on valid routes. The designed missing-page navigation returns HTTP 404 and Chromium reports the expected failed main-resource diagnostic for that 404; there is no application exception.

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every listed command was run independently from the candidate. Each listed id has exactly one matching `@claim:<id>` declaration.

| Claim | Result | Evidence |
| --- | --- | --- |
| `offline-reload` | PASS | 2/2 desktop/mobile; offline reload and ready-file preview |
| `demo-sandbox` | PASS | 2/2; demo localStorage only and no real IndexedDB |
| `demo-ready-sample` | PASS | 2/2; one click, banner, ready mirror, three files |
| `demo-reset` | PASS | 2/2; seed restored without reload and focus retained |
| `local-only` | PASS | 2/2; no cross-origin file request |
| `freshness` | PASS | 2/2; refresh changes visible ready time |
| `file-handoff` | PASS | 2/2; `handoff-notes.md` download |
| `scoped-folder-access` | PASS | 2/2; SAF and no broad storage permission |
| `free-tier` | PASS | 2/2; one/eight limits, 30 records, $14 |
| `browser-persistence` | PASS | 2/2; two files survive reload |
| `native-refresh-safety` | PASS | 1/1 native transaction regression |
| `license-verification-privacy` | PASS | 2/2; documented Sociobot endpoint only |
| `checkout` | PASS | 2/2; 303 to hosted Dodo checkout |
| `consent-removal` | PASS | 1/1 native deletion/grant-release regression |
| `native-handoff` | PASS | 1/1 private `FileProvider` and chooser regression |

The independent artifact comparison found the unlisted APK-equivalence claim described above.

## Clean-checkout gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 149 packages, zero vulnerabilities |
| Every exact `.factory/claims.json` command | PASS — all 15 independently |
| `npm test` | PASS — 72/72 Playwright tests |
| `npm run test:unit` | PASS — 7/7 Vitest tests |
| `npm run lint` | PASS — TypeScript no-emit check |
| `npm run build` | PASS — exact production build produced `dist/` |
| `npm audit --omit=dev` | PASS — zero vulnerabilities |

Production output: JavaScript 38,321 B (13,542 B gzip), CSS 14,178 B (4,382 B gzip), font 74,932 B, hero image 83,164 B. These are within the defined budgets.

## Independent end-to-end behavior

Fresh live contexts covered normal, boundary, invalid, and recovery paths:

- Demo refresh updates the ready time; all three files are present; Markdown saves with the correct filename.
- Dialog initial focus, Escape close, and trigger-focus restoration pass.
- Reset restores the seed and keeps focus on **Reset demo**.
- Browser folder import persists two files across reload.
- A second free folder is blocked with a specific recovery action.
- A browser mirror without a reopenable handle reports the limitation and preserves the last successful ready time.
- Canceling removal preserves the mirror; accepting removal deletes it and returns to the useful empty state.
- A zero-byte file renders as `0 B`.
- An HTML-like filename is rendered as text, with no injected image element.
- A real invalid license receives `{valid:false, reason:"invalid"}` and shows a recovery notice.
- Checkout returns 303 to `checkout.dodopayments.com/session/...`.

No sign-in is required. AI, library/CLI consumer packaging, and a product-owned backend are not applicable.

## Privacy, network, and request allowance

- Cold landing, complete demo refresh/preview/reset, and real import/open flows requested only the live same origin. There were no analytics, CDN font/script, or file-content requests.
- Demo storage contained only `demo:offline-file-bridge`; the real IndexedDB database did not exist.
- Real mode used `offline-file-bridge-real`; it did not read the demo namespace.
- License verification sends the token only to the documented Sociobot endpoint. Its response is `Cache-Control: no-store`, and CORS allows the live origin.
- A fresh sequential burst of 40 invalid verification requests produced **30 × 200, then 10 × 429**. The first 429 was request 31; every sampled 429 had `Retry-After: 4` and `x-ratelimit-after: 4`. Observed allowance: **30 requests per burst window**.

## Accessibility, mobile, PWA, headers, and performance

- `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/install` return 200. `/missing-page` returns the designed 404.
- Every route has `lang=en`, one H1, one main landmark, route-specific title, and no missing image alt text.
- Axe found zero serious/critical findings on all seven routes in desktop light mode and 390 px dark mode.
- Keyboard flow starts at the skip link; the primary action is reachable and opens `/demo`; SPA navigation focuses the new H1. Focus is a visible 3 px accent outline with 3 px offset.
- At 390 px there is no horizontal overflow, visible controls meet 44 px, secondary labels are at least 16 px, and 200% text reflows without overflow.
- Reduced motion makes the trace effectively instant (0.01 ms); no animation remains after settlement.
- The live worker controls `/demo` with cache `offline-file-bridge-v3`; offline reload and file preview pass.
- A fresh local update simulation changed the worker to `v5`, displayed the update notice, removed `v3` after controller change, and reloaded offline successfully.
- Chromium parsed the manifest with zero errors.
- Headers include HSTS, `nosniff`, referrer policy, permissions policy, and CSP with header-only `frame-ancestors 'none'`. Hashed assets are one-year immutable; `sw.js` is `no-cache`; HTML revalidates after 30 seconds.
- `/opt/fleet/lib/verify-url.sh`: PASS in 857 ms with no valid-route console errors.
- Fresh mobile Lighthouse: **Performance 99, Accessibility 100, Best Practices 100, SEO 100**. FCP 0.90 s, LCP 1.65 s, TBT 121 ms, CLS 0; total transfer 196,426 B.

## Android artifact evidence and limitation

- Public release: `v0.1.2`, tag commit `85b6c082837b07fdc85c58be7f977b1542d27fc2`.
- APK: 7,584,941 B, SHA-256 `24972b5c04731f96d36a22eaf52ed21432e03011b5604603e7cc50312d3c7e3e`.
- AAB: 7,475,967 B.
- `sha256sum -c SHA256SUMS` passes for APK, AAB, and provenance.
- APK includes app id `in.sociobot.offline_file_bridge`, native classes, manifest, and a complete web shell.
- Public GitHub Actions run `33229112667` is successful, including installed-APK Android 36 instrumentation, Gradle tests, APK/AAB build, payload check, and publication. It validates the old tag artifact, not candidate `bff0090`.
- This verifier image has no Java, Android SDK, or emulator, so Gradle/device tests could not be rerun locally. The mobile-native contract assigns package creation to GitHub Actions. The fresh download, checksum, provenance, and embedded-payload inspection were completed locally.

## Evidence files

Artifacts are in `.factory/verification-artifacts/verification-5/`, including first-read/demo screenshots, keyboard focus, the false APK-match state, URL-verifier output, and the Lighthouse JSON report.
