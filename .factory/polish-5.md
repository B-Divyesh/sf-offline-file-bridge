# Polish round 5 — complete finding ledger

Candidate release: `v0.1.13` · live site:
<https://offline-file-bridge.sociobot.in>

The product keeps its handwritten lab-notebook identity, local-first model,
and Android APK delivery. All previous findings were checked again rather than
accepted from an old ledger. Evidence paths below are committed with this
repair or produced by the matching release/deploy check.

| Finding | Change made | Evidence | Live check |
| --- | --- | --- | --- |
| F-1-1 | Reset reseeds, rerenders, announces the result, and restores Reset focus. | `@claim:demo-reset` | `/demo` |
| F-1-2 | One click opens the isolated ready Field notes sample with three files. | `@claim:demo-ready-sample`; `evidence/polish-5/local-demo-mobile-390.png` | `/demo` |
| F-1-3 | Failed-refresh wording remains Android-specific. | `@claim:native-refresh-safety` | `/` |
| F-1-4 | Price, limits, and one-time checkout are verified; unsupported refund/device/export promises remain absent. | `@claim:free-tier`, `@claim:checkout` | `/`, `/terms` |
| F-1-5 | README limits browser wording to tested reload persistence. | `@claim:browser-persistence` | `/app` |
| F-1-6 | Visitor release-process promises remain removed. | README and install copy audit | `/install` |
| F-1-7 | Fixture-token interception restricts license verification to Sociobot. | `@claim:license-verification-privacy` | `/privacy` |
| F-1-8 | The information-free hero mood line remains removed. | `.factory/copy-audit.md` | `/` |
| F-1-9 | The workflow heading remains functional and descriptive. | route/title browser checks | `/` |
| F-1-10 | Invented notebook labels remain absent from visitor copy. | `.factory/copy-audit.md` | `/` |
| F-1-11 | Folder mirror remains the sole product term in copy, metadata, and demo instructions. | `copy-contract.test.ts`; route metadata test | `/app`, `/demo` |
| F-1-12 | Folder and file actions state their result, including file-specific Preview controls. | `@claim:file-handoff` | `/demo` |
| F-1-13 | The styled 404 heading is Page not found. | route browser checks | `/missing-page` |
| F-1-14 | Unknown routes remove canonical metadata. | canonical route browser test | `/missing-page` |
| F-2-1 | Untested Play Store, signing, PWA, and AAB visitor assertions remain removed. | README/install copy audit | `/install` |
| F-2-2 | Internal signing jargon remains absent from installation copy. | README/install copy audit | `/install` |
| F-3-1 | Exact-candidate Android 35 picker and permission evidence is published with the tag. | `@claim:scoped-folder-access` | release `v0.1.13` |
| F-3-2 | Exact-candidate staged-refresh safety evidence is published with the tag. | `@claim:native-refresh-safety` | release `v0.1.13` |
| F-3-3 | Exact-candidate private-file deletion and grant-release evidence is published with the tag. | `@claim:consent-removal` | release `v0.1.13` |
| F-3-4 | Exact-candidate chooser, URI, MIME, and grant evidence is published with the tag. | `@claim:native-handoff` | release `v0.1.13` |
| F-3-5 | APK control still checks identity before exposing a versioned download. | `@claim:apk-payload-match` | `/`, `/install` |
| F-3-6 | Checkout control names the Sociobot external destination. | `@claim:checkout` | `/`, `/terms` |
| F-3-7 | README calls Android’s folder picker by its plain name. | README copy audit | `/` |
| F-3-8 | README calls Android’s app chooser by its plain name. | README copy audit | `/install` |
| F-3-9 | Terms heading identifies the product and page. | route browser checks | `/terms` |
| F-4-1 | Browser removal and browser-data clearing retain distinct observable claims; Android copy stays scoped. | `@claim:browser-mirror-removal`, `@claim:browser-storage-clearing`, `@claim:consent-removal` | `/privacy` |
| F-4-2 | README test instructions explain the outcome without internal jargon. | README copy audit | `/` |
| F-5-1 | v0.1.13 binds the picker claim to this candidate’s installed release APK. | `@claim:scoped-folder-access`; `ANDROID-CLAIMS.json` | release `v0.1.13` |
| F-5-2 | v0.1.13 binds the failed-refresh claim to this candidate’s installed release APK. | `@claim:native-refresh-safety`; `ANDROID-CLAIMS.json` | release `v0.1.13` |
| F-5-3 | v0.1.13 binds the removal claim to this candidate’s installed release APK. | `@claim:consent-removal`; `ANDROID-CLAIMS.json` | release `v0.1.13` |
| F-5-4 | v0.1.13 binds the app-chooser claim to this candidate’s installed release APK. | `@claim:native-handoff`; `ANDROID-CLAIMS.json` | release `v0.1.13` |
| F-5-5 | Demo places Field notes and full ridge-route.pdf above the 390 × 844 fold; summary follows the sample. | `@claim:demo-ready-sample`; `evidence/polish-5/local-demo-mobile-390.png` | `/demo` |
| F-5-6 | The one tagged APK claim test now contains both exact-match and stale-payload rejection assertions. | `@claim:apk-payload-match` | `/`, `/install` |

## Quality evidence

- `npm ci`, `npm run lint`, `npm run test:unit`, `npm test`, `npm run build`,
  `npm audit --omit=dev`, and `git diff --check` pass from a clean checkout.
- Every literal command in `.factory/claims.json` passes independently. The
  Android commands verify the public tag’s APK digest, embedded web payload,
  provenance, and named Android 35 JUnit evidence.
- Browser checks cover all public routes, route titles/descriptions/canonicals,
  keyboard focus, 200% reflow, reduced motion, privacy request interception,
  isolated demo reset/exit, offline reload, and Axe serious/critical issues.
- The final cold live check covers `/`, `/demo`, `/?demo=1`, `/app`, `/privacy`,
  `/terms`, `/install`, and an unknown route. It also confirms the release
  record enables the matching APK only after provenance checks.
