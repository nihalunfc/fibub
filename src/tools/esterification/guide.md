---
name: Esterification
num: 1298
shelf: learn
section: school-chemistry
title: "Esterification: acid + alcohol makes a sweet-smelling ester and water"
summary: "Pick a carboxylic acid (methanoic to butanoic) and an alcohol (methanol to octan-1-ol), press React and watch the –OH of the acid and the H of the alcohol leave as water while the rest joins into an ester. Get its name, formula, molar mass and smell, and work out the limiting reagent, the theoretical mass and the equilibrium amount from the masses you use."
status: live
ads: false
order: 1298
icon: flask
works: offline
updated: 2026-11-09
related: [carbon-chain-namer, soap-micelle, le-chatelier, isomer-explorer]
sources:
  - "Esterification, ester naming (alkyl alkanoate), and the usual descriptions of ester smells are general chemistry knowledge, written for fibub. Molar masses use IUPAC standard atomic weights."
  - "The equilibrium constant K ≈ 4 is the classic textbook value for ethanoic acid + ethanol, used for every pair here as an approximation. Equilibrium amounts checked against Python numpy.roots; 1 mol + 1 mol gives the textbook 2/3 mol."
flow:
  - { icon: pointer, label: "Acid" }
  - { icon: pointer, label: "Alcohol" }
  - { icon: flask, label: "React" }
  - { icon: calculator, label: "Amounts" }
---

## What it does

When a carboxylic acid is warmed with an alcohol and a few drops of concentrated sulfuric acid, the two join up and give off water. The new compound is an **ester**, and many esters smell sweet and fruity: they are part of the smell of bananas, pineapples and pears, and they are used in perfumes and flavourings. The reaction is called **esterification**:

**acid + alcohol ⇌ ester + water**

This page lets you choose the acid (methanoic, ethanoic, propanoic or butanoic acid) and the alcohol (methanol, ethanol, propan-1-ol, butan-1-ol, pentan-1-ol or octan-1-ol). Press **React** and the picture shows the –OH from the acid and the H from the alcohol leaving as a water molecule, while the rest joins through a –COO– link. You get:

- the **name** (alcohol part first, ending in -yl; then the acid part, ending in -oate),
- the condensed and molecular **formula** and the **molar mass**,
- the **smell**, as it is commonly described,
- the balanced **equation**.

A second card works out **how much ester** you can make from the masses of acid and alcohol you use: the moles of each, the **limiting reagent**, the **theoretical mass**, and the smaller **equilibrium amount**, because the reaction is reversible.

It fits the Class 10 science chapter on carbon and its compounds (ethanoic acid and esterification) and the Class 12 chapter on aldehydes, ketones and carboxylic acids. The names of the acid and alcohol come from [[carbon-chain-namer]]; boiling an ester with an alkali gives soap, which cleans as shown in [[soap-micelle]]; and why the reaction stops part-way is explored in [[le-chatelier]].

## How to use it

1. Pick the acid and the alcohol. The masses below change to 0.1 mol of each.
2. Press **React**. **Back to the start** shows the two molecules again.
3. Read the name, formula, molar mass and smell.
4. Change the masses in **How much ester?** and read the steps.

## A worked example

Ethanoic acid (CH₃COOH) and ethanol (C₂H₅OH) give **ethyl ethanoate**, CH₃COOC₂H₅ (C₄H₈O₂, 88.11 g/mol), which smells sweet, like nail-polish remover.

With 6 g of acid (0.0999 mol) and 4.6 g of ethanol (0.0998 mol), ethanol is just the limiting reagent. At most 0.0998 mol = 8.80 g of ester could form. At equilibrium, with K ≈ 4, you get about two thirds of that: about 5.87 g.

## Tips

- Name the ester from the alcohol first: ethanol + methanoic acid gives ethyl methanoate, not methyl ethanoate.
- Using more of the cheaper reagent (usually the alcohol) pushes the equilibrium towards more ester.
- The reverse reaction, ester + sodium hydroxide → alcohol + sodium salt of the acid, is called saponification: it is how soap is made from oils and fats.

## Check yourself

Three fresh questions each time: name an ester, its molar mass, and the most ester a given amount of acid can make. Nothing is saved.

## FAQ

**Are the smells exact?** They are the common descriptions. Real smells depend on how much there is and on the person; many esters simply smell "fruity".

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
