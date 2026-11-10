---
name: Esterification
num: 1298
shelf: learn
section: school-chemistry
title: "Esterification"
summary: "Pick a carboxylic acid and an alcohol and join them: see the OH and H leave as water, and get the ester's name, formula, molar mass and smell. Split it again with sodium hydroxide, and at Class 11–12 level work out how much ester forms at equilibrium."
status: live
ads: false
order: 1298
icon: flask
works: offline
updated: 2026-11-09
related: [carbon-chain-namer, isomer-explorer, le-chatelier, soap-micelle]
sources:
  - "Esterification, the naming of esters (alkyl alkanoate), saponification and the ¹⁸O labelling result are standard school chemistry. The equilibrium constant K ≈ 4 for ethanoic acid and ethanol is a round classroom value. The smells are common kitchen-chemistry descriptions; smell is subjective. Written for fibub."
  - "Formulas checked by hand (ethyl ethanoate C₄H₈O₂ = 88, pentyl ethanoate C₇H₁₄O₂ = 130, methyl benzoate C₈H₈O₂ = 136) and for all 30 pairs acid + alcohol = ester + water by mass; the equilibrium checked against sympy.solve (1 : 1 gives 2/3 mol; 1 : 3 gives 0.9028 mol)."
flow:
  - { icon: flask, label: "Acid" }
  - { icon: link, label: "Join" }
  - { icon: pencil, label: "Name" }
  - { icon: check, label: "Practise" }
---

## What it does

A **carboxylic acid** and an **alcohol**, warmed with a few drops of concentrated sulfuric acid, join to make an **ester** and water. Esters often smell sweet and fruity, which is why they are used in flavours and perfumes. This page shows the reaction:

- pick one of five acids (methanoic, ethanoic, propanoic, butanoic, benzoic) and one of six alcohols,
- the picture marks the **OH of the acid** and the **H of the alcohol** that leave as water; **Join them** draws the ester with its new C–O bond,
- you get the ester's **name**, condensed and molecular **formula**, **molar mass** and **smell**,
- **Split with NaOH** runs it backwards (saponification), the reaction that turns fats into soap,
- at the **Class 11–12** level, a calculator finds how much ester there is at **equilibrium** from the amounts of acid, alcohol and water and the constant K.

It follows the Class 10 chapter on **carbon and its compounds** (esterification and saponification), Class 12 carboxylic acids, and Class 11 chemical equilibrium.

Name the acid and alcohol themselves with the [[carbon-chain-namer]]; esters with the same formula as acids are functional isomers in the [[isomer-explorer]], and pushing an equilibrium one way is explored in [[le-chatelier]].

## How to use it

1. Choose the **Acid** and the **Alcohol**. The boxed atoms are the ones that leave as water.
2. Press **Join them**. Read the equation, how the name is built, the formula and the smell.
3. Press **Split with NaOH** to see the salt and alcohol you get back. **Start again** returns to the beginning.
4. Switch to **Class 11–12** and type the moles of acid, alcohol and any water at the start, and K.

## A worked example

**Ethanoic acid + ethanol**: CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O. The alcohol gives the first part of the name (ethyl) and the acid the second (ethanoic acid → ethanoate): **ethyl ethanoate**, C₄H₈O₂, 60 + 46 − 18 = **88 g/mol**. It smells sweet, like nail-polish remover.

**At equilibrium** with 1 mol of each and K = 4: x² ÷ (1 − x)² = 4, so x ÷ (1 − x) = 2 and x = 2/3 mol, a **66.7 %** yield. With 3 mol of ethanol instead, x = 0.903 mol, a 90.3 % yield: an excess of one reactant pushes the equilibrium towards the ester.

**Ethanoic acid + pentan-1-ol** gives pentyl ethanoate, which smells of banana.

## Tips

- In an ester name, the part ending in -yl comes from the alcohol and the part ending in -oate from the acid.
- An ester and a carboxylic acid can share a formula: ethyl ethanoate and butanoic acid are both C₄H₈O₂.
- The sulfuric acid is a catalyst; it is not part of the equation.

## Check yourself

Four fresh questions each time: name an ester, its molar mass, and two equilibrium amounts. Nothing is saved.

## FAQ

**Can I make esters at home?** No: concentrated sulfuric acid is dangerous. In school this is done by a teacher, often in a fume cupboard.

**Is this from the NCERT book?** It covers the same topic with fibub's own drawings and examples. fibub is not part of NCERT.
