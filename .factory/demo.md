# Demo sandbox

## Entry point

- Hosted: `https://offline-file-bridge.sociobot.in/demo`
- Local: run `npm run dev`, then open `http://localhost:5173/demo`
- Query alias: `/?demo=1`

The first screen already contains the **Field notes** folder mirror. It has three realistic sample files:

- `Maps/ridge-route.pdf`
- `Logs/specimen-log.csv`
- `Notes/handoff-notes.md`

Use **Refresh folder mirror** to update its successful refresh time. Use **Preview handoff-notes.md** to inspect a local sample, then use **Save sample** to exercise browser handoff. Turn off the browser network and reload `/demo` to verify the cached app shell and sample remain usable.

## Isolation and reset

Demo mode writes only the `demo:offline-file-bridge` localStorage key. It does not open or write the real `offline-file-bridge-real` IndexedDB database. Sample file bodies are bundled in the app code and revived in memory.

Use **Reset demo** in the persistent yellow banner to replace all demo state with the original sample. It immediately shows the seeded `synced 12 min ago` state and a reset notice. Use **Start for real** to delete the demo key and open `/app`. Real folder mirrors are never read while the demo banner is present.
