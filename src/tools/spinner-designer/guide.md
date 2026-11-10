---
name: Probability spinner designer
num: 1282
shelf: learn
code: L150
section: school-maths
title: "Probability spinner designer: sectors, angle ÷ 360°, thousands of spins and expected value"
summary: "Design a spinner with up to six coloured sectors, read each probability as angle ÷ 360°, then spin once or a thousand times and watch the share of landings settle near the theory. At Class 12 level give each sector points and find the expected score."
status: live
ads: false
order: 1282
icon: target
works: offline
updated: 2026-11-09
related: [sample-space, probability-tree, decay-dice, distribution-explorer]
sources:
  - "Geometric probability (sector angle ÷ 360°), experimental probability and expected value E(X) = Σ p·x are standard school maths. Written for fibub; spins use a seeded pseudo-random generator in the browser."
  - "Checked by hand (120°, 120°, 90°, 30° sectors with 1, 2, 5, 10 points: probabilities 1/3, 1/3, 1/4, 1/12 and expected score 3.083) and by 200 000 seeded spins landing within 1 % of each probability."
flow:
  - { icon: sliders, label: "Sectors" }
  - { icon: target, label: "Spin" }
  - { icon: chart, label: "Compare" }
  - { icon: check, label: "Practise" }
---

## What it does

A spinner is a fair way to choose at random, as long as you know how big each part is. On a spinner the chance of landing on a sector is its **angle ÷ 360°**: a 90° sector comes up a quarter of the time. This page lets you **design your own spinner** and then test it:

- set up to six sectors by their angles, and see each probability as a fraction and a decimal,
- **spin once** (with an animated pointer), or **10** or **1 000** times at once,
- compare the share of landings with the theory in a table and a bar chart, where a black mark shows each probability,
- at the **Class 12** level, give each sector a number of points and get the **expected score** per spin, E(X) = Σ P × points, next to the average your spins actually scored.

It goes with the Class 9 maths chapter on **probability** (experiments, outcomes and chance), Class 10 probability, and Class 12 random variables and expected value.

For listing every outcome of dice, coins and cards, use the [[sample-space]]; for several stages one after another, draw a [[probability-tree]]. Randomness that builds up over many trials is also behind [[decay-dice]].

## How to use it

1. Under **Design the sectors** type each sector's angle in degrees. **Add a sector** (up to six) or remove one with ×.
2. If the angles do not add up to 360°, the page still shares the circle in proportion and says so; **Fit to 360°** rounds them so they do. **Make all equal** gives a fair spinner.
3. Press **Spin once** to watch the pointer, or **Spin 10** and **Spin 1 000** to run many spins quickly. **Clear the tally** starts the count again.
4. Read **Theory against experiment**: the "Share" column and the bars are what happened; the "P (theory)" column and the black marks are what should happen in the long run.
5. Switch to **Class 12** to show a points box for each sector and the expected value.

## A worked example

The page starts with Red 120°, Blue 120°, Green 90° and Yellow 30°. The probabilities are 120/360 = 1/3, 1/3, 90/360 = 1/4 and 30/360 = 1/12, and they add up to 1.

Spin 10 times and the shares can be far off (Yellow might not come up at all). Spin 1 000 more and each share is usually within a few percentage points of its probability.

At Class 12 level the points are 1, 2, 5 and 10. The expected score is 1/3 × 1 + 1/3 × 2 + 1/4 × 5 + 1/12 × 10 = 0.333 + 0.667 + 1.25 + 0.833 = **3.083** points per spin.

## Tips

- The probability of *not* landing on a sector is 1 minus its probability: (360° − angle) ÷ 360°.
- To make a sector with probability p, give it p × 360°: 1/3 needs 120°, 2/5 needs 144°.
- Experimental probability never has to equal the theory exactly; it gets closer, on the whole, as the number of spins grows.

## Check yourself

Four fresh questions each time: probability from an angle, angle from a probability, "not" a sector, and an expected score. You can type a fraction like 1/4 or a decimal. Nothing is saved.

## FAQ

**Are the spins really random?** They come from a pseudo-random number generator in your browser, which is good enough for experiments like these. Nothing is sent anywhere.

**Is this from the NCERT book?** It covers the same topics with fibub's own spinner. fibub is not part of NCERT.
