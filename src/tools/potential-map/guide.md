---
name: Potential map
num: 1402
shelf: learn
section: school-physics
title: "Potential map"
summary: "Drag charges around a board and see their electric potential as a coloured map with equipotential lines and as hills and wells in 3D. Probe any point for V = Σ kq/r and the field, and let a positive test charge roll downhill along the field, crossing every equipotential at right angles."
status: live
ads: false
order: 1402
icon: mountain
works: offline
updated: 2026-11-09
related: [coulomb-forces, gauss-law, electrostatics-solver, capacitor-lab]
sources:
  - "Potential of point charges V = Σ q/(4πε₀r), field E = −grad V: standard physics. ε₀ = 8.8541878188 × 10⁻¹² F/m, the CODATA 2022 recommended value (NIST)."
  - "Checked against an independent NumPy script, the field compared with a numerical gradient of the potential, and the equipotential lines checked by evaluating V at their ends."
flow:
  - { icon: pointer, label: "Place" }
  - { icon: mountain, label: "See hills" }
  - { icon: target, label: "Probe" }
  - { icon: check, label: "Check" }
---

## What it does

The **electric potential** V at a point is the work done per unit charge to bring a small positive charge there from far away. For point charges it is V = Σ kq/r, with k = 1/(4πε₀). Unlike forces, potentials are plain numbers (scalars), so the potentials of several charges simply add.

A good way to picture potential is as a landscape. A positive charge makes a **hill** and a negative charge makes a **well**. Lines joining points at the same height are **equipotentials**, like contour lines on a map. The electric field is the **downhill slope**: it points straight down the steepest way, so it is always at right angles to the equipotentials, and it is strongest where the lines crowd together.

This page shows both pictures at once. The map is shaded red where the potential is high and blue where it is low, with equipotential lines every ±50, 100, 200, 400 and 800 V (dashed for 0 V). The 3D view draws the same potential as a surface you can turn. Tap anywhere to put a probe there and read V and the field. Press **Let a + test charge roll** and a positive charge rolls downhill from the probe along the field.

It follows the electrostatic potential and capacitance chapter of Class 12 Physics (potential due to a point charge, a dipole and a system of charges, equipotential surfaces, relation between field and potential). Start with forces in [[coulomb-forces]] and flux in [[gauss-law]]; for conductors at fixed voltages see the [[electrostatics-solver]], and for stored charge the [[capacitor-lab]].

## How to use it

1. Pick a starting layout: one charge, a dipole, two like charges or three charges. Charges are in nanocoulombs (nC) on a 36 cm by 28 cm board.
2. **Drag** a charge to move it. **Tap** a charge to choose it and change it with the slider (−5 to +5 nC).
3. **Tap** an empty spot to move the probe (the small ring). Read V there, each charge's share, and the field's size and direction.
4. Press **Let a + test charge roll** to watch it run downhill (it stops at a negative charge or the edge of the board).
5. Turn the 3D view with its slider. Heights are cut off at ±1000 V so the peaks fit.

## Worked example

The page opens with a dipole: A = +2 nC at (12, 14) cm and B = −2 nC at (24, 14) cm, with the probe at (18, 20) cm.

- Each charge is √(6² + 6²) = 8.49 cm from the probe. A gives 8.99 × 10⁹ × 2 × 10⁻⁹ / 0.0849 = 212 V and B gives −212 V.
- So **V = 0**: the probe sits on the 0 V line that runs straight up the middle.
- But the field is not zero: it is **3530 V/m**, pointing to the right (0°), from the hill towards the well.

Change the layout to two like charges and the same probe reads 424 V, while the field there points straight up.

## Tips

- E = −dV/dr: in a uniform field, E = ΔV/Δd between two equipotentials.
- No work is done moving a charge along an equipotential; moving it between two of them takes W = q ΔV whatever the path.
- Around a single charge the equipotentials are circles, closer together near the charge, because V falls off as 1/r.

## FAQ

**Why are the heights cut off?** Right at a point charge V goes to infinity. The cut-off just keeps the picture on the screen; the numbers are not cut off.

**Is this the real 3D field?** The board is a flat slice through space with point charges in it, and the potential is worked out in 3D, so the numbers are real; only the slice is shown.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
