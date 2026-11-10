---
name: Markovnikov addition predictor
num: 1365
shelf: learn
code: L212
section: school-chemistry
title: "Markovnikov's rule predictor: HBr, HCl, HI and water adding to alkenes, with and without peroxide"
seoTitle: "Markovnikov's rule and peroxide effect predictor"
summary: "Pick an alkene (propene, but-1-ene, 2-methylpropene and more) and add HBr, HCl, HI or water with acid. See the two carbocations that could form, which is more stable and why (inductive effect and hyperconjugation), the product and its IUPAC name, and how a peroxide flips HBr to anti-Markovnikov."
status: live
ads: false
order: 1365
icon: flask
works: offline
updated: 2026-11-09
related: [carbon-chain-namer, isomer-explorer, sn1-sn2, lewis-structures]
sources:
  - "Standard organic chemistry: Markovnikov's rule, carbocation and free-radical stability (3° > 2° > 1°) from the inductive effect and hyperconjugation, and the peroxide (Kharasch) effect for HBr. Written for fibub; no textbook text, figures or exercises are used."
  - "Every alkene, reagent and peroxide combination checked against the standard textbook outcomes (for example propene + HBr → 2-bromopropane; with peroxide → 1-bromopropane; HCl unaffected by peroxide)."
flow:
  - { icon: flask, label: "Alkene" }
  - { icon: pointer, label: "Add HX" }
  - { icon: target, label: "Carbocation" }
  - { icon: check, label: "Product" }
---

## What it shows

When an unsymmetrical alkene such as propene, CH₃–CH=CH₂, adds HBr, two products are possible: 1-bromopropane or 2-bromopropane. Almost all of it is **2-bromopropane**. **Markovnikov's rule** says the H goes to the carbon of the double bond that already has more hydrogens, and the Br to the other one.

The reason is the first step. H⁺ adds to one end of the C=C and leaves a positive charge (a **carbocation**) on the other end. A **tertiary** carbocation is more stable than a **secondary**, which is more stable than a **primary**, so the reaction goes through the most stable one. This page shows both possible carbocations, counts the carbon groups and α-hydrogens that steady each one, sketches the energy profile and names the product.

With **HBr and a peroxide** the mechanism changes to free radicals: a Br• adds first, again to make the more stable radical, so Br ends on the carbon with more hydrogens. This is the **anti-Markovnikov** or peroxide effect. It works only with HBr.

It follows hydrocarbons (alkenes) and the electron-displacement effects in organic chemistry in Class 11. The [[carbon-chain-namer]] explains the names, the [[isomer-explorer]] shows the isomers you could get, and the [[sn1-sn2]] race uses the same carbocation stability in Class 12.

## How to use it

1. **Pick an alkene** and **what to add**: HBr, HCl, HI, or water with an acid catalyst (which gives an alcohol).
2. Tick **Peroxide present** to see the peroxide effect (it only matters for HBr).
3. Read the product and its name. The cards show the two possible intermediates: the green one wins.
4. The energy sketch shows why: the more stable intermediate has the lower hump.

## Worked example

**Propene + HBr.** H⁺ on carbon 1 gives CH₃–C⁺H–CH₃, a secondary carbocation with two carbon groups and 6 α-hydrogens. H⁺ on carbon 2 would give CH₃–CH₂–C⁺H₂, a primary carbocation with only 2 α-hydrogens. The secondary one forms; Br⁻ joins it: **2-bromopropane**, CH₃–CH(Br)–CH₃.

**With peroxide.** Br• adds to carbon 1, leaving the secondary radical CH₃–C•H–CH₂Br, which takes an H from HBr: **1-bromopropane**.

**2-Methylpropene + HCl** gives the tertiary cation (CH₃)₃C⁺ (9 α-hydrogens) and so **2-chloro-2-methylpropane**.

## Check yourself

Three questions with fresh alkenes: the Markovnikov product, the peroxide product, and the most stable carbocation. Nothing is saved.

## FAQ

**Why only HBr for the peroxide effect?** For HCl one radical step needs too much energy (the H–Cl bond is strong), and for HI the I• radical is too weak to add to the double bond.

**Does the rule apply to symmetrical alkenes?** Both ends give the same cation, so there is just one product.

**Is this from my textbook?** It covers the standard school topic with its own examples and pictures. It is an independent study aid, not part of NCERT.
