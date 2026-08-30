# Polish round 6 handoff — Offline File Bridge

## Result

**PASS — every finding from reviews 1–6 is closed.**

- Product commit: `9d532df0109ff37b34195de6db9628d57c57cd2f`
- Android release: [`v0.1.14`](https://github.com/B-Divyesh/sf-offline-file-bridge/releases/tag/v0.1.14)
- Android workflow: [run 33281413327](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33281413327), successful
- Static deployment: `005a15d2-46c5-4721-a5ed-f6cd1ca77980`
- Live URL: <https://offline-file-bridge.sociobot.in/>
- Live build identity: version `0.1.14`, product commit `9d532df…`, payload SHA-256 `4d1d721277cdd61099b7be119ced855544da410b6852beb2ee4b6c64c1a487d3`

## What changed

- The first-screen sample action now opens the required `/?demo=1` URL. Client navigation preserves its query string, moves focus to the demo h1, and keeps the isolated banner, Reset, and Start for real controls.
- The release contract now distinguishes product source from later evidence records. An exact tag or evidence-only descendant can verify `v0.1.14`; changes to the app, claims, tests, README, catalog, or configuration still require a new release.
- A unit contract rejects undeclared claims, duplicate claim ids, missing browser tags, and missing Android claim mappings.
- Version `0.1.14`, Android version code 14, the PWA start version, and the service-worker cache version move together.
- The catalog line is now the 80-character, verb-first sentence: “Keep approved Android folders ready offline and open their files in another app.”
- All earlier copy, terminology, demo reset, mobile ordering, metadata, routing, focus, 404, legal, privacy, billing, and Android behavior repairs remain protected by tests. The handwritten field-notebook identity is unchanged.

## Clean-clone verification

A no-local-links clone of commit `9d532df…` was installed with `npm ci`; npm reported 148 packages and zero vulnerabilities.

| Check | Result |
| --- | --- |
| Every literal command in `.factory/claims.json` | PASS — all 18; 14 browser commands and 4 published installed-APK commands |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS — 19/19 |
| `npm test` | PASS — 80/80 across desktop and mobile Chromium |
| `npm run build` | PASS — `dist/` produced |
| `npm run test:release-artifact` | PASS — commit, APK, embedded web files, provenance, payload, and four Android results match |
| `npm audit --omit=dev` | PASS — zero vulnerabilities |
| `git diff --check` | PASS |

The four Android commands accepted API 35 installed-release results for the exact `v0.1.14` APK:

- `scoped-folder-access`: system picker launched and installed permissions contained no broad storage access.
- `native-refresh-safety`: an abandoned staged copy preserved the previous bytes; a completed refresh replaced them.
- `consent-removal`: private files and the saved access record were removed.
- `native-handoff`: the chooser received the expected content URI, MIME type, and read grant.

The APK is 7,586,981 bytes with SHA-256 `4776c0a1c1b9725935617c819995526245b51594166546f0fc27bf593a4c3004`. The AAB is 7,478,014 bytes with SHA-256 `a85ec1e56f5bd63b69b03490d29783f554a93f98138dc0e035be7c40c2d92ff8`.

## Live verification

Cold checks on 30 August 2026 covered `/`, `/?demo=1`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, and `/missing-polish-6`.

- The standard URL verifier passed home, query demo, Privacy, Terms, and Install with correct titles, `lang=en`, one h1, one main landmark, alt coverage, and no console errors.
- The query demo kept real sentinels unchanged, never opened the real product database, made no foreign request, reset visibly to 12 minutes, restored Reset focus, and deleted its own key on exit.
- At 390 × 844, **Field notes** and `ridge-route.pdf` were fully above the fold. Mobile had no horizontal overflow; all controls were at least 44 px; 200% text reflow had no overflow.
- Offline reload retained the ready sample and opened `ridge-route.pdf`.
- Route navigation and Back focused the destination h1. The unknown route returned HTTP 404, used **Page not found**, omitted canonical metadata, and linked home.
- Privacy and Terms links appeared in every route footer. All known routes returned 200 with route-specific titles, descriptions, and canonicals.
- Axe found zero serious or critical issues on seven routes in light and dark modes. Reduced-motion mode had zero running animations.
- The APK check exposed only the matching `v0.1.14` download and linked SHA256SUMS.
- CSP, HSTS, `nosniff`, referrer policy, and permissions policy were present. No unexpected console error occurred.

Evidence: [live browser report](verification-artifacts/polish-6/live-browser-check.json), [mobile home](verification-artifacts/polish-6/live-home-mobile-390.png), [query demo](verification-artifacts/polish-6/live-demo-query-mobile-390.png), [404](verification-artifacts/polish-6/live-404-mobile-390.png), and [route focus](verification-artifacts/polish-6/live-route-focus-mobile-390.png).

Live Lighthouse scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. FCP was 1.1 s, LCP 1.7 s, TBT 0 ms, CLS 0, and total transfer 192 KiB. Initial JavaScript is 39,295 B, CSS is 15,056 B, the self-hosted font is 74,932 B, and the hero WebP is 83,164 B. See [the report](verification-artifacts/polish-6/lighthouse-live.json).

## Run and deploy

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build
```

Deploy `dist/` as the static site. Android packages are built only by `.github/workflows/android.yml` from a version tag.

## Known gaps and next steps

No known gap remains in the direct-download Android APK and offline PWA scope. A later Play Store submission would use the owner's stable upload key and is outside this work order.
