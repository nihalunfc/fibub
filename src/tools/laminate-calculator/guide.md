---
name: Laminate calculator
num: 850
shelf: science
code: T586
section: mechanical-behaviour
title: "Composite laminate calculator: rule of mixtures, ABD matrix, ply stresses and Tsai-Wu first-ply failure"
summary: "Get ply properties from fibre and matrix (rule of mixtures, Reuss or Halpin-Tsai), then use classical lamination theory for any stacking such as [0/±45/90]s: Q and Q-bar, the A, B and D matrices, effective laminate moduli, ply stresses and strains under in-plane forces and moments, and first-ply failure by maximum stress and Tsai-Wu."
status: live
ads: true
order: 850
icon: calculator
works: offline
updated: 2026-11-09
related: [stress-strain-analyser, fracture-toughness-calculator, fatigue-sn-calculator, beam-calculator, glass-transition-calculator]
sources:
  - "Rule of mixtures, Halpin-Tsai (Halpin and Kardos, 1976) and classical lamination theory with the maximum stress and Tsai-Wu (1971) criteria, in the textbook forms of Jones, Mechanics of Composite Materials, and Daniel and Ishai, Engineering Mechanics of Composite Materials. fibub's code is checked in the tests against an independent NumPy implementation."
  - "The example fibre, matrix and strength values are made-up round numbers, not data for any real material."
  - "Nothing you type is sent or stored."
flow:
  - { icon: flask, label: "Ply" }
  - { icon: table, label: "Stack" }
  - { icon: sigma, label: "ABD" }
  - { icon: target, label: "Failure" }
---

## What it does

A fibre-reinforced laminate is a stack of thin plies, each much stiffer and stronger along its fibres than across them. Turning the plies to different angles gives a laminate with the stiffness you need in each direction. This page does the standard hand calculation, **classical lamination theory (CLT)**, in three steps:

1. **Ply properties.** From the fibre and matrix moduli, Poisson's ratios and the fibre volume fraction Vf, the **rule of mixtures** gives E₁ = Vf Ef + (1 − Vf) Em and ν₁₂. Across the fibres you choose the **inverse rule of mixtures** (Reuss, a lower bound) or **Halpin-Tsai** (ξ = 2 for E₂, ξ = 1 for G₁₂), which is usually much closer to tests. Or type measured ply properties.
2. **Stacking.** For a sequence such as [0/±45/90]s it builds the ply stiffness **Q**, the turned stiffness **Q-bar** for each angle, and the **A, B and D matrices**: A links in-plane forces to stretching, D links moments to bending, and B couples the two (B = 0 for a symmetric stack). It then gives the effective laminate moduli Ex, Ey, Gxy, νxy and the bending moduli, from the inverse of the full ABD matrix.
3. **Loads and failure.** For in-plane forces N and moments M per unit width it solves for the mid-plane strains and curvatures, and gives the strains and stresses at the bottom and top face of every ply, in laminate axes and in ply axes. Each point gets a **strength ratio R**: the factor on all the loads at which that point fails by **maximum stress** (with the failure mode) and by **Tsai-Wu**. The smallest R is **first-ply failure**.

Get each ply's strength from a coupon test with the [[stress-strain-analyser|stress-strain curve analyser]], and use the laminate's stiffness in a [[beam-calculator|beam deflection]] check.

## How to use it

1. Type fibre and matrix properties, or switch to "Type ply properties".
2. Type the ply angles and the ply thickness. Write angles with / or commas; ±45 adds +45 and −45; 0_2 repeats a ply; ]2 repeats the bracketed group; a final s mirrors the stack. Ply 1 sits at z = −h/2.
3. Type the loads and the five ply strengths (compressive strengths as positive numbers). Read the strength ratios, the through-thickness plot and the ply table, and download the table as CSV or everything as an image, PDF or Word file.

## Worked example

Made-up glass-like fibres (Ef = 75 GPa, νf = 0.2) in a resin (Em = 3.5 GPa, νm = 0.35) at Vf = 0.6 give **E₁ = 46.40 GPa**, ν₁₂ = 0.2600, and with Halpin-Tsai **E₂ = 15.02 GPa** and **G₁₂ = 4.493 GPa** (the Reuss bound gives only 8.178 and 3.051 GPa).

Eight plies of 0.125 mm in [0/±45/90]s make a 1 mm quasi-isotropic laminate: **Ex = Ey = 24.03 GPa**, Gxy = 9.098 GPa and νxy = 0.3209, with A₁₁ = 26,793 N/mm. It is symmetric and balanced, so B = 0 and there is no stretch-shear coupling.

Under Nx = 40 N/mm the laminate stretches by 1664 microstrain. The 90° plies carry σ₂ = 23.43 MPa across their fibres, against a made-up transverse strength of 30 MPa. Tsai-Wu gives **R = 1.249**, so the first ply (the 90° plies in the middle) fails at Nx = 49.94 N/mm; maximum stress gives R = 1.281, in transverse tension. The 0° plies are far from failing (R = 12.84).

## Tips

- First-ply failure is usually matrix cracking in the plies across the load. The laminate can often carry more after that; a progressive (last-ply) analysis needs reduced ply stiffnesses and is beyond this page.
- Thermal and moisture residual stresses from curing are not included here, and in 90° plies they can be a large part of the transverse stress.
- For an unsymmetric stack, in-plane loads also bend and twist the laminate (look at the curvatures).

## FAQ

**Why do maximum stress and Tsai-Wu differ?** Maximum stress checks each stress on its own; Tsai-Wu is one quadratic surface that lets the stresses interact, so a ply under both σ₂ and τ₁₂ fails earlier with Tsai-Wu.

**Which Q-bar sign convention?** θ is measured from the x axis towards y, and Q-bar₁₆ changes sign with θ, as in Jones and in Daniel and Ishai.

**Is my input stored?** No, all the sums happen on this page.
