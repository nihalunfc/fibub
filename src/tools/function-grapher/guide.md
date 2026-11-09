---
name: Graphing calculator
num: 541
shelf: science
section: pure-mathematics
title: "Graphing calculator: plot functions, equations, polar and parametric curves and 3D surfaces (free)"
summary: "Plot y = f(x), any equation in x and y, polar r(θ) and parametric (x(t), y(t)) curves together, with sliders, zoom, tap-to-trace, roots, turning points and crossings, plus 3D surfaces z = f(x, y). Download PNG, SVG or CSV. Runs in your browser."
status: live
ads: true
order: 541
icon: curve
works: offline
updated: 2026-11-09
related: [plot-maker, calibration-curve]
sources:
  - "Standard numerical methods (bisection, golden-section search, marching squares, orthographic projection); no outside data."
  - "Checked against Python numpy and scipy: polynomial roots and crossings (numpy.roots), curve lengths (scipy quad and ellipe), crossings (brentq) and maxima (minimize_scalar)."
flow:
  - { icon: pencil, label: "Type curves" }
  - { icon: curve, label: "Graph" }
  - { icon: target, label: "Trace" }
  - { icon: download, label: "PNG/SVG/CSV" }
---

## What it does

This is a graphing calculator that runs in your browser. Type one or more curves and they are drawn together, each in its own colour-blind safe colour. It understands four kinds of curve, worked out from the way you type them:

- **y = f(x)**, a function of x, such as `y = x^3 - 2x - 1` or `y = e^x`.
- **An equation in x and y**, such as `x^2 + y^2 = 16` or `x^3 + y^3 = 6x y`. These implicit curves are traced with the marching squares method on a fine grid, and each point is placed accurately by bisection.
- **Polar curves r = f(θ)**, such as `r = 4cos(3θ)`. Type `theta` if your keyboard has no θ.
- **Parametric curves (x(t), y(t))**, such as `(4sin(3t), 3sin(2t))`.

Any other single letter, such as `a`, `b` or `k`, becomes a **slider**, so you can watch the graph change. `e` is Euler's number and `pi` is π. Functions include sin, cos, tan, their inverses (asin, acos, atan), sinh, cosh, tanh, exp, ln, log (base 10), sqrt, abs, cbrt, min, max and atan2. Angles are in radians.

The **3D surface** tab draws z = f(x, y) as a shaded wireframe that you can turn and tilt by dragging.

## How to use it

1. Type a curve in the first box. Press **Add a curve** for more (up to 8). The line under each box says what kind of curve it read, or what is wrong.
2. **Drag** the graph to move around. **Pinch**, scroll the mouse wheel or press **+** and **−** to zoom. **Reset view** goes back to the start.
3. **Tap or click a curve** to trace it: the point and its coordinates appear. For y = f(x) curves the value is worked out exactly at that x.
4. **Key points in the window** lists, for every y = f(x) curve, its roots, local maxima and minima and where it crosses the y axis, and where it crosses the other curves. Type a number in **Value at x** to read every curve there.
5. Download the graph as **PNG** (twice the screen size), **SVG** (vector, for Inkscape, Illustrator or a report) or **CSV** (every plotted point).

## Settings

- **Equal scale** keeps one unit the same length on both axes, so circles look round. It turns off if you type a window that stretches one axis.
- **Window** sets the exact x and y range.
- **Ranges for t and θ** set how far parametric and polar curves run. The default is 0 to 2π.
- In 3D, **Grid** sets how many lines the surface has, and **Colour by height** shades it from light (low) to dark (high).

## Worked example

The example draws the cubic y = x³ − 2x − 1 and the circle x² + y² = 16 for x from −6 to 6. Key points lists the roots −1, −0.618034 and 1.61803 (the last two are (1 ± √5)/2), a local maximum at (−0.816497, 0.0886621), a local minimum at (0.816497, −2.08866), the y-intercept (0, −1), and the two places the cubic meets the circle: (−1.84025, −3.55155) and (2.0428, 3.43904). Typing 2 in Value at x gives y = 3 on the cubic and y = −3.4641, 3.4641 (±√12) on the circle.

## How exact is it?

Roots and crossings are found by bisection to full double precision, so they are correct to about 15 digits; the page shows 6. Turning points use golden-section search and are good to about 8 digits in x. The checks behind this page compare it with Python's numpy and scipy.

## What it does not do

It does not do algebra (no symbolic derivatives or simplification), inequalities or shading, or regression on your data (use the [calibration curve](/science/calibration-curve/) tool for fits, or the [plot maker](/science/plot-maker/) for data). Key points are found only for y = f(x) curves and only inside the window: zoom out to find more. An equation that touches zero without changing sign, such as (x² + y² − 4)² = 0, is not drawn; write x² + y² = 4 instead.

## Frequently asked questions

**Why is there a gap in tan x?** The graph breaks where the curve jumps to infinity (an asymptote) or where it is not defined, instead of joining the two sides with a false vertical line.

**Is anything sent anywhere?** No. Every calculation runs in your browser, and the page works offline once it has loaded.

**Can I use degrees?** Angles are radians. To use degrees, multiply by pi/180, as in sin(x*pi/180).
