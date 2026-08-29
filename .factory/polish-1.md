# Polish round 1

Candidate product code: `a5f10872f8fd6a1054621ecdfb93a255c55ee634`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Reset now restores the seed, rerenders immediately, announces “Sample data was reset,” and returns focus to Reset demo. | `@claim:demo-reset`; [live reset screenshot](verification-artifacts/polish-1-live-demo-reset-desktop.png); cold live check at `https://offline-file-bridge.sociobot.in/?demo=1` passed. |
| F-1-2 | Added the `demo-ready-sample` claim and one-click fresh-context test for banner, Field notes, three files, readiness, and isolated storage. | `@claim:demo-ready-sample`; [live mobile demo](verification-artifacts/polish-1-live-demo-mobile-390.png). |
| F-1-3 | Qualified failed-refresh copy as Android-only, matching the transactional Android regression claim. | `@claim:native-refresh-safety`; live landing copy checked. |
| F-1-4 | Removed untestable multi-device, free-export, and refund promises from pricing and terms; retained only tested price, capacity, and checkout statements. | `@claim:free-tier`, `@claim:checkout`; live landing checked. |
| F-1-5 | Rewrote the README browser statement to the tested reload-persistence behavior. | `@claim:browser-persistence`; README reviewed in clean clone. |
| F-1-6 | Removed untestable release-publication and emulator-process promises from the README. | README reviewed in clean clone; live install route still loads with its route title. |
| F-1-7 | Added `license-verification-privacy`; its fixture test records the exact Sociobot verification request and no other foreign request. | `@claim:license-verification-privacy`; live privacy route checked. |
| F-1-8 | Deleted the information-free hero mood line. | Cold live first-screen check. |
| F-1-9 | Renamed the workflow heading to “How to keep a folder ready offline.” | Cold live first-screen check and accessibility route test. |
| F-1-10 | Deleted the notebook-lore labels “field check 04” and “advanced field kit.” | Cold live landing check. |
| F-1-11 | Standardized visible object terminology on “folder mirror,” including navigation, counts, limits, controls, and pricing. | `.factory/copy-audit.md`; live demo screenshot. |
| F-1-12 | Replaced “Open bridge” with “Open folders” and each ambiguous handoff control with its file-specific “Preview …” result. | `@claim:file-handoff`, `@claim:local-only`; live demo screenshot. |
| F-1-13 | Replaced the metaphorical 404 heading with “Page not found.” | `tests/site.spec.ts` canonical/404 test; cold `https://offline-file-bridge.sociobot.in/missing-page` check. |
| F-1-14 | Unknown routes now remove the canonical link; known routes restore the route-specific canonical and metadata. | `tests/site.spec.ts` known/unknown canonical test; cold live missing-route check. |

Additional cumulative polish: secondary mobile labels now render at least 16px. `mobile secondary labels keep the 16px reading baseline` passes on desktop Chromium and Pixel 5 emulation.

## Verification

- Fresh clean clone: all 15 exact commands in `.factory/claims.json` passed, followed by `npm test` (72/72), `npm run test:unit` (7/7), `npm run lint`, `npm run build`, and `git diff --check`.
- Live deployment: factory static deployment `5731cf8c-2aed-47f2-9ee1-1c4ab437af30` succeeded. The public host serves `index-Bt21ISq4.js` and `index-CVR1-fnr.css`.
- `/opt/fleet/lib/verify-url.sh` passed against the live URL: title, `lang`, one H1, main landmark, image alt coverage, and console errors all clean. Local axe coverage passes 16/16 routes/projects.
- Lighthouse evidence: [polish-1-lighthouse.json](verification-artifacts/polish-1-lighthouse.json) reports Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.95 s and CLS 0.
