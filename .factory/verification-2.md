# Independent product verification 2 — FAIL

**Candidate:** `344ba1552febc62d31d085f871af98d7f0ac6081` (`main`)

**Verified:** 28 August 2026

**Live URL:** <https://offline-file-bridge.sociobot.in>

**Artifact class:** Android APK

**Verdict:** **FAIL — do not release this candidate.**

This was a fresh verification. The earlier deployment-only failures are repaired: a valid APK/AAB/checksum release exists, the install screen resolves it, and the live checkout redirects to Dodo. The candidate still fails the mandatory claims gate and has unclosed native and accessibility acceptance gaps.

## Mandatory first gates

### First-read test — PASS

A cold 1440×900 load says:

- What it does: “Keep approved folders ready offline.”
- Who it is for: “For Android users who need cloud files in another app when the network disappears.”
- What to click: “Try it with sample data,” next to “A ready folder opens. Nothing is saved.”

One click opened `/demo` with a populated three-file **Field notes** mirror. The persistent “Demo — sample data, nothing is saved” banner, **Reset demo**, and **Start for real** were visible. Evidence: `evidence/verification-2/live-first-read-desktop.png` and `evidence/verification-2/live-demo-first-click-desktop.png`.

### Claims gate — FAIL

`.factory/claims.json` exists and contains 12 entries, each with one matching `@claim:<id>` tag. Every listed command was run individually, in manifest order, after `npm ci` from candidate commit `344ba15`.

| Claim | Exact manifest command | Result |
| --- | --- | --- |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — 2/2 desktop/mobile |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS — 2/2 |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS — 2/2 |
| `freshness` | `npm test -- --grep @claim:freshness` | PASS — 2/2 |
| `file-handoff` | `npm test -- --grep @claim:file-handoff` | PASS — 2/2 |
| `scoped-folder-access` | `npm test -- --grep @claim:scoped-folder-access` | PASS — 2/2 |
| `free-tier` | `npm test -- --grep @claim:free-tier` | PASS — 2/2 |
| `browser-persistence` | `npm test -- --grep @claim:browser-persistence` | PASS — 2/2 |
| `native-refresh-safety` | `npm run test:unit -- --grep @claim:native-refresh-safety` | **FAIL**, exit 1 |
| `checkout` | `npm test -- --grep @claim:checkout` | PASS — 2/2 |
| `consent-removal` | `npm run test:unit -- --grep @claim:consent-removal` | **FAIL**, exit 1 |
| `native-handoff` | `npm run test:unit -- --grep @claim:native-handoff` | **FAIL**, exit 1 |

All three failures are deterministic. Vitest 3.0.5 rejects the listed option before collecting tests:

```text
CACError: Unknown option `--grep`
Node.js v22.23.2
```

The aggregate `npm run test:unit` passes the three tests, but that does not satisfy the contract that each exact claims-manifest command must pass. The correct Vitest filter is `-t`/`--testNamePattern`, not Playwright's `--grep`. README's statement that `npm test` runs every claim is also inaccurate: `npm test` runs the nine Playwright claim tests, while the three native claim tests are only in the separate unit command.

## Local clean-checkout gates

| Gate | Result |
| --- | --- |
| `npm ci` | PASS; 150 packages installed from lockfile |
| `npm test` | PASS; 46/46 Playwright tests across desktop Chromium and Pixel 5 emulation |
| `npm run test:unit` | PASS; 3/3 Vitest source-regression tests |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS; `dist/` produced |
| Lint | No lint command/config exists |
| `npm audit --omit=dev` | PASS; 0 production vulnerabilities |
| `npm audit` | **FAIL**; 5 development dependency findings: 1 moderate, 2 high, 2 critical |
| `npm run test:android` | Could not run locally: this verifier image has no Java/JDK (`JAVA_HOME` unset) |

