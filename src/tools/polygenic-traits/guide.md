---
name: Polygenic traits
num: 1445
shelf: learn
section: school-biology
title: "Polygenic inheritance: how more genes turn a few classes into a bell curve"
summary: "Choose 1 to 6 genes with additive alleles and cross two all-heterozygous parents. See the 2n + 1 height classes and their ratio (1 : 2 : 1, 1 : 4 : 6 : 4 : 1 …) grow into a bell curve, add environmental spread to smooth it, and grow 1000 random children to compare."
status: live
ads: false
order: 1445
icon: chart
works: offline
updated: 2026-11-09
related: [mendel-peas, punnett-square, grouped-data-stats, natural-selection]
sources:
  - "The additive (polygenic) model and the binomial distribution of plus alleles are standard genetics and probability. The class probabilities and the smoothed curve were checked in the tests against scipy.stats (binom.pmf, norm.pdf)."
  - "The plant, its 100 cm base height and 5 cm per allele are made up for teaching. Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Genes" }
  - { icon: chart, label: "Classes" }
  - { icon: curve, label: "Bell curve" }
  - { icon: target, label: "Grow" }
---

## What it does

Mendel's pea plants were tall or short, with nothing in between: one gene, two clear types. Many traits are not like that. Human height and skin colour, or the colour of wheat grains, vary smoothly. That happens when **several genes add their effects together**: polygenic inheritance.

- **Genes.** Pick 1 to 6 genes. Each has a "plus" allele (capital letter) that adds 5 cm to a made-up plant's height, and a "minus" allele (small letter) that adds nothing. Both parents are heterozygous for every gene, such as AaBbCc × AaBbCc.
- **Classes and ratio.** A child can get 0 to 2n plus alleles, so there are 2n + 1 height classes. The bars show the expected share of each; darker bars have more plus alleles. With 1 gene the ratio is 1 : 2 : 1, with 2 genes 1 : 4 : 6 : 4 : 1, with 3 genes 1 : 6 : 15 : 20 : 15 : 6 : 1. The middle is common; the extremes are rare.
- **Environment.** Real plants also differ because of soil, water and light. Slide the environmental spread and each class blurs; the coloured curve shows the smooth result.
- **Grow.** Grow 1000 random children and compare your dots with the bars. Grow again to see chance at work.

This fits **Class 12 Biology: principles of inheritance and variation** (polygenic inheritance, with human skin colour as the usual example) and links to **Class 11 maths: statistics** and **Class 12 maths: probability** (the binomial distribution). Compare with the single-gene crosses in [[mendel-peas]] and the [[punnett-square]]; to work out the mean and spread of your own grouped data, use [[grouped-data-stats]].

## How to use it

1. Tap a number of genes.
2. Read the classes, the ratio, the chance of the extremes and the average.
3. Move **Env.** to add environmental spread.
4. Tap **Grow 1000 children**, more than once. **Clear** removes the dots.
5. Try the **Check yourself** questions.

## Worked example

Three genes, AaBbCc × AaBbCc. A child has 0 to 6 plus alleles, so there are 7 classes from 100 to 130 cm. The number of ways to get k plus alleles out of 6 is C(6, k), so the ratio is 1 : 6 : 15 : 20 : 15 : 6 : 1 out of 4³ = 64. The commonest height is 115 cm (3 plus alleles): 20/64 = 0.3125. Only 1 child in 64 is as short as 100 cm, and 1 in 64 as tall as 130 cm. The spread is √(3/2) × 5 = 6.12 cm.

With 6 genes there are 13 classes and the extremes are 1 in 4096: you would need thousands of children to see one. Add an environmental spread of ±3 cm and the 13 bars merge into one smooth bell curve.

## Tips

- More genes means more classes, each step smaller, and rarer extremes.
- The shape is the binomial distribution, which looks more and more like the normal (bell) curve as genes are added.
- Real polygenic traits also have alleles with different sized effects, dominance and gene-environment interaction; this page keeps the simplest additive model.

## FAQ

**Why is the middle so common?** There are many ways to get a mixture of plus and minus alleles, but only one way to get all plus or all minus.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
