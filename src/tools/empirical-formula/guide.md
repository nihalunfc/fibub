---
name: Empirical formula
num: 2263
shelf: learn
code: L349
section: school-chemistry
title: "Empirical formula calculator: from masses or percentages"
summary: "Enter the masses or percentages of two to four elements and follow every step to the empirical formula, then use Mr for the molecular formula, or run a magnesium oxide burning experiment to get your own data."
status: live
ads: false
order: 2263
icon: flask
works: offline
updated: 2026-11-16
related: [mole-bridge, molar-mass-calculator, formula-writer]
sources:
  - "Standard atomic masses (IUPAC, rounded: H 1.008, C 12.011, O 15.999, Mg 24.305, Fe 55.845). The method is the standard moles, divide by smallest, whole-number ratio method. Serves GCSE chemistry C3, Ontario SCH3U quantities in chemical reactions and NGSS HS-PS1-7. Maths in src/lib/learn/curr-chem.ts, checked in tests/curr-chem.mjs. Drawings are fibub's own."
flow:
  - { icon: flask, label: "Amounts" }
  - { icon: calculator, label: "Moles" }
  - { icon: percent, label: "Ratio" }
  - { icon: check, label: "Quiz" }
---

## What it does

An empirical formula is the simplest whole-number ratio of the atoms in a compound. You cannot count atoms, but you can weigh each element. Dividing each mass by its atomic mass gives moles, and the ratio of moles is the ratio of atoms. This page does that for 2, 3 or 4 elements, from masses in grams or from percentages, and shows every step in a table.

If the ratios are not whole numbers after dividing by the smallest, the page applies the multiplier rule: 1.5 means multiply by 2, 1.33 or 1.67 by 3, 1.25 or 1.75 by 4. Add the relative formula mass Mr to get the molecular formula too. You can also run the magnesium oxide experiment and send its data to the calculator. For the next steps, use [[mole-bridge]], [[molar-mass-calculator]] and [[formula-writer]].

## How to use it

1. Choose an example, or choose the number of elements and the unit.
2. Pick each element and type its mass or percentage.
3. Read the table: moles, divide by the smallest, multiply if needed, whole numbers.
4. Type Mr to get the molecular formula.
5. For the experiment, choose the mass of magnesium, burn it, read the balance and press Use these numbers.

## What each setting does

- **Grams or percent:** percentages work like grams in a 100 g sample.
- **Divide by smallest:** the smallest number of moles becomes 1.
- **Multiplier:** the smallest of 1 to 6 that makes every ratio whole, within about 0.1.
- **Mr:** divides by the empirical formula mass to find n, the number of empirical units in a molecule.

## Worked example

A compound is 40 % carbon, 6.7 % hydrogen and 53.3 % oxygen. Moles: C 40 ÷ 12.011 = 3.33, H 6.7 ÷ 1.008 = 6.65, O 53.3 ÷ 15.999 = 3.33. Divide by 3.33: C 1, H 2, O 1. The empirical formula is CH₂O with a formula mass of 30.03. If Mr = 180, then n = 180 ÷ 30.03 = 6 and the molecular formula is C₆H₁₂O₆.

## FAQs

**Why is the magnesium oxide result sometimes not exactly 1 : 1?** A balance reading to 0.01 g and a little smoke escaping make the oxygen slightly low or high. A ratio within about 0.1 of 1 is still MgO.

**Is the empirical formula the same as the molecular formula?** Sometimes. Ethane, C₂H₆, has empirical formula CH₃, but water, H₂O, is the same in both.

**Can I use percentages that do not add to 100?** Yes, as long as each is a share of the same sample.
