---
name: Relativistic kinematics calculator
num: 947
shelf: science
section: nuclear-and-particle-physics
title: "Relativistic kinematics calculator: invariant mass, two-body decay, Lorentz boost and threshold energy"
summary: "Four special-relativity calculators in one page, in MeV or GeV with c = 1: the invariant mass of any set of particles, the momenta and lab energy ranges in a two-body decay, a Lorentz boost of a four-momentum in any direction, and the threshold energy of a reaction on a fixed target or in a collider. Type particle names instead of masses."
status: live
ads: true
order: 3
icon: orbit
works: offline
updated: 2026-11-09
related: [decay-chain, uncertainty-calculator, redshift-calculator]
sources:
  - "Special-relativistic kinematics (four-vectors, invariant mass, the Källén function for two-body decays, general Lorentz boosts, threshold energies): standard results, for example the Particle Data Group's Review of Particle Physics, Kinematics section, and Hagedorn, R. (1963), Relativistic Kinematics."
  - "Particle masses are rounded general values (Particle Data Group style), listed in the page's code."
  - "Checked against a NumPy Lorentz-matrix implementation written for the tests and against textbook thresholds (antiproton production, 5.63 GeV kinetic; π⁰ photoproduction, 144.7 MeV)."
  - "The example particles and momenta are made up."
flow:
  - { icon: sigma, label: "Invariant" }
  - { icon: target, label: "Decay" }
  - { icon: orbit, label: "Boost" }
  - { icon: ruler, label: "Threshold" }
---

## What it does

At speeds near light, energy and momentum mix together as a **four-momentum** (E, px, py, pz). This page uses natural units, where c = 1, so energies, momenta and masses all share one unit (MeV or GeV). The one number every observer agrees on is the **invariant mass**, M² = E² − |p|². Everything here follows from that.

1. **Invariant mass:** add up the four-momenta of a set of particles (for example two muons from a detector) and get the mass of whatever made them, plus the system's total energy, momentum, transverse momentum, velocity, γ and rapidity.
2. **Two-body decay:** a particle of mass M at rest splits into two. Their momentum is fixed: p* = √λ(M², m₁², m₂²) / 2M, where λ is the Källén function. If the parent is moving, the page gives each daughter's lab energy range and the largest angle it can make with the parent's direction, with a chart of lab angle against rest-frame angle.
3. **Lorentz boost:** a four-momentum seen from a frame moving with any velocity β.
4. **Threshold:** the least beam energy that can make a given set of products on a target at rest, and the energy per beam if two equal beams collide head-on instead.

## How to use it

- Choose **MeV or GeV**. Wherever a mass is asked for, type a number or a **particle name**: e, mu, tau, pi+, pi0, K+, K0, eta, p, n, d, alpha, Lambda, J/psi, W, Z, H, top, and gamma or nu for massless particles.
- In the invariant-mass box, write one particle per line: mass (or name), px, py, pz, separated by spaces, commas or tabs.

## Worked example

The page opens in GeV. Two made-up muons with momenta (30, 10, 20) and (−25, −5, −15) GeV have an invariant mass of **66.435 GeV**. In the decay K⁺ → π⁺ π⁰, each pion has **0.20514 GeV** of momentum in the kaon's rest frame; for a kaon of 1 GeV momentum, the π⁺ has between **0.14496 and 0.97603 GeV** in the lab and is never more than **46.52°** from the kaon's direction. A proton with 1 GeV of momentum along z, seen from a frame moving at β = 0.5 along z, has **E = 1.006 GeV** and p = (0, 0, 0.363) GeV. Making an antiproton by p + p → p + p + p + p̄ needs a beam kinetic energy of **5.6296 GeV** on a fixed target (six proton masses), but only 0.93827 GeV per beam in a collider.

## Tips

- Rapidity adds simply under boosts along z, which is why colliders plot it; pseudorapidity η is its massless version, computed from the angle alone.
- In a two-body decay the daughters' momenta are always back to back and equal in the rest frame; only the boost spreads them out in the lab.

## FAQ

**Why c = 1?** It saves writing c and c² everywhere. A mass of 938 MeV means 938 MeV/c², and a momentum of 1 GeV means 1 GeV/c.

**Does the threshold check conservation laws?** No, only energy and momentum. Charge, baryon number and other rules are up to you.

**How accurate are the built-in masses?** They are rounded general values, good to about five figures. Type your own numbers for precision work.
