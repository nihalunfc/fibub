---
name: Airfoil calculator
num: 958
shelf: science
code: T693
section: fluid-dynamics
title: "Airfoil calculator: lift, pitching moment and drag of NACA 4-digit airfoils by thin airfoil theory and a vortex panel method"
summary: "Type a NACA 4-digit code and an angle of attack to get the lift coefficient from thin airfoil theory and from a vortex panel method, the zero-lift angle, quarter-chord moment, pressure distribution, lift per metre of span, a rough drag estimate and, for a wing of given aspect ratio, induced drag."
status: live
ads: true
order: 3
icon: curve
works: offline
updated: 2026-11-09
related: [lattice-boltzmann, dimensionless-numbers, rocket-equation, potential-flow, boundary-layer, aircraft-performance, propeller-thrust, standard-atmosphere, wind-energy-yield]
sources:
  - "NACA 4-digit geometry: Jacobs, E. N., Ward, K. E. and Pinkerton, R. M. (1933), NACA Report 460 (public domain)."
  - "Thin airfoil theory: Abbott, I. H. and von Doenhoff, A. E. (1959), Theory of Wing Sections. Linear-strength vortex panel method: Kuethe, A. M. and Chow, C.-Y., Foundations of Aerodynamics. Lifting-line wing: Prandtl."
  - "Drag estimate: flat-plate skin friction (Blasius laminar, Prandtl-Schlichting turbulent) with a thickness form factor of the kind given in Raymer, Aircraft Design: A Conceptual Approach. Rough by design."
  - "Checked against SciPy quadrature of the thin airfoil integrals and an independent Hess-Smith (constant source and vortex) panel code in NumPy."
flow:
  - { icon: pencil, label: "NACA code" }
  - { icon: compass, label: "Angle" }
  - { icon: chart, label: "Pressure" }
  - { icon: target, label: "Lift" }
---

## What it does

The NACA 4-digit airfoils are the classic wing sections: four digits describe the whole shape. This calculator draws the section and works out its lift and pitching moment two ways:

- **Thin airfoil theory** treats the section as its curved camber line and gives the famous result Cl = 2π (α − α₀), plus a quarter-chord moment that does not depend on angle.
- A **vortex panel method** wraps the real shape, thickness included, in 60 to 240 straight panels carrying a linearly varying vortex sheet, makes the flow follow the surface, and imposes the Kutta condition at the sharp trailing edge. It gives the pressure over the surface and slightly more lift than thin theory, because thickness adds lift slope.

It then turns the coefficients into forces for your chord and speed, adds a rough drag estimate, and, if you give a wing aspect ratio, the lift and induced drag of a finite wing.

Get the air density at height from the [[standard-atmosphere]], and use the lift and drag in the [[aircraft-performance|aircraft performance calculator]].

## How to use it

1. Type the **NACA code**: 0012 is symmetric and 12 % thick; 2412 has 2 % camber at 40 % chord; 4415 is more cambered and 15 % thick.
2. Set the **angle of attack**. Inviscid methods do not stall, so stay below about 12° for real sections.
3. Choose the number of **panels**: more is more accurate and slower; 160 is plenty.
4. Give the **chord**, **air speed**, **density** and **viscosity** (rounded sea-level air is filled in).
5. Optionally give the **aspect ratio** (span² ÷ wing area) and **span efficiency** to see a 3D wing.

## Worked example

The page opens on a NACA 2412 at 4° with a 1 m chord at 30 m/s. The panel method gives **Cl = 0.742** and thin airfoil theory 0.666. The zero-lift angle is −2.18° by panels and **−2.08°** by thin theory, which also gives the quarter-chord moment of **−0.0531** (−0.0614 by panels). The Reynolds number is 2.03 × 10⁶, so lift is about 409 N per metre of span. The rough profile drag is 0.00991, so the 2D lift-to-drag ratio is about 74.8. As a wing of aspect ratio 8 with e = 0.9, the lift coefficient falls to 0.569 and induced drag adds 0.0143, for an L/D of about 23.5.

## Tips

- Compare 0012 and 0024 at the same angle: the thick section has a slightly steeper lift slope in the panel method, which thin theory cannot see.
- The pressure plot is drawn with suction upwards: the big peak near the nose on the upper surface is where most of the lift comes from.
- The quarter-chord moment barely changes with angle: that is why the quarter chord is called the aerodynamic centre.

## FAQ

**Why is the panel lift higher than measured?** Real boundary layers thin out the effective camber near the trailing edge and the flow separates at high angle. Expect measured lift a few per cent lower, and stall near 12° to 16°.

**How good is the drag?** Only a rough estimate of zero-lift skin friction drag. Real drag depends on where the boundary layer turns turbulent and rises with lift.

**Is anything uploaded?** No, it all runs in your browser. It is for study and planning, not a substitute for professional judgement.
