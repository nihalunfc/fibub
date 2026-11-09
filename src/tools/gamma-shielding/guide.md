---
name: Gamma shielding calculator
num: 946
shelf: science
section: nuclear-and-particle-physics
title: "Gamma shielding calculator: half-value layer, tenth-value layer, attenuation and buildup"
summary: "How much a lead, tungsten, steel, aluminium, concrete or water shield cuts a gamma beam from 0.1 to 2 MeV: linear attenuation coefficient, half- and tenth-value layers, narrow-beam transmission, optional buildup, and the thickness for a wanted transmission, with every material compared. Teaching values, editable."
status: live
ads: true
order: 2
icon: target
works: offline
updated: 2026-11-09
related: [decay-calculator, decay-chain, beer-lambert-calculator, uncertainty-calculator]
sources:
  - "Mass attenuation coefficients: a small rounded set (3 significant figures) from NIST XCOM and the NIST X-ray Mass Attenuation Coefficients tables (Hubbell and Seltzer), US government work in the public domain; log-log interpolation between grid energies."
  - "Exponential attenuation, half- and tenth-value layers, and the Berger buildup form B = 1 + a μx e^(b μx): standard results, for example Knoll, G. F., Radiation Detection and Measurement, and Shultis, J. K. and Faw, R. E., Radiation Shielding."
  - "Checked against NumPy interpolation and SciPy root finding written for the tests, and every coefficient against the Klein-Nishina Compton cross-section as a lower bound."
  - "Densities are rounded general values; the example shield is made up."
flow:
  - { icon: target, label: "Energy" }
  - { icon: ruler, label: "Shield" }
  - { icon: curve, label: "Attenuation" }
  - { icon: table, label: "Compare" }
---

## What it does

Gamma rays are not stopped at a fixed depth the way alpha and beta particles are. Each centimetre of shield removes the same *fraction* of the photons that reach it, so a narrow beam falls off exponentially:

I = I₀ × e^(−μx)

where x is the thickness and μ the **linear attenuation coefficient**. μ is the material's **mass attenuation coefficient** μ/ρ (how strongly each gram interacts) times its density ρ. From μ follow the **half-value layer** (HVL = ln 2 / μ, the thickness that halves the beam) and the **tenth-value layer** (TVL = ln 10 / μ).

This page gives all of these for six common shield materials between 0.1 and 2 MeV, with an optional **buildup factor** for the scattered photons that a broad beam adds back.

## How to use it

1. Choose a **gamma energy** from the list of common lines, or type your own (0.1 to 2 MeV).
2. Choose the **shield material**. Its μ/ρ (interpolated from the built-in set) and density fill in; type your own values to override them, for example for a special concrete.
3. Type the **thickness** and its unit (mm, cm or inch).
4. **Buildup:** *none* gives the narrow-beam answer. *Simple* uses B = 1 + μx, a rough rule of thumb. *Berger* uses B = 1 + a μx e^(b μx); take a and b from a buildup table for your material, energy and geometry.
5. **Wanted transmission:** the page finds the thickness that lets through this percentage.
6. **Incoming intensity** is optional: any count rate or flux, and the page gives what gets through.

## Worked example

A made-up Cs-137 source (0.662 MeV) behind **2 cm of lead**. The page fills in μ/ρ = 0.111 cm²/g and ρ = 11.35 g/cm³, so μ = **1.26 /cm**, the half-value layer is **0.55 cm** and the tenth-value layer **1.83 cm**. A narrow beam is cut to **8.05 %**. With the simple buildup, the transmission is 28.3 %, three and a half times more. To get down to 1 % takes **3.66 cm** without buildup (two tenth-value layers) or 5.27 cm with the simple buildup.

The table compares the materials at the same energy: tungsten needs a 0.365 cm half-value layer, steel 1.20 cm, concrete 3.91 cm and water 8.09 cm. For Co-60 (1.25 MeV) in concrete the half-value layer is 5.30 cm.

## Tips

- Per gram, all materials are similar above about 0.5 MeV (Compton scattering dominates), so a shield's mass matters more than what it is made of. Below that, lead and tungsten win by far (the photoelectric effect grows with atomic number).
- For a nuclide with several lines, check each line: the most penetrating one usually decides the thickness.
- The built-in coefficients are rounded to three figures; for design work use the full XCOM data and proper buildup tables.

## FAQ

**Why does buildup increase the transmission?** Photons scattered inside the shield can still reach you. A narrow, collimated beam ignores them; a real, broad source does not.

**Can I use this to design a shielded room?** No. It is for study and planning, not a substitute for professional judgement or a shielding assessment by a qualified expert. Real designs need workload, occupancy, geometry, scatter and local rules, and this page does not work out doses.

**Why only 0.1 to 2 MeV?** That covers most laboratory and medical gamma sources, and keeps the built-in set small. Above 2 MeV pair production starts to matter more.
