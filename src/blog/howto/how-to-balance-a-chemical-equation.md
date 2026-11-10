---
title: "How to balance a chemical equation (with a worked example)"
summary: "Put numbers in front of each formula until every element has the same count on both sides. A method you can do by hand, a worked aluminium example and a mass check."
tools: [equation-balancer, molar-mass-calculator, mole-bridge]
updated: 2026-11-10
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
  - "Law of conservation of mass (Lavoisier): standard school chemistry."
---

To balance a chemical equation, write a whole number in front of each formula so that every element appears the same number of times on the left and on the right. Never change the small numbers inside a formula. The [[equation-balancer]] finds those numbers for you, shows an atom count for each side, and can then tell you which reactant runs out first.

## What you need

- **The word equation or the formulas** of everything that reacts and everything that forms. If you only know the names, write each formula first (the [[formula-writer]] helps with valencies).
- **Correct capitals.** Co is cobalt, CO is carbon monoxide. A computer, and your teacher, read them differently.
- **Optional: masses in grams**, if the question also asks how much product you can make.

## Step by step

Atoms are never made or destroyed in a reaction, so each element must be counted equally on both sides. The numbers you place in front of formulas are called **coefficients**. A coefficient multiplies every atom in that formula: 3H₂O means 6 hydrogen atoms and 3 oxygen atoms.

The rule you are satisfying, for every element X, is:

**atoms of X on the left = atoms of X on the right**

By hand, a reliable order is:

1. Start with the formula that has the most atoms or the most different elements.
2. Balance elements that appear in only one substance on each side first.
3. Leave lone elements such as Al, O₂ or H₂ until the end, because changing them upsets nothing else.
4. If you are stuck with an odd number against a pair (like 3 H against H₂), double everything.
5. Make sure the coefficients cannot be divided by a common number. 4, 2, 2 should be 2, 1, 1.

With the tool:

1. Type the reaction in the **Reaction** box, using + between substances and -> (or =) between the two sides. Any coefficients or state symbols like (aq) that you type are ignored, so you can paste an unbalanced equation straight from a worksheet.
2. Read the balanced equation in large type under the box.
3. Look at the table below it. Each row is one element with its count on the left, its count on the right and a tick when they match. For ions, a Charge row is added.
4. If you want amounts too, scroll to **Amounts: limiting reagent and yield** and type the grams (or moles) of each reactant you start with.

## A worked example

Aluminium reacts with hydrochloric acid to give aluminium chloride and hydrogen gas:

Al + HCl → AlCl₃ + H₂

**By hand.** AlCl₃ has the most atoms, so start there. It has 3 chlorine atoms, so put 3 in front of HCl. Now there are 3 hydrogen atoms on the left, but hydrogen gas comes in pairs, so 3 cannot be matched. Double everything you have so far: 2AlCl₃ and 6HCl. Six hydrogen atoms make 3H₂. Finally, 2AlCl₃ holds 2 aluminium atoms, so write 2Al:

**2Al + 6HCl → 2AlCl₃ + 3H₂**

Typing `Al + HCl -> AlCl3 + H2` into the balancer gives the same line. The atom table shows Al 2 and 2, H 6 and 6, Cl 6 and 6, each with a tick.

**Going further.** Say you drop 5.4 g of aluminium into a solution holding 7.3 g of HCl. Type 5.4 in the Al box and 7.3 in the HCl box, both in grams.

- Aluminium: 5.4 ÷ 26.982 g/mol = 0.2001 mol.
- HCl: 7.3 ÷ 36.458 g/mol = 0.2002 mol.
- The equation needs 3 HCl for every Al. The acid could only use up 0.2002 ÷ 3 = 0.06674 mol of aluminium, so HCl runs out first. It is the **limiting reagent**.

The page agrees: it marks HCl as limiting and says at most **8.899 g of AlCl₃** and **0.2018 g of H₂** can form. Only 1.801 g of the aluminium reacts, leaving 3.599 g of metal in the beaker. If you dried and weighed 8.0 g of aluminium chloride, pick AlCl₃ under "Product you collected", type 8.0, and the percent yield reads **89.9 %**.

## Check your answer

- **Count once more, element by element.** Multiply each coefficient by each small number.
- **Check the mass.** A balanced equation also balances mass. On the left, 2 × 26.982 + 6 × 36.458 = 272.712 g. On the right, 2 × 133.332 + 3 × 2.016 = 272.712 g. Equal, as they must be. The [[molar-mass-calculator]] gives each molar mass if you do not want to add them up.
- **Look for a common factor.** If every coefficient is even, halve them all.
- **No new subscripts.** If you wrote H₃ or AlCl₂ to make things fit, you changed the substance, not the balance.

## Questions people ask

**Can I put a fraction in front of a formula?**
While working, yes: ½O₂ is a handy step. Most teachers want the final answer in whole numbers, so multiply every coefficient by 2 at the end.

**What does it mean if an element is on one side only?**
A substance is missing or a formula is wrong. Water, carbon dioxide and hydrogen gas are the ones people forget most often. The tool says so instead of giving a false answer.

**How do I turn the balanced equation into grams of product?**
Convert the starting grams to moles, use the coefficients as a mole ratio, then convert back to grams. The amounts table does all three steps, and the [[mole-bridge]] shows each step with pictures if you want to practise them separately.
