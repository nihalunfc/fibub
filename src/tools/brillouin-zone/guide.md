---
name: Brillouin zone viewer
num: 963
shelf: science
code: T698
section: condensed-matter-physics
title: "Brillouin zone viewer: reciprocal lattice, first Brillouin zone and high-symmetry points for 2D and 3D lattices"
summary: "Pick a 2D or 3D lattice (square, hexagonal, fcc, bcc, hexagonal, tetragonal, orthorhombic or any triclinic cell) and see its reciprocal lattice vectors, the first Brillouin zone drawn and turnable in 3D, its faces, corners and volume, and the coordinates of the standard high-symmetry points such as Γ, X, L, K and W. Download the zone corners and points as CSV."
status: live
ads: true
order: 7
icon: target
works: offline
updated: 2026-11-09
related: [band-structure, point-group-finder, altermagnet-bands, miller-index-calculator, xrd-peak-calculator, electron-diffraction-indexer, chiral-magnon-bands]
sources:
  - "Reciprocal lattice, Wigner-Seitz construction of the first Brillouin zone and Voronoi-relevant vectors: standard results, for example Ashcroft, N. W. and Mermin, N. D., Solid State Physics (1976), chapters 5 and 8, and Conway, J. H. and Sloane, N. J. A., Sphere Packings, Lattices and Groups (Voronoi's criterion)."
  - "High-symmetry point names and fractional coordinates: the common textbook conventions, as also tabulated by Setyawan, W. and Curtarolo, S. (2010), Computational Materials Science 49, 299 to 312. These are labels of geometric points (facts of geometry), checked by fibub to lie on the zone surface."
  - "Checked by fibub against SciPy's Voronoi and ConvexHull (Qhull) applied to the reciprocal lattice points: corner, face and edge counts and zone volumes for cubic, hexagonal and triclinic cells, and zone areas in 2D."
  - "Example lattice constants are made up."
flow:
  - { icon: sliders, label: "Lattice" }
  - { icon: sigma, label: "Reciprocal" }
  - { icon: target, label: "Zone" }
  - { icon: table, label: "Points" }
---

## What it does

Waves in a crystal, whether electrons, phonons or X-rays, are labelled by a **wavevector k**. Because the crystal repeats, wavevectors that differ by a **reciprocal lattice vector G** describe the same state, so every state can be drawn inside one cell of k-space: the **first Brillouin zone**. It is the region closer to Γ (k = 0) than to any other reciprocal lattice point, bounded by the **Bragg planes** halfway to the nearest points. Band structures, phonon dispersions and Fermi surfaces are all drawn in it.

This viewer builds the reciprocal lattice from your real-space cell, constructs the zone exactly (using Voronoi's rule to find which reciprocal points bound it), and draws it. In 3D you can turn and tilt it; hidden edges are dashed. It lists:

- the **primitive and reciprocal vectors**, their lengths and the angles between them;
- the **cell and zone volumes** (or areas in 2D), which are always (2π)³/V apart;
- the zone's **faces, corners and edges**, with the distance from Γ to the nearest faces;
- the **high-symmetry points** with fractional and Cartesian coordinates and distance from Γ.

Draw the bands along the paths between these points with the [[band-structure|band structure explorer]], and index the lattice planes behind the zone faces with the [[miller-index-calculator|Miller index calculator]].

## How to use it

1. Choose a **lattice**. For fcc, bcc and centred rectangular lattices, type the conventional (cube or rectangle) edge; the tool uses the primitive cell inside.
2. Type the **cell lengths** in Å and, for oblique and triclinic cells, the **angles**.
3. Choose the **convention**: physicists include 2π in the reciprocal vectors (aᵢ·bⱼ = 2π δᵢⱼ), crystallographers do not. The zone has the same shape either way; only its size changes.
4. Turn and tilt the 3D zone with the sliders, then download the corners, points or a report.

## Worked example

The page opens on a made-up **fcc** crystal with a = 4 Å. Its reciprocal lattice is body-centred cubic and the zone is a **truncated octahedron: 14 faces, 24 corners, 36 edges**. The primitive cell holds a³/4 = **16 Å³**, so the zone volume is (2π)³/16 = **15.5 Å⁻³**. The reciprocal vectors are 2π√3/a = **2.721 Å⁻¹** long. The table gives X at 2π/a = **1.571 Å⁻¹** (centre of a square face), L at √3π/a = **1.36 Å⁻¹** (centre of a hexagonal face), K and U at **1.666 Å⁻¹** and the corner W at **1.756 Å⁻¹**. Switch to bcc and the zone becomes a rhombic dodecahedron with 12 faces and 14 corners.

## Tips

- The fcc and bcc lattices are each other's reciprocal: compare their zones.
- In 2D, the hexagonal lattice gives a regular hexagon with K at the corners (where graphene's Dirac cones sit) and M at the edge centres. The second picture shows the real-space lattice and its Wigner-Seitz cell for comparison.
- For low-symmetry cells only Γ is labelled, since the names of other points depend on the exact cell shape.

## FAQ

**Why is the zone sometimes not the shape I expect for a triclinic cell?** The zone of a general lattice has 14 faces (or 12, or 8, or 6 in special cases). Small changes in the angles can change which faces exist.

**Why limit the length ratios to 4?** The tool searches a fixed shell of reciprocal points; very elongated cells would need a larger search. Real crystals inside this range are covered.

**Is the 2π convention a choice of units?** Yes. Diffraction often uses 1/d without the 2π; band structures use k with it. The CSV states the units.
