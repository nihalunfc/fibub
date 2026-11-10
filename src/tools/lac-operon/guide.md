---
name: lac operon switch
num: 1447
shelf: learn
section: school-biology
title: "lac operon: how lactose switches genes on, repressor and operator, i⁻ and Oᶜ mutants, CAP and glucose"
summary: "Add or remove lactose and watch the repressor leave or grip the operator, and RNA polymerase copy (or not) the z, y and a genes. Try bacteria with no repressor or a faulty operator, add glucose and CAP as an extension, and follow a culture that eats glucose first and then switches on the lac genes."
status: live
ads: false
order: 1447
icon: eye
works: offline
updated: 2026-11-09
related: [central-dogma, meselson-stahl, enzyme-activity, genetic-circuit-designer]
sources:
  - "The lac operon of E. coli (Jacob and Monod), its repressor, operator, promoter and structural genes, the i⁻ and Oᶜ mutants and catabolite activation by CAP-cAMP are standard biology."
  - "The time course is a teaching model with made-up rate constants, not data from any experiment. It was checked in the tests against scipy solve_ivp. Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: pointer, label: "Sugars" }
  - { icon: eye, label: "Repressor" }
  - { icon: check, label: "Genes on?" }
  - { icon: chart, label: "Over time" }
---

## What it does

Bacteria make the enzymes for digesting lactose only when lactose is around. The genes for those enzymes sit together with their switch in one unit, the **lac operon**:

- **i**, the regulator gene, makes a **repressor** protein all the time.
- **p**, the promoter, is where RNA polymerase binds to start copying.
- **o**, the operator, is where the repressor binds; sitting there, it blocks RNA polymerase.
- **z, y, a** are the structural genes: β-galactosidase (splits lactose), permease (lets lactose in) and transacetylase.

Tap **Lactose** to add it. A little lactose becomes **allolactose**, the inducer, which binds the repressor, changes its shape and makes it fall off the operator. RNA polymerase can now copy z, y and a into one mRNA, and the enzymes are made. Remove the lactose and the repressor goes back. This is **negative regulation**.

- **Mutants.** An **i⁻** bacterium makes no repressor, and an **Oᶜ** bacterium has an operator the repressor cannot hold. Both have their genes on all the time.
- **With CAP (extension).** Bacteria prefer glucose. When glucose is scarce, a signal molecule (cAMP) builds up and, with the CAP protein, helps RNA polymerase bind. So the genes are on strongly only with lactose present **and** glucose absent.
- **A culture over time.** Give the bacteria both sugars. With CAP switched on, they use the glucose first; only then does the enzyme rise and the lactose disappear. Once the lactose is gone the repressor returns and the enzyme fades as the cells grow and divide.

This fits **Class 12 Biology: molecular basis of inheritance** (regulation of gene expression, the lac operon). See how a gene becomes a protein in the [[central-dogma]] tool and how enzymes work in [[enzyme-activity]]; to draw designed gene circuits with repressors, use the [[genetic-circuit-designer]].

## How to use it

1. Tap **Lactose** on and off and read what happens.
2. Pick a bacterium: **Normal**, **i⁻** or **Oᶜ**.
3. Choose **With CAP** to see the glucose effect; a **Glucose** button appears.
4. In the second card, set the starting glucose and lactose and read the time course.
5. Try the **Check yourself** questions.

## Worked example

Normal bacterium, no lactose: the repressor sits on the operator and the genes are off. Add lactose: allolactose holds the repressor off and the page shows mRNA and the three enzymes. Pick i⁻ and remove the lactose: the genes stay on, because there is no repressor to switch them off.

Time course with CAP, 2 mM glucose and 2 mM lactose: the glucose is used up at about 116 minutes; only then does the enzyme climb, peaking at about 1.55 units near 169 minutes, and the lactose is gone at about 176 minutes. Without CAP (Class 12 level) the lac genes switch on at once and the lactose is gone by about 68 minutes, glucose or not.

## Tips

- The operon is "inducible": off by default, switched on by the substance it deals with.
- The repressor is made all the time; lactose does not stop it being made, it stops it binding.
- The z, y and a genes are copied as one mRNA: one switch, three enzymes.

## FAQ

**Are the numbers real?** No. The rates in the time course are made up to show the shape of what happens, not real measurements.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
