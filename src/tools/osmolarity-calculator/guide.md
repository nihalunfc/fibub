---
name: Osmolarity calculator
num: 344
shelf: science
section: physiology
title: "Osmolarity and tonicity calculator: mOsm/L of a solution, osmotic pressure and hypo-, iso- or hypertonic"
summary: "Add the solutes of a solution in mmol/L, g/L, % w/v or mg/dL and get its osmolarity (concentration × van 't Hoff factor × osmotic coefficient), its effective osmolarity, the van 't Hoff osmotic pressure, and whether it is hypo-, iso- or hyperosmotic and tonic compared with a reference you set. For study and teaching, not for clinical use."
status: live
ads: true
order: 344
icon: flask
works: offline
updated: 2026-11-09
related: [colligative-properties, solution-calculator, molar-mass-calculator, buffer-recipe-calculator]
sources:
  - "Osmotic pressure: J. H. van 't Hoff (1887), π = cRT. Gas constant R = 8.314462618 J/(mol·K) (CODATA)."
  - "Molar masses from the formula and the IUPAC/CIAAW standard atomic weights; the van 't Hoff factors are ideal dissociation counts (general chemistry). Which solutes cross cell membranes (urea, glycerol, ethanol) is general physiology."
  - "Checked in the tests against a Python rewrite with separately typed IUPAC atomic weights. The example solution is made up."
flow:
  - { icon: flask, label: "Solutes" }
  - { icon: calculator, label: "mOsm/L" }
  - { icon: sliders, label: "Reference" }
  - { icon: check, label: "Tonicity" }
---

## What it does

Water moves across a cell membrane towards the side with more dissolved particles. How many particles a solution holds per litre is its **osmolarity**, in milliosmoles per litre (mOsm/L). This calculator adds up the particles from every solute you list:

**osmolarity = Σ concentration × i × φ**

where **i** is the number of particles one formula unit gives (NaCl gives Na⁺ and Cl⁻, so 2) and **φ** is the osmotic coefficient, a correction for ions that do not act fully independently.

It then gives the **osmotic pressure** by van 't Hoff's law (π = cRT) and compares the solution with a **reference** you choose, such as the inside of a cell.

For study and teaching, not for clinical use.

## Osmotic or tonic?

- **Hyper-, iso- or hypo-osmotic** compares all particles.
- **Hyper-, iso- or hypotonic** compares only the particles that cannot cross the membrane, because those are the ones that hold water back. Urea, glycerol and ethanol enter most cells, so a urea solution can be hyperosmotic and still hypotonic: cells in it swell.

## How to use it

1. **Add solutes.** Pick from the list (the molar mass comes from the formula) or choose "Other…" and type a name, molar mass and i.
2. **Amount and unit:** mmol/L, mol/L, g/L, % w/v (grams per 100 mL) or mg/dL.
3. **i** fills in for listed solutes; change it if a salt does not dissociate fully.
4. **φ** is 1 for an ideal solution. Use a measured value if you have one.
5. **Crosses membranes** removes that solute from the effective (tonic) osmolarity.
6. Set the **temperature**, the **reference** osmolarity and how close counts as equal.

## Worked example

The made-up example is 0.9 % w/v NaCl (φ 0.93) with 100 mmol/L urea, at 37 °C, compared with 290 ± 10 mOsm/L.

- 0.9 % NaCl is 154 mmol/L, giving 286.4 mOsm/L. Urea adds 100.
- **Osmolarity 386.4 mOsm/L: hyperosmotic.**
- **Effective osmolarity 286.4 mOsm/L: isotonic**, because urea crosses membranes.
- Osmotic pressure 996.5 kPa (9.835 atm, 7475 mmHg); from the NaCl alone 738.7 kPa.

## Tips

- Osmolarity is per litre of solution; osmolality is per kilogram of water. In dilute solutions they are close.
- Hydrated salts (such as CaCl₂·2H₂O) have a larger molar mass: pick the form on your bottle.
- Proteins add very little osmolarity because there are few of them, even at many grams per litre.

## FAQ

**Why is my answer different from a freezing-point osmometer?** Real solutions are not ideal. Use a measured φ, or measure osmolality directly.

**Does anything leave my device?** No. Everything is worked out in your browser.
