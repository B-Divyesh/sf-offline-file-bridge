# Independent verification 12

**Result: PASS — candidate accepted**

- Candidate: `0a87d5e1276a6ec24e25751b1882885e6c772f55`
- Live URL: <https://offline-file-bridge.sociobot.in>
- Android release: `v0.1.12`
- Verified: 29 August 2026 UTC from the clean candidate checkout

The prior deployment-only blocker is resolved. The live site, release tag,
published APK, build provenance, and installed-release Android evidence all
bind to this exact candidate and payload.

## Mandatory gates performed first

### Claims

`.factory/claims.json` exists and declares 18 claims. I ran every listed
`test` value separately after `npm ci`, without editing product code.

| Claim | Exact command | Result |
| --- | --- | --- |
| `apk-payload-match` | `npm test -- --grep @claim:apk-payload-match` | PASS, desktop and mobile |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS, desktop and mobile |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS, desktop and mobile |
| `demo-ready-sample` | `npm test -- --grep @claim:demo-ready-sample` | PASS, desktop and mobile |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS, desktop and mobile |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS, desktop and mobile |
| `freshness` | `npm test -- --grep @claim:freshness` | PASS, desktop and mobile |
| `file-handoff` | `npm test -- --grep @claim:file-handoff` | PASS, desktop and mobile |
| `scoped-folder-access` | `npm run test:android-claim -- scoped-folder-access` | PASS, published installed-release evidence |
| `free-tier` | `npm test -- --grep @claim:free-tier` | PASS, desktop and mobile |
| `browser-persistence` | `npm test -- --grep @claim:browser-persistence` | PASS, desktop and mobile |
| `browser-mirror-removal` | `npm test -- --grep @claim:browser-mirror-removal` | PASS, desktop and mobile |
| `browser-storage-clearing` | `npm test -- --grep @claim:browser-storage-clearing` | PASS, desktop and mobile |
| `native-refresh-safety` | `npm run test:android-claim -- native-refresh-safety` | PASS, published installed-release evidence |
| `license-verification-privacy` | `npm test -- --grep @claim:license-verification-privacy` | PASS, desktop and mobile |
| `checkout` | `npm test -- --grep @claim:checkout` | PASS, desktop and mobile |
| `consent-removal` | `npm run test:android-claim -- consent-removal` | PASS, published installed-release evidence |
| `native-handoff` | `npm run test:android-claim -- native-handoff` | PASS, published installed-release evidence |

The four Android results identify API 35, package
`in.sociobot.offline_file_bridge`, the expected JUnit method, and APK SHA-256
`8733e96c8b5083953cc23746aa7fe727af24aa4fbcd29681c02d27797330be78`.

### Cold first read

PASS. The first screen says:

- what it does: **“Keep approved folders ready offline”**;
- who it is for: **“For Android users who need cloud files in another app
  when the network disappears.”**; and
- what to click: **“Try it with sample data”**, next to **“A ready folder
  opens. Nothing is saved.”**

The action is inside the first desktop viewport. At 390×844 it occupies
vertical pixels 477–526, also inside the first viewport. One click opened the
working sample.

## Repository quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 148 packages, 0 audit vulnerabilities |
| `npm run lint` | PASS — TypeScript no-emit check |
| `npm run test:unit` | PASS — 17 tests in 4 files |
| `npm test` | PASS — 80 Playwright tests in 2.1 minutes |
| `npm run build` | PASS — exact production command produced `dist/` |
| `npm run test:release-artifact` | PASS — `v0.1.12`, payload tree `c16958c…` |
| `npm run test:android` | Environment unavailable — no Java runtime in this verifier image |

The local Gradle limitation is not substituted for or concealed: the public
Android workflow completed successfully against this commit, and its
candidate-bound installed-release evidence, APK digest, provenance, and
GitHub build attestation were independently checked below.

## End-to-end product exercise

Fresh live browser contexts covered desktop and 390 px mobile.

- The one-click demo opened **Field notes**, ready at 12 minutes ago, with
  `ridge-route.pdf`, `specimen-log.csv`, and `handoff-notes.md`.
- Demo storage contained only `demo:offline-file-bridge`; IndexedDB had no
  real database. The entire demo flow made only same-origin requests.
- The demo rejected choosing real data with a clear instruction to start for
  real. Refresh changed the visible state to `synced just now`.
- The Markdown sample opened in a modal, its close control received focus,
  Escape returned focus to its trigger, and Save produced
  `handoff-notes.md`. Reset restored the 12-minute seed and visible notice.
- The real browser app showed its empty state, imported the shipped two-file
  fixture, survived reload, and stopped a second mirror at the free-tier
  boundary with an actionable message.
