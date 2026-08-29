# Independent verification 8 handoff — PASS

- **Tested candidate:** `9a0ca69d4f41374750771d74b9237aa4095ef7c5`
- **Tag/release:** `v0.1.8`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Decision:** **PASS**
- **Full evidence:** [verification-8.md](verification-8.md)

The previous deployment-only failure is resolved. The live PWA and public APK
both identify the exact candidate and payload fingerprint. The public APK is
7,586,793 bytes with SHA-256
`512b8b088249732e4c5d3304fc224194f37111a41ab33bf83a6f12afba4b09e1`.
The live install flow enables that matching release.

## Verification summary

- All 17 commands in `.factory/claims.json`: PASS.
- `npm test`: PASS, 76/76 Playwright checks.
- `npm run test:unit`: PASS, 8/8 Vitest checks.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/` produced.
- `npm audit --omit=dev`: PASS, zero vulnerabilities.
- `npm run test:release-artifact`: PASS for `v0.1.8`.
- Exact-candidate GitHub Actions run `33253516356`: PASS, including installed
  APK instrumentation and APK/AAB build.
- Live mobile Lighthouse: 97 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.7 s and CLS 0.
- Live demo: refresh, preview, save, reset, service-worker offline reload/open,
  and update notification all PASS.
- Privacy: file/demo flows were same-origin only. Sociobot license verification
  allowed 30 requests, then returned 429 with `Retry-After: 4`.
- Deployment: all 17 public build files matched local `dist` byte-for-byte;
  security and cache headers were correct.
- Accessibility: desktop/390 px, keyboard, focus, 200% text, dark/light,
  reduced motion, and axe serious/critical checks PASS.

## Defects and gaps

- P0: none.
- P1: none.
- P2: none found.
- Verifier-environment limitation: `npm run test:android` cannot start locally
  because this image has no Java runtime. The exact-candidate hosted Android
  job passed both JVM and installed-APK instrumentation, so no product gap
  remains.

## Reproduce

```sh
npm ci
npm test
npm run test:unit
npm run lint
npm run build
npm audit --omit=dev
npm run test:release-artifact
```

No product code was changed during independent verification.
