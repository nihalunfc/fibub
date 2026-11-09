---
name: Electric field line plotter
num: 909
shelf: science
section: electromagnetism
title: "Electric field line and equipotential plotter: drag point charges, line charges and dipoles"
summary: "Place point charges, line charges and dipoles, drag them around, and watch the field lines and equipotentials redraw. Tap anywhere to read the field strength, direction and potential there, and see the force on every charge."
status: live
ads: true
order: 1
icon: pointer
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, plot-maker]
sources:
  - "Coulomb's law, superposition, the fields of an infinite line charge and of a point dipole, and Gauss's law: standard results, for example Griffiths, D. J., Introduction to Electrodynamics, chapters 2 and 3."
  - "ε₀ = 8.8541878188 × 10⁻¹² F/m (CODATA 2022 recommended value)."
  - "Checked against an independent NumPy and SciPy script written for the tests (potential summed directly, field from its numerical gradient), Gauss's law and the textbook dipole limits. No data tables are used; the example arrangements are made up."
flow:
  - { icon: pointer, label: "Place" }
  - { icon: curve, label: "Field lines" }
  - { icon: target, label: "Probe" }
  - { icon: download, label: "Save" }
---

## What it does

Electric field lines show which way a small positive test charge would be pushed at every point; equipotentials join points at the same voltage and always cross the field lines at right angles. This plotter draws both for any arrangement of up to 12 sources and redraws them as you drag the charges around, so you can see how the field of a dipole differs from that of two like charges, why the field between two opposite line charges is strong and nearly straight, or how a far-away neutral arrangement fades much faster than a single charge.

Three kinds of source are offered:

- **Point charges** (in nanocoulombs), the usual Coulomb field E = kq/r².
- **Line charges** (in nanocoulombs per metre): long straight wires running through the screen at right angles. Their field falls off as 1/r, and their potential has no zero at infinity, so the page takes it as zero 1 m from each line.
- **Point dipoles** (in nC·cm, so 1 nC·cm is +1 nC and −1 nC 1 cm apart) with an angle you choose, drawn as an arrow from − to +.

## How to use it

1. Pick a starting arrangement, or use the buttons to add charges. Each source has a row where you can type its amount and position (in cm from the centre) and remove it.
2. **Drag** a charge on the picture to move it (positions snap to 0.1 cm). **Tap** an empty spot to move the probe (the small circle with an orange arrow showing the direction of E).
3. Set the **view half-width** to zoom, and the number of **lines from the largest charge**. Every other charge of the same kind gets lines in proportion to its size, so a +2 nC charge has twice as many lines as a +1 nC charge.
4. Turn the field lines or equipotentials off if you only want one. The levels used for the equipotentials are listed under the picture.
5. Read the field and potential at the probe, and the force on every charge from all the others. Download a report (image, PDF or Word) or a CSV grid of V, Eₓ and Eᵧ across the view.

## Worked example

The first arrangement is a made-up dipole: +1 nC at (−3, 0) cm and −1 nC at (3, 0) cm, with the probe at (0, 3) cm, on the line halfway between them. Each charge is 4.243 cm from the probe, so each alone gives 4.99 kV/m. The vertical parts cancel and the horizontal parts add, so the page shows **E = 7.06 kV/m at 0°, V = 0 V**: the whole perpendicular bisector of a dipole is at zero potential, yet the field there is not zero. A +1 nC test charge there would feel 7.06 µN. Each charge pulls the other with **2.5 µN** (k × 1 nC × 1 nC / (6 cm)²), shown in the forces table.

## Tips

- Lines start on positive charges and end on negative ones. With unequal charges, the extra lines head off to the edge of the view, as they should.
- A point dipole's lines start and end on the dipole itself.
- Drawn in a flat picture, the spacing of field lines from point charges shows the strength only roughly; for line charges it is exact.

## FAQ

**Why is the potential zero between two opposite charges if the field is strong there?** The field is the slope of the potential, not its value. Halfway between +q and −q the two potentials cancel, but the potential is falling steeply from + to −.

**Can I model a capacitor?** Two rows of opposite line charges give the idea. For real electrode shapes, use the 2D electrostatics solver, which solves Laplace's equation for electrodes you draw.

**Is anything uploaded?** No. Every field line is worked out in your browser.
