---
name: Buffer recipe calculator
num: 113
shelf: science
section: biochemistry
title: "Buffer recipe calculator: Henderson–Hasselbalch with temperature-adjusted pKa (Tris, HEPES, phosphate, MES and more)"
summary: "Choose a buffer, pH, concentration and volume, and get a recipe: grams to weigh and mL of NaOH or HCl to add, or how much of two forms to mix. Solves the full charge balance with pKa adjusted for temperature and ionic strength, and shows buffer capacity, species and the pH at the temperature you will use it."
status: live
ads: true
order: 2
icon: flask
works: offline
updated: 2026-11-08
related: [solution-calculator, titration-curve, equilibrium-solver, pcr-master-mix, enzyme-kinetics-fitter]
sources:
  - "Henderson–Hasselbalch, charge balance and buffer capacity: standard acid–base chemistry."
  - "pKa values and their change with temperature: rounded, approximate values (±0.05) of the kind printed in general chemistry and biochemistry references, not copied from any one table."
  - "Activity corrections: the Davies equation, with a rounded straight-line Debye–Hückel constant."
  - "Water ionisation (pKw) against temperature: rounded values, interpolated."
  - "Molar masses: worked out by fibub from each formula and IUPAC standard atomic weights."
flow:
  - { icon: flask, label: "Buffer" }
  - { icon: sliders, label: "pH and mM" }
  - { icon: calculator, label: "Recipe" }
  - { icon: chart, label: "Species" }
---

## What it does

A buffer holds the pH steady because it contains a weak acid and its conjugate base in balance. The **Henderson–Hasselbalch** equation, pH = pKa + log([base]/[acid]), gives that balance for one pair. This tool goes further. It solves the full charge balance over every pKa of the buffer, so citrate and phosphate with three pKa values come out right, and so do very dilute or very concentrated buffers.

It also makes the corrections that a simple calculator skips:

- **Temperature.** Each pKa moves with temperature. Tris drops about 0.03 per °C, so a Tris buffer set to pH 8.0 at room temperature reads near pH 8.6 in a cold room.
- **Ionic strength.** Charged species are less active in salty solutions, which shifts the apparent pKa (pKa′). Phosphate's pKa of 7.2 becomes about 6.8 in a 100 mM buffer. The Davies equation handles this up to about 0.5 M ionic strength.
- **Counter-ions.** The sodium or chloride that comes with each salt, the added NaOH or HCl and any extra NaCl all count towards the ionic strength.

## How to use it

1. Choose the buffer, target pH, concentration (the total of all forms) and final volume.
2. Enter the temperature at which you will set the pH. Enter the temperature you will use it at too, to see how far the pH drifts.
3. Choose a recipe:
   - **Weigh one form, then add strong acid or base.** You get grams of the form and mL of NaOH or HCl. Pick the strength of the acid or base you have.
   - **Mix two forms.** You get grams of each form, for example the two sodium phosphates. No acid or base is needed. If the pH is outside what the pair can reach, the tool says so.
4. Follow the numbered steps. Always finish with a calibrated pH meter, because real pKa values vary with the batch, the exact salt and the meter.

The capacity β tells you how many mM of strong acid or base it takes to shift the pH by one unit. A buffer works best within about one unit of its pKa′.

## Worked example

**Tris, 50 mM, pH 8.0 at 25 °C, 1 L.** Weigh 6.057 g of Tris base and add about 28.4 mL of 1 M HCl. The apparent pKa at this ionic strength (28 mM) is 8.12. The same buffer reads **pH 8.63 at 4 °C**, so make it in the cold room if that is where you will use it.

**Sodium phosphate, 100 mM, pH 7.4, 1 L, two forms.** Mix 2.425 g of anhydrous NaH₂PO₄ with 11.33 g of anhydrous Na₂HPO₄, a 20 : 80 ratio. The ionic strength is about 260 mM, and the apparent pKa is 6.80 rather than 7.2. A plain Henderson–Hasselbalch sum with pKa 7.2 would give a 39 : 61 ratio, which reads close to pH 7.0, not 7.4.

## Questions

**Why does my measured pH differ from the target?** The pKa values here are rounded, your salts may hold different amounts of water, and electrodes read concentrated or cold solutions with some error. Treat the recipe as a starting point and adjust with the meter.

**Can I use KOH or a potassium salt?** Yes. The amounts of acid or base are the same. Only the masses change if you weigh a potassium salt instead of a sodium salt.

**Which buffer should I pick?** Choose one with a pKa within about 0.5 of your pH at the working temperature, which does not bind metals or react with your system. For example, avoid phosphate with calcium, and avoid Tris with amine-reactive labels.

**Is anything sent anywhere?** No. Everything is worked out in your browser, and the page works offline once loaded.