- Whitespace-only license input made no request, displayed a recovery
  message, and returned focus to the labelled input. A live invalid token made
  exactly one permitted request to the Sociobot verification URL and showed
  the inactive-license recovery message.
- Cancel kept a folder mirror. Confirming removal deleted it and left zero
  mirror records in IndexedDB.
- With the active service worker, an online `/demo` visit survived an offline
  reload and still opened `ridge-route.pdf`. `registration.update()` completed;
  the active worker was `activated`, and the worker uses `skipWaiting` plus
  `clients.claim`.
- The install page fetched public release metadata and enabled the exact
  `offline-file-bridge-v0.1.12.apk` link with a SHA256SUMS link.

Screenshots are in `verification-artifacts/verification-12-*.png`.

## Deployment and Android identity

Local and live `build-identity.json` are identical:

```text
version             0.1.12
commit              0a87d5e1276a6ec24e25751b1882885e6c772f55
payloadFileCount    17
payloadTreeSha256   c16958c7ebeb84a0e5dcb5ca67057232a2c9a90c361c6fe6e85b4490fe0bc36e
```

Annotated tag `v0.1.12` resolves to the candidate. GitHub Actions run
`33272437612` completed successfully for that SHA. The release contains APK,
AAB, SHA256SUMS, build provenance, and Android claim evidence.

- APK size: 7,586,621 bytes (>1 MB)
- APK SHA-256: `8733e96c8b5083953cc23746aa7fe727af24aa4fbcd29681c02d27797330be78`
- AAB SHA-256: `9b834188645fa7b412df2a7fcf6464fc26e45606b74d094fec6f702dc504758e`
- APK ZIP integrity: PASS
- Embedded `assets/public/build-identity.json`: exact live identity above
- Manifest strings: package `in.sociobot.offline_file_bridge`, version
  `0.1.12`, only app-declared permission `INTERNET`; no broad storage
  permission
- APK v2 signature block and GitHub build attestation: present

The downloaded APK, GitHub asset digest, SHA256SUMS, provenance, and every
JUnit record agree on the same APK digest. This directly clears verification
11's stale-APK defect.

## Accessibility, privacy, resilience, and performance

- Fresh live axe runs on `/`, `/demo`, `/app`, `/install`, `/privacy`,
  `/terms`, and the 404 found zero serious/critical issues at desktop and
  390 px mobile. The full local suite also scans light and dark schemes.
- Each route has `lang=en`, one named h1, one main landmark, route-specific
  title/metadata, no missing image alt, no horizontal overflow, and no
  page errors. The only console resource message was the expected HTTP 404 on
  the deliberately missing route.
- Keyboard Tab exposed the skip link with a 3 px accent outline and 3 px
  offset, then reached the sample-data action. No trap appeared. Reduced
  motion settled with zero running animations.
- At 390 px, every visible link/button/input was at least 44 px tall and 47 px
  wide. At 200% text size, landing and demo reflowed at exactly 390 px with no
  horizontal overflow.
- Cold landing and the complete demo flow sent only same-origin requests.
  The invalid-license flow sent the redacted token only to
  `api.sociobot.in`; no analytics, CDN scripts, or third-party fonts loaded.
- CSP, HSTS, nosniff, strict referrer policy, and camera/microphone/geolocation
  restrictions are present. Hashed assets use one-year immutable caching;
  the service worker uses `no-cache`; HTML revalidates after 30 seconds.
- Chrome parsed the web manifest with no errors and reported no installability
  errors.
- Initial assets: JS 39,198 B (13.71 KB gzip), CSS 14,431 B (4.45 KB gzip),
  self-hosted font 74,932 B, hero 83,164 B. All budgets pass.
- Live mobile Lighthouse: Performance 98, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.1 s, LCP 1.7 s, TBT 150 ms, CLS 0, total 192 KiB.
- Billing verify allowance: requests 1–30 returned 200; request 31 returned
  429 with `Retry-After: 4`. The observed allowance is 30 requests per active
  window. Checkout returned 303 to the hosted Dodo session; no payment was
  attempted.

This static/PWA product has no sign-in, first-party backend, library, or CLI,
so the corresponding sign-in, backend persistence/concurrency, and consumer
package checks are not applicable.

## Claim-copy cross-check and defects

Landing, app, legal pages, install page, README, and demo documentation were
cross-checked against `.factory/claims.json`. The user-reliant statements map
to declared tests; no unlisted material product claim was found.

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Non-blocking follow-up: run a physical-device smoke test across representative
document providers and target apps before Play Store distribution. The
published direct-download APK uses the documented workflow-generated test
signing key; store distribution still needs the owner's upload key.
