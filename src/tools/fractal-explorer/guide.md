---
name: Fractal explorer
num: 547
shelf: science
code: T375
section: pure-mathematics
title: "Fractal explorer: zoom into the Mandelbrot set, Julia sets and the Barnsley fern (free, in your browser)"
summary: "Zoom deep into the Mandelbrot set and Julia sets, drawn in a background worker with smooth colours, or grow the Barnsley fern, Sierpinski triangle, carpet and Heighway dragon by the chaos game, with their fractal dimensions. Download a 2400 × 1800 PNG."
status: live
ads: true
order: 547
icon: search
works: offline
updated: 2026-11-09
related: [function-grapher, chaos-explorer, cellular-automata, turing-pattern-simulator, poincare-disk]
sources:
  - "Escape-time algorithm with smooth colouring, the cardioid and bulb test, the chaos game and Moran's equation are standard mathematics; the Barnsley fern's four maps are the well-known ones from Michael Barnsley's 1988 book Fractals Everywhere (mathematical constants)."
  - "Checked against a plain Python loop over complex numbers (escape counts and smooth values) and scipy brentq (similarity dimensions)."
flow:
  - { icon: target, label: "Pick a set" }
  - { icon: search, label: "Zoom in" }
  - { icon: sliders, label: "Colours" }
  - { icon: download, label: "PNG" }
---

## What it does

Fractals are shapes with detail at every scale. This page draws three kinds, all in your browser:

- **The Mandelbrot set.** Each pixel is a complex number c. Starting from z = 0, the tool repeats z → z² + c. If z stays within 2 of zero for every step, c belongs to the set and is drawn black. Otherwise the colour shows how fast z ran away, using a smooth escape count so the colours blend without bands.
- **Julia sets.** The same rule, but c is fixed and each pixel is the starting z. When c lies inside the Mandelbrot set the Julia set is one connected piece; when it lies outside, it breaks into dust. The page tells you which.
- **Iterated function systems:** the Barnsley fern, the Sierpinski triangle and carpet, and the Heighway dragon. These are grown by the "chaos game": start anywhere, pick one of a few shrinking maps at random, apply it, and repeat. The points settle onto the fractal.

The Mandelbrot and Julia pictures are computed in a Web Worker, a background thread, so the page stays smooth while a deep view is being drawn, band by band.

Follow the logistic map on its way to chaos in the [[chaos-explorer]], and grow patterns from simple rules in the [[cellular-automata]].

## How to use it

1. Choose **Mandelbrot**, **Julia** or **Fern and friends**.
2. **Drag** to move. **Double-tap**, pinch, scroll or press **+** and **−** to zoom (each press doubles or halves the view). **Reset view** goes back.
3. **Iterations** sets how many steps each point gets before it counts as inside. "Automatic" adds more as you zoom (200 at the start, 120 more for every doubling), because the edge of the set needs more steps to resolve.
4. **Colours** changes the palette straight away, without recomputing.
5. In Mandelbrot mode, **Julia set for the centre** opens the Julia set whose c is the point at the centre of your view. Julia sets look most interesting for c near the edge of the Mandelbrot set.
6. **Go to a point** jumps to an exact centre and width. **PNG 2400 × 1800** draws the same view at print size.

## How deep can you zoom?

The tool uses ordinary double-precision numbers, which carry about 16 significant digits. Near the set, neighbouring pixels stop being distinct numbers once the view is about 3 × 10⁻¹² wide, roughly a trillion times magnification. The tool stops there and shows a note as you get close. Going deeper needs arbitrary-precision or perturbation methods, which this page does not do.

## Worked example

The opening view is centred on −0.6 + 0i and is 3.6 wide (magnification 1 ×, 200 iterations). About 15 % of the pixels are inside the set, and adding up their area gives about 1.51, close to the best published estimate of the set's area, 1.5066. Choose Julia and the shape "Douady rabbit" (c = −0.123 + 0.745i): the page says the set is connected, because c is in the Mandelbrot set. The shape "Dust" (c = 0.285 + 0.01i) is outside, and the facts say so.

For the Sierpinski triangle, three copies at half size cover the whole, so its similarity dimension D solves 3 × (1/2)ᴰ = 1, giving D = log 3 / log 2 = 1.58496. The carpet gives log 8 / log 3 = 1.89279 and the dragon exactly 2. The box-counting estimate from the points is a rough check (within about 0.05 for the triangle and carpet; it reads low for the dragon and fern, whose points are spread unevenly). The fern's maps are not similarities, so it has no simple formula.

## Frequently asked questions

**Why is the edge blurry when I zoom a lot?** Raise Iterations. Points close to the set can take thousands of steps to escape.

**Is anything uploaded?** No. Everything runs on your device, and the page keeps working offline.

**Can I draw a function's graph instead?** Use the [graphing calculator](/science/function-grapher/).
