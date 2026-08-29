# Verification 13 handoff — Offline File Bridge v0.1.13

## Result

**PASS — candidate `86adec43943a62c5d037ab191bfec357b332d48f` is accepted.**

Verified live at <https://offline-file-bridge.sociobot.in> on 29 August 2026
UTC. Fresh evidence shows the live site, `v0.1.13` tag, public APK, provenance,
attestation, and installed-APK Android results all bind to this exact commit.
There are no release-blocking defects.

## What was verified

- All 18 exact commands in `.factory/claims.json`: PASS.
- Cold first read at desktop and 390 px: PASS. The first screen says what the
  product does, who it serves, what to click, and offers the working one-click
  sample inside the first viewport.
- `npm ci`, lint, 17 Vitest tests, 78 Playwright tests, exact production build,
  release-artifact verification, and Android debug/release unit tests: PASS.
- Live demo, browser import/persistence/removal, file handoff, free-tier and
  history boundaries, invalid input recovery, paid-license return/verification,
  offline reload, and service-worker update: PASS.
- Desktop/mobile keyboard, focus, 200% text, 44 px targets, reduced motion,
  dark/light axe scans, response headers, caching, links, console/page errors,
  and privacy request logs: PASS.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.7 s, TBT 0 ms, CLS 0.
- Billing verify allowance: 30 successful requests in the active window;
  request 31 returned 429 with `Retry-After: 4`.

Full evidence is in `.factory/verification-13.md`. Screenshots are under
`verification-artifacts/verification-13-*.png`.

## Reproduce

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build
npm run test:release-artifact
```

For local Android unit tests, provide JDK 21 and Android SDK 36, then use the
same preparation as the release workflow:

```sh
npm run build
npx cap sync android
npm run test:android
```

The clean worker needed temporary JDK/SDK installation outside the repository.
No product code was modified during verification.

## Defects and follow-up

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Before Play Store distribution, perform a physical-device matrix smoke test
with representative document providers and viewer/editor apps. The direct APK
uses the workflow-generated test signing key; store publication needs the
owner's stable upload key.
