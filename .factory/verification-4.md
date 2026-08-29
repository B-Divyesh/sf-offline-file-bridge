# Independent verification 4 — PASS

- **Candidate:** `5888fa3ee5647c18f6c4716a3dfa4507bb70128a`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Verified:** 29 August 2026 UTC
- **Artifact:** Android APK with PWA landing/demo

## Release decision

**PASS.** No release-blocking or material product defect was found. The previously reported stale-APK failure is repaired: the live site, a fresh candidate build, and the web payload embedded in the public `v0.1.2` APK are byte-for-byte equal. The APK, AAB, provenance, and published checksums are present and internally consistent.

## Mandatory first read and demo gate

A cold load shows all required information before scrolling, including at 390 × 844 px:

- What it does: **“Keep approved folders ready offline.”**
- Who it is for: **“For Android users who need cloud files in another app when the network disappears.”**
- What to click first: **“Try it with sample data.”** The adjacent note says a ready folder opens and nothing is saved.
- One click opens `/demo` with three usable files and the persistent **“Demo — sample data, nothing is saved”** banner, plus **Reset demo** and **Start for real**.

Result: **PASS**.

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every listed command was run separately from candidate `5888fa3`; every claim has exactly one matching `@claim:<id>` test declaration.

| Claim | Result | Evidence |
| --- | --- | --- |
| `offline-reload` | PASS | 2/2 Chromium projects; offline reload and ready sample open |
| `demo-sandbox` | PASS | 2/2; only `demo:offline-file-bridge`, no real IndexedDB |
| `local-only` | PASS | 2/2; demo and selected-file flows send no file request |
| `freshness` | PASS | 2/2; refresh changes visible status to “synced just now” |
| `file-handoff` | PASS | 2/2; saved filename is `handoff-notes.md` |
| `scoped-folder-access` | PASS | 2/2; SAF picker and no broad storage permission |
| `free-tier` | PASS | 2/2; one/eight-folder limits, 30 records, and $14 price |
| `browser-persistence` | PASS | 2/2; both selected files remain after reload |
| `native-refresh-safety` | PASS | 1/1 native transaction regression |
| `checkout` | PASS | 2/2; 303 to hosted Dodo checkout |
| `consent-removal` | PASS | 1/1 native deletion/grant-release regression |
| `native-handoff` | PASS | 1/1 private `FileProvider`/chooser regression |

No contradictory or unsupported product claim was found in the live copy or README. Operational release statements were also checked against the public workflow, release metadata, and downloaded artifacts.

## Clean-checkout and build evidence

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 149 packages, 0 vulnerabilities |
| `npm run lint` | PASS — TypeScript no-emit check |
| `npm run test:unit` | PASS — 7/7 |
| `npm test` | PASS — 62/62 desktop/mobile Playwright tests |
| `npm run build` | PASS — `dist/` produced |
| `git diff --check` | PASS |
| `npm run test:android` | Not runnable here — this verifier image has no Java or Android SDK |

The production output is 37,218 B JavaScript (13,344 B gzip), 14,198 B CSS (4,393 B gzip), a 74,932 B self-hosted font, and an 83,164 B hero image. All are within contract budgets.

## Candidate, deployment, and Android identity

- Every one of the 17 publicly served build files checked (all `dist/` files except deployment-only `staticwebapp.config.json`) exactly matches the fresh candidate build in size and SHA-256.
- Live `/build-identity.json` is byte-identical to the candidate output and records product `offline-file-bridge`, version `0.1.2`, and immutable release commit `85b6c082837b07fdc85c58be7f977b1542d27fc2`.
- Candidate `5888fa3` deliberately resolves `v0.1.2` as that immutable release identity. Its unit regression passes. Product/native source is unchanged after the tag; the candidate produces the same deployable bytes.
- Public GitHub Actions run `33229112667` is completed/success for tag commit `85b6c082…`; its installed release-APK Android 36 instrumentation, Gradle tests, APK/AAB build, payload comparison, and publication steps all report success.
- Fresh consumer download: APK 7,584,941 B, AAB 7,475,967 B. `sha256sum -c SHA256SUMS` passes for APK, AAB, and provenance.
- APK SHA-256: `24972b5c04731f96d36a22eaf52ed21432e03011b5604603e7cc50312d3c7e3e`.
- The release contract independently compared all 18 APK `assets/public/` files with candidate `dist/`; all match. Web-tree SHA-256 is `e62fb7fcc9eca061970ef64db71a9db29e2af748adcc0fecd77a9a29e939670b`.
- Embedded Capacitor config has app id `in.sociobot.offline_file_bridge`; the APK is larger than 1 MB and includes the manifest, native bridge, icons, and complete web shell.
- The live download action resolves `offline-file-bridge-v0.1.2.apk` and displays “This APK matches this site.”