The tagged GitHub Android workflow is independently visible as successful: [run 33191438619](https://github.com/B-Divyesh/sf-offline-file-bridge/actions/runs/33191438619), head `b00b303868da2883be14bcb32601cb473fa69ba4`. Its Android test/build step passed. Candidate `344ba15` differs from that tag only in `.factory/handoff.md`, so product and Android sources are identical.

## End-to-end product exercise

### Web/PWA path — PASS

- Demo refresh changes the visible freshness to “synced just now” in the exact claim test.
- Opening `handoff-notes.md` moves focus into the dialog; Escape closes it and restores focus; saving downloads the correct filename.
- Demo storage contained only `demo:offline-file-bridge`; no real IndexedDB database appeared.
- A real browser folder with `route.csv` and `offline-note.txt` persisted across reload.
- The real folder reloaded offline and downloaded `offline-note.txt`; the status said “Offline — ready files still open.”
- The free second-folder attempt showed the limit and recovery action.
- A fallback-browser refresh that cannot reopen its source preserved the ready files and explained that the mirror must be removed and chosen again.
- Remove cancellation retained the mirror; confirmation removed it and restored the empty state.
- An empty license submission made no request and exposed the browser's required-field message. An invalid token made one Sociobot request and showed “This license is no longer active. Buy a new license or restore another.”

### Android artifact — package PASS, real job unverified

The latest release API returned v0.1.1 with:

- APK: 7,403,321 bytes; SHA-256 `edd01b824744d78e0f8d12a1995fed934c4ff70380f9526f57cbfd871cca1d75`
- AAB: 7,250,771 bytes; SHA-256 `59d654a1e8791ffad67b3a179e420e77b3d5bf08c6138864056a2a188b32ff7f`
- `SHA256SUMS`: both downloaded files validated.

The APK unzips cleanly. Its manifest reports package `in.sociobot.offline_file_bridge`, version `0.1.1`, min/target SDK 22/34, only `INTERNET` plus Android's generated non-exported receiver permission, a non-exported `FileProvider`, and no broad storage permission. Its certificate is the documented `CN=Param Factory Test, O=Sociobot, C=IN` test certificate. The embedded `index-Ctd228YQ.js` exactly matches the local production build.

However, the repository and release workflow have no device/emulator instrumentation covering the actual Storage Access Framework selection, persisted grant, offline private mirror, chooser handoff to a second app, or revoke-on-remove path. The four native claim checks are source-text/JVM regressions, not an observable installed-APK flow. Therefore the Android smallest useful product and the brief's 95% second-app success measure remain unverified. This verifier environment has no Java, Android emulator, or attached device, so static/package checks cannot close that acceptance requirement.

## Live deployment identity

The live deployment matches this candidate's product output byte-for-byte:

| File | Local/live SHA-256 comparison |
| --- | --- |
| `index.html` | MATCH |
| `assets/index-Ctd228YQ.js` | MATCH |
| `assets/index-eALpEu6Q.css` | MATCH |
| `sw.js` | MATCH |
| `manifest.webmanifest` | MATCH |

The released APK embeds that same JS hash. This is not a deployment mismatch.

The live footer nevertheless says **v0.1.0** while package.json, Android manifest, install page, release, and APK say **v0.1.1**. The UI therefore does not provide an accurate build identity.

## Accessibility and responsive QA

Passing evidence:

- Desktop/light and 390×844 mobile/dark checks on `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, and `/missing-page` found one `<h1>`, one `<main>`, `lang=en`, route titles, no console/page errors, and no default-size horizontal overflow.
- Axe found 0 serious/critical violations on every route in both profiles.
- `/opt/fleet/lib/verify-url.sh` passed: 681 ms load, no errors, title/lang/main present, no missing image alt, no unlabeled buttons. Evidence is under `evidence/verification-2/verify-url/`.
- The first Tab focuses the skip link with a visible 3px accent outline and 3px offset. The primary demo action is keyboard reachable.
- The file dialog focuses **Close file**, traps focus natively, closes with Escape, and returns focus to its opener.
- Reduced-motion emulation matched the media query and reduced animation/transition duration to `0.01ms`.

Manual failures not reported by Axe:

1. Client-side navigation does not focus the new `<h1>`. Activating **Try it with sample data** leaves `document.activeElement` on `<body>`. `navigate()` pushes `{}` and `renderRoute()` only focuses the heading when `history.state.routed` is true, so forward link navigation misses the required focus change.
2. Keyboard Tab enters the transparent 1×1 `#folder-input` between **Choose a folder** and the next visible action. The designed focus outline is therefore invisible for one focus stop.
3. At 390px, header links are 40px high, the wordmark is 42px high, and footer links are about 22.3px high. These miss the required 44×44px touch target.
4. A 200% text-size simulation caused horizontal overflow: 575px content width on `/` and 537px on `/demo` in a 390px viewport. `/privacy` reflowed at 390px. Screenshots: `evidence/verification-2/text-200-home.png` and `text-200-demo.png`.

## Privacy, network, security, and rate limiting

- The complete demo refresh/open/download flow made only same-origin requests and produced no console errors.
- Lighthouse observed zero third-party runtime requests. Fonts are self-hosted. No analytics/tracker request was observed.
- A repository secret-pattern scan found no API key, private key, or client secret.
- The only intentional external runtime calls are GitHub public release metadata after **Check latest APK**, Sociobot license/checkout, and explicit external navigation.
- Live security policy includes HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, camera/microphone/geolocation denial, and a restrictive CSP. No CSP violations appeared.
- Hashed CSS/JS respond with `public, max-age=31536000, immutable`; `sw.js` responds with `no-cache`; HTML is revalidated with a 30-second max age.
- The service worker was activated and controlled `/demo`; `registration.update()` completed with no waiting/installing worker. Cache `offline-file-bridge-v2` contained the versioned JS/CSS and application routes. Offline reload and file open passed.
- An 80-request concurrent burst against the license verify endpoint completed in 657 ms: **30 × 200, 50 × 429**. Every sampled 429 included `Retry-After: 4`. The observed burst capacity was 30 requests.
- Checkout returned `303` to `https://checkout.dodopayments.com/session/...`.
- The product has no sign-in flow, so Entra tenant verification is not applicable.

## Performance and budgets

Production build output:

- JS: 37.00 KB raw / 13.26 KB gzip (budget ≤200 KB)
- CSS: 13.43 KB raw / 4.25 KB gzip (budget ≤50 KB)
- Font: 74,932 bytes (budget ≤120 KB)
- Hero WebP: 83,164 bytes (budget ≤300 KB)

Fresh mobile Lighthouse on the live landing page:

- Performance 98; Accessibility 100; Best Practices 100; SEO 100
- FCP 1.0 s; LCP 1.8 s; TBT 160 ms; CLS 0; Speed Index 1.1 s
- 8 requests / 196,040 transferred bytes; 0 third-party requests
- Representative open-file interaction event duration: 16 ms

All stated performance budgets passed.

## Defects by severity

### Critical / release-blocking

1. **Three required claims-manifest commands fail.** Vitest rejects `--grep`, producing a 9-pass/3-fail claims gate. The acceptance contract explicitly makes any failed claim command release-blocking.

### High

2. **The Android job-to-be-done lacks device-level end-to-end evidence.** No test installs the APK and proves SAF consent, offline mirror refresh, second-app chooser handoff, or revoke-on-remove. Source substring checks cannot establish the brief's real Android outcome or 95% success measure.
3. **Accessibility acceptance fails outside Axe.** Route changes lose heading focus, the hidden file input creates an invisible Tab stop, mobile touch targets are below 44px, and 200% text creates horizontal overflow on the core landing/demo screens.

### Medium

4. **Claim proof is incomplete even beyond the broken commands.** The free-tier test asserts the “30 refresh records” sentence but never creates 31 records or verifies the cap. Native handoff/consent tests inspect source strings instead of exercising an installed package. User-facing claims that source folders are unchanged, refunds revoke licenses, and real file content is never sent do not each have an observable claims-manifest test.
5. **Development dependency audit fails.** Five dev-tool vulnerabilities include critical advisories in the Capacitor CLI `tar` chain and Vitest. Production dependencies audit clean, so runtime exposure is not shown, but clean install/CI tooling remains affected.
6. **Build identity and artifact entry are inconsistent.** The live footer says v0.1.0 while the artifact is v0.1.1. The landing page also has no direct **Download APK** action; reaching the binary requires opening Install, clicking **Check latest APK**, then clicking **Download APK**, contrary to the mobile artifact contract.
7. **Unknown routes return HTTP 200.** `/missing-page` renders the designed not-found UI but responds `200`, so the deployment does not provide a real HTTP 404 route.

## Required fixes before another verification

1. Change the three Vitest claim commands to a supported name filter and run every exact manifest command from a clean checkout.
2. Add device/emulator instrumentation that installs the release APK and proves the actual SAF, failed-refresh preservation, chooser, and permission-revocation flows, including an offline second-app handoff sample.
3. Focus the destination heading on every SPA route transition; make every touch target at least 44px; verify reflow at 200% text.
4. Strengthen claim tests so each advertised behavior is observed, especially 30-record retention and privacy/native promises.
5. Update dev dependencies, correct the footer version, expose a direct landing-page APK action, and return 404 for unknown routes.
