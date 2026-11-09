---
name: 2D electrostatics solver
num: 915
shelf: science
section: electromagnetism
title: "2D electrostatics solver: draw electrodes, solve Laplace's equation, see potential, field and capacitance"
summary: "Type or draw electrodes at any voltages inside a box, and the page solves Laplace's equation on a grid by over-relaxation. See the potential map, equipotentials and field arrows, probe any point, and get the charge on each electrode and the capacitance per metre."
status: live
ads: true
order: 7
icon: pencil
works: offline
updated: 2026-11-09
related: [field-line-plotter, capacitor-inductor-calculator, plot-maker]
sources:
  - "Laplace's equation solved by finite differences with successive over-relaxation (optimal factor 2/(1 + sin(π/(n − 1)))): standard numerical method, for example Press et al., Numerical Recipes, section 19.5, and Sadiku, M. N. O., Numerical Techniques in Electromagnetics."
  - "Charge from the discrete form of Gauss's law and capacitance from the field energy 2W/V²; coaxial capacitance 2πε₀/ln(b/a) for comparison: standard results."
  - "ε₀ = 8.8541878188 × 10⁻¹² F/m (CODATA 2022)."
  - "Checked against a direct sparse solution of the same grid (SciPy spsolve), the same discrete Gauss sum, and the exact coaxial capacitance, written for the tests. The example electrodes are made up."
flow:
  - { icon: pencil, label: "Electrodes" }
  - { icon: calculator, label: "Solve" }
  - { icon: chart, label: "Field map" }
  - { icon: target, label: "Probe" }
---

## What it does

Between conductors held at fixed voltages, the potential in empty space obeys **Laplace's equation**: every point sits at the average of its surroundings. For a few simple shapes there are formulas, but for real layouts (a wire near a corner, plates with edges, several electrodes) the answer has to be found numerically. This solver does that on a square grid in your browser:

1. Electrodes are held at their voltages; the outer edge is either a **grounded metal box** or **open** (no field crosses it).
2. Every other grid point is repeatedly replaced by the average of its four neighbours, over-relaxed so that it converges in a few hundred sweeps.
3. From the potential it draws a colour map, equipotential lines and field arrows, and works out the field at any point, the charge on each electrode (from Gauss's law on the grid), the field energy, and, when there are just two voltages, the **capacitance per metre**.

The problem is two-dimensional: every shape runs on unchanged into and out of the screen, like a long cable or a pair of long plates.

## How to use it

1. Pick a starting example, or type shapes, one per line, in cm from the centre: `circle x y r V`, `ring x y r V` (a thin round shell), `rect x1 y1 x2 y2 V` or `line x1 y1 x2 y2 V`.
2. Or choose **Draw**, set the brush voltage and radius, and paint electrodes on the picture with your finger or mouse. **Erase** removes electrode under the brush (typed shapes too). **Clear drawing** removes what you painted.
3. Choose the box size, the grid (finer is more accurate but slower) and what the box edges do.
4. Switch back to **Probe** and tap anywhere to read the potential and field there.
5. Download the potential grid as CSV, or the report as an image, PDF or Word file.

## Worked example

The first example is a made-up coaxial cable: a 1 cm radius wire at 100 V inside a 4 cm radius shell at 0 V, on the 121 × 121 grid. The exact capacitance is 2πε₀/ln(4) = 40.13 pF per metre; the page shows **C = 39.19 pF per metre**, 2.3 % low, because the round shapes become staircases of grid points (the wire is 0.833 mm grid steps across). The charge is ±3.919 nC per metre and the field energy 194.3 nJ per metre. The probe, 2.5 cm from the centre, reads **32.58 V and 2.82 kV/m**, against the exact 33.9 V and 2.89 kV/m. Choose the 161 grid and the capacitance rises to 39.54 pF per metre, closer to the exact value.

## Tips

- Sharp corners and thin edges concentrate the field: the "strongest field" fact shows where breakdown would start.
- With open edges, keep the electrodes well inside the box; the field that would spread to infinity is cut off at the edge.
- A grounded box around everything is how real shielded cables and enclosures behave, and it makes the result exact for that geometry.

## FAQ

**Can it include a dielectric?** Not region by region. If the whole space is filled with one material, multiply the capacitance and charges by its εr.

**Why is there a charge on the box?** In a grounded box, every field line that leaves an electrode ends somewhere; lines that do not end on another electrode end on the box, which then carries the balancing charge.

**Is anything uploaded?** No. The solver runs in your browser.
