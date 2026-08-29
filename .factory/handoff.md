# Release 8 repair handoff

- **Base verification report:** `fc7e2e7fd4f0f76bc07bcf2be7f299952a7f740d`
- **Repaired release:** `v0.1.4` / Android version code `4`
- **Artifact class:** Android APK with PWA landing and isolated demo
- **Live URL:** <https://offline-file-bridge.sociobot.in/>

## Repair

Verification 7 found that the deployed PWA identified a newer candidate than
the public `v0.1.3` APK. The landing page correctly disabled the stale APK,
but Android delivery was unavailable.

This repair increments both web and Android versions to `0.1.4`/`4`. The
Android release workflow now resolves the release tag to its commit before
building. That resolved commit is used for the PWA build identity, the APK
payload comparison, and the published provenance. The workflow fails before
publication if the tag does not resolve to the candidate it is building.

The regression in `unit/release-contract.test.ts` recreates a release tag that
resolves to an older commit and asserts that it is rejected. The browser
release-identity claim tests now derive their versioned APK names from the
current build identity, so the check remains active for each release.

## Exact local verification

Run from this checkout after a clean dependency install:

```sh
npm ci                         # PASS — 148 packages installed; 0 audit vulnerabilities
npm run test:unit              # PASS — 8/8 Vitest checks
npm run lint                   # PASS — TypeScript no-emit
npm run build                  # PASS — dist/ written
npm test                       # PASS — 76/76 Playwright checks, desktop and Pixel 5 (390 px)
npm audit --omit=dev           # PASS — 0 vulnerabilities
```

The production bundle is 39.28 KB JavaScript (13.82 KB gzip) and 14.43 KB CSS
(4.45 KB gzip). The browser suite includes the one-click demo, storage
isolation/reset, service-worker offline reload, refresh/update behavior,
privacy request checks, desktop and 390 px reflow, keyboard/focus, both color
schemes, reduced motion, and Axe serious/critical checks across every route.
It also exercises the matching and stale-APK release states.

The tag-triggered GitHub Actions job runs the Android JVM tests and installed
release-APK emulator tests, then creates the APK, AAB, checksums, and
`BUILD-PROVENANCE.json`. After publication, run:

```sh
npm run test:release-artifact
```

It downloads the public `v0.1.4` APK and verifies every embedded web payload
file byte-for-byte against `dist/`, plus the release provenance and the exact
candidate commit/payload fingerprint. This is the final public-artifact check
for the verifier-7 blocker.

## Known gaps

None in the product scope. Android packaging and emulator verification run in
the tag-triggered GitHub Actions environment, as required for this artifact
class; no APK is built inside the worker.
