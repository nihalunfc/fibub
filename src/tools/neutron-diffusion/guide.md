---
name: One-group diffusion and criticality
num: 678
shelf: science
section: nuclear-engineering
title: "Neutron diffusion and criticality calculator: buckling, k_eff, critical size and flux shape of a bare reactor"
summary: "Work out the geometric buckling, k_eff and critical size of a bare slab, sphere, cylinder or box from one-group (or two-group) diffusion data, see the flux shape, and check the formula with a numeric finite-volume solve. For study. Nothing is uploaded."
status: live
ads: true
order: 678
icon: target
works: offline
updated: 2026-11-09
related: [point-kinetics, decay-calculator]
sources:
  - "One-group and two-group bare-reactor diffusion theory (buckling, k_eff = k∞/(1 + L²B²), critical size, flux shapes) as set out in standard reactor physics textbooks (general physics); J0 by its power series."
  - "Checked against SciPy (Bessel zero and J0, root-finding of k_eff = 1 in the physical size, two-group roots) to 1e-10, and the tool's finite-volume power iteration against the formulas (k within 1e-5, flux within 1e-3, second-order convergence) and against a separate node-based SciPy eigenvalue solve."
  - "The example material data are made up for fibub; they are not cross-sections of any real fuel or from any evaluated data library."
flow:
  - { icon: flask, label: "Material" }
  - { icon: ruler, label: "Shape" }
  - { icon: calculator, label: "k_eff" }
  - { icon: curve, label: "Flux" }
---

## What it does

A reactor is critical when each generation of neutrons makes exactly as many neutrons as the last. In an infinite block of fuel that ratio is **k∞**; in a real, finite core some neutrons leak out of the surface, so k_eff is smaller. One-group diffusion theory gives the leakage through a single number for the shape, the **geometric buckling B²**:

k_eff = k∞ / (1 + L²B²),  k∞ = νΣf / Σa,  L² = D / Σa

This calculator, for a bare (unreflected) homogeneous core:

- gives **B²** for a slab, sphere, finite or infinite cylinder, or box, with the extrapolation distance (2.13 D) added if you want;
- works out **k_eff**, the non-leakage probability and the **critical size** for each shape (with the cylinder's height-to-diameter ratio of your choice), with volumes;
- draws the **flux shape** (cosine, sin(Br)/Br, or the Bessel function J₀) and k_eff against size;
- solves the same problem **numerically** (finite volumes and power iteration) and shows how closely it matches the formula;
- offers a **two-group** model (fast and thermal), with k_eff = k∞ / ((1 + L₁²B²)(1 + L₂²B²)).

It is for study: real cores have reflectors, many materials and many energy groups.

## Worked example

With the made-up one-group data (D = 0.9 cm, Σa = 0.0195 /cm, νΣf = 0.0245 /cm), k∞ = 1.25641 and L² = 46.154 cm². A sphere of radius 40 cm, extrapolated by 1.917 cm, has B² = 0.0056172 cm⁻², a non-leakage probability of 79.41 % and **k_eff = 0.99774**: just subcritical. The critical sphere has R = 40.23 cm (272.8 L). The numeric solve with 200 cells gives 0.99774 too, differing by 2.5 × 10⁻⁶. Critical sizes of the other shapes: a slab 38.31 cm thick, a cylinder with H = D of R 36.62 cm and H 73.24 cm (308.6 L), and a cube of side 69.17 cm (330.9 L): the sphere needs the least material because it leaks least.

With the made-up two-group data, k∞ = 1.31771 and M² = 59.79 cm²; the 40 cm sphere has k_eff = 0.96726 and the critical sphere has R = 42.70 cm.

## FAQ

**Why is the sphere the smallest critical shape?** It has the least surface for its volume, so the fewest neutrons leak out.

**What is the extrapolation distance?** In diffusion theory the flux does not reach zero at the surface; it would reach zero about 0.71 transport mean free paths (2.13 D) outside it.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
