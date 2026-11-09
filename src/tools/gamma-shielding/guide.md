---
name: Gamma shielding calculator
num: 946
shelf: science
section: nuclear-and-particle-physics
title: "Gamma shielding calculator: half-value layer, tenth-value layer, attenuation and buildup"
summary: "How much a lead, tungsten, steel, aluminium, concrete or water shield cuts a gamma beam from 0.1 to 2 MeV: linear attenuation coefficient, half- and tenth-value layers, narrow-beam transmission, optional buildup, and the thickness for a wanted transmission, with every material compared. The built-in μ/ρ is worked out from formulas, not a table, so it is only an estimate: type the NIST XCOM value for real work."
status: live
ads: true
order: 2
icon: target
works: offline
updated: 2026-11-09
related: [decay-calculator, decay-chain, beer-lambert-calculator, uncertainty-calculator]
sources:
  - "No attenuation data is used: the built-in coefficients are computed from formulas. Klein-Nishina Compton cross-section: Klein, O. and Nishina, Y. (1929), Zeitschrift für Physik 52, 853. Photoelectric scaling law (the Born limits that give the familiar Z⁴ to Z⁵ over E³ behaviour) and near-threshold pair production: Heitler, W., The Quantum Theory of Radiation, and Evans, R. D., The Atomic Nucleus."
  - "Exponential attenuation, half- and tenth-value layers, and the Berger buildup form B = 1 + a μx e^(b μx): standard results, for example Knoll, G. F., Radiation Detection and Measurement, and Shultis, J. K. and Faw, R. E., Radiation Shielding."
  - "Atomic weights come from the site's periodic table (IUPAC abridged values); compositions from chemical formulas, except concrete, which is a simple made-up stand-in mix."
  - "Checked against a numerical integration of the Klein-Nishina differential cross-section (SciPy quad) and SciPy root finding, written for the tests."
  - "Densities are rounded general values; the example shield is made up."
flow:
  - { icon: target, label: "Energy" }
  - { icon: ruler, label: "Shield" }
  - { icon: curve, label: "Attenuation" }
  - { icon: table, label: "Compare" }
---

## How the built-in coefficients are made (please read)

This page does not carry a table of measured attenuation coefficients. It **works μ/ρ out from formulas**, element by element, from each material's composition:

- the **Compton** part from the exact Klein-Nishina cross-section per electron, times the electrons per gram;
- the **photoelectric** part from a textbook scaling law (roughly Z⁴ to Z⁵ over E³, taken as the geometric mean of the two Born limits);
- **pair production** above 1.022 MeV from a near-threshold formula, which is tiny below 2 MeV.

Coherent (Rayleigh) scattering, electron binding and absorption edges are left out. So the built-in numbers are an **approximate model for teaching and rough screening, not reference data**. Above about 0.5 MeV they are usually within roughly 20 %; below that they read low for heavy materials, by up to about 2.5 times for lead and tungsten at 0.1 MeV, where the photoelectric effect dominates. The page shows what fraction of each estimate is the approximate photoelectric part, and warns when that part is large.

**For real work, look μ/ρ up in NIST XCOM (free, US government) and type it into the box.** A typed value is used exactly as given, and that is the recommended way to use this page.

## What it does

Gamma rays are not stopped at a fixed depth the way alpha and beta particles are. Each centimetre of shield removes the same *fraction* of the photons that reach it, so a narrow beam falls off exponentially:

I = I₀ × e^(−μx)

where x is the thickness and μ the **linear attenuation coefficient**. μ is the material's **mass attenuation coefficient** μ/ρ (how strongly each gram interacts) times its density ρ. From μ follow the **half-value layer** (HVL = ln 2 / μ, the thickness that halves the beam) and the **tenth-value layer** (TVL = ln 10 / μ).

This page gives all of these for six common shield materials between 0.1 and 2 MeV, with an optional **buildup factor** for the scattered photons that a broad beam adds back.

## How to use it

1. Choose a **gamma energy** from the list of common lines, or type your own (0.1 to 2 MeV).
2. Choose the **shield material**. Its μ/ρ (from the model above) and density fill in; **type your own μ/ρ** to override it, from NIST XCOM or your own measurement. "Concrete" is a simple made-up stand-in mix, so a typed value is especially worthwhile there.
3. Type the **thickness** and its unit (mm, cm or inch).
4. **Buildup:** *none* gives the narrow-beam answer. *Simple* uses B = 1 + μx, a rough rule of thumb. *Berger* uses B = 1 + a μx e^(b μx); take a and b from a buildup table for your material, energy and geometry.
5. **Wanted transmission:** the page finds the thickness that lets through this percentage.
6. **Incoming intensity** is optional: any count rate or flux, and the page gives what gets through.

## Worked example

A made-up Cs-137 source (0.662 MeV) behind **2 cm of lead**. The model gives μ/ρ = 0.0941 cm²/g (65 % Compton, 35 % photoelectric, so the page flags it as rough) and ρ = 11.35 g/cm³, so μ = **1.068 /cm**, the half-value layer is **0.649 cm** and the tenth-value layer **2.16 cm**. A narrow beam is cut to **11.8 %**. With the simple buildup, the transmission is 37 %, three times more. To get down to 1 % takes **4.31 cm** without buildup (two tenth-value layers) or 6.22 cm with it.

The table compares the materials at the same energy: tungsten needs a 0.426 cm half-value layer, steel 1.22 cm, concrete 3.87 cm and water 8.09 cm. For Co-60 (1.25 MeV) in concrete the model gives a half-value layer of 5.25 cm, and says the estimate is 99.9 % Compton, so it is one of the reliable ones.

## Tips

- Per gram, all materials are similar above about 0.5 MeV (Compton scattering dominates), so a shield's mass matters more than what it is made of. Below that, lead and tungsten win by far (the photoelectric effect grows with atomic number).
- For a nuclide with several lines, check each line: the most penetrating one usually decides the thickness.
- Trust the built-in estimate most where the page says the photoelectric share is small (light materials, or any material above about 1 MeV); that part is the exact Klein-Nishina result.

## FAQ

**Why does buildup increase the transmission?** Photons scattered inside the shield can still reach you. A narrow, collimated beam ignores them; a real, broad source does not.

**Can I use this to design a shielded room?** No. It is for study and planning, not a substitute for professional judgement or a shielding assessment by a qualified expert. Real designs need workload, occupancy, geometry, scatter and local rules, and this page does not work out doses.

**Why only 0.1 to 2 MeV?** That covers most laboratory and medical gamma sources, and it is where this simple model behaves best. Lower down, absorption edges and electron binding matter and the model is not reliable; higher up, pair production needs the full Bethe-Heitler treatment, which the page does not do.

**Why not just ship a table of XCOM values?** Reference tables belong to the people who made them, and a half-remembered table is worse than an honest formula. Computing the numbers keeps the page self-contained and makes its limits visible, and the box lets you type the authoritative value whenever accuracy matters.
