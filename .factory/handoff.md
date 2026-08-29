# Offline File Bridge — polish round 1 handoff

- **Result:** PASS
- **Product code deployed:** `a5f10872f8fd6a1054621ecdfb93a255c55ee634`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Deployment:** Azure Static Web Apps deployment `5731cf8c-2aed-47f2-9ee1-1c4ab437af30`, production, 29 August 2026 UTC

This round closes every finding in [review-1.md](review-1.md). Demo Reset now visibly restores the seed without a reload; one-click demo readiness and reset behavior have dedicated claims; all remaining claims have one exact tagged test; first-screen and product copy use plain, consistent “folder mirror” terms; 404/canonical handling is correct; and mobile secondary labels meet the 16px baseline. The notebook visual system remains intact.

## How to run and verify

```sh
npm ci
npm test
npm run test:unit
npm run lint
npm run build
```

The one-click demo is `/demo` or `/?demo=1`. It stores only `demo:offline-file-bridge`; use **Reset demo** to restore the visible seed, or **Start for real** to discard it and open `/app`.

From a fresh clone of `a5f1087`, all 15 commands listed in `.factory/claims.json` passed. The same clean clone then passed `npm test` **72/72**, `npm run test:unit` **7/7**, `npm run lint`, `npm run build`, and `git diff --check`. The production bundle is 38.32 KB JavaScript (13.53 KB gzip) and 14.18 KB CSS (4.38 KB gzip).

Post-deploy checks passed:

- `verify-url.sh https://offline-file-bridge.sociobot.in .factory/verification-artifacts/live-url-polish-1` — 200, no console errors, title/lang/main/H1/alt checks pass.
- Local axe suite — **16/16** desktop and Pixel 5 route checks pass, including reduced motion.
- Cold live demo reset, 404/canonical, privacy, mobile 390px reflow, and same-origin demo requests pass. Evidence is in [polish-1.md](polish-1.md).
- Lighthouse: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP **1.95 s**, CLS **0**.

## Known gaps

None for the reviewed web/PWA product. Android release packaging remains GitHub Actions work by design; a physical-device smoke and owner-key signing are still required before a Play Store release.
