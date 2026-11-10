---
name: Pedigree analyser
num: 1444
shelf: learn
code: L275
section: school-biology
title: "Pedigree analysis practice: which inheritance pattern fits, autosomal or X-linked, dominant or recessive"
summary: "Tap the people in a three-generation family tree to mark who has a trait, and see at once which inheritance patterns fit: autosomal dominant or recessive, X-linked dominant or recessive, or Y-linked. Each ruled-out pattern gives the family that breaks it, and the tree marks who must be a carrier. Made-up teaching families only."
status: live
ads: false
order: 1444
icon: table
works: offline
updated: 2026-11-09
related: [mendel-peas, punnett-square, pedigree-drawing-tool, natural-selection]
sources:
  - "Pedigree symbols and the rules of autosomal, X-linked and Y-linked inheritance with full penetrance are standard genetics. The verdicts come from trying every genotype for every person; this was checked in the tests against an independent Python brute force on 40 random families, and the one-line reasons were checked against it on 5000 more."
  - "The example families are made up for teaching and describe no real people or disorders. This is a learning tool, not genetic counselling. Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: pointer, label: "Tap family" }
  - { icon: search, label: "Test" }
  - { icon: check, label: "Fits?" }
  - { icon: eye, label: "Carriers" }
---

## What it does

A **pedigree** is a family tree that shows who has a trait. Squares are males, circles are females, filled symbols are affected, a horizontal line joins a couple and the lines below lead to their children. Reading one is like detective work: each pattern of inheritance leaves its own fingerprints.

- **The family.** Three generations: grandparents I-1 and I-2, their children II-1, II-3 and II-5, the partners who married in (II-2 and II-4), and four grandchildren. Tap anyone to mark them affected or unaffected. Switch to **Tap: boy or girl** to change the sex of a child.
- **The verdicts.** For each of five patterns (autosomal dominant, autosomal recessive, X-linked dominant, X-linked recessive, Y-linked) the page tries every possible set of genotypes, assuming one gene and that everyone who carries a dominant allele, or two recessive ones, shows the trait. A pattern **fits** if at least one set works.
- **Why not?** A ruled-out pattern names the family that breaks it, for example "II-5 is affected but neither parent is: a dominant trait cannot skip a generation".
- **Carriers.** Tap a pattern that fits and a dot appears inside everyone who must be a carrier under it. When several patterns fit, the note counts how many unrelated carriers each would need to marry in: for a rare trait, fewer is more likely.

This fits **Class 12 Biology: principles of inheritance and variation** (pedigree analysis, sex-linked inheritance, Mendelian disorders) and builds on **Class 10 Science: heredity**. Start with dominant and recessive alleles in [[mendel-peas]]; work out exact odds for any cross with the [[punnett-square]]; and to draw a real-size family tree of your own, use the [[pedigree-drawing-tool]].

## How to use it

1. Tap an example family, or mark people yourself.
2. Read the list of patterns: green ticks fit, red crosses are ruled out with a reason.
3. Tap a pattern in the list to see its carriers in the tree.
4. Change a grandchild from boy to girl and watch the X-linked verdicts change.
5. Try the **Check yourself** questions.

## Worked example

"Skips a generation": II-5 and his niece III-4 are affected, but none of their parents are. A dominant trait can't hide, so **autosomal dominant** is ruled out (II-5 is affected but neither parent is). III-4 is a girl with an unaffected father, so **X-linked recessive** is ruled out too: she would need the allele on her father's X. Only **autosomal recessive** fits, and the dots show the carriers: I-1, I-2, II-3 and II-4.

"Sons of carrier mothers": grandfather I-1 and grandson III-3 are affected. **X-linked recessive** fits, with II-3 an obligate carrier: she got her father's X. **Autosomal recessive** also fits, but it needs II-4, who married into the family, to be a carrier too, which is unlikely for a rare trait. Make III-3 a girl and X-linked recessive drops out.

## Tips

- Affected children of unaffected parents: recessive. Unaffected children of two affected parents: dominant.
- Mostly males affected, passed through unaffected daughters: think X-linked recessive.
- An affected father whose daughters are all affected and sons all unaffected: think X-linked dominant.
- Father to every son, never to daughters: Y-linked.

## FAQ

**Why can several patterns fit?** Small families often don't contain the one mating that would rule a pattern out. Real geneticists look at many families and at how rare the trait is.

**Does it handle traits that skip people who carry a dominant allele?** No. It assumes full penetrance and one gene, as school questions do.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
