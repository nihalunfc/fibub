---
name: Coulomb forces
num: 1399
shelf: learn
code: L254
section: school-physics
title: "Coulomb forces"
summary: "Drag up to four point charges around a board, choose one, and see the force from each of the others as an arrow, with Coulomb's law worked out with your numbers. The arrows add head to tail into the net force, with its size, direction and x and y parts."
status: live
ads: false
order: 1399
icon: pointer
works: offline
updated: 2026-11-16
related: [field-line-plotter, gauss-law, potential-map, dipole-torque]
sources:
  - "Coulomb's law F = q₁q₂ / (4πε₀ r²) and the superposition principle: standard physics. ε₀ = 8.8541878188 × 10⁻¹² F/m, the CODATA 2022 recommended value (NIST), so k = 1/(4πε₀) = 8.98755 × 10⁹ N m²/C²."
  - "Checked against an independent NumPy script that adds the force vectors for each starting layout."
  - "Relative permittivity: 1 for vacuum and (to a good approximation) air, about 80 for water at room temperature: standard textbook values; check your book for the exact figure it uses. Checked by hand: 2 µC and 3 µC, 30 cm apart, give 0.599 N; two 5 nC charges 2 cm apart give 5.62 × 10⁻⁴ N."
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

## Solve your own numbers

The first card solves Coulomb's law for the numbers in your problem. Choose what to find: the force, one of the charges, or the distance. Type the charges (in µC, nC, mC, pC, C or as a number of electron charges), the distance (cm, m, mm or Å) and, when finding a charge or distance, the size of the force in N, mN, µN or kN. Put a minus sign on a negative charge and the answer says whether the force is attractive or repulsive. When you find a charge, you tell the page whether the force is attractive or repulsive, and it gives the charge its sign.

The working is laid out like an exam answer: the formula, the unit conversions, the numbers substituted with k = 8.99 × 10⁹ N m²/C², and the result with three significant figures. You can also choose the medium between the charges: air or vacuum, water (relative permittivity about 80, so the force is 80 times smaller) or your own value. Examples include two point charges, the electron and proton in a hydrogen atom, and finding a distance or an unknown charge.

Common mistakes are listed under the answer: leaving µC and cm unconverted, forgetting to square the distance, and putting the signs into the size of the force. A distance of zero, a zero charge or a zero force gets a clear message, never an infinity.

## FAQ

**Why is k sometimes written 1/(4πε₀)?** ε₀ is the permittivity of free space. Writing the law with 4πε₀ makes later results, such as Gauss's law, come out without extra factors.

**Does air change the force?** Only very slightly, so the board uses empty space. In a material with relative permittivity εr the force is εr times smaller, and the calculator at the top lets you pick water or type your own value.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.

**How do I calculate the force between two charges?** Use F = k q₁ q₂ / r² with the charges in coulombs and the distance in metres; type the numbers into the calculator at the top and it gives the force, the working and whether it attracts or repels.

**What happens if I put the charges in water?** The force drops by the relative permittivity (about 80 for water), which you can choose in the calculator.
