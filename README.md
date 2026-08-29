# Offline File Bridge

Keep an approved folder ready offline, see when it last refreshed, and open its files in another Android app.

Offline File Bridge is for Android users who need a cloud file in another local app. It copies files from an approved folder into a folder mirror.

Live site: <https://offline-file-bridge.sociobot.in>

One-click demo: <https://offline-file-bridge.sociobot.in/?demo=1>

## What v1 includes

- Android's folder picker remembers read access only for folders you approve
- Folder mirrors stored on the device
- Visible file counts, storage sizes, and last successful refresh times
- Open a ready file in another Android app
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

Open `http://localhost:5173/` or go straight to `http://localhost:5173/?demo=1`.

## Test and build

```sh
npm test
npm run test:unit
npm run lint
npm run build
```

The production command is `npm run build`. It writes the static site to `dist/`. The root file is `dist/index.html`.

`npm test` runs browser claims on desktop and mobile Chromium. It removes only this repository's stale preview process. Playwright starts and closes its server. `npm run test:unit` checks release metadata and Android source safeguards.

Android outcome claims run against an installed release APK in the release workflow. A clean checkout checks the app checksum and published Android result. Evidence-only commits may reuse that release; any product, claim, test, README, or configuration change requires a new one. Run one with `npm run test:android-claim -- <claim-id>`.

Run one claim with:

```sh
npm test -- --grep @claim:offline-reload
```

## Android project

The Capacitor 8 project lives in `android/` with app id `in.sociobot.offline_file_bridge`.

The Android plugin opens the approved-folder picker. It copies selected files into private app storage. It opens a ready file in Android's app chooser.

## Privacy and licenses

Real browser mirrors use the `offline-file-bridge-real` IndexedDB database. Demo state uses only the `demo:offline-file-bridge` localStorage key. The app sends no file contents to a server. License verification sends a token only to the Sociobot billing API.

See [Privacy](https://offline-file-bridge.sociobot.in/privacy), [Terms](https://offline-file-bridge.sociobot.in/terms), and [demo details](.factory/demo.md).

Source code is available under the [MIT License](LICENSE). Generated visual assets and their prompts are documented in [.factory/design.md](.factory/design.md).
