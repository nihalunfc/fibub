---
name: Superconductor calculator
num: 966
shelf: science
section: condensed-matter-physics
title: "Superconductor calculator: BCS gap from Tc, London penetration depth, coherence length, κ and critical fields"
summary: "From the critical temperature, get the BCS energy gap and how it closes with temperature, the gap frequency, and from the penetration depth and coherence length (typed, or estimated from the electron density and Fermi velocity) the Ginzburg-Landau κ, type I or II, the critical fields B_c, B_c1 and B_c2, the Pauli limit and the depairing current, with a field-temperature phase diagram."
status: live
ads: true
order: 10
icon: sigma
works: offline
updated: 2026-11-09
related: [band-structure, heat-capacity-fitter, hall-effect]
sources:
  - "BCS theory (Bardeen, Cooper and Schrieffer, 1957): the weak-coupling gap equation, Δ₀ = 1.764 k_BT_c and the coherence length ħv_F/πΔ₀; London penetration depth; Pippard's mean free path correction; Ginzburg-Landau relations for κ, B_c, B_c1, B_c2 and the depairing current; Clogston-Chandrasekhar Pauli limit. Standard textbook results, for example Tinkham, M., Introduction to Superconductivity (1996)."
  - "Two-fluid (Gorter-Casimir) λ(T) and the empirical (1 − t²) law for critical fields: standard approximations, labelled as such on the page."
  - "Checked by fibub against SciPy (quad and brentq on the full BCS gap equation with a Debye cutoff) and scipy.constants; constants are CODATA values."
  - "Example values are made up."
flow:
  - { icon: sliders, label: "Tc and T" }
  - { icon: ruler, label: "λ and ξ" }
  - { icon: sigma, label: "Gap" }
  - { icon: chart, label: "Fields" }
---

## What it does

Below its critical temperature T_c a superconductor carries current with no resistance and pushes magnetic field out. A few numbers describe almost everything about it:

- the **energy gap Δ**, the energy needed to break a Cooper pair. BCS theory links it to T_c: Δ₀ ≈ 1.764 k_BT_c, and the gap shrinks to zero as T approaches T_c;
- the **London penetration depth λ**, how far a magnetic field leaks in;
- the **coherence length ξ**, the size of a Cooper pair;
- their ratio, the **Ginzburg-Landau parameter κ = λ/ξ**. Below 1/√2 the material is **type I** and expels field until it goes normal at B_c; above, it is **type II** and lets field in as **vortices** between B_c1 and B_c2.

This calculator gives the gap (solving the BCS gap equation at your temperature), the **gap frequency** (the photon frequency that breaks pairs, useful for detectors), λ(T), κ and the type, the critical fields and their temperature dependence, the **Pauli limit** set by spin splitting, the **depairing current density**, and a field-temperature phase diagram.

## How to use it

1. Type **T_c** and the **temperature** you care about.
2. Keep the **gap ratio** 2Δ₀/k_BT_c at 3.528 (weak-coupling BCS) or raise it for a strong-coupling material.
3. Either type **λ(0) and ξ(0)** if you know them, or choose **Estimate from the electrons** and give the electron density, effective mass, Fermi velocity and, for a dirty (alloy) superconductor, the mean free path.
4. Read the results, look at the phase diagram, and download the table against temperature or a report.

## Worked example

Take a made-up superconductor with T_c = 9.2 K, λ(0) = 40 nm and ξ(0) = 35 nm. The page shows **Type II (κ = 1.14): Δ₀ = 1.4 meV, B_c2(0) ≈ 0.269 T**. The gap frequency is **676 GHz**. At 4.2 K the gap is still 97 % of its full value, **1.359 meV**, and λ has grown to 40.9 nm. The thermodynamic field is 0.166 T and B_c1 is 13.7 mT. The Pauli limit, 17.1 T, is far above B_c2, so orbital effects limit the field here.

Switch to **Estimate from the electrons** with 10²⁸ electrons per m³ and v_F = 10⁶ m/s: λ_L = 53.1 nm and ξ₀ = 150 nm, so κ = 0.355 and the material is **type I**. Add a mean free path of 10 nm and ξ shrinks and λ grows until it becomes type II: this is why alloys are type II.

## Tips

- B_c1 from ln κ is only rough when κ is close to 1; it is good for κ above about 2.
- The (1 − t²) law is a convenient approximation. Real B_c2(T) curves are often closer to straight near T_c.
- The gap frequency sets the upper limit for low-loss microwave resonators and the threshold of superconducting photon detectors.

## FAQ

**Does this work for high-T_c cuprates or iron-based superconductors?** The formulas are BCS and Ginzburg-Landau estimates for conventional, isotropic superconductors. Unconventional materials have anisotropic gaps and need more careful models; use the numbers as rough guides only.

**Why does a finite mean free path make λ larger?** Scattering reduces how well the superfluid screens the field: λ ≈ λ_L √(1 + ξ₀/ℓ).

**Is this good enough to design a magnet?** No. It is for study and estimates, not a substitute for measured critical fields and professional judgement.
