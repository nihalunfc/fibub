---
name: Coulomb's law and superposition
num: 1399
shelf: learn
section: school-physics
title: "Coulomb's law: forces between charges, superposition and the net force on a charge"
summary: "Drag up to four point charges around a board, choose one, and see the force from each of the others as an arrow, with Coulomb's law worked out with your numbers. The arrows add head to tail into the net force, with its size, direction and x and y parts."
status: live
ads: false
order: 1399
icon: pointer
works: offline
updated: 2026-11-09
related: [field-line-plotter, gauss-law, potential-map, dipole-torque]
sources:
  - "Coulomb's law F = q₁q₂ / (4πε₀ r²) and the superposition principle: standard physics. ε₀ = 8.8541878188 × 10⁻¹² F/m, the CODATA 2022 recommended value (NIST), so k = 1/(4πε₀) = 8.98755 × 10⁹ N m²/C²."
  - "Checked against an independent NumPy script that adds the force vectors for each starting layout."
flow:
  - { icon: pointer, label: "Place" }
  - { icon: target, label: "Choose one" }
  - { icon: sigma, label: "Add forces" }
  - { icon: check, label: "Check" }
---

## What it does

Two charges push each other apart if they are alike and pull together if they are opposite. **Coulomb's law** gives the size of that force: F = k q₁ q₂ / r², where k = 1/(4πε₀) ≈ 8.99 × 10⁹ N m²/C² and r is the distance between them. Double the distance and the force falls to a quarter.

When there are more than two charges, each pair acts as if the others were not there, and the forces on one charge simply **add as vectors**. This is the superposition principle. This page lets you see it: place up to four charges on a 36 cm by 28 cm board, choose one, and the page draws the force from every other charge on it (thin grey arrows) and the net force (thick green arrow). Under the board, each force is worked out with your numbers, and the sum is split into its x and y parts.

It follows the first chapter of Class 12 Physics, electric charges and fields (Coulomb's law, forces between multiple charges, superposition). After this, see how the same forces become a field in the [[field-line-plotter]], count field lines through a closed surface with [[gauss-law]], or turn forces into hills and valleys with the [[potential-map]].

## How to use it

1. Pick a starting layout: two charges, three charges, three in a line, or four at the corners of a square.
2. **Tap** a charge to choose it; it gets a ring. **Drag** any charge to move it. Positions snap to a 1 cm grid.
3. Use the slider to set the chosen charge from −10 µC to +10 µC. Red charges are positive, blue are negative.
4. **Add a charge** (up to four) or **Remove chosen** (at least two stay).
5. Tick **Show the head-to-tail sum** to draw the single forces end to end; the net force closes the chain.

The arrows are to scale with each other: the longest arrow is always the same length, and the others are in proportion. The direction of the net force is given anticlockwise from the right, like an angle on a graph.

## Worked example

The page opens with three charges: A = +2 µC at (8, 8) cm, B = −3 µC at (28, 8) cm and C = +1 µC at (18, 22) cm. A is chosen.

- **From B:** r = 20 cm = 0.2 m, so F = 8.99 × 10⁹ × 2 × 10⁻⁶ × 3 × 10⁻⁶ / 0.2² = 1.35 N. The charges are opposite, so it is an attraction: B pulls A to the right.
- **From C:** r = √(10² + 14²) = 17.2 cm, so F = 8.99 × 10⁹ × 2 × 10⁻⁶ × 1 × 10⁻⁶ / 0.172² = 0.607 N. Both are positive, so C pushes A away, down and to the left.
- **Add:** Fx = 1.35 − 0.353 = 0.995 N and Fy = −0.494 N, so the net force is √(0.995² + 0.494²) = **1.11 N** at 334°, that is right and a little down.

## Tips

- Forces are always along the line joining the two charges; only the sign decides push or pull.
- In the line layout, a charge between two like charges feels two pushes in opposite directions. Find the spot where they cancel: that is where k q₁/r₁² = k q₂/r₂².
- Newton's third law holds: choose B instead of A and the force from A on B is the same size, opposite way.

## FAQ

**Why is k sometimes written 1/(4πε₀)?** ε₀ is the permittivity of free space. Writing the law with 4πε₀ makes later results, such as Gauss's law, come out without extra factors.

**Does air change the force?** Only very slightly; the page uses empty space. In a material with dielectric constant K the force is K times smaller.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
