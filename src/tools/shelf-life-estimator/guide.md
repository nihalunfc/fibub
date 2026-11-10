---
name: Shelf life
num: 392
shelf: science
code: T280
section: food-science
title: "Shelf life"
summary: "Work out shelf life at another storage temperature with a Q10, fit Q10 and the Arrhenius activation energy to two or more accelerated shelf-life tests, and get water activity from equilibrium relative humidity or a Norrish-type equation. For study and planning. Nothing is uploaded."
status: live
ads: false
order: 392
icon: clock
works: offline
updated: 2026-11-09
related: [recipe-nutrition-calculator, reaction-kinetics-fitter, psychrometric-calculator, colligative-properties]
sources:
  - "General formulas: Q10 shelf-life relation t2 = t1 / Q10^((T2 − T1)/10); the Arrhenius equation k = A·exp(−Ea/RT) with shelf life proportional to 1/k; water activity = ERH/100; the Norrish-type equation aw = xw·exp(−K·xs²) with K entered by the user. Gas constant from CODATA."
  - "Checked against scipy.stats.linregress on the example (fitted Q10, Ea, R² and predictions at 5 and 20 °C) and an independent Python calculation of the Norrish equation."
  - "The example test results and solution are made up for this tool. No product data or published constants are included."
flow:
  - { icon: clock, label: "Shelf life" }
  - { icon: table, label: "Test points" }
  - { icon: curve, label: "Fit Q10, Ea" }
  - { icon: percent, label: "Water act." }
---

## What it does

Food spoils faster when it is warm. This page does three related sums for planning shelf-life studies and for coursework:

- **Shelf life at another temperature** from a known shelf life and a Q10, the factor by which spoilage speeds up for every 10 °C rise: shelf life at T2 = shelf life at T1 ÷ Q10^((T2 − T1)/10). A table shows the result from 0 to 50 °C.
- **Fit Q10 and the activation energy** from accelerated tests: store the product at two or more raised temperatures, find when it fails at each, and paste the results. The page fits two models to ln(shelf life): a straight line against temperature (the Q10 model) and a straight line against 1/T in kelvin (the Arrhenius model, which gives the activation energy Ea). It then predicts the shelf life at the temperature you choose with both.
- **Water activity** (a<sub>w</sub>), the part of a food's water that is free for microbes and reactions. It equals the equilibrium relative humidity (ERH) divided by 100. For a sugar or salt solution you can also estimate it with a Norrish-type equation, a<sub>w</sub> = x<sub>w</sub>·exp(−K·x<sub>s</sub>²), where x are mole fractions and K is a constant for the solute that you enter from your own reference. With K = 0 it is Raoult's law.

For heat treatment of the same product, use the [[thermal-process-calculator|thermal processing F-value calculator]]; to write it into a food safety plan, the [[haccp-plan-builder]].

## How to use it

1. Type a known shelf life, its temperature, a Q10 and the new temperature. The time unit is only a label.
2. Paste test results, one per line: temperature in °C, then shelf life. Set the temperature to predict at.
3. For water activity, type a measured ERH, or the masses of water and solute, the solute's molar mass and K.

## Worked example

Press **Use the example**. A shelf life of 180 days at 25 °C with a Q10 of 2.5 becomes **1125 days at 5 °C**, because 20 °C cooler means 2.5² = 6.25 times slower.

The made-up tests are 180 days at 25 °C, 75 days at 35 °C and 32 days at 45 °C. The fitted Q10 is 2.37 (R² 0.9999) and the activation energy is 68.1 kJ/mol (R² 0.9999). At 20 °C the Q10 model predicts 276 days and the Arrhenius model 289 days; they part because the Q10 implied by Ea grows as it gets colder (2.51 near 20 °C).

For water activity, an ERH of 85 % is a<sub>w</sub> 0.850. 60 g of a solute of molar mass 342.3 g/mol in 100 g water, with K = 0, gives a<sub>w</sub> 0.9694.

## Tips

- Extrapolate as little as you can. A change in what limits shelf life (for example fat oxidation at high temperature but mould at low) breaks both models.
- Use the same failure test at every temperature.
- Rough general guide: most bacteria need a<sub>w</sub> above about 0.9, most moulds above about 0.8. Safety limits for a product come from the official source.

## FAQ

**Which model should I trust?** Over a narrow range they agree. Arrhenius has more physical basis; Q10 is simpler and common in industry. Check both against a real storage test.

**Can I use this to set a use-by date?** No. It is for study and planning, not a substitute for professional judgement and real tests on the product.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
