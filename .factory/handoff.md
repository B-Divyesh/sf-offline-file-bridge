# Offline File Bridge v0.1.1 verification handoff — FAIL

Candidate `344ba1552febc62d31d085f871af98d7f0ac6081` was independently tested on 2026-08-28 against <https://offline-file-bridge.sociobot.in>.

## Release decision

**FAIL — do not release this candidate.** Three mandatory claim commands fail before running because `.factory/claims.json` passes unsupported `--grep` arguments to Vitest. Manual accessibility QA also found broken 200% mobile reflow, an invisible keyboard focus stop, and sub-44px mobile targets.

Full evidence and defect details are in [`.factory/verification-2.md`](verification-2.md).

## What was verified

- Required first-read and one-click sample demo: PASS.
- Installed from lockfile with `npm ci`.
- Every exact command in `.factory/claims.json`: 9 PASS, 3 FAIL.
- `npm run test:unit`: 3/3 PASS.
- `npm test`: 46/46 PASS across desktop and mobile Chromium.
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS; `dist/` produced.
- `npm audit --omit=dev`: zero production findings. Full audit: 5 development-tool findings, including 2 critical.
- Live normal, limit, invalid-license, removal/recovery, privacy, offline, keyboard, reduced-motion, and 390px flows exercised.
- Live security headers, cache policy, request destinations, console/page errors, and all rendered links checked.
- Rate limit: a 100-request verification burst yielded 30×200 and 70×429; 429 responses included `Retry-After: 4`.
- Lighthouse mobile: 97 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.654 s, CLS 0.
- Live HTML/JS/CSS hashes match the candidate production build exactly.
- Published v0.1.1 APK/AAB downloaded, ZIP-tested, and matched both `SHA256SUMS` and GitHub digests. The APK embeds the candidate web assets.

## Release blockers and defects

1. **Critical:** native claim commands at claims lines 62, 76, and 83 use unsupported Vitest `--grep`; all exit 1 without tests.
2. **High:** at 200% text size on a 390px viewport, content expands to 537px and **Share / open** controls leave the viewport.
3. **High:** the broad “Files stay on your device” privacy promise is represented only by a demo-scoped claim/test.
4. **Medium:** keyboard Tab reaches the transparent 1×1 folder input, producing an invisible focus stop.
5. **Medium:** mobile header and footer links measure below the required 44×44px target.
6. **Medium:** full `npm audit` reports vulnerable Vite, Vitest, and Capacitor CLI's `tar` dependency tree.
7. **Low:** the footer says v0.1.0 while this build and release are v0.1.1.
8. **Low:** unknown routes render the 404 design with HTTP 200.

## Environment limits / next verification

This worker has no Java, Android SDK, emulator, or `adb`, so `npm run test:android` and physical-device flows could not run locally. GitHub Action run `33191438619` passed Android JVM tests and produced the checked artifacts. After repairs, rerun every claim command and then exercise SAF selection, an unreadable provider, failed-refresh preservation, consent removal, and chooser handoff on a physical Android device.
