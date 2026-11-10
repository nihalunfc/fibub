---
name: Stopping power
num: 948
shelf: science
section: nuclear-and-particle-physics
title: "Stopping power"
summary: "Energy loss (stopping power, LET) and CSDA range of protons, deuterons, alphas, carbon ions, your own ion, muons and pions in water, air, PMMA, aluminium, silicon, copper, lead or your own material, from the Bethe-Bloch formula. Plots stopping power against energy and the Bragg curve, and gives the energy left after any thickness."
status: live
ads: true
order: 4
icon: chart
works: offline
updated: 2026-11-09
related: [gamma-shielding, relativistic-kinematics, decay-chain, uncertainty-calculator, counting-statistics, spectrum-peak-fitter, physical-constants, plot-maker]
sources:
  - "Bethe-Bloch formula and the maximum energy transfer Tmax: Particle Data Group, Review of Particle Physics, Passage of particles through matter (formula only); Bethe, H. (1930), Annalen der Physik 397, 325."
  - "Mean excitation energies, Z/A and densities: rounded, commonly quoted values (for example in ICRU Report 37 and the PDG atomic and nuclear properties pages), filled in as editable defaults. Particle masses: rounded general constants."
  - "Checked against an independent Python implementation with SciPy adaptive quadrature and root finding, written for the tests."
  - "Below 1 MeV per nucleon the range uses a power law (range ∝ T^1.75) joined to the Bethe value; the example beam is made up."
flow:
  - { icon: target, label: "Particle" }
  - { icon: flask, label: "Material" }
  - { icon: chart, label: "Bragg curve" }
  - { icon: ruler, label: "Range" }
---

## What it does

A fast charged particle slows down in matter mainly by knocking electrons about. The **Bethe-Bloch formula** gives its average energy loss per unit path, the **stopping power**:

−dE/dx = K z² (Z/A) (1/β²) [½ ln(2 mₑc² β²γ² Tmax / I²) − β²]

where z is the particle's charge, Z/A the material's electrons per nucleon, I its **mean excitation energy**, β and γ the particle's speed and Lorentz factor, and Tmax the largest energy it can give to one electron. Adding up the path needed to lose all the energy gives the **CSDA range** (continuous slowing-down approximation).

Because the loss rises steeply as the particle slows, a proton or ion deposits most of its energy just before it stops: the **Bragg peak**, the reason protons and carbon ions are used in cancer therapy.

Get the particle's speed and momentum from the [[relativistic-kinematics|relativistic kinematics calculator]], and compare with photon shielding in the [[gamma-shielding|gamma shielding calculator]].

## How to use it

1. Choose a **particle**, or your own ion by charge number z and mass in atomic mass units.
2. Type the **kinetic energy**, as total MeV or MeV per nucleon (the usual unit for ion beams).
3. Choose a **material**. Its Z/A, mean excitation energy and density fill in as rounded, editable values; type your own for other materials.
4. **Bragg curve:** *with range straggling* spreads the stopping points of a beam with a normal distribution (σ about 1.2 % of the range for protons, smaller for heavier ions: a rough rule), which gives a peak like a measured one; *pristine* shows a single particle's curve, which climbs very steeply at the end.
5. Optionally type a **thickness** to cross (µm, mm, cm or g/cm²) to get the energy left on the far side.

The page shows the range in length and in g/cm², the mass and linear stopping power (the linear one in keV/µm is the **LET**), β, γ and Tmax, a log-log chart of stopping power against energy, and the Bragg curve along the track. Both tables download as CSV.

## Worked example

A made-up **100 MeV proton beam in water**: the stopping power is **7.29 MeV cm²/g** (0.729 keV/µm), β = 0.4282, and the largest energy one electron can receive is 229.2 keV. The CSDA range is **7.711 cm**. After 5 cm of water the protons have **55.82 MeV** left, where they lose 11.42 MeV cm²/g, and the Bragg curve climbs to its peak just before 7.7 cm. A 250 MeV/u carbon-12 beam in water has a range of 12.7 cm; a 1 GeV muon crosses 70.39 cm of lead.

## Tips

- In g/cm², ranges hardly depend on density, so a gas and a liquid of the same composition compare directly.
- Different particles at the same speed: stopping power scales as z², and range as M/z².
- A measured Bragg peak is also lowered by nuclear reactions and widened by the beam's energy spread, which this page leaves out.

## FAQ

**How accurate is it?** The formula leaves out shell corrections (which matter at low energy), the density effect (above a few hundred MeV for protons, much more for light particles), Barkas and Bloch terms, and the ion picking up electrons as it slows. It is good to a few percent from about 2 MeV per nucleon to a few GeV per nucleon; the page flags lower energies. A 5 MeV alpha in air, for example, comes out about 3.0 cm, shorter than the measured range of about 3.5 to 3.7 cm.

**Does it include nuclear reactions or radiation losses?** No. Some protons are lost to nuclear reactions over long ranges, and electrons (not covered here) lose energy by bremsstrahlung.

**Can I use this for treatment planning or shielding?** No. It is for study and planning, not a substitute for professional judgement or validated software.
