# Shared interactive figures (`/learn-kit/viz/`)

Figures here can be used by **any course that has the lesson kit on** (`kit: true` in its syllabus), and by the
NCERT study materials, with an `@` in front of the name:

```html
<figure class="fig" data-fig="@moi-shapes"><figcaption>What the reader should notice.</figcaption></figure>

<div class="steps" data-fig="@some-steps-fig"><div class="step">Step 1 text</div><div class="step">Step 2 text</div></div>
```

A course's own figures (`/learn-kit/<course>/figs/<name>.js`, no `@`) still work as before. Put a figure here instead
when more than one course can use it (Class 11 and 12 physics, chemistry, biology and maths, JAM, GATE, NET, CUET, the
science courses).

## Rules for a shared figure
- One file per figure: `public/learn-kit/viz/<name>.js`, `export default function (host, { data }) { ... }`, optionally
  returning `{ step(i, n) {} }` for step players. Starts with a comment saying what it shows and what to try.
- Import only `../kit.js` (canvas, axes, line, dot, text, title, arrow, row, slider, button, choice, readout, loop,
  colors, rng, clamp, lerp, ease) and helpers here whose names start with `_` (`./_3d.js`: drag-to-turn 3D view,
  wireframes of ring, disc, rod, sphere, cylinder, plate, box, cone; `rotAbout`). No outside libraries, fonts or URLs.
- Physically right: use the real equations, check numbers against a textbook case, and show the numbers in a readout.
- Phone first: works at 320 to 375 px wide with no sideways scroll; text inside the canvas uses `text()`/`title()`
  (they shrink to fit). Animations use `loop()` (runs only on screen, starts paused under reduced motion).
- Colours from `colors()` only (light, dark and red night mode follow automatically); the fibub.com watermark is
  automatic, keep its corner (top right) free.
- List it in `catalogue/<group>.md` as `` `@name` `` with one line on what it shows and the lessons that use it
  (`node tests/viz.mjs` fails otherwise).

## Catalogue
See `catalogue/*.md` (one file per subject group).
- Before committing, run `node scripts/viz-check.mjs . <names> --shots <dir>` (mounts each figure at 375 px light and 900 px dark, presses every control, fails on errors or sideways scroll) and look at the screenshots.
