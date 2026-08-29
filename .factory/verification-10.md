# Independent verification 10

**Result: PASS**

- Candidate: `babaeb944e64b61706e0816d7f643cb8199e90f2`
- Live product: <https://offline-file-bridge.sociobot.in>
- Verified: 29 August 2026 (UTC), from a clean `npm ci` checkout.

The prior release-only failure is repaired. The live build identity, the
`v0.1.10` tag, and the public Android artifact all bind to the candidate
commit and the same web payload fingerprint.

## First read and demo

A cold desktop visit answered the three required questions in plain words:
“Keep approved folders ready offline”; “For Android users who need cloud files
in another app when the network disappears”; and the adjacent primary action
“Try it with sample data” with “A ready folder opens. Nothing is saved.” The
first-screen one-click demo requirement passes.

Fresh live demo exercise at `/demo` found the persistent isolated-demo banner,
the ready **Field notes** mirror, and three realistic sample files. Previewing
and saving `handoff-notes.md` produced that filename, Reset demo restored the
seed, and an online visit followed by an offline reload still displayed the
ready mirror and opened the sample file. Evidence images are in
`verification-artifacts/verification-10-live-*.png`.

## Claims gate — PASS

All 16 entries in `.factory/claims.json` were executed through their declared
demo entry points. No claim test failed.

| Claims | Exact command | Evidence |
| --- | --- | --- |
| `apk-payload-match`, `offline-reload`, `demo-sandbox`, `demo-ready-sample`, `demo-reset`, `local-only`, `freshness`, `file-handoff`, `free-tier`, `browser-persistence`, `license-verification-privacy`, `checkout` | `npm test -- --grep @claim:<id>` | Every individual declared browser claim completed; Playwright's final status was `passed` with no failed tests. |
| `scoped-folder-access` | `npm run test:android-claim -- scoped-folder-access` | PASS, installed Android 35 release evidence. |
| `native-refresh-safety` | `npm run test:android-claim -- native-refresh-safety` | PASS, installed Android 35 release evidence. |
| `consent-removal` | `npm run test:android-claim -- consent-removal` | PASS, installed Android 35 release evidence. |
| `native-handoff` | `npm run test:android-claim -- native-handoff` | PASS, installed Android 35 release evidence. |

## Local quality gates

| Check | Result |
| --- | --- |
| `npm run test:unit` | PASS — 15 tests in 3 files. |
| `npm run lint` | PASS. |
| `npm test` | PASS — 74 Playwright tests, desktop and mobile Chromium. |
| `npm run build` | PASS — writes `dist/`. |
| `npm run test:release-artifact` | PASS — `v0.1.10`, payload SHA-256 `53b36b823c8c569ab1347a8d09af25dd55a2f1038bb94bd2cd71ed7f034b9e77`. |
| `npm run test:android` | Not runnable in this non-Android worker: no `java` executable / `JAVA_HOME`. This is an environment limitation, not substituted for the four passing published installed-release claim checks above. |

The production bundle is within the static budget: JS is 39.13 KB (13.71 KB
gzip), CSS is 14.43 KB (4.45 KB gzip), the hero WebP is 83 KB, and the
self-hosted font is 75 KB. Lighthouse could not be scored in this worker: the
only available Playwright Chromium headless shell crashes the Lighthouse
launcher. The browser checks and static budgets above are fresh evidence; this
is a verification limitation, not a product finding.

## Live deployment, privacy, security, and accessibility

- `https://offline-file-bridge.sociobot.in/build-identity.json` reports
  version `0.1.10`, the exact candidate commit, 17 payload files, and the
  payload fingerprint above. Local `v0.1.10` resolves to the same commit.
- The live APK control validated release provenance before enabling
  `offline-file-bridge-v0.1.10.apk`. The public APK is 7,586,617 bytes and
  SHA-256 `56061a4b75fff1f648260b4dc1d090eb35a56e11a32ae3ddde4c786c2884cf2a`.
- The demo request log contains only same-origin requests. In the explicit
  release-check and fixture-license flow, the only cross-origin requests were
  the documented GitHub release/tag API and the documented Sociobot license
  verification endpoint; file data was never sent.
- `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/install` loaded with no
  console or page errors. `verify-url.sh` passed on `/` with title, `lang`, one
  h1/main, alt text, labelled controls, and no errors (artifact directory:
  `verification-artifacts/verification-10-verify-url/`).
- Axe on all of those routes plus the styled missing-page route reported zero
  serious/critical findings. At 390 px there was no horizontal overflow;
  keyboard Tab reached the skip link with a visible 3 px focus ring; reduced
  motion is honoured by the stylesheet; the full browser suite also covers
  44 px controls and 200% text reflow.
- Live HTML has a restrictive CSP (including `frame-ancestors 'none'`), HSTS,
  nosniff, strict referrer policy, disabled camera/mic/location, and immutable
  caching for hashed CSS/JS/font assets. The service worker is `no-cache`,
  claims clients, versions its cache, and the fresh offline reload succeeded.

The designed `/missing-page` response correctly has HTTP 404. Chromium logs
its expected generic “Failed to load resource: 404” console message for that
document status; this does not occur on any supported route and is not treated
as a product console-error defect.

## Defects and follow-up

- **Critical / high / medium:** none.
- **Low:** `.factory/demo.md` says to use **“Refresh local copy”**, but the
  shipped control is **“Refresh folder mirror”**. Update the guide to the
  visible label and retained terminology table. This does not affect the
  tested demo behaviour or release acceptance.
