# Polish round 5 handoff — Offline File Bridge v0.1.13

## What changed

This repair closes every finding in reviews 1–5 while preserving the handwritten
field-notebook visual system and Android APK delivery class.

- The one-click sample and `/?demo=1` route enter the separate demo namespace,
  show the persistent banner, and provide working Reset demo and Start for real
  controls.
- The mobile demo now places **Field notes** and the complete
  `ridge-route.pdf` name in the 390 × 844 initial viewport. Its storage summary
  and folder picker follow the working sample instead of hiding it.
- Demo controls now use a scroll offset below the sticky banner, so a repeated
  refresh cannot leave the target under the banner.
- `@claim:demo-ready-sample` asserts the first viewport; `@claim:demo-sandbox`
  enters through `/?demo=1`; and `@claim:apk-payload-match` now proves both the
  exact-record allow path and matching-tag stale-payload reject path in one
  exact command.
- The Android release version is `0.1.13` / version code `13`. The tag’s
  workflow builds the signed APK/AAB and attaches candidate-bound installed-APK
  evidence for the picker, failed refresh, removal, and chooser claims.

## Verification

Run locally:

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build
```

The clean-clone gate also runs each literal command in `.factory/claims.json`.
After the `v0.1.13` Android release is published, run:

```sh
npm run test:release-artifact
npm run test:android-claim -- scoped-folder-access
npm run test:android-claim -- native-refresh-safety
npm run test:android-claim -- consent-removal
npm run test:android-claim -- native-handoff
```

Local source evidence before publication: `npm test` passes all 78 desktop and
mobile browser checks; `npm run test:unit` passes 17 tests; lint, build, audit,
and `git diff --check` pass. The mobile demo screenshot is
`.factory/evidence/polish-5/local-demo-mobile-390.png`.

The production site is deployed from the tagged commit with
`/opt/fleet/lib/deploy-static.sh offline-file-bridge dist`. Cold live route,
demo, offline, accessibility, and release-artifact checks are recorded in
`.factory/polish-5.md`.

## Known gaps

None. The release workflow remains the authoritative Android 35 emulator
environment for installed-APK claims; no Android SDK is required in a browser
verifier.
