---
name: Gauss's law
num: 1400
shelf: learn
code: L255
section: school-physics
title: "Gauss's law: electric flux through a closed surface, and the field of a wire, a sheet and a shell"
summary: "Drag charges and a closed surface around a board and count field lines across it: only the charge inside changes the flux, Φ = q/ε₀. Then use a Gaussian surface to find the field of a long charged wire, a large flat sheet and a thin spherical shell, with your numbers and a graph of E against distance."
status: live
ads: false
order: 1400
icon: target
works: offline
updated: 2026-11-16
related: [coulomb-forces, field-line-plotter, potential-map, electrostatics-solver]
sources:
  - "Gauss's law Φ = q_enclosed / ε₀ and its standard results: E = λ/(2πε₀r) for a long wire, E = σ/(2ε₀) for a large sheet, E = 0 inside and Q/(4πε₀r²) outside a thin spherical shell. ε₀ = 8.8541878188 × 10⁻¹² F/m, the CODATA 2022 recommended value (NIST)."
  - "The line counts were checked with an independent NumPy script that walks each ray in small steps and counts every time it enters or leaves the surface."
  - "Φ = q/ε₀, E = kQ/r² outside and 0 inside a shell, E = kQr/R³ inside a uniform solid sphere, E = λ/(2πε₀r), E = σ/(2ε₀) and σ/ε₀ at a conductor: standard school physics found in any textbook (ε₀ = 8.8541878188 × 10⁻¹² F/m, CODATA 2022). The Solve my numbers card was hand-checked against worked examples."
flow:
  - { icon: pointer, label: "Drag" }
  - { icon: target, label: "Count lines" }
  - { icon: chart, label: "Find E" }
  - { icon: check, label: "Check" }
---

## What it does

**Electric flux** measures how much electric field passes through a surface. **Gauss's law** says that the total flux out of any closed surface depends only on the charge inside it: Φ = q_inside / ε₀. Charges outside make no difference, and neither does the shape or size of the surface.

The first part of this page shows why, by counting field lines. Each charge gets its own field lines, four for every microcoulomb, drawn straight out from it (positive) or into it (negative). A dashed closed surface sits on the board; each place a line crosses it is marked green (field going out) or orange (field coming in). A line from a charge inside crosses once. A line from a charge outside either misses the surface or crosses twice, once in and once out, so it adds nothing. The net count is always four times the charge inside, whatever you do to the surface.

The second part uses the law the way the textbook does: pick a surface that fits the symmetry, and the field drops out. It covers a **long straight wire**, a **large flat sheet** and a **thin spherical shell**, with the working and a graph of E against distance.

It follows the electric charges and fields chapter of Class 12 Physics (electric flux, Gauss's law and its applications). Start with forces between charges in [[coulomb-forces]], see real curved field lines in the [[field-line-plotter]], and go on to potential in the [[potential-map]].

## Solve my numbers

The card at the top handles the usual textbook problems. **Flux through a closed surface** gives Φ = q / ε₀ from the charge inside; **charge from a flux** goes the other way. **Charged sphere** gives the field inside or outside a hollow shell (or metal sphere) or a solid, evenly charged sphere, and tells you when the answer is zero. **Long charged wire** gives E = λ / (2π ε₀ r), and **large flat sheet** gives σ / 2ε₀ for a thin sheet or σ / ε₀ next to a conductor. Type the charge in C, mC, µC or nC and distances in cm or m, and read the answer in one sentence with the working below. Six worked-example buttons fill it in for you, such as 1 µC inside a surface (about 1.13 × 10⁵ N m²/C) or the field 30 cm from a 5 nC shell (about 499 N/C).

Common mistakes: counting charges outside the surface, using 1/r² for a wire (it is 1/r), and forgetting that the field inside a hollow shell is zero. A radius or distance of zero gets a friendly message, not an error.

## How to use it

1. Choose a **Circle** or **Square** surface. Drag inside it to move it, and use the size slider to grow or shrink it.
2. Drag the charges A, B and C. Tap one to choose it, then set it from −5 to +5 µC with the slider.
3. Read the charge inside, the flux Φ = q/ε₀, and the line count under the board.
4. In the second card, choose a wire, a sheet or a shell, then set the amount of charge and the distance r.

The surface's size is always a half centimetre off the grid, so a charge (which snaps to whole centimetres) is never exactly on it.

## Worked example

The page opens with A = +2 µC and B = −1 µC inside a circle of radius 7.5 cm, and C = +1 µC outside.

- Charge inside: +2 − 1 = +1 µC, so Φ = 1 × 10⁻⁶ / 8.85 × 10⁻¹² = **1.13 × 10⁵ N m²/C**.
- Lines: A sends 8 out, B pulls 4 in, and one of C's 4 lines enters and leaves. That is 9 out and 5 in, net 4: four lines for the one microcoulomb inside.

In the second card, a wire with λ = 2 µC/m at r = 20 cm gives E = λ / (2πε₀ r) = 2 × 10⁻⁶ / (2π × 8.85 × 10⁻¹² × 0.2) = **1.8 × 10⁵ N/C**. A sheet with σ = 2 µC/m² gives 1.13 × 10⁵ N/C at any distance. A 2 µC shell gives 4.49 × 10⁵ N/C at 20 cm and zero inside its 10 cm radius.

## Tips

- Flux through a surface can be zero even when field lines cross it: equal numbers going in and out.
- A charge at the centre of a cube sends q/ε₀ through the whole cube, so q/(6ε₀) through each face.
- Gauss's law is always true, but it only gives the field easily when the field has the same size all over the chosen surface.

## FAQ

**What does Gauss's law say?** The net electric flux through any closed surface equals the charge inside it divided by ε₀, so only the enclosed charge counts.

**Why are the lines straight?** Each charge's own field is straight out from it. The real field lines of several charges together curve (see the field line plotter), but adding each charge's flux separately gives the same total.

**Is a 2D picture enough?** The board is a slice through 3D space; in 3D the lines spread out over a sphere, but the counting argument is the same.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
