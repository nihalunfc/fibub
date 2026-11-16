---
name: Limiting reagent
num: 2236
shelf: learn
code: L336
section: school-chemistry
title: "Limiting reagent: moles, theoretical yield and leftover"
summary: "Choose a reaction, set the grams of each reactant and see which one runs out first, the most product you can make and how much of the other reactant is left over, with a bar for each reactant."
status: live
ads: false
order: 2236
icon: flask
works: offline
updated: 2026-11-16
related: [mole-bridge, equation-balancer, molar-mass-calculator]
sources:
  - "Stoichiometry and the limiting reagent are standard chemistry (NGSS HS-PS1-7). Molar masses are rounded standard atomic weights (H 1.008, C 12.011, N 14.007, O 15.999, Mg 24.305 g/mol). Checked on a hand-worked example in tests/sci.mjs. Pictures are fibub's own."
flow:
  - { icon: sliders, label: "Grams" }
  - { icon: calculator, label: "Moles" }
  - { icon: flask, label: "Limiting" }
  - { icon: check, label: "Quiz" }
---

## What it does

A recipe for sandwiches needs two slices of bread and one slice of cheese. With 10 slices of bread and 20 slices of cheese you can make only 5 sandwiches: the bread runs out first. A chemical reaction works the same way. The reactant that runs out first is the **limiting reagent**, and it decides the most product you can get, the **theoretical yield**.

Pick a reaction, set the grams of each reactant, and the page turns grams into moles, divides by the coefficients in the balanced equation, and shows two bars. The shorter bar is the limiting reagent. It also gives the grams of product and the grams of the other reactant left over. For the steps before and after, use [[mole-bridge]] and [[equation-balancer]], and [[molar-mass-calculator]] for any other formula.

## How to use it

1. Choose a reaction from the menu, or "My own reaction" to type the formulas and coefficients from your homework.
2. Type the amount of each reactant (or use the slider) and pick its unit: g, mg, kg or mol.
3. Read the sentence at the top: which reactant runs out and the most product.
4. Open **Show the working** for the exam-style steps: molar masses, moles, divide by the coefficients, theoretical yield and leftover.
5. Under **More options**, type the actual yield you collected to get the percent yield, or switch to rounded school masses (H 1, C 12, O 16).
6. Answer the quiz questions, which use new amounts each time.

## What each setting does

- **Reaction:** ten ready-made balanced equations (water, ammonia, methane, propane, magnesium, aluminium, iron and sulfur, zinc, limestone, sodium) or your own. Where a reaction has several products, a menu lets you choose which one to find.
- **Amounts of A and B:** how much of each reactant you start with, in g, mg, kg or mol. Typing a number and sliding it stay in step.
- **Actual yield:** optional. The percent yield is actual ÷ theoretical × 100.
- **Rounded school masses:** uses whole-number atomic masses where books do (H 1, O 16, Cl 35.5) so your answer matches the book. By default exact atomic weights are used.
- **Bars:** how many "batches" of the reaction each reactant could supply.

## Worked example

Take 2 H₂ + O₂ → 2 H₂O with 4 g of H₂ and 32 g of O₂. That is 1.984 mol of H₂ (divide by 2 to get 0.992 batches) and 1.000 mol of O₂ (1.000 batches). H₂ runs out first and makes 1.984 mol of water, 35.7 g. About 0.26 g of O₂ is left over.

## Common mistakes

- Comparing the grams of the two reactants. The one with fewer grams is not necessarily the limiting one: compare moles divided by coefficients.
- Forgetting the coefficient. In 2 H₂ + O₂ the hydrogen moles are divided by 2.
- Finding the yield from the reactant that is in excess. Always use the limiting reagent.
- Mixing mg, g and kg. Pick the unit in the box next to the number.

## FAQs

**How do I find the limiting reagent?** Turn each mass into moles, divide each by its coefficient in the balanced equation, and the smaller result is the limiting reagent.


**Why divide by the coefficient?** The coefficient is how many moles one batch of the reaction uses.

**Is the biggest mass always in excess?** No. Compare moles divided by coefficients, not grams.

**Is the yield always achieved in a real lab?** Real yields are lower. Percent yield compares what you actually got with this theoretical amount.
