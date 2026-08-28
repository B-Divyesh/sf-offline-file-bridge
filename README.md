# Offline File Bridge

Keep an approved folder ready offline, see when it last refreshed, and open its files in another Android app.

Offline File Bridge is for Android users of self-hosted or privacy-first storage. It handles the gap between a provider's offline cache and the local viewer or editor that needs a file.

Live site: <https://offline-file-bridge.sociobot.in>

One-click demo: <https://offline-file-bridge.sociobot.in/demo>

## What v1 includes

- An Android Storage Access Framework picker with persisted, folder-scoped read access
- Private local mirrors in app storage
- Visible file counts, storage sizes, and last successful refresh times
- Android open-with handoff through a narrow `FileProvider`
- A browser/PWA path backed by IndexedDB and the File System Access API
- A separate, resettable sample-data sandbox
- A free one-folder tier and a $14 Bridge Pro license for up to eight folders

The product does not replace a cloud provider, crawl unapproved folders, or claim a file is current after a failed refresh.

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:5173/` or go straight to `http://localhost:5173/demo`.

## Test and build

```sh
npm test
npm run test:unit
npm run lint
npm run build
```

The exact production command is `npm run build`. It writes the deployable static site to `dist/`, with `dist/index.html` at the root. `npm test` runs the browser claims on desktop and mobile Chromium. `npm run test:unit` runs the three native source regressions; together they run every command listed in `.factory/claims.json`.

Run one claim with:

```sh
npm test -- --grep @claim:offline-reload
```

## Android project

The Capacitor 8 project lives in `android/` with app id `in.sociobot.offline_file_bridge`. The custom `OfflineBridgePlugin` opens Android's folder picker, copies selected files into private app storage, and hands a chosen copy to Android's app chooser.

The worker image does not include a JDK or Android SDK. GitHub Actions builds the release artifacts with JDK 21:

```sh
npm run build
npx cap sync android
cd android
./gradlew assembleRelease bundleRelease
```

The workflow generates a temporary debug keystore, builds the APK and AAB, writes `SHA256SUMS`, and attaches all three files to release `v0.1.1`. A public store release must use the owner's upload key.

The release workflow also starts an Android 35 emulator and runs `npm run test:android-device`. Those installed-APK tests cover the scoped picker intent and manifest permissions, failed-refresh preservation, private `FileProvider` chooser handoff, and local-copy/consent removal.

## Privacy and licenses

Real browser mirrors use the `offline-file-bridge-real` IndexedDB database. Demo state uses only the `demo:offline-file-bridge` localStorage key. The app sends no file contents to a server. License verification sends the pasted token to the Sociobot billing API.

See [Privacy](https://offline-file-bridge.sociobot.in/privacy), [Terms](https://offline-file-bridge.sociobot.in/terms), and [demo details](.factory/demo.md).

Source code is available under the [MIT License](LICENSE). Generated visual assets and their prompts are documented in [.factory/design.md](.factory/design.md).
