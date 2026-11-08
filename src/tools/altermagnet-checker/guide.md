---
name: Altermagnet checker
num: 117
shelf: science
section: condensed-matter-physics
title: "Altermagnet checker: is a magnet an altermagnet, antiferromagnet or ferrimagnet? (spin-group symmetry test)"
summary: "Enter a crystal and mark which atoms are spin up or spin down. The tool finds the symmetry operations that swap the two spin sublattices and tells you whether the material is a conventional antiferromagnet (spin-degenerate bands), an altermagnet (d-, g- or i-wave spin-split bands) or a ferrimagnet, with the symmetry-allowed form of the spin splitting and a map of where it is positive or negative."
status: live
ads: true
order: 1
icon: compass
works: offline
updated: 2026-11-08
related: [point-group-finder, crystal-field-calculator, huckel-mo-calculator]
sources:
  - "Classification: the standard non-relativistic spin-group test for collinear magnets (antiferromagnet when a translation or inversion swaps the sublattices; altermagnet when only rotations or mirrors do), as used in the altermagnetism literature since 2022."
  - "Example structures: idealised rutile-type and NiAs-type cells written by fibub with rounded lattice constants; not copied from any structure database."
  - "Symmetry search and spin-splitting form: worked out by fibub from the structure you enter (group projection onto polynomials in k)."
flow:
  - { icon: table, label: "Crystal" }
  - { icon: compass, label: "Symmetry" }
  - { icon: check, label: "Verdict" }
  - { icon: chart, label: "Spin map" }
---

## What it does

**Altermagnets** are a third kind of collinear magnet, recognised in 2022. Like antiferromagnets, their up and down moments cancel exactly, so there is no net magnetisation. Like ferromagnets, their electron bands are split by spin, which is useful for spintronics. For years many were filed as ordinary antiferromagnets, because a magnetometer cannot tell the two apart.

The difference is **symmetry**: which operation turns the spin-up atoms into the spin-down atoms.

- **Conventional antiferromagnet:** a plain translation or an inversion swaps the two sublattices. Combined with time reversal, that forces every band to stay spin-degenerate.
- **Altermagnet:** only a rotation or a mirror swaps them, perhaps with a fractional shift such as a screw axis or glide. The bands then split by spin, with the sign alternating as you turn in momentum space. The pattern has 2, 4 or 6 spin-degenerate nodal planes, called **d-wave**, **g-wave** or **i-wave**.
- **Ferromagnet or ferrimagnet:** the moments do not cancel.

This tool runs that test. It finds every symmetry operation of the crystal and sorts them into those that keep each spin and those that swap up and down. It then gives the verdict, names the operation that decides it, and works out the lowest-order form of the spin splitting Δ(k) that the symmetry allows. Finally it draws Δ(k) on the plane through the zone centre where it varies most.

## How to use it

1. Start from an example, or type your own structure: a `cell` line with a, b, c in ångströms and α, β, γ in degrees, then one line per atom with its element, fractional coordinates and spin (`up`, `down`, or a signed moment). Leave the spin off for non-magnetic atoms.
2. List **every** atom of the magnetic unit cell, including both spin sublattices and all non-magnetic atoms. The non-magnetic atoms (often oxygen or a pnictogen) usually decide the answer, because they break the symmetry between the two magnetic sites.
3. If your coordinates come from an experiment, raise the tolerance a little (for example to 0.2 Å) so that small errors still count as symmetric.
4. Read the verdict, the operation behind it, and the spin-splitting form. In the map, blue and orange mark the two signs of the splitting: spin-up states lie lower on one colour and spin-down states on the other. Which colour is which depends only on which sublattice you call up.

## Worked example

**Rutile-type RuO₂** (idealised, with oxygen at u = 0.3): the up and down Ru atoms are swapped only by a **4-fold screw about [0 0 1] with translation (½, ½, ½)** and related operations, and never by a translation or inversion. Verdict: **d-wave altermagnet, Δ(k) ∝ kx·ky**, with two nodal planes (kx = 0 and ky = 0). Whether real RuO₂ orders magnetically at all is still debated, which shows why the first step is to measure the magnetic structure.

**NiAs-type MnTe and CrSb:** the swap is a **6-fold screw about [0 0 1] with translation (0, 0, ½)**. Verdict: **g-wave altermagnet**, Δ(k) ∝ kx²·ky·kz − (1/3)·ky³·kz, which has four nodal planes. Spin-split bands like these have been seen by ARPES in both materials.

**Body-centred checkerboard:** the body-centring translation swaps the spins, so it is a conventional antiferromagnet with spin-degenerate bands.

## Questions

**How do experiments confirm it?** First find the magnetic structure, usually by neutron diffraction. Then run this symmetry test. Finally look for the spin splitting directly with spin-resolved ARPES, or for signs that need it: an anomalous Hall effect or X-ray magnetic circular dichroism with no net magnetisation.

**What does it leave out?** Spin–orbit coupling, which adds small effects such as weak ferromagnetism, and non-collinear magnets. The test also says what is allowed, not how big the splitting is. That needs a band-structure calculation.

**Is anything sent anywhere?** No. Your structure stays in your browser, and the page works offline once loaded.
