---
name: Probability spinner designer
num: 1282
shelf: learn
section: school-maths
title: "Probability spinner designer: build a spinner, spin it 1000 times and compare with the theory"
summary: "Give up to six colours a number of equal shares and see the spinner, each colour's probability as a fraction and a percentage, and its angle. Spin once or 10, 100 or 1000 times and watch the experimental probabilities settle near the theory. Then design a spinner that meets a challenge."
status: live
ads: false
order: 1282
icon: target
works: offline
updated: 2026-11-09
related: [sample-space, probability-tree, distribution-explorer, decay-dice]
sources:
  - "Theoretical probability (favourable ÷ total equally likely outcomes), expected counts and sector angles (probability × 360°) are standard school probability, written for fibub."
  - "The random spins were checked against the theory with a chi-square test on 100 000 seeded spins (2 degrees of freedom, 99.9% critical value 13.82 from Python scipy.stats)."
flow:
  - { icon: sliders, label: "Shares" }
  - { icon: target, label: "Spin" }
  - { icon: chart, label: "Compare" }
  - { icon: check, label: "Challenge" }
---

## What it does

A spinner is a circle cut into sectors, with a pointer at the top. When every sector is the same size, each one is equally likely to stop under the pointer. Give a colour more sectors and it becomes more likely. This page lets you design the spinner yourself.

- **Design.** Give Red, Blue, Green, Yellow, Purple and Orange a number of equal shares (0 to 24). The page draws the spinner and shows each colour's **theoretical probability** as a simplified fraction and a percentage: shares of that colour ÷ all shares.
- **Spin.** Press **Spin** to watch one spin, or **10**, **100** or **1000 spins** at once. A bar chart puts the **experimental probability** (how often the colour came up ÷ number of spins) next to the theoretical one (dashed line), and a table gives the counts.
- **Challenge.** The page asks for a spinner with given probabilities, such as P(Red) = 1/2, P(Blue) = 1/4, P(Green) = 1/4. Set the shares and press **Check my spinner**.

It fits the Class 9 maths chapter on the mathematics of maybe (probability) and the Class 10 chapter on probability. All outcomes of two dice or a few coins are listed in [[sample-space]], and events that happen one after another are in [[probability-tree]].

## How to use it

1. Use **+** and **−** (or type) to set the shares. A colour with 0 shares is left off the spinner.
2. Read the probabilities next to each colour. They always add up to 1.
3. Press **Spin** a few times, then **1000 spins**. Watch the coloured bars move towards the dashed theory lines.
4. **Reset** clears the counts (so does changing the spinner).
5. In **Challenge**, find whole-number shares that give exactly the probabilities asked for. A wrong try gives a hint using the lowest common denominator.

## A worked example

The page starts with Red 2, Blue 3 and Green 1 share: 6 shares in all.

- P(Red) = 2/6 = 1/3, P(Blue) = 3/6 = 1/2, P(Green) = 1/6.
- The angles are 1/3 × 360° = 120°, 1/2 × 360° = 180° and 1/6 × 360° = 60°.
- In 600 spins you expect about 200 reds, 300 blues and 100 greens. You will rarely get exactly those numbers, but the experimental probabilities get closer to 1/3, 1/2 and 1/6 as the number of spins grows.

## Tips

- Experimental probability changes every time you run the experiment; theoretical probability does not.
- Doubling every share (Red 4, Blue 6, Green 2) gives the same spinner probabilities.
- P(not Red) = 1 − P(Red), because the pointer must land somewhere.

## Check yourself

Four fresh questions each time: a probability from sector counts, the probability of "not" a colour, the expected number of a colour in many spins, and the angle a sector needs for a given probability. Nothing is saved.

## FAQ

**Is the computer's spinner really random?** It uses the browser's random number generator, which is fine for experiments like this. The page never stores your spins.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
