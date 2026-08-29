# Review 6 handoff — Offline File Bridge

## Result

**FAIL — four mandatory Android claims reject candidate
`bc537802f61ba014c4cc6b1e6b00292fe4b13dc1`.**

The full adversarial report is in `.factory/review-6.md`. No product code was
modified. Three live evidence screenshots were added under
`.factory/verification-artifacts/review-6-*.png`.

## What was done

- Opened the live product cold in fresh 390 × 844 and 1440 × 900 contexts.
- Audited every landing/README sentence, heading, control, and product claim.
- Exercised the one-click demo, Reset, Start for real, offline reload, storage
  isolation, and request log.
- Ran every literal command in `.factory/claims.json` from a no-hard-link fresh
  clone.
- Rechecked every finding from reviews 1–5 and polish rounds 1–5 in live UI and
  current code.
- Crawled all routes and links; checked metadata, 404 behavior, navigation/Back
  focus, headers, and live Axe results in light and dark modes.

## Verification

- Claims: **14/18 pass**. `scoped-folder-access`, `native-refresh-safety`,
  `consent-removal`, and `native-handoff` fail because `v0.1.13` resolves to
  `86adec43943a62c5d037ab191bfec357b332d48f`, not the reviewed candidate.
- `npm run test:release-artifact`: fails on the same commit mismatch.
- `npm run lint`: pass.
- `npm run test:unit`: **17/17 pass**.
- `npm test`: **78/78 pass**.
- `npm run build`: pass; `dist/` produced.
- Live Axe: zero violations across `/`, `/demo`, `/app`, `/privacy`, `/terms`,
  `/install`, and the designed 404 in both light and dark modes.

## Known gap and next step

Publish candidate-bound APK provenance and named Android 35 evidence for the
reviewed commit, then rerun all 18 exact claim commands. The browser product,
copy, demo, privacy behavior, route structure, accessibility, and visual
identity have no additional finding in this round.
