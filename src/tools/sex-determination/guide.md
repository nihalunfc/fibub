---
name: Sex determination
num: 1489
shelf: learn
code: L320
section: school-biology
title: "Sex determination: XX and XY chromosomes, and why each child is a 50 percent chance of a boy or a girl"
summary: "Cross an XX mother with an XY father, then simulate up to 10 000 births and families. See the share of girls settle near half and why earlier children never change the next one."
status: live
ads: false
order: 1489
icon: table
works: offline
updated: 2026-11-10
related: [mendel-peas, punnett-square]
sources:
  - "In humans a female has two X chromosomes (XX) and a male has one X and one Y (XY); the sperm decides the sex. The family-size chances are the binomial C(n, k) / 2^n, checked in the tests. This is standard school biology and probability."
  - "The simulation is a teaching model of equal numbers of X and Y sperm. Drawings are fibub's own. Nothing you do on this page is stored or sent anywhere."
flow:
  - { icon: table, label: "Cross" }
  - { icon: target, label: "Simulate" }
  - { icon: chart, label: "Compare" }
  - { icon: check, label: "Check" }
---

## What it does

In humans, sex is set by a pair of sex chromosomes. A mother has two **X** chromosomes (XX), so every egg she makes carries an X. A father has one X and one **Y** (XY), so half his sperm carry X and half carry Y. If an X sperm meets the egg the child is XX, a girl. If a Y sperm does, the child is XY, a boy.

The Punnett square shows two XX and two XY outcomes, so each child has a 50 % chance of being a girl. The simulator then makes thousands of births to show that overall the share lands near half, while small families vary a lot. To see the same method with other traits, try [[mendel-peas]] and [[punnett-square]].

## How to use it

1. Read the cross at the top.
2. Choose how many **births** to simulate and how many **children per family**.
3. Press **Simulate births** and read the bar chart and the totals.
4. Press it again with fewer births to see how much a small sample jumps about.

## What each setting does

- **Births**: how many children are made. More births land closer to 50 %.
- **Children per family**: groups the births into families and shows how many girls each family has.
- **Class 11**: draws the exact chances, C(n, k) / 2^n, as black lines over the bars.

## Worked example

For 3 children per family there are 8 equally likely patterns, so 3 girls has chance 1/8 = 12.5 % and 1 girl has 3/8 = 37.5 %. Simulate 10 000 births and the bars sit close to those values. The girls overall come to about 5 000.

## FAQs

**Does the mother decide?** No. Every egg carries an X, so the sperm decides.

**After three girls, is a boy "due"?** No. Each child is a fresh 50 : 50 chance.

**Why is it not exactly half?** Chance. A sample of 10 000 is usually within about a percentage point of half, but rarely exact.
