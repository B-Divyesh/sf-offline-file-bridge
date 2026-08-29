# Offline File Bridge

Keep an approved folder ready offline, see when it last refreshed, and open its files in another Android app.

Offline File Bridge is for Android users who need a cloud file in another local app. It copies files from an approved folder into a folder mirror.

Live site: <https://offline-file-bridge.sociobot.in>

One-click demo: <https://offline-file-bridge.sociobot.in/demo>

## What v1 includes

- An Android Storage Access Framework picker with persisted, folder-scoped read access
- Folder mirrors stored on the device
- Visible file counts, storage sizes, and last successful refresh times
- Android open-with handoff through a narrow `FileProvider`
- In supported browsers, selected folder files stay available after reload
- A separate, resettable sample-data sandbox
- A free one-folder-mirror tier and a $14 Bridge Pro license for up to eight folder mirrors

The product does not replace a cloud provider or crawl unapproved folders.

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

The exact production command is `npm run build`. It writes the deployable static site to `dist/`, with `dist/index.html` at the root. `npm test` runs the browser claims on desktop and mobile Chromium. It removes only a stale preview process from this repository before Playwright starts and closes its own server. `npm run test:unit` runs the three native source regressions; together they run every command listed in `.factory/claims.json`.

Run one claim with:

```sh
npm test -- --grep @claim:offline-reload
```

## Android project

The Capacitor 8 project lives in `android/` with app id `in.sociobot.offline_file_bridge`.

The custom `OfflineBridgePlugin` opens Android's folder picker. It copies selected files into private app storage. It hands a chosen copy to Android's app chooser.

GitHub Actions builds Android release artifacts with JDK 21:

```sh
npm run build
npx cap sync android
cd android
./gradlew assembleRelease bundleRelease
```

For a public store release, use the owner's upload key.

## Privacy and licenses

Real browser mirrors use the `offline-file-bridge-real` IndexedDB database. Demo state uses only the `demo:offline-file-bridge` localStorage key. The app sends no file contents to a server. License verification sends a token only to the Sociobot billing API.

See [Privacy](https://offline-file-bridge.sociobot.in/privacy), [Terms](https://offline-file-bridge.sociobot.in/terms), and [demo details](.factory/demo.md).

Source code is available under the [MIT License](LICENSE). Generated visual assets and their prompts are documented in [.factory/design.md](.factory/design.md).
