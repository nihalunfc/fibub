---
title: "The pH scale explained: acids, bases, indicators and dilution"
summary: "What pH really measures, why each step is ten times, what five school indicators look like, and why adding water never turns an acid basic."
tools: [ph-scale-explorer, titration-curve, concentration-converter, equilibrium-solver]
updated: 2026-11-10
sources:
  - "pH = −log[H⁺], Kw = 1.0 × 10⁻¹⁴ at 25 °C, pH + pOH = 14 and the usual colour-change ranges of litmus, phenolphthalein, methyl orange and turmeric: standard chemistry facts."
  - "Household pH values in the tool are rounded, typical values; real samples vary."
---

The pH scale explorer lets you slide along the scale from 0 to 14, or tap an everyday substance, and see at once how acidic it is, how much hydrogen ion it holds and what colour five common indicators would turn. It suits Class 10 students meeting acids and bases for the first time, Class 11 students working with logarithms and Kw, and anyone who wonders why a tiny pH change can matter so much. When you are ready to see pH change while one solution is added to another, open the [[titration-curve]]; to turn grams into mol/L first, use the [[concentration-converter]]; and for weak acids that only partly ionise, try the [[equilibrium-solver]].

## What it is

Water always holds a few hydrogen ions (H⁺) and hydroxide ions (OH⁻). Acids add H⁺; bases add OH⁻. pH is a short way to write how much H⁺ there is:

pH = −log[H⁺]

Here [H⁺] means the concentration of hydrogen ions in moles per litre (mol/L), and log is the base-10 logarithm. Because of the minus sign, more H⁺ gives a smaller pH.

The logarithm is the key idea. One pH unit is a factor of ten. A solution at pH 3 holds ten times more H⁺ than one at pH 4,.

At 25 °C, the two ions are tied together by the ionic product of water:

[H⁺][OH⁻] = Kw = 1.0 × 10⁻¹⁴

so pOH (the same idea for OH⁻) is simply 14 − pH. Pure water has equal amounts of each, 10⁻⁷ mol/L, which is why neutral is pH 7.

**Indicators** are dyes that change colour over a certain pH range. Litmus flips between red and blue, methyl orange changes in strong acid, phenolphthalein turns pink only in bases, turmeric goes reddish-brown in bases, and universal indicator has a colour for every pH.

## How to use it

1. Pick **Class 10** or **Class 11** at the top. Class 11 adds [OH⁻], pOH, the Kw line and each indicator's change range.
2. Set a pH: drag the pointer on the coloured bar, move the slider (steps of 0.1), use the arrow keys on the bar, or tap a substance button such as Vinegar or Soap solution.
3. Read the headline (for example "pH 2.8: strongly acidic"), the [H⁺] value and how it compares with pure water. The formula line shows −log[H⁺] with your number.
4. Look at the **Indicator colours** card: six swatches for blue litmus, red litmus, phenolphthalein, methyl orange, turmeric and universal indicator.
5. In **Add water**, choose a dilution from 10 times up to 10 million times and read the new pH.
6. Try the **Check yourself** questions, and press **New questions** for another set.

## A worked example

Tap **Vinegar**, which the tool treats as a typical pH of 2.8.

- [H⁺] = 10⁻²·⁸ = 0.00158 mol/L.
- Pure water has 10⁻⁷ mol/L, so vinegar holds 10⁽⁷ ⁻ ²·⁸⁾ = 10⁴·² ≈ 1.58 × 10⁴ times more H⁺, nearly sixteen thousand times.
- Colours: blue litmus turns red, methyl orange is red, phenolphthalein stays colourless, turmeric stays yellow, and universal indicator shows orange (2.8 rounds to 3).

Now dilute it **100 times**. [H⁺] drops a hundredfold, so pH rises by log 100 = 2, to **4.80**.

Dilute it **100 000 times** instead. Simple arithmetic would say 2.8 + 5 = 7.8, which is basic. That is impossible: you only added water. The tool gives **6.97**, just below 7, because at such low acid levels the 10⁻⁷ mol/L of H⁺ from water itself takes over.

Bases behave the same way from the other side. Soap solution at pH 10 has [OH⁻] = 10⁻⁴ mol/L and pOH 4. Dilute it 1 000 times and the simple answer is exactly 7, but the tool shows **7.21**, still slightly basic.

## Where it is used

- **Gardening and farming.** Many crops grow best in soil between about pH 6 and 7.5. A soil test result of 5 means ten times more H⁺ than 6, which explains why lime is added in large amounts.
- **Swimming pools and aquariums.** Keepers hold the water in a narrow band, because a drift of one unit is a tenfold change for the fish or the chlorine.
- **Food and cooking.** Pickling relies on low pH to stop bacteria; baking soda is basic and reacts with acidic ingredients to make gas.
- **The lab.** Choosing an indicator for a titration means matching its change range to the pH where the reaction finishes.

## Common mistakes

- **Reading pH as a straight scale.** pH 4 is not "twice as acidic" as pH 8 in any sense; it has ten thousand times more H⁺. Always think in powers of ten.
- **Thinking dilution can cross 7.** Water adds equal amounts of H⁺ and OH⁻, so it only pulls the pH towards neutral. Use the 10 million times option to see the limit.
- **Using phenolphthalein to spot an acid.** It is colourless in both acids and neutral water, so it cannot tell them apart. Use blue litmus or methyl orange.
- **Treating substance values as exact.** The buttons give rounded typical values. A real lemon or soap may differ by half a unit or more.
- **Forgetting temperature.** pH + pOH = 14 holds at 25 °C. Kw changes with temperature, so hot pure water is neutral below pH 7.

## Questions people ask

**Can pH go below 0 or above 14?** Yes, for very concentrated strong acids or bases. The tool stays between 0 and 14, the range used in school.

**Why does blue litmus look purple near neutral?** Litmus changes gradually. Between about 4.5 and 8.3 it sits between red and blue, so it looks purplish.

**Is a weak acid the same as a dilute acid?** No. "Weak" means it only partly splits into ions; "dilute" means there is little of it in the water. The dilution card treats the solution as a strong acid or base.

