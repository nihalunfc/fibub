---
name: IUPAC namer
num: 1104
shelf: learn
code: L49
section: school-chemistry
title: "IUPAC namer"
summary: "Build a carbon chain of up to 10 carbons, tap carbons to add methyl and ethyl branches, add a double or triple bond and one functional group (–OH, –CHO, C=O, –COOH, –Cl, –Br). Get the IUPAC name with each step explained, the molecular formula and the homologous series, and test yourself on new structures."
status: live
ads: false
order: 1104
icon: pencil
works: offline
updated: 2026-11-16
related: [lewis-structures, unsaturation-calculator, molar-mass-calculator]
sources:
  - "Atomic weights used for molar masses: C 12.011, H 1.008, O 15.999, Cl 35.45, Br 79.904 (IUPAC conventional values, checked 2026-11-16). Numbers of structural alkane isomers C1 to C10 (1, 1, 1, 2, 3, 5, 9, 18, 35, 75) are a standard result of organic chemistry. Degrees of unsaturation = (2C + 2 − H) ÷ 2."
  - "IUPAC nomenclature rules for open-chain compounds as taught in school: the principal chain holds the principal group and the multiple bond and is then the longest (the 1993 recommendations' order; the 2013 recommendations choose the longest chain first), lowest locants, alphabetical prefixes, seniority acid > aldehyde > ketone > alcohol, locants placed before the suffix (but-2-ene, propan-2-ol). Written fresh for fibub."
  - "Checked against 34 standard IUPAC names of simple compounds, including ones where the longest chain runs through a drawn branch (3-methylhexane, 2-ethylpent-1-ene) and ones with a group and a double bond (but-3-en-2-ol, but-2-enal); molecular formulas checked by counting atoms."
flow:
  - { icon: pencil, label: "Build" }
  - { icon: pointer, label: "Branches" }
  - { icon: book, label: "Name" }
  - { icon: check, label: "Check" }
---

## What it does

Organic compounds have names that tell you their structure, if you know the rules. This page lets you **build** a molecule and watch its **IUPAC name** change as you go. Use **−** and **+** to set how many carbons are in the chain, choose a double or triple bond and a functional group, and (in Class 11 mode) **tap a carbon** in the drawing to hang a methyl or ethyl branch on it. The name appears at once with the steps that build it, the molecular formula, and the family (homologous series) it belongs to.

The blue numbers and thick bonds show the chain the name is based on. Often it is not the chain you drew: put an ethyl near the end of a chain and the longest chain runs through the branch.

It follows Class 10 Science (carbon and its compounds: saturated and unsaturated compounds, homologous series, nomenclature with functional groups) and Class 11 Chemistry (organic chemistry basics: IUPAC nomenclature). Use **Class 10** for straight chains only. To see the electron dots of the bonds, open the [[lewis-structures]] tool; to check a formula's rings and double bonds use the [[unsaturation-calculator]]; for the molar mass of the formula, the [[molar-mass-calculator]].

## How to use it

1. Set **Carbons in the chain** (1 to 10).
2. Choose a **Multiple bond** and where it goes, if you want one.
3. Choose a **Functional group** and the carbon it sits on. –CHO and –COOH can only be at an end; a ketone C=O must be inside the chain.
4. In Class 11 mode, tap a carbon to cycle its branches: methyl, ethyl, two methyls, none.
5. Read the name, the formula, the series and **How the name is built**. The **Homologous series** table lists the first members of the same family.
6. Try **Check yourself**: pick the right name for three new structures.

## Worked example

Start with 5 carbons (pentane, C₅H₁₂). Tap carbon 2 twice to give it an **ethyl** branch. The longest chain is now 6 carbons, through the branch, so the root is "hex-". Number from the end nearer the branch: the methyl left over sits on carbon 3. The name is **3-methylhexane**, formula C₇H₁₆, an alkane (CₙH₂ₙ₊₂).

Now reset, keep 5 carbons, choose **Alcohol –OH** on carbon 4 and tap carbon 2 once for a methyl. The –OH must get the lowest number, so the chain is numbered from the other end: –OH on carbon 2, methyl on carbon 4. The name is **4-methylpentan-2-ol** (C₆H₁₄O).

## Name it from the numbers

The card at the top works without drawing. Choose **Name and formula of a chain**: type the carbons (1 to 10), pick the family (alkane, alkene, alkyne, alcohol, aldehyde, ketone, carboxylic acid, chloro- or bromoalkane), the position of the bond or group, and, if you like, a methyl or ethyl branch on a carbon. You get the IUPAC name, formula, family and molar mass in one sentence, with the naming steps below it. For an alkane it also tells you how many structural isomers that formula has (C₄H₁₀ has 2, C₅H₁₂ has 3, C₆H₁₄ has 5).

Choose **Family from a formula** and type C, H and optionally O. It works out the degrees of unsaturation, (2C + 2 − H) ÷ 2, and says which families fit: C₄H₈ is an alkene (or a ring), C₃H₆O an aldehyde or ketone, C₂H₄O₂ a carboxylic acid or ester. Impossible formulas, such as an odd number of hydrogens on a hydrocarbon, give a friendly message. Five name presets and three formula presets fill it in.

Common mistakes: numbering from the wrong end, and choosing a chain that is not the longest one through the branch.

## Rules the tool follows

- **Choose the chain**: it must hold the principal group and the double or triple bond; then the longest; then the one with most branches.
- **Number it** so the principal group gets the lowest number, then the multiple bond, then the branches.
- **Suffixes**: –oic acid > –al > –one > –ol. Chloro and bromo are always prefixes.
- **Prefixes** go in alphabetical order (ethyl before methyl); di-, tri- don't count.

## FAQ

**What is the IUPAC name of my molecule?** Describe it in the card at the top or draw it in the builder, and the name appears with the steps.

**Why "propene" and not "prop-1-ene"?** When there is only one place a group or bond can be, school books leave the number out (ethanol, propanone, propanal). With branches, the number is always given.

**Is this an NCERT tool?** No. It is a free fibub page made for these chapters; it runs on your device.
