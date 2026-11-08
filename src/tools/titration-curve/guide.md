---
name: Titration curve simulator
num: 82
shelf: science
section: analytical-chemistry
title: "Titration curve simulator and end point finder: pH curves, equivalence points and indicators"
summary: "Draw the exact pH curve for strong, weak and polyprotic acids and bases, see the equivalence points and the right indicator, and find the end point of your own measured titration from its derivatives."
status: live
ads: true
order: 6
icon: flask
works: offline
updated: 2026-11-08
related: [solution-calculator, equation-balancer, molar-mass-calculator, calibration-curve, uncertainty-calculator]
flow:
  - { icon: flask, label: "Analyte" }
  - { icon: curve, label: "pH curve" }
  - { icon: target, label: "End point" }
---

## What it does

In an acid–base titration you add a base from a burette to an acid in a flask, or the other way round, until exactly enough has been added to react with all of it: the **equivalence point**. This tool works out the whole pH curve and helps with real measurements.

- **Exact pH curves.** At every volume, the pH comes from solving the charge balance of the solution exactly, with no "buffer" or "weak acid" shortcuts. That way the start, the buffer region, the jump and the excess all come out right, including dilute solutions and fairly strong weak acids.
- **Any acid or base**: strong, weak, or with up to four pKa values (phosphoric acid, citric acid, carbonate). It comes with presets, or you can type your own pKa values.
- **Key points**: starting pH, the half-way points (where pH ≈ pKa), each equivalence point and its pH, and the excess.
- **Indicators** whose colour change falls within 0.5 % of the equivalence point, with the error each one gives.
- **End point of your own curve.** Paste volume and pH readings. The tool finds the steepest point (the peak of ΔpH/ΔV, placed where the second derivative crosses zero), and from it the analyte's concentration and an estimate of the pKa.

## How to use it

1. Choose what is in the flask, or "Your own pKa values" for anything else. Strong acids are titrated with NaOH and bases with HCl.
2. Enter the concentrations and the flask volume. The curve, the key points and the indicators update as you type.
3. To analyse a real titration, paste your readings into the second box. Readings at 0.1 to 0.2 mL steps near the jump give the sharpest end point.

## Worked example

Take 25.00 mL of 0.100 mol/L acetic acid (pKa 4.76) titrated with 0.100 mol/L NaOH.

- **Start:** a weak acid on its own, pH 2.88.
- **Half-way, 12.50 mL:** equal amounts of acetic acid and acetate, so pH = pKa = 4.76.
- **Equivalence, 25.00 mL:** only sodium acetate is left in 50 mL. Acetate is a weak base, so the pH is 8.73, not 7.
- **Indicator:** phenolphthalein (pH 8.2–10.0) changes right on the equivalence point. Methyl orange would change far too early.

For hydrochloric acid instead, the equivalence pH is exactly 7.00 and almost any indicator from methyl red to phenolphthalein works, because the jump runs from about pH 4 to 10. Ammonia titrated with HCl ends at pH 5.28, so methyl red is the indicator to use.

## Questions

**Why are some curves calculated a little differently in my textbook?** Textbooks use approximations, such as ignoring water's own ions or the acid's dissociation in the buffer region. The exact charge balance agrees with them where they hold and is better where they don't. The model does not include activity coefficients, which matter in strong salt solutions, or temperature (it is set at 25 °C, Kw = 1.0 × 10⁻¹⁴).

**Why does phosphoric acid show only two jumps?** The third proton (pKa 12.35) is too weak to give a jump in water: the pH barely rises above what the excess NaOH makes on its own.

**Is my data sent anywhere?** No. Everything is calculated in your browser.
