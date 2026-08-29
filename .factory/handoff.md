# Offline File Bridge — polish round 1 handoff

- **Result:** PASS
- **Reviewed candidate:** `5888fa3ee5647c18f6c4716a3dfa4507bb70128a`
- **Pushed repair:** `02f2a795d77c1404ed3783bc994fb7b585c8fae4`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Deployment:** Azure Static Web Apps production deployment `e2470841-1f66-4333-b929-b9ae35a5806d`, 29 August 2026 UTC

All 14 findings from `review-1.md` are closed and mapped to evidence in [polish-1.md](polish-1.md). The published PWA keeps the established notebook identity and matching APK release payload. This retry adds a scoped preview-server preflight so Playwright owns and closes its test server: it removes only an old port-4173 Vite preview from this repository, never another project’s process.

## How to run and verify

```sh
npm ci
npm test
npm run test:unit
npm run lint
npm run build
```

The one-click demo is `/demo` or `/?demo=1`. It uses only `demo:offline-file-bridge`; **Reset demo** visibly restores the seeded state and **Start for real** discards the demo namespace.

From a fresh clone at the repair commit, all 15 exact commands listed in `.factory/claims.json` passed independently. The aggregate suite then passed: `npm test` **72/72**, `npm run test:unit` **7/7**, `npm run lint`, `npm run build`, `npm audit --omit=dev`, and `git diff --check`. Browser coverage includes desktop/Pixel 5, offline reload, local-only request interception, demo reset/isolation, focus and route announcements, 44 px controls, 200% reflow, metadata/404/canonical handling, and Axe on every route. The production output is 38.32 KB JavaScript (13.53 KB gzip) and 14.18 KB CSS (4.38 KB gzip).

Post-deploy cold checks passed:

- `verify-url.sh https://offline-file-bridge.sociobot.in .factory/verification-artifacts/polish-1-retry/live-url` — 200, no console errors, title/lang/main/H1/alt checks pass.
- Direct live mobile check — demo refresh/reset, isolated storage, three sample files, no horizontal overflow, and zero serious/critical Axe findings on `/demo` and `/missing-page` pass. Screenshots are in [verification-artifacts/polish-1-retry](verification-artifacts/polish-1-retry/).
- Live routes `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install` return 200; `/missing-page` returns 404 with no canonical URL. Security headers are present.

## Known gaps

No web/PWA review finding remains. This worker has no Java or Android SDK, so it could not rerun Gradle or device instrumentation locally. Android release build and installed-APK coverage remain in the repository’s GitHub Actions workflow; physical-device testing with the owner’s upload key remains a store-release step, not an unresolved product defect.