This directly closes the P0 mismatch in verification 3.

## End-to-end product behavior

Fresh live browser contexts covered normal, boundary, invalid, and recovery cases:

- Demo refresh updates freshness, all three sample files open, and Markdown saves with the correct filename.
- Dialog initial focus, Escape close, and focus restoration pass.
- Demo reset restores the sample; trying to add in demo explains how to start for real.
- Leaving demo deletes the demo key and opens the real empty state.
- A two-file browser folder imports, opens/downloads the selected file, and persists after reload.
- The free second-folder attempt shows a specific recovery action.
- A browser mirror that cannot reopen its source reports that limitation and keeps the last successful timestamp.
- Canceling removal preserves the mirror; confirming removes it and returns to the useful empty state.
- A zero-byte file is accepted and shown as `0 B`.
- An HTML-like filename is rendered as text, not markup.
- An invalid license returns a clear correction message.
- Checkout currently returns 303 to a `checkout.dodopayments.com/session/...` URL.

No sign-in is required. AI, library/CLI packaging, and a product-owned backend are not applicable.

## Privacy and request allowance

- Cold landing requests were same-origin only: document, JS, CSS, font, and hero image.
- The complete demo refresh/open/reset flow emitted no cross-origin request.
- Real folder import/open/remove emitted no file-content request. Browser file handling remained local.
- Invalid license verification sent only the entered token to the documented Sociobot endpoint. Release lookup occurred only after the explicit APK action and went only to GitHub's public API.
- Sociobot verification CORS explicitly allows `https://offline-file-bridge.sociobot.in`; the response uses `Cache-Control: no-store`.
- Fresh concurrent allowance check: 35 invalid-license verification requests produced **30 × 200 and 5 × 429**. Every 429 included `Retry-After: 4` and `x-ratelimit-after: 4`. Observed burst allowance: **30 requests**.

## Accessibility, mobile, PWA, security, and performance

- `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/install` return 200. A missing path returns the designed 404.
- Every route has `lang=en`, one named H1, one main landmark, a route-specific title/canonical URL, and no image missing alt text.
- Axe: zero serious/critical findings on all routes at desktop; zero serious/critical findings on all product routes at 390 px dark mode.
- Keyboard: skip link is first, primary demo action is reachable/operable, SPA navigation moves focus to the new H1, and focus uses a visible 3 px outline with 3 px offset.
- Mobile: no horizontal overflow at 390 px, visible controls are at least 44 px, and 200% text reflows without horizontal overflow.
- Reduced motion: zero running document animations.
- PWA: Chromium parses the manifest with no errors; the active worker controls the page and uses `offline-file-bridge-v3`. Live `/demo` reloads offline and opens a ready file.
- Update simulation against an unmodified candidate build plus a versioned worker response showed the update notice, activated the new cache, removed the old cache, and reloaded offline successfully.
- Headers include CSP with header-only `frame-ancestors 'none'`, HSTS, `nosniff`, referrer policy, and permissions policy. `sw.js` is `no-cache`; hashed JS/CSS are one-year immutable.
- `/opt/fleet/lib/verify-url.sh`: PASS in 765 ms, no console errors.
- Fresh mobile Lighthouse: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; FCP 0.91 s, LCP 1.81 s, TBT 33 ms, CLS 0.

## Defects and limitations

### Release blockers

None.

### Material defects

None found.

### P3 — small secondary mobile labels fall below the visual baseline

At 390 px, several secondary labels render below the design-principles 16 px web text baseline: header navigation is 13.12 px, the action note is 14.4 px, and some file metadata is 12.48 px. Contrast, 200% zoom/reflow, 44 px touch targets, and axe all pass, so this is a non-blocking readability/polish finding rather than an accessibility or task-completion failure.

### Verification limitation

This disposable verifier lacks Java, the Android SDK, and an emulator, so it could not rerun Gradle or install the APK locally. This is not a product failure: the required Android build path is GitHub Actions, its public tagged run is successful, and this verification independently checked the downloadable binaries, hashes, provenance, app id, embedded identity, and exact embedded web payload. A physical-device smoke remains sensible before a store release signed with the owner's upload key.

## Evidence

Screenshots and the URL verifier output are in `.factory/verification-artifacts/`.
