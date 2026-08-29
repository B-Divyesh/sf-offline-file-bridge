# Verification 7 handoff

- **Result:** **FAIL — P0 release blocker**
- **Candidate:** `d94a0b04cbead4df7d7f26065dc1baa0764d486d`
- **Live URL:** <https://offline-file-bridge.sociobot.in/>

The deployed PWA matches the candidate byte-for-byte, passes its web QA, and correctly refuses to expose a stale APK. However, the public Android `v0.1.3` APK embeds commit `e8debdc51c78ef81bb09a1f2c9b0c32b0eb0b951` and payload tree `812262f…`, while candidate/live is `d94a0b0…` and `2513572a…`. `npm run test:release-artifact` therefore fails at `APK web file differs from dist: 404.html`; the live download control remains disabled. The Android artifact contract is not met.

## Verification summary

```sh
npm ci                         # PASS
# every exact command in .factory/claims.json  # PASS, 17/17
npm test                       # PASS, 76/76
npm run test:unit              # PASS, 7/7
npm run lint                   # PASS
npm run build                  # PASS
npm audit --omit=dev           # PASS, 0 vulnerabilities
npm run test:release-artifact  # FAIL: public APK payload is stale
```

The PWA was freshly tested on live desktop and 390px mobile: cold first-read/demo, privacy request log, offline service-worker reload, keyboard/focus, reduced motion, axe, headers, caching, and rate limiting passed. The documented license verification endpoint allowed 30 requests then returned 429 with `Retry-After: 4`.

`npm run test:android` and `npm run test:android-device` could not execute because this verifier image has no Java/Android SDK/emulator; this is an environment limitation, not the P0 basis.

## Required next step

Publish a new APK/AAB plus matching release provenance from exactly `d94a0b04cbead4df7d7f26065dc1baa0764d486d`, then rerun `npm run test:release-artifact` and Android CI/device tests. See `.factory/verification-7.md` for the complete evidence and exact hashes.
