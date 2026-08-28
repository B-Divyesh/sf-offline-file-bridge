# Offline File Bridge v0.1.0 handoff — **FAIL (independent verification)**

> Independent verification on 2026-08-28 against candidate `149b6f4e8824a574c1939c07c88478b50ed58ba7` and https://offline-file-bridge.sociobot.in **failed**. See `.factory/verification-1.md` for exact commands and evidence. Do not release this candidate.
>
> Release blockers: no publicly downloadable APK/AAB/SHA256SUMS; the advertised Sociobot checkout returns 404; native refresh deletes the prior private mirror before a replacement copy has completed; native removal leaves its persisted SAF read grant behind; and `npm run test:unit` fails. The web/PWA demo and all eight claim commands pass, but they do not validate those Android release paths.

## Original builder handoff (superseded by the verification result above)

## What was built

- A Vite and TypeScript offline-first PWA at `/`, with real routes for `/demo`, `/app`, `/install`, `/privacy`, `/terms`, and the styled 404 state.
- A one-click, isolated demo with three realistic files, refresh state, local preview, download handoff, reset, and an offline reload path.
- A real browser bridge using user-selected directories where the File System Access API exists. Other browsers use a folder-scoped multi-file picker. Copies persist in IndexedDB.
- A Capacitor 6 Android project with app id `in.sociobot.offline_file_bridge`.
- A native `OfflineBridgePlugin` that uses `ACTION_OPEN_DOCUMENT_TREE`, persists the selected URI permission, recursively copies files into private app storage, and opens copies through Android's chooser and a narrow `FileProvider`.
- The free one-folder limit and a $14 one-time Bridge Pro flow. Checkout, returned-license capture, daily verification caching, offline optimistic access, and token restore use the Sociobot billing contract. No product id is hardcoded.
- A GitHub Actions workflow that builds release APK and AAB files with JDK 17, signs them with a generated test keystore, writes `SHA256SUMS`, and attaches them to release `v0.1.0`.
- A product-specific handwritten lab notebook system, original generated hero art, social art, PWA icons, Android icons and splash images, light/dark palettes, reduced-motion behavior, and a self-hosted Caveat font.

## Run and verify

```sh
npm ci
npm test
npm run build
```

`npm test` passed 44 Playwright checks across desktop Chromium and a Pixel 5 profile. This includes all eight tagged claims, offline reload, demo isolation, same-origin privacy, browser persistence, file handoff, keyboard navigation, route semantics, mobile overflow, and axe serious/critical checks.

`npm run build` passed and wrote `dist/index.html`. Production output:

- JavaScript: 37.00 KB raw / 13.26 KB gzip
- CSS: 13.43 KB raw / 4.25 KB gzip
- Hero WebP: 82 KB
- Self-hosted font: 74 KB

Mobile Lighthouse, run against the production preview on 28 August 2026:

- Performance: 99
- Accessibility: 100
- Best practices: 100
- SEO: 100
- LCP: 2.1 s
- Total blocking time: 0 ms
- CLS: 0

`npm audit --omit=dev` reported zero production vulnerabilities. The source image was reviewed for text artifacts, logos, brands, seams, and misleading UI. It passed.

The Android build was not executed in this static worker because no JDK or Android SDK is installed. The checked-in workflow runs `./gradlew assembleRelease bundleRelease` in the required JDK 17 Android environment.

## Product boundaries

- Refresh is user-triggered. Background cloud crawling is intentionally excluded.
- The web build cannot invoke Android's app chooser. It uses Web Share where supported and download elsewhere. The Capacitor build provides the native chooser.
- A successful refresh time is preserved after an error. It does not imply that the source stayed unchanged.
- The app mirrors readable files. It skips provider entries that Android cannot open and reports a failed top-level refresh without changing the prior ready time.

## Needs operator action

1. Register `offline-file-bridge` with the Sociobot billing engine and confirm the $14 one-time price and return URL.
2. Run the `Build Android release` workflow or push tag `v0.1.0`. Confirm the APK, AAB, and `SHA256SUMS` assets appear on the release.
3. For Play Store distribution, replace the generated workflow key with the owner's upload key and protect its secrets. The generated key is for direct test releases only.
4. Install the APK on at least two supported Android versions and complete a physical-device handoff to a PDF viewer and text editor before store submission.

## Evidence and references

- Claims: `.factory/claims.json`
- Demo contract: `.factory/demo.md`
- Copy audit: `.factory/copy-audit.md`
- Visual system and provenance: `.factory/design.md`
- Android release workflow: `.github/workflows/android.yml`
