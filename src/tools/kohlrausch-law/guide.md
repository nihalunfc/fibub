---
name: Kohlrausch's law
num: 1433
shelf: learn
section: school-chemistry
title: "Kohlrausch's law"
summary: "Plot molar conductivity against √c for KCl, NaCl, HCl, NaOH, MgCl₂ and other strong electrolytes, extend the straight line to find Λ°m, and see why ethanoic acid's curve cannot be extended. Then build Λ°m from ion values with Kohlrausch's law, find Λ° of a weak acid from three strong electrolytes, and get α and κ."
status: live
ads: false
order: 1433
icon: chart
works: offline
updated: 2026-11-09
related: [galvanic-cell, nernst-calculator, ph-scale-explorer, electroplating-calculator]
sources:
  - "Kohlrausch's law of independent migration, Λm = Λ°m − A√c for strong electrolytes, Ostwald's dilution law K = cα²/(1 − α) and κ = Λm c / 1000 are standard physical chemistry."
  - "Ion limiting molar conductivities at 25 °C are rounded to whole numbers (typical values found in any physical chemistry book; general facts). The slopes A (95, 200, 400 S cm² mol⁻¹ (mol/L)^−½ by charge type) are made-up teaching values. Ka of ethanoic acid and Kb of ammonia, about 1.8 × 10⁻⁵, are general facts."
  - "The maths was checked in the tests against Python (scipy brentq for α, numpy polyfit for the line). Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: flask, label: "Electrolyte" }
  - { icon: chart, label: "Λm vs √c" }
  - { icon: ruler, label: "Extrapolate" }
  - { icon: calculator, label: "Kohlrausch" }
---

## What it does

A solution conducts electricity because its ions move. **Conductivity κ** tells you how well a whole solution conducts; **molar conductivity Λm = 1000 κ / c** tells you how well each mole of dissolved electrolyte conducts. Λm changes with concentration, and how it changes tells strong and weak electrolytes apart.

- **Λm against √c.** Pick an electrolyte and a concentration. The page plots Λm against √c from 0 to 0.1 mol/L, marks six "measured" points and your concentration.
- **Strong electrolytes** (KCl, NaCl, HCl, NaOH, AgNO₃, CH₃COONa, MgCl₂) are fully ionised. Λm drops slowly as c rises, because crowded ions slow each other, and the points lie on a straight line, Λm = Λ°m − A√c. The dashed line extends it to c = 0, where it meets the axis at **Λ°m**, the limiting molar conductivity.
- **Weak electrolytes** (ethanoic acid, ammonium hydroxide) are only slightly ionised. On dilution the fraction ionised, the **degree of dissociation α**, rises steeply, so Λm shoots up near c = 0 and the curve can't be extended. The page gives α from Ostwald's law and Λm = αΛ°m.
- **Kohlrausch's law.** At infinite dilution each ion moves on its own, so Λ°m is the sum of the ions' own values: pick a cation and an anion to see it, with the right number of each ion for charges such as Mg²⁺ and SO₄²⁻.
- **Λ° of a weak electrolyte** from three strong ones: Λ°(CH₃COOH) = Λ°(HCl) + Λ°(CH₃COONa) − Λ°(NaCl).

This fits **Class 12 Chemistry: electrochemistry** (conductance of electrolytic solutions, variation of conductivity and molar conductivity with concentration, Kohlrausch's law and its uses). Next, see what makes a cell's voltage in the [[galvanic-cell]] and [[nernst-calculator]] tools; for how far weak acids ionise in terms of pH, try the [[ph-scale-explorer]].

## How to use it

1. Choose an electrolyte from the list.
2. Move the **c** slider (it runs on a log scale from 0.0001 to 0.1 mol/L).
3. Read Λm, κ and, for weak electrolytes, α; follow the working under the plot.
4. In the second card, pick any cation and anion, and switch between the two weak electrolytes.
5. Try the **Check yourself** questions.

## Worked example

KCl at 0.01 mol/L: Λm = 150 − 95 × √0.01 = 140.5 S cm² mol⁻¹, so κ = 140.5 × 0.01 / 1000 = 0.001405 S cm⁻¹. The line through the six points meets the axis at Λ°m = 150 = 74 (K⁺) + 76 (Cl⁻).

Ethanoic acid at 0.01 mol/L: from 1.8 × 10⁻⁵ = 0.01 α² / (1 − α), α = 0.0415, so only about 4 % is ionised. Λ°m = 350 + 41 = 391, and Λm = 0.0415 × 391 = 16.2 S cm² mol⁻¹. Dilute to 0.0001 mol/L and α rises to 0.344, Λm to 134.

Kohlrausch: Λ°(HCl) + Λ°(CH₃COONa) − Λ°(NaCl) = 426 + 91 − 126 = 391, the same as H⁺ + CH₃COO⁻.

## Tips

- H⁺ and OH⁻ have unusually high values because they hop along chains of water molecules instead of pushing through them.
- Λm rises on dilution for every electrolyte, but κ falls, because there are fewer ions per cm³.
- For MgCl₂ one formula unit gives one Mg²⁺ and two Cl⁻, so Λ°m = 106 + 2 × 76 = 258.

## FAQ

**Are these real measurements?** No. The ion values are rounded typical values and the slope A is a teaching value, so the curves have the right shape but are not lab data.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
