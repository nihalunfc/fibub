---
name: Miller index calculator
num: 844
shelf: science
section: crystallography
title: "Miller index calculator: d-spacing in any crystal system, angle between planes, zone axis and hkil conversion"
summary: "Work out the spacing of any (hkl) plane in cubic, tetragonal, orthorhombic, hexagonal, trigonal, monoclinic or triclinic cells, the angle between two planes, their zone axis and the 2θ of each, convert to and from four-index Miller-Bravais notation, list reflections, and see the planes drawn in the unit cell."
status: live
ads: true
order: 844
icon: ruler
works: offline
updated: 2026-11-09
related: [xrd-peak-calculator, point-group-finder, crystal-field-calculator]
sources:
  - "The metric tensor formulas for d-spacings and angles, the zone law and the Miller-Bravais rules are standard crystallography; the code is written by fibub and checked in the tests against NumPy, which builds the reciprocal cell a different way (a* = b × c / V)."
  - "The example cells are round made-up numbers; type your own."
flow:
  - { icon: sliders, label: "Cell" }
  - { icon: pencil, label: "hkl" }
  - { icon: ruler, label: "d and angle" }
  - { icon: eye, label: "Picture" }
---

## What it does

Miller indices (hkl) name a family of parallel planes in a crystal by where one of them cuts the cell edges: at a/h, b/k and c/l. This page turns indices into numbers you can use, for any of the seven crystal systems:

- **d-spacing.** The distance between neighbouring (hkl) planes, from the reciprocal metric tensor: 1/d² = h G* hᵀ. In a cubic cell this is the familiar d = a/√(h² + k² + l²); in a triclinic cell it is the full six-parameter formula. The 2θ of each spacing is shown for an X-ray wavelength you choose.
- **Angle between two planes.** The angle between their normals, again from the metric tensor, so it is right in non-cubic cells too.
- **Zone axis.** The direction [uvw] that both planes contain, the cross product of their indices. It is what you look down in a microscope to see both sets of planes edge-on.
- **A direction.** Give [uvw] to get its length, its angle to plane 1's normal and to the zone axis, and whether it lies in plane 1 (the zone law hu + kv + lw = 0).
- **Miller-Bravais.** Hexagonal crystals are often written with four indices: planes (hkil) with i = −(h + k), and directions [uvtw]. Type either form in the boxes, or use the converter.
- **The picture.** The unit cell drawn to scale with every plane of family 1 that crosses it, the first plane of family 2 and the zone axis. Turn it with the sliders or by dragging, and download it as SVG.
- **Reflection list.** Every plane up to a chosen index, grouped by spacing, with d and 2θ, as a table or CSV.

## How to use it

1. **Cell.** Pick the crystal system and type the lattice parameters it needs. Only the free ones are shown: a for cubic, a and c for tetragonal and hexagonal, and so on.
2. **Indices.** Type plane 1 and plane 2, and a direction if you want one. "1 −1 0", "1,-1,0" and "1-10" all work.
3. **Read** the spacings, angle and zone axis, and look at the planes in the picture.
4. **Download** the picture as SVG, the reflection list as CSV, or a PNG, PDF or Word report.

## Worked example

The page opens on a cubic cell with a = 4.05 Å, plane 1 = (111) and plane 2 = (100). It shows **d(111) = 2.3383 Å** (2θ = 38.469° with Cu Kα1, 1.5406 Å) and d(100) = 4.0500 Å. The angle between the planes is **54.74°**, the angle between a cube face and a body diagonal, and the zone axis is [01−1]. The picture shows two (111) triangles cutting the cube, with the one nearest the origin darker.

Switch to *Hexagonal*, type a = 3.21 Å and c = 5.21 Å, and plane 1 = 1 0 −1 1: the page reads it as (101) and gives d = 2.4526 Å. Type direction 2 −1 −1 0 to get [100], a lattice vector 3.2100 Å long.

## Tips

- Planes and directions with the same indices are perpendicular only in cubic cells. Elsewhere, use the angle the page gives.
- d(nh nk nl) = d(hkl)/n: (222) is the second-order reflection of (111).
- The reflection list ignores systematic absences. For cubic lattices the XRD peak calculator applies the rules for body-centred, face-centred and diamond lattices.
- Rhombohedral cells can be described on hexagonal axes; use the hexagonal system for those indices.

## FAQ

**Why are the angles in the picture not 90°?** The cell is drawn with its real angles, so a monoclinic or triclinic cell leans.

**What does "planes" mean in the list?** How many hkl, signs included, have exactly that spacing. In a cubic cell {100} has 6 and {111} has 8.

**Is anything sent anywhere?** No. Everything is worked out on this page.
