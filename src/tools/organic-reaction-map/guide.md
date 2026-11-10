---
name: Organic reaction map
num: 1436
shelf: learn
code: L272
section: school-chemistry
title: "Organic reaction map: conversions between alkanes, alkenes, haloalkanes, alcohols, aldehydes, ketones, acids and amines, with a route finder"
summary: "A tappable map of 25 families of carbon compounds joined by about 60 textbook reactions, with the reagent and the name of each. Pick a start and an end and get the fewest-steps route, with an example compound at every step, other routes, and an option to keep the carbon count."
status: live
ads: false
order: 1436
icon: flask
works: offline
updated: 2026-11-09
related: [carbon-chain-namer, sn1-sn2, isomer-explorer, chirality-checker]
sources:
  - "The reactions are standard school organic chemistry (hydrocarbons, haloalkanes and haloarenes, alcohols, phenols and ethers, aldehydes, ketones and carboxylic acids, amines). The map, wording and examples are written by fibub, not copied from any textbook."
  - "The route finder is a breadth-first search. Its fewest-step distances for all 625 pairs of families, with and without the 'keep the carbon count' option and at Class 11 level, were checked against an independent Python search over the same list of reactions."
  - "Nothing you choose is stored or sent anywhere."
flow:
  - { icon: pointer, label: "From" }
  - { icon: target, label: "To" }
  - { icon: link, label: "Route" }
  - { icon: check, label: "Check" }
---

## What it does

Organic chemistry at school is a web of conversions: an alkene adds HBr to give a haloalkane, the haloalkane becomes an alcohol with aqueous KOH, the alcohol is oxidised to an aldehyde or a ketone, and so on. Exam questions then ask you to "convert A into B" in two or three steps. This map puts the whole web on one screen:

- **25 families** as boxes: alkanes, alkenes, alkynes, dihalides, 1° and 2° haloalkanes, 1°, 2° and 3° alcohols, aldehydes, ketones, ethers, Grignard reagents, carboxylic acids, esters, amides, nitriles and amines, plus benzene, chlorobenzene, nitrobenzene, aniline, the diazonium salt, phenol and an azo dye.
- **About 60 reactions** as arrows, each with its **reagent and conditions** and its name (hydration, Hoffmann bromamide degradation, Sandmeyer reaction, and so on).
- A **route finder**: choose where to start and where to end, and it gives the fewest steps, with a real example compound at each step (propan-1-ol, propene, propanone ...).

Primary, secondary and tertiary alcohols and halides are kept apart on purpose: a 1° alcohol oxidises to an aldehyde and a 2° alcohol to a ketone, so treating them as one box would give wrong answers. The map fits **Class 11 Chemistry: hydrocarbons** and **Class 12 Chemistry: haloalkanes and haloarenes; alcohols, phenols and ethers; aldehydes, ketones and carboxylic acids; amines**. To name the compounds on a route use [[carbon-chain-namer]], and to see why a haloalkane step goes fast or slow try [[sn1-sn2]].

## How to use it

1. **Pick the level.** Class 11 shows hydrocarbons, haloalkanes and the first benzene reactions; Class 12 shows everything.
2. **Choose From and To** in the boxes at the top, or tap a family on the map and press **Start here** or **End here**. The ⇄ button swaps them.
3. **Read the route.** Each step shows the change, every reagent that does it ("Or: ..."), any note (for example, a mixture of products) and an example such as *propan-1-ol, CH₃CH₂CH₂OH → propene, CH₃CH=CH₂*. Below it are up to three other routes of the same length or one step longer.
4. **Keep the same number of carbons** leaves out steps that add a carbon (KCN, Grignard with methanal or CO₂), remove one (Hoffmann, decarboxylation) or join two pieces (esters, ethers, Grignard with a ketone, coupling).
5. **On the map**, the tapped family's products have solid arrows and its starting materials dashed arrows. The route is the thick coloured line. The list under the map spells out each arrow.
6. **Check yourself** asks four fresh questions: a reagent, a product, the fewest steps between two families, and what a step does to the carbon count.

## Worked example

Convert **propan-1-ol into propanone**. You cannot oxidise a 1° alcohol to a ketone: oxidation stops at the aldehyde (PCC) or the acid (KMnO₄). The map finds **3 steps**:

1. 1° alcohol → alkene: conc. H₂SO₄ at 443 K (propan-1-ol → propene).
2. Alkene → 2° alcohol: water with dilute H₂SO₄, Markovnikov addition (propene → propan-2-ol).
3. 2° alcohol → ketone: K₂Cr₂O₇ with dilute H₂SO₄ (propan-2-ol → propanone).

Now reverse it: **ketone → aldehyde** takes 4 steps (reduce to propan-2-ol, dehydrate to propene, hydroboration–oxidation to propan-1-ol, then PCC), because hydroboration is the step that puts the –OH on the end carbon.

## Tips

- Steps that change the chain length are the ones examiners love: KCN adds a carbon, the Hoffmann reaction removes one.
- Two reagents can give opposite results from the same alkene: HBr follows Markovnikov's rule, HBr with a peroxide does not.
- The diazonium salt is the busiest box on the aromatic side: from it you can reach phenol, chlorobenzene, benzene and azo dyes.

## FAQ

**Is every possible reaction here?** No. It holds the main conversions met at school, so a real chemist may know shorter routes. The fewest steps here are the fewest *on this map*.

**Why is there no arrow from a ketone to an acid?** Ketones resist oxidation; strong oxidising agents break the carbon chain, which is beyond this map.

**Why do the examples use three carbons?** Propane derivatives are the smallest ones where 1° and 2° positions differ, so the examples stay true at every step.
