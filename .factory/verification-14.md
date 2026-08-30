# Independent verification 14

**Result: PASS — candidate accepted.**

- Candidate: `b698f3e23978501651c6c31e707154c1bfd622ee`
- Released product source: `9d532df0109ff37b34195de6db9628d57c57cd2f` (`v0.1.14`)
- Live URL: <https://offline-file-bridge.sociobot.in/>
- Verified: 30 August 2026 UTC

`b698f3e` is one documentation/evidence-only descendant of `9d532df`. Its
diff changes `.factory` records only; the candidate build metadata intentionally
resolves to the released product source. The live identity, v0.1.14 release
provenance, published APK, and APK's embedded identity all agree on that source
and the payload tree below.

```text
version             0.1.14
commit              9d532df0109ff37b34195de6db9628d57c57cd2f
payloadFileCount    17
payloadTreeSha256   4d1d721277cdd61099b7be119ced855544da410b6852beb2ee4b6c64c1a487d3
```

## Mandatory gates run first

`.factory/claims.json` exists and contains 18 unique claims. From a clean
`npm ci` (148 packages; zero audit vulnerabilities), I ran every literal
registered command separately. All passed.

| Claim | Exact registered command | Result |
| --- | --- | --- |
| apk-payload-match | `npm test -- --grep @claim:apk-payload-match` | PASS, desktop + mobile |
| offline-reload | `npm test -- --grep @claim:offline-reload` | PASS, desktop + mobile |
| demo-sandbox | `npm test -- --grep @claim:demo-sandbox` | PASS, desktop + mobile |
| demo-ready-sample | `npm test -- --grep @claim:demo-ready-sample` | PASS, desktop + mobile |
| demo-reset | `npm test -- --grep @claim:demo-reset` | PASS, desktop + mobile |
| local-only | `npm test -- --grep @claim:local-only` | PASS, desktop + mobile |
| freshness | `npm test -- --grep @claim:freshness` | PASS, desktop + mobile |
| file-handoff | `npm test -- --grep @claim:file-handoff` | PASS, desktop + mobile |
| scoped-folder-access | `npm run test:android-claim -- scoped-folder-access` | PASS, v0.1.14 installed-release evidence |
| free-tier | `npm test -- --grep @claim:free-tier` | PASS, desktop + mobile |
| browser-persistence | `npm test -- --grep @claim:browser-persistence` | PASS, desktop + mobile |
| browser-mirror-removal | `npm test -- --grep @claim:browser-mirror-removal` | PASS, desktop + mobile |
| browser-storage-clearing | `npm test -- --grep @claim:browser-storage-clearing` | PASS, desktop + mobile |
| native-refresh-safety | `npm run test:android-claim -- native-refresh-safety` | PASS, v0.1.14 installed-release evidence |
| license-verification-privacy | `npm test -- --grep @claim:license-verification-privacy` | PASS, desktop + mobile |
| checkout | `npm test -- --grep @claim:checkout` | PASS, desktop + mobile |
| consent-removal | `npm run test:android-claim -- consent-removal` | PASS, v0.1.14 installed-release evidence |
| native-handoff | `npm run test:android-claim -- native-handoff` | PASS, v0.1.14 installed-release evidence |

The four Android checks validate published installed-APK results for the system
folder picker/no broad storage permission, failed-refresh retention, removal
and released consent, and chooser handoff with a read-only URI.

## First read and end-to-end use

PASS on desktop and 390 x 844 mobile. The cold first screen states the job
(“Keep approved folders ready offline”), audience (“For Android users who need
cloud files in another app when the network disappears”), and first action
(“Try it with sample data” beside “A ready folder opens. Nothing is saved”).
At 390 px that action is fully in the first viewport (y=477–526) and opens
`/?demo=1` in one click.

Fresh live contexts showed only `demo:offline-file-bridge` storage and no real
IndexedDB database. The realistic three-file Field notes mirror refreshed,
previewed `handoff-notes.md`, downloaded that filename through **Save sample**,
and Reset restored its 12-minute seeded state. After service-worker control,
an offline reload still showed “Offline — ready files still open” and opened
`ridge-route.pdf`.

The local full suite additionally exercised browser import/reload persistence,
confirm/cancel removal, clearing site storage, the one-folder free boundary,
the 30-record history boundary, whitespace-only license recovery, and hosted
checkout validation.

## Quality gates

| Check | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS — 19 tests in 5 files |
| `npm test` | PASS — 80 Playwright tests, desktop + mobile Chromium |
| `npm run build` | PASS — `dist/` created |
| `npm run test:release-artifact` | PASS — APK/provenance/claim evidence match the payload tree |
| `npm run test:android` | PASS — 3 debug + 3 release tests, zero failures |
| `npm audit --omit=dev` | PASS — zero vulnerabilities |
| `git diff --check` | PASS |

The clean worker lacked Java and Android SDK. I installed temporary JDK 21 and
SDK 36 outside the repository, ran `npx cap sync android`, then ran the native
suite. A JDK 17 attempt correctly failed with `invalid source release: 21`; the
JDK 21 rerun passed. No product source was changed.

## Live quality, privacy, and deployment

At 390 px, seven routes (`/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`,
and a designed 404) in light and dark themes each had exactly one h1 and main,
`lang=en`, alt coverage, a route title, no horizontal overflow, and zero axe
serious/critical findings. Known 200 routes had no console or page errors.
The deliberate HTTP 404 navigation has Chromium's normal failed-resource
console message; it is not a JavaScript error.

Keyboard testing reached the skip link first, then the demo action; Enter moved
focus to the demo h1. After settling under reduced motion, no animations ran.
The complete live demo request log (load, refresh, preview, download, reset,
offline reload) was same-origin only. No analytics, CDN font, or file upload
appeared; the tested license flow limits its sole cross-origin request to the
documented Sociobot billing API.

The v0.1.14 APK link resolved. The downloaded APK is 7,586,981 bytes,
ZIP-integrity passed, and SHA-256 is
`4776c0a1c1b9725935617c819995526245b51594166546f0fc27bf593a4c3004`, matching
the release record. `aapt dump badging` reports package
`in.sociobot.offline_file_bridge`, version 0.1.14/code 14, min SDK 24, target
SDK 36, and no broad storage permission.

Live headers include HSTS, CSP with `frame-ancestors 'none'`, nosniff, strict
referrer policy, and restrictive permissions policy. HTML revalidates after
30 seconds; hashed JS/CSS cache for one year immutable; `sw.js` is no-cache.
The live service worker controls `/demo`, `registration.update()` completed,
and the offline exercise verified cached reload.

One client made 35 direct requests to the documented billing verification API:
requests 1–30 returned 200, and requests 31–35 returned **429** with
`Retry-After: 4`. Observed allowance: 30 requests per active window.

## Performance and visual contract

Production JS is 39,295 B (13,770 B gzip), CSS 15,056 B (4,560 B gzip), the
self-hosted font 74,932 B, and the hero WebP 83,164 B: all declared budgets
pass. The live interface matches its documented handwritten-lab-notebook visual
thesis while making consent, file counts, freshness, errors, and scope visible.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

No release-blocking finding remains. A physical-device interoperability smoke
test with real document providers and target apps is prudent before Play Store
distribution, but is not a defect in this direct-download release; the
published installed-APK evidence already covers required native outcomes.
