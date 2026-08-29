# Independent verification 13

**Result: PASS — candidate accepted**

- Candidate: `86adec43943a62c5d037ab191bfec357b332d48f`
- Live URL: <https://offline-file-bridge.sociobot.in>
- Android release: `v0.1.13`
- Verified: 29 August 2026 UTC from the clean candidate checkout

Fresh evidence resolves the possible deployment-only concern. The live site,
release tag, public APK, build provenance, GitHub attestation, and installed-APK
Android evidence all identify this exact candidate and payload.

## Mandatory gates performed first

### Claims

`.factory/claims.json` exists and declares 18 claims. After `npm ci`, I ran
every listed `test` value separately and unchanged. All passed.

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
| `scoped-folder-access` | `npm run test:android-claim -- scoped-folder-access` | PASS, candidate-bound installed-release evidence |
| `free-tier` | `npm test -- --grep @claim:free-tier` | PASS, desktop and mobile |
| `browser-persistence` | `npm test -- --grep @claim:browser-persistence` | PASS, desktop and mobile |
| `browser-mirror-removal` | `npm test -- --grep @claim:browser-mirror-removal` | PASS, desktop and mobile |
| `browser-storage-clearing` | `npm test -- --grep @claim:browser-storage-clearing` | PASS, desktop and mobile |
| `native-refresh-safety` | `npm run test:android-claim -- native-refresh-safety` | PASS, candidate-bound installed-release evidence |
| `license-verification-privacy` | `npm test -- --grep @claim:license-verification-privacy` | PASS, desktop and mobile |
| `checkout` | `npm test -- --grep @claim:checkout` | PASS, desktop and mobile |
| `consent-removal` | `npm run test:android-claim -- consent-removal` | PASS, candidate-bound installed-release evidence |
| `native-handoff` | `npm run test:android-claim -- native-handoff` | PASS, candidate-bound installed-release evidence |

The Android evidence records API 35, package
`in.sociobot.offline_file_bridge`, one passing installed-APK JUnit case per
native claim, and APK SHA-256
`661751eef1cb87995c79c61a09208a1e2f7e34cc567544a4acaa144603e338a5`.

### Cold first read

PASS on desktop and 390 x 844 mobile.

- What it does: **“Keep approved folders ready offline.”**
- Who it is for: **“For Android users who need cloud files in another app
  when the network disappears.”**
- What to click first: **“Try it with sample data,”** beside **“A ready folder
  opens. Nothing is saved.”**

The action occupied mobile vertical pixels 477–526, inside the first viewport.
One click opened `/demo`; **Field notes** and the full first filename,
`ridge-route.pdf`, were also inside that initial 844 px viewport.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 148 packages, 0 audit vulnerabilities |
| `npm run lint` | PASS — TypeScript no-emit check |
| `npm run test:unit` | PASS — 17 tests in 4 files |
| `npm test` | PASS — 78 Playwright tests in 2.1 minutes |
| `npm run build` | PASS — exact production command produced `dist/` |
| `npm run test:release-artifact` | PASS — `v0.1.13`, payload tree `ab76f039…` |
| `npm run test:android` after the workflow's `npx cap sync android` step | PASS — 3 app unit tests in both debug and release variants |
| `git diff --check` | PASS |

This worker initially lacked Java and Android SDK. I installed temporary JDK 21
and Android SDK 36 outside the repository, ran `npx cap sync android` as the
release workflow does, and obtained `BUILD SUCCESSFUL` from the Android test
script. Calling that script before Capacitor sync fails because the generated
Cordova compatibility project is absent; that is a setup prerequisite, not a
failing test. No product code was changed.

## End-to-end product exercise

Fresh live browser contexts covered desktop and 390 px mobile.

- The one-click demo opened a ready **Field notes** mirror with three realistic
  files. Only `demo:offline-file-bridge` existed; the real IndexedDB database
  did not.
- Trying to choose real files inside the demo produced the expected instruction
  to start for real. Refresh changed the visible state to `synced just now`.
- The Markdown sample opened in a modal, focus moved to **Close file**, Escape
  restored focus to the originating file action, and **Save sample** downloaded
  `handoff-notes.md`. Reset restored the 12-minute seed without a reload.
- **Start for real** deleted the demo key. The real browser app imported the
  two-file fixture, retained both files after reload, downloaded
  `offline-note.txt`, and rejected a second mirror at the free-tier boundary
  with an actionable message.
- Cancel preserved a folder mirror. Confirming removal deleted the UI record
  and left zero mirror records in IndexedDB.
- Whitespace-only license input made no request, explained the correction, and
  returned focus to the labelled field. A real invalid token produced one
  request to the Sociobot verification URL and a visible inactive-license
  recovery message.
- A `?license=` return token was saved under
  `sb_license:offline-file-bridge`, removed from the address bar, verified once,
  and not reverified after reload because the daily verdict cache was fresh.
- The live install check enabled only
  `offline-file-bridge-v0.1.13.apk`, linked SHA256SUMS, and stated that the
  commit and payload fingerprint matched.

