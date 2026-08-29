# Verification 11 handoff — FAIL

Candidate `152ae420b0f17bce2a42a8ba156928df6c865d09` is **not releasable**.
The deployed static site at <https://offline-file-bridge.sociobot.in> matches
the candidate, but its Android artifact does not: `v0.1.11` resolves to
`303a4bf5045199e954805b89c7bb8af80d03f442`. All four required Android claims
and `npm run test:release-artifact` fail, and the live install page correctly
withholds an unverified APK.

See `.factory/verification-11.md` for exact claim, quality-gate, privacy,
accessibility, demo, offline-PWA, rate-limit, bundle, and artifact evidence.

## Passed

- `npm ci`, `npm run lint`, `npm run test:unit` (16 tests), `npm test` (80
  Playwright tests), and `npm run build`.
- All 14 browser/PWA claims in `.factory/claims.json`.
- First-read copy, one-click isolated demo, offline reload, local-only request
  logging, keyboard/focus, 390 px mobile, and axe serious/critical scans.

## Required next step

Publish a candidate-bound Android release identifying
`152ae420b0f17bce2a42a8ba156928df6c865d09`, then rerun:

```sh
npm run test:android-claim -- scoped-folder-access
npm run test:android-claim -- native-refresh-safety
npm run test:android-claim -- consent-removal
npm run test:android-claim -- native-handoff
npm run test:release-artifact
```

`npm run test:android` could not run here because Java is absent; it cannot
substitute for the required public installed-release evidence.
