# Adversarial review 5 handoff — FAIL

## Work completed

Created `.factory/review-5.md` for repository candidate `eada27e9a014159013c4e8161fa3e8f1ee29b882`. No product code was changed.

The review covered cold 390 px and desktop first reads, full landing/README copy, all 18 declared claim commands from a clean clone, live demo isolation and offline behavior, prior finding history, routes, metadata, links, focus/history behavior, accessibility, security headers, and visual identity.

## Verification

- 14 of 18 exact claim commands exit successfully, but `apk-payload-match` omits its required stale-payload case.
- Four Android commands fail because `v0.1.12` is bound to product commit `0a87d5e…`, not reviewed HEAD `eada27e…`.
- `npm run lint`, `npm run test:unit`, `npm test`, and `npm run build` pass from the clean clone; `dist/` is produced.
- `npm run test:release-artifact` fails on the same candidate/tag mismatch.
- Live `verify-url.sh` passes. Axe reports zero violations across seven routes, light and dark.
- Demo reset, real-data isolation, exit cleanup, preview, download, and offline reload pass with no foreign demo requests or console errors.

## Blocking findings

- F-5-1 through F-5-4: the four installed-Android claim commands reject the reviewed candidate.
- F-5-5: at 390 × 844, **Field notes** and every sample filename are below the initial demo viewport.
- F-5-6: the exact APK claim command runs only the positive case; its stale-payload case is untagged.

## Next steps

Publish exact-candidate Android evidence and make all four commands pass. Move the stale-payload rejection into the tagged APK test. Compact or reorder the mobile demo so realistic sample data is visible before scrolling, then add a 390 × 844 viewport assertion and rerun the complete review.
