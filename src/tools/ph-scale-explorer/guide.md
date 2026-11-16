---
name: pH scale explorer
num: 1083
shelf: learn
code: L38
section: school-chemistry
title: "pH scale explorer: household substances, indicator colours, pH = −log[H⁺] and dilution"
summary: "Drag along the pH scale or tap a household substance and see whether it is acidic or basic, its H⁺ concentration and the colour of litmus, phenolphthalein, methyl orange, turmeric and universal indicator. Add water and watch the pH move towards 7. Ends with fresh practice questions."
status: live
ads: false
order: 1083
icon: flask
works: offline
updated: 2026-11-16
related: [titration-curve, concentration-converter, equilibrium-solver]
sources:
  - "pH = −log[H⁺], Kw = 1.0 × 10⁻¹⁴ at 25 °C and the indicator colour-change ranges (litmus about 4.5 to 8.3, phenolphthalein 8.2 to 10, methyl orange 3.1 to 4.4, turmeric about 7.4 to 8.6): general chemistry facts, as in IUPAC and standard handbook tables, rounded."
  - "pH values of household substances are rounded, typical values written for fibub (general knowledge); real samples vary."
flow:
  - { icon: pointer, label: "Drag" }
  - { icon: flask, label: "Substance" }
  - { icon: eye, label: "Indicators" }
  - { icon: check, label: "Practise" }
---

## What it does

The pH scale tells you how acidic or basic a solution is, from 0 (very acidic) through 7 (neutral) to 14 (very basic). This page lets you move along the scale and see what changes.

- **Drag the pointer** along the coloured scale, use the slider, or tap a substance such as lemon juice, milk, soap or drain cleaner. Each substance has a rounded, typical pH.
- The page says whether the solution is acidic, neutral or basic, how much hydrogen ion (H⁺) it holds in mol/L, and how many times more or less H⁺ that is than pure water.
- **Indicator colours** show what litmus (blue and red), phenolphthalein, methyl orange, turmeric and universal indicator would look like at that pH.
- **Add water** dilutes the solution 10, 100, 1 000 or more times and shows the new pH.
- **Solve my numbers** takes the numbers from your question. Say what you know (pH, pOH, [H⁺], [OH⁻], the concentration of a strong acid or base, or a weak acid or base with its Ka or Kb) and the page gives pH, pOH, [H⁺] and [OH⁻] with the working written out. Concentrations can be in mol/L or mmol/L, and "Ca(OH)₂ gives 2 OH⁻" is a box you can change. Five example buttons fill it in.
- The **Level** switch adds the Class 11 details: [OH⁻], pOH, the ionic product of water Kw and the colour-change range of each indicator.

It follows Class 10 Science (acids, bases and salts: indicators, the pH scale, how strong acid and base solutions are, pH in everyday life) and Class 11 Chemistry (equilibrium: ionisation of water, the pH scale, pH = −log[H⁺]). Next, see how pH changes during a titration in the [[titration-curve]], or turn grams into molarity with the [[concentration-converter]].

## How to use it

1. Tap a substance, or drag along the scale.
2. Read the result and the formula line, which shows the sum with your numbers.
3. Look at the indicator colours. Try the same substance with different indicators.
4. Choose a dilution in **Add water** and see where the pH ends up.
5. Answer the **Check yourself** questions; **New questions** gives a fresh set.

## Worked example: lemon juice

Tap **Lemon juice** (typical pH 2.2). The page reads "pH 2.2: strongly acidic".

- [H⁺] = 10⁻²·² = 0.00631 mol/L, so pH = −log(0.00631) = 2.2.
- That is about 63 000 (6.31 × 10⁴) times more H⁺ than pure water, which has 10⁻⁷ mol/L.
- Blue litmus turns red, methyl orange is red, phenolphthalein stays colourless, turmeric stays yellow and universal indicator is red.

Now dilute it 100 times. The H⁺ concentration falls 100 times, so the pH goes up by log 100 = 2, to 4.2. Dilute it 10 million times and the pH ends near 7 but stays just below it: once the acid is very dilute, the H⁺ that water makes on its own matters more than the acid's.

## Worked example: 0.005 M calcium hydroxide

In **Solve my numbers** choose "concentration of a strong base", type 0.005 and set 2 OH⁻ per formula unit. [OH⁻] = 2 × 0.005 = 0.01 mol/L, pOH = −log(0.01) = 2, so pH = 14 − 2 = 12. A weak acid works the same way with one more box: 0.1 M ethanoic acid with Ka = 1.8 × 10⁻⁵ gives [H⁺] = 0.00133 mol/L and pH 2.88. The page uses the full quadratic, and tells you when the quick √(Ka × C) shortcut would have been off by more than 5 %.

## Common mistakes

- Reading the question's pOH as a pH. Check which one is given.
- Forgetting that Ca(OH)₂ and Ba(OH)₂ release 2 OH⁻, and that H₂SO₄ is counted as 2 H⁺ in school problems.
- Using −log(concentration) for a very dilute acid (below about 10⁻⁶ M). Water adds its own 10⁻⁷ mol/L, so a 10⁻⁸ M acid is pH 6.98, not 8. The page handles this and says so.
- Mixing mmol/L and mol/L. Use the unit box.

## Why each step is ten times

pH is a logarithm. Going from pH 3 to pH 2 means ten times more H⁺; from 3 to 1 means a hundred times more. That is why a small change in pH, such as in your mouth after sugary food (tooth enamel starts to dissolve below about 5.5) or in soil for crops, can make a big difference.

## Tips

- Phenolphthalein is the indicator to use when you want to see a base: it is colourless in acids and neutral solutions.
- Turmeric (haldi) stains turn reddish-brown with soap because soap solution is basic.
- At 25 °C, pH + pOH = 14. At other temperatures water's Kw changes and neutral is not exactly 7.

## FAQ

**How do I calculate pH from concentration?** For a strong acid, pH = −log of its H⁺ concentration in mol/L (0.01 M HCl gives pH 2); for a strong base find pOH = −log[OH⁻] and use pH = 14 − pOH.

**What if the numbers I type make no sense?** A zero, negative or missing value gets a plain message, never NaN.

**Are the substance values exact?** No. They are rounded, typical values. Real lemons, soft drinks and soaps vary.

**Why does dilution never make an acid basic?** Adding water adds equal amounts of H⁺ and OH⁻, so it can only bring the pH towards 7.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
