---
name: Fracture toughness calculator
num: 848
shelf: science
code: T584
section: mechanical-behaviour
title: "Fracture toughness calculator: stress intensity K, critical crack size, plane-strain check and Paris-law crack growth"
summary: "Work out the stress intensity K = Yσ√(πa) for centre, edge, double-edge and buried cracks, with finite-width corrections. Get the critical stress and critical crack size against K_IC, the ASTM E399 plane-strain size check, the plastic zone, and the fatigue crack growth life from Paris' law."
status: live
ads: true
order: 848
icon: calculator
works: offline
updated: 2026-11-09
related: [stress-strain-analyser, fatigue-sn-calculator, larson-miller-calculator, laminate-calculator, uncertainty-calculator]
sources:
  - "K = Yσ√(πa), Feddersen's secant correction and Tada's finite-width fits are the textbook forms (Tada, Paris and Irwin, The Stress Analysis of Cracks Handbook, as quoted in Anderson, Fracture Mechanics, chapter 2, and Dowling, Mechanical Behavior of Materials, chapter 8). The plane-strain size 2.5 (K/σy)² is the ASTM E399 criterion. fibub's code is checked in the tests against SciPy (brentq and integrate.quad)."
  - "The example numbers (crack, stress, toughness, Paris C and m) are made-up round values, not data for any real material."
  - "Nothing you type is sent or stored."
flow:
  - { icon: ruler, label: "Crack" }
  - { icon: sigma, label: "K" }
  - { icon: target, label: "Critical" }
  - { icon: curve, label: "Growth" }
---

## What it does

Linear elastic fracture mechanics (LEFM) says a crack grows suddenly when the **stress intensity factor** K at its tip reaches the material's **fracture toughness** K_IC. For a crack of size a under a remote stress σ:

K = Y σ √(πa)

where Y is a geometry factor that depends on where the crack is and how wide the part is. This page:

- works out **Y and K** for seven common geometries, or a Y you type;
- gives the **critical stress** that would break a part with this crack, and the **critical crack size** at this stress;
- checks the **plane-strain size** 2.5 (K_IC/σy)²: for a K_IC test to be valid (ASTM E399), the thickness B, the crack a and the uncracked ligament must each be at least this big;
- shows Irwin's **plastic zone** size at the crack tip in plane stress and plane strain;
- integrates **Paris' law** da/dN = C ΔKᵐ to give the number of load cycles for the crack to grow to its critical size (or a size you choose), with the crack growth curve.

Find the stress range a part sees and its fatigue life with the [[fatigue-sn-calculator|fatigue S-N calculator]], and the yield strength for the size check with the [[stress-strain-analyser|stress-strain curve analyser]].

## Geometries

- **Centre crack, wide plate**: a through crack of length 2a far from any edge, Y = 1.
- **Centre crack, finite width (secant)**: Feddersen's correction Y = √sec(πa/W), good to about 0.3 % up to 2a/W = 0.7.
- **Centre crack, finite width (Tada)**: the secant times (1 − 0.025α² + 0.06α⁴), α = 2a/W, accurate to 0.1 % at any width.
- **Edge crack, wide plate**: Y = 1.12 (1.1215), the free-surface correction.
- **Single edge crack, finite width**: the polynomial 1.12 − 0.231(a/W) + 10.55(a/W)² − 21.72(a/W)³ + 30.39(a/W)⁴ for a/W up to 0.6.
- **Two edge cracks, finite width**: Tada's fit with α = 2a/W.
- **Buried penny crack** of radius a in a large body: Y = 2/π.

W is always the full width of the plate; a is the half length of a centre crack, or the depth of an edge crack.

## How to use it

1. Pick the geometry and type the crack size, the plate width (when asked), the stress, K_IC, the yield strength and the thickness.
2. Read K and the safety factor K_IC ÷ K, the critical stress and crack size, and the size checks. The plot shows how K rises as the crack grows, with K_IC as a dashed line.
3. For fatigue, type the minimum stress of the load cycle and the Paris constants for your material, and read the life and the crack growth curve. Download the curve as CSV, or everything as an image, PDF or Word file.

## Worked example

A plate 100 mm wide and 30 mm thick has a centre crack 10 mm long (a = 5 mm) and carries 200 MPa. The made-up material has K_IC = 60 MPa√m and σy = 600 MPa. With the secant correction Y = 1.0062, so **K = 25.22 MPa√m**, a safety factor of 2.38. The critical stress for this crack is 475.8 MPa, and at 200 MPa the crack can grow to **a = 22.05 mm** before fracture. The plane-strain size is 2.5 (60/600)² m = **25 mm**, so the 30 mm thickness passes.

Cycling between 20 and 200 MPa (Δσ = 180 MPa) with C = 5 × 10⁻¹² m/cycle and m = 3, the crack grows from 5 mm to 22.05 mm in **82,780 cycles**. More than half of that life passes before the crack reaches its half-way size.

## Tips

- If the critical stress is above the yield strength, the part yields before it fractures: use a plastic collapse or elastic-plastic (J or CTOD) method instead.
- Thin sheets fail in plane stress or mixed mode and are tougher than K_IC suggests, so using K_IC is on the safe side.
- Paris' law holds in the middle range of crack growth. Near the threshold ΔK_th cracks grow more slowly; near K_IC faster.

## FAQ

**Why is the life so sensitive to the starting crack size?** Most of the life is spent while the crack is small and K is low. Halving the starting crack can more than double the life when m is about 3, which is why inspections look for small cracks.

**Which units for C?** Metres per cycle with ΔK in MPa√m. To convert from in/cycle with ksi√in, C changes with m, so convert ΔK first.

**Is my input stored?** No, all the sums happen on this page.
