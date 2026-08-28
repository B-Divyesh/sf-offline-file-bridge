# Offline File Bridge — visual thesis

## Direction

**Handwritten lab notebook.** The product handles an invisible boundary: a file can exist offline yet remain trapped inside one app. The interface treats each approved folder as a careful field experiment. Ruled paper, ink annotations, punched holes, taped labels, and check marks make consent, freshness, and file state feel inspectable rather than magical.

The product is utility-first. Decoration explains the bridge between an approved source and a local app. There are no gradient blobs, stock dashboards, or generic feature-card grids.

## Palette

| Token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| `paper` | `#F4EEDC` | `#171B1E` | notebook page / night bench |
| `paper-deep` | `#E8DEC4` | `#22282C` | layered notes |
| `ink` | `#172A32` | `#F5EFDD` | primary text |
| `ink-muted` | `#52626A` | `#B8C2C3` | secondary text |
| `rule` | `#A8C5CC` | `#42545A` | graph ruling and outlines |
| `bridge-blue` | `#075C73` | `#72D4E8` | primary action and links |
| `blue-contrast` | `#FFFFFF` | `#08232A` | text on the accent |
| `marker-yellow` | `#E3B341` | `#F0C861` | pending / needs attention |
| `stamp-green` | `#1B6B52` | `#72D3A9` | ready / fresh |
| `pencil-red` | `#A33B36` | `#FF9C91` | error / stale |

All text and controls must meet WCAG AA. State always includes a word or symbol, never color alone. The direction supports light and dark themes through `prefers-color-scheme`.

## Type

- Display and annotations: `Caveat` variable Latin subset, self-hosted as a 74 KB WOFF2. It supplies the quick handwritten character without a runtime font request.
- Interface and long text: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- File sizes and timestamps: `ui-monospace, "SFMono-Regular", Consolas, monospace` with tabular figures.

The display face is reserved for short headings and annotations. Body copy stays in the system sans at 17px or larger.

## Spacing and layout

An 8px base grid: `4, 8, 16, 24, 32, 48, 64, 96`. Text measure is 66 characters. Controls are at least 44px tall. The desktop landing page resembles two facing notebook pages: copy on the left and a live bridge log on the right. On a 390px phone, the pages stack and secondary decoration disappears.

Sections alternate between full paper and inset torn notes. Thin horizontal rules extend beyond headings. Corners are slightly irregular through asymmetric radii rather than noisy random transforms. This keeps the notebook recognizable and the controls stable.

## Shape and interaction grammar

- Primary buttons are dark-ink labels with a subtle offset “pencil shadow.”
- Secondary actions look like underlined notebook annotations.
- Folder records resemble clipped field notes, with a punched status circle.
- A dotted path connects source, local mirror, and another app.
- Focus uses a 3px double-style cyan outline with 3px offset.
- Freshness is written as `Ready · synced 12 min ago`, `Needs refresh`, or `Source unavailable`.

The native bridge uses the browser File System Access API where available. The Capacitor wrapper keeps the same PWA experience and uses the system share sheet for opening or handing off exported files. The UI states that source folder access remains user-approved and browser-dependent.

## Motion

The signature motion is a single “ink trace” that moves from source to mirror after a completed refresh. State changes use 180–240ms opacity and transform transitions. Nothing loops. Under `prefers-reduced-motion: reduce`, the trace appears instantly and all movement is removed.

## Asset plan and provenance

1. `bridge-notebook.webp`: generated landing illustration. A top-down handmade notebook diagram shows a folder envelope crossing a small blue bridge into a phone tray. It contains no UI text and does not imply automatic cloud sync.
2. `og-card.webp`: a deterministic 1200×630 crop/composition derived from the same generated source.
3. App icons: hand-authored SVG mark, then rasterised locally. The mark is an open folder joined to a bridge arch. It contains no third-party artwork.

### Prompt sheet

- Use case: `stylized-concept`
- Subject: an open kraft-paper folder envelope safely crossing a short teal bridge into a dark ink-outlined phone tray
- World: top-down field notebook on warm cream graph paper, small binder holes, tape scraps, pencil construction lines, stamped green check
- Materials: fibrous paper, blue fountain-pen ink, graphite, masking tape, one red pencil accent
- Light: soft diffuse desk light, shallow paper relief, no dramatic shadows
- Lens/composition: top-down, landscape, subject weighted right with calm negative space, all important content inside a central safe area
- Palette words: warm cream, blue-black ink, muted teal, mustard marker, field-note green
- Negative list: no people, hands, logos, brands, readable text, letters, watermark, screens with UI, photorealistic devices, gradients, neon, glossy 3D, impossible folder geometry

Generated with the factory image model (`factory-image`) on 2026-08-28. The result is original to this product. The prompt and generation metadata are stored beside the source image in `assets/src/`.

The Caveat font is by Pablo Impallari and is distributed under the SIL Open Font License 1.1. The Latin subset was fetched at build time from the Google Fonts repository and is self-hosted; no runtime Google request is made.

## Why this fits

Offline storage often fails because its state is hidden. A lab notebook makes every permission, copy, and timestamp visible. The bridge drawing makes the product boundary literal without claiming that it replaces a storage provider.
