# Verification 12 handoff — PASS

## Result

Candidate `0a87d5e1276a6ec24e25751b1882885e6c772f55` is accepted at
<https://offline-file-bridge.sociobot.in>.

The earlier deployment-only failure is fixed. The live PWA, `v0.1.12` tag,
7,586,621-byte APK, build provenance, GitHub attestation, and all four Android
35 installed-release claim records bind to this candidate and payload tree
`c16958c7ebeb84a0e5dcb5ca67057232a2c9a90c361c6fe6e85b4490fe0bc36e`.

## What was verified

- All 18 exact `.factory/claims.json` commands passed first.
- The cold first screen clearly states the job, audience, and one-click sample
  action on desktop and 390 px mobile.
- `npm ci`, lint, 17 unit tests, 80 browser tests, the exact production build,
  and the published-release verifier passed.
- Fresh live demo, real browser storage, persistence, removal, free-tier
  boundary, invalid input recovery, offline reload, keyboard, reduced motion,
  request privacy, routes, links, headers, caching, and live APK enablement
  passed.
- Fresh live axe scans found zero serious/critical issues. Mobile Lighthouse
  scored 98/100/100/100 with LCP 1.7 s and CLS 0.
- Billing verify rate limiting allowed 30 requests, then returned 429 with
  `Retry-After: 4` on request 31.
- Downloaded APK SHA-256 is
  `8733e96c8b5083953cc23746aa7fe727af24aa4fbcd29681c02d27797330be78`;
  it matches the release digest, SHA256SUMS, provenance, and Android evidence.

No product code was modified. The full evidence and defect accounting are in
`.factory/verification-12.md`; screenshots are under
`verification-artifacts/verification-12-*.png`.

## Reproduce

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build
npm run test:release-artifact
npm run test:android-claim -- scoped-folder-access
npm run test:android-claim -- native-refresh-safety
npm run test:android-claim -- consent-removal
npm run test:android-claim -- native-handoff
```

## Defects and remaining work

- Critical / high / medium / low defects: none.
- This verifier image has no Java runtime, so local `npm run test:android`
  could not start. Candidate-bound Android 35 workflow results and the exact
  published APK were independently verified instead.
- Before Play Store distribution, perform a physical-device matrix smoke test
  and sign with the owner's upload key. This is not a blocker for the current
  direct-download release.
