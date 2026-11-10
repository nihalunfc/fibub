---
title: "Listeria inactivation at mild heat with oregano oil: D- and z-values"
summary: "A 2025 study found that a carvacrol-rich fraction of Mexican oregano oil made mild heat kill Listeria monocytogenes far faster in a meat-like broth. Here is how to fit D and z values yourself."
tools: [thermal-process-calculator, curve-fitter, haccp-plan-builder]
updated: 2026-11-10
sources:
  - "Pimentel-González M, Possas A, Valero A, Sánchez-García E, Rodríguez-Rodríguez J, Castillo S (2025), Applied Sciences 15(11): 6164, CC BY, the paper described here."
  - "Log-linear (Bigelow) inactivation, D-value and z-value: standard food microbiology formulas. Weibull model with a shape parameter: Mafart et al. (2002), International Journal of Food Microbiology 72: 107-113. Method only."
paper:
  title: "Inactivation Kinetics of Listeria monocytogenes Applying Mild Temperatures and Fractionated Mexican Oregano Essential Oil (Poliomintha longiflora Gray) in a Modified Simulated Meat Medium"
  authors: "Pimentel-González M, Possas A, Valero A, Sánchez-García E, Rodríguez-Rodríguez J, Castillo S"
  journal: "Applied Sciences"
  year: 2025
  doi: "10.3390/app15116164"
  url: "https://www.mdpi.com/2076-3417/15/11/6164"
  licence: "CC BY"
  reviewed: true
---

*Listeria monocytogenes* is the bacterium behind listeriosis, a rare but serious illness often linked to ready-to-eat meats. Heat kills it, but strong heat also spoils texture and flavour. A 2025 paper in Applied Sciences tested whether a small dose of oregano essential oil lets milder heat do the job. In a broth made to resemble meat, one fraction of the oil, rich in carvacrol and thymol, gave up to about 5.5 log reductions (a 300,000-fold drop) within 3 minutes at 57.5 °C, against under 2 logs with heat alone. The [[thermal-process-calculator|F-value calculator]] fits the same kind of D- and z-values to your own survivor counts, and the [[curve-fitter]] handles curves that bend.

## What they found

The team heated one outbreak strain of *L. monocytogenes* at 52, 54, 57.5 and 63 °C, with no oil, with the whole oil, or with a fraction of it called FIV, each at 0.06 % by volume. The oils made the bacteria die much faster at every temperature. The time for the first tenfold drop at 52 °C, for example, fell from about 8.5 minutes without oil to about 0.6 minutes with FIV.

The z-value, the rise in temperature that makes killing ten times faster, barely moved: the authors report 5.75 °C without oil, 5.20 °C with the whole oil and 5.00 °C with FIV. So the oil did not change how the bacteria respond to heat; it simply added killing power on top. The survival curves bent and flattened with time, a pattern called tailing, which suggests some cells resist better than others.

## Why it matters

Ready-to-eat products such as cooked ham are often given a short heat treatment after packing to kill any *Listeria* picked up during slicing. If a natural antimicrobial lets that step run cooler or shorter, the food may keep a better texture and use less energy. The tailing matters for safety too: a straight-line model that ignores it can promise more killing than really happens at long times.

## How they did it

1. The oil from *Poliomintha longiflora*, a Mexican oregano, was split into fractions; FIV was about 60 % carvacrol and 21 % thymol.
2. Tubes of a meat-like broth with the oil were brought to temperature in a water bath, then the bacteria were added.
3. Samples were taken over up to 30 minutes, diluted, spread on Oxford agar (which selects for *Listeria*) and counted after 48 hours at 37 °C.
4. Two models were fitted to each survival curve: the classic straight line on a log scale (the Bigelow model, which gives a D-value), and a Weibull model with a shape parameter. The Weibull model fitted better, with a shape parameter below 1 in every case, meaning a curve that flattens.
5. The temperature effect was then fitted across the four temperatures to give the z-values.

## Check it yourself with fibub

The [[thermal-process-calculator|F-value calculator]] fits the straight-line (log-linear) model. Here is a worked example with **our own made-up numbers**, not the paper's data.

**D-value at one temperature.** Paste these invented counts per mL at 57.5 °C, one line per sample, into **D-value from survivor counts**: 0, 2e7; 1, 6.5e6; 2, 1.8e6; 3, 6.0e5; 4, 1.7e5; 5, 6.0e4. The tool fits a line to log₁₀(count) against time and reports **D = 1.96 min**, the time for each tenfold drop, with R² = 0.9994 and 2.55 log reductions seen over 5 minutes.

Now try a tailing curve: 0, 2e7; 1, 1.5e6; 2, 4.0e5; 3, 1.6e5; 4, 8.0e4; 5, 5.0e4. D comes out almost the same, 2.03 min, but R² drops to 0.9086 and the plot shows the points bowing away from the line: fast deaths early, then a stubborn tail. That is the sign to fit a Weibull model instead. In the [[curve-fitter]] you can type your own formula, such as log₁₀ N = a − (t/δ)^p, and get δ and p with their uncertainties.

**z-value across temperatures.** In **z-value from D-values**, paste these invented pairs: 52, 9.0; 54, 4.5; 57.5, 1.0; 63, 0.11. The tool gives **z = 5.69 °C** with R² = 0.9994, close in size to the paper's values. Set the reference temperature at the top to 57.5 °C and the tool reads back D at 57.5 °C from the line: 1.02 min.

**F for a target kill.** In **F needed for a log reduction**, enter D = 1.02 min, a starting count of 1e5 and a count wanted of 1. The answer is F = 5.10 min at 57.5 °C, for 5 log reductions.

**F from a heating curve.** Keep the reference at 57.5 °C and z at 5.69 °C, and paste a product's core temperatures every 2 minutes: 20, 40, 52, 56, 58, 58, 58, 50, 35 °C. The general method adds up the lethal rate over time and gives F = 8.75 min, or 8.58 log reductions with D = 1.02 min. Most of it comes from the minutes near 58 °C.

To write the step into a food safety plan, record the critical limit and monitoring in the [[haccp-plan-builder]].

## The fine print

- One strain was tested, in broth rather than real meat. Fat and protein in food can shield bacteria and soak up oil compounds.
- Only one oil dose was used, chosen low enough that survivors could still be counted, and each temperature had two independent runs.
- The paper did not measure taste or texture, so whether 0.06 % oregano oil is acceptable in a product is still open.
- Our worked examples are invented. The calculator is for study and checking sums; a commercial heat process must be set and validated by a qualified process authority under the rules where the food is sold.
