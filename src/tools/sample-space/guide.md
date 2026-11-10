---
name: Sample space builder
num: 1165
shelf: learn
code: L82
section: school-maths
title: "Sample space builder: probability with dice, coins and cards"
summary: "See every outcome of two dice, a few coins or a deck of cards, shade an event and get its probability as a fraction. Then run the experiment thousands of times and watch the share of hits settle near it."
status: live
ads: false
order: 1165
icon: target
works: offline
updated: 2026-11-09
related: [combinatorics-calculator, distribution-explorer, grouped-data-stats]
sources:
  - "Classical probability (favourable outcomes over equally likely outcomes) and relative frequency are standard school mathematics. Written for fibub; the simulation uses the public-domain mulberry32 generator."
  - "Checked against counts done separately in Python with itertools.product: two dice (sum 7 = 6/36, sum at least 10 = 6/36, prime sum = 15/36, even product = 27/36), three coins (exactly one head = 3/8) and the 52-card deck (26 red, 12 face, 6 red face cards)."
flow:
  - { icon: sliders, label: "Experiment" }
  - { icon: table, label: "Outcomes" }
  - { icon: percent, label: "P(E)" }
  - { icon: chart, label: "Simulate" }
---

## What it does

Probability at school starts from one idea: when every outcome is **equally likely**, the probability of an event is

**P(E) = number of outcomes in the event / total number of outcomes.**

The hard part is listing the outcomes without missing any or counting one twice. This page lists them for you. Pick two dice, one to three coins or a full deck of 52 cards, choose an event, and every outcome appears in a grid with the ones in the event shaded. The probability is shown as a fraction, in its simplest form and as a decimal, together with the chance that the event does **not** happen.

The second card does the experiment at random, 100, 1 000 or 10 000 times, and draws how the share of hits (the **relative frequency**) changes as the trials pile up. That is the *experimental* probability of the Class 9 chapter; the shaded count is the *theoretical* (classical) probability of Class 10, and Class 11 puts the two side by side. The page lets you see them meet.

To count outcomes when listing them is too long, try [[combinatorics-calculator]]. When the outcomes are numbers, [[distribution-explorer]] shows the whole spread of chances, and [[grouped-data-stats]] summarises real data you collect.

## How to use it

1. Choose **Two dice**, **Coins** or **A deck of cards**.
2. Pick an event from the list. Some events take a number, such as "the sum is k" or "exactly k heads"; type it in the **Number** box.
3. For coins, choose how many (1, 2 or 3).
4. Read P(E) under the grid. Shaded cells are the favourable outcomes.
5. Press **100 times**, **1 000 times** or **10 000 times**. The blue line is the running relative frequency; the dashed line is the probability.

## A worked example

Two dice are thrown. What is the probability that the sum is 7?

- There are 6 × 6 = 36 equally likely outcomes, from (1, 1) to (6, 6).
- The sum is 7 for (1, 6), (2, 5), (3, 4), (4, 3), (5, 2) and (6, 1): 6 outcomes, one diagonal of the grid.
- P(sum 7) = 6/36 = 1/6 ≈ 0.1667, and P(sum not 7) = 30/36 = 5/6.

Run it 10 000 times and the relative frequency usually lands within about 0.01 of 0.1667. With only 100 throws it can easily be 0.12 or 0.22.

## Tips

- (2, 5) and (5, 2) are different outcomes. Think of one red die and one blue die.
- P(E) is always between 0 (impossible) and 1 (certain), and P(E) + P(not E) = 1.
- More trials do not force the frequency to equal the probability; they only make big gaps rarer.

## Check yourself

Four fresh questions each time: a dice sum, a number of heads, a card event and a "does not happen" question. Fractions such as 1/6 are accepted. Nothing is saved.

## FAQ

**Why is a sum of 7 the most likely?** It has the most ways to happen: six, one for each value of the first die.

**Is this from the NCERT book?** It covers the same topics with fibub's own examples. fibub is not part of NCERT.