All real links on the six known routes resolved. The checkout returned the
expected 303 to the hosted Dodo session. The deliberate 404 route returned a
designed page and a real HTTP 404; its same-page skip fragment naturally keeps
that status.

Screenshots are in `verification-artifacts/verification-13-*.png`.

## Deployment and Android identity

Local and live `build-identity.json` were byte-equivalent in meaning:

```text
version             0.1.13
commit              86adec43943a62c5d037ab191bfec357b332d48f
payloadFileCount    17
payloadTreeSha256   ab76f03909821f323bb818e0e0f37476bf0cde0fc340d88cccc02ba91d6e7d4f
```

Annotated tag `v0.1.13` resolves to the candidate. GitHub Actions run
`33277614082` completed successfully for that SHA. The release includes APK,
AAB, SHA256SUMS, build provenance, and Android claim evidence.

- APK: 7,586,909 bytes; SHA-256 `661751eef1cb87995c79c61a09208a1e2f7e34cc567544a4acaa144603e338a5`
- AAB: 7,477,927 bytes; SHA-256 `10f9cfd824bfd3abde0a15591bf1b30015ea4262aac9346dcdae0d8cfdae376b`
- APK and AAB ZIP integrity: PASS
- APK signature: valid v2, one 2048-bit RSA test signer
- Manifest: package `in.sociobot.offline_file_bridge`, version `0.1.13`,
  min SDK 24, target SDK 36, `allowBackup=false`, no cleartext traffic
- App permissions: `INTERNET` plus Android's package-scoped dynamic receiver
  permission; no broad storage permission
- Embedded `assets/public/build-identity.json`: exact live candidate identity
- GitHub build attestation: present; workflow, tag, repository, commit, and APK
  digest agree with the release

Published asset digests, SHA256SUMS, provenance, embedded identity, attestation,
and every Android JUnit record agree on the same APK.

## Accessibility and responsive behavior

- Independent axe scans covered `/`, `/demo`, `/app`, `/install`, `/privacy`,
  `/terms`, and the 404 in light and dark schemes at desktop and 390 px: zero
  serious or critical findings across 28 route/theme/viewport combinations.
- Every route had `lang=en`, one named h1, one main landmark, route-specific
  title/metadata, alt text, no horizontal overflow, and no unexpected console
  or page error.
- Keyboard Tab exposed the skip link first with a 3 px accent outline and 3 px
  offset, then reached and operated the sample action. No trap appeared.
- Every visible mobile control was at least 44 x 44 CSS px. At 200% text size,
  landing and demo remained within 390 px without horizontal loss.
- Reduced-motion mode settled with zero running animations. The dialog exposed
  a name/role, managed initial and return focus, and closed with Escape.

## Privacy, headers, resilience, and PWA

- Cold landing, complete demo, and real file import/open/reload flows made only
  same-origin requests. No analytics, CDN scripts, or third-party fonts loaded.
- License verification sent the token only to
  `api.sociobot.in`; the response used `no-store`. Release inspection contacted
  only the documented GitHub public API.
- The live responses include CSP with `frame-ancestors 'none'`, HSTS, nosniff,
  strict referrer policy, and camera/microphone/geolocation restrictions.
- Hashed assets use one-year immutable caching; `sw.js` uses `no-cache`; HTML
  revalidates after 30 seconds.
- Chrome parsed the manifest with no errors. The active service worker update
  check completed. In a local two-version exercise, a changed worker installed,
  activated via `skipWaiting`, and displayed **“An update is ready. Reload to
  use it.”** in 101 ms.
- Cache Storage contained the hashed JS and CSS. After clearing only Chromium's
  HTTP cache, forcing offline, and reloading `/demo`, the full app still rendered
  and `ridge-route.pdf` opened. This rules out ordinary browser cache masking.
- This static/PWA product has no first-party backend or sign-in. The billing
  verification endpoint allowed requests 1–30; request 31 returned 429 with
  `Retry-After: 4`. Observed allowance: 30 requests per active window.

## Performance

- Initial JS: 39,259 B raw / 13,954 B encoded
- CSS: 15,056 B raw / 4,656 B encoded
- Self-hosted font: 74,932 B
- Hero WebP: 83,164 B
- Total cold transfer measured by Lighthouse: 178,519 B

All stated budgets pass. Live mobile Lighthouse scored Performance 100,
Accessibility 100, Best Practices 100, and SEO 100. FCP was 1.1 s, LCP 1.7 s,
TBT 0 ms, CLS 0, and Speed Index 1.1 s.

## Claim-copy cross-check and defects

Landing, demo, app, install, privacy, terms, README, and demo documentation were
cross-checked against `.factory/claims.json`. Material product promises map to
declared tests; no unlisted claim was found.

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Non-blocking follow-up: before Play Store distribution, repeat a physical-device
smoke test across representative document providers and target apps. The public
direct-download APK is signed with the workflow-generated test key; an owner's
stable upload key is still required for store distribution.
