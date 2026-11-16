---
name: Probability tree
num: 1191
shelf: learn
code: L94
section: school-maths
title: "Probability tree"
summary: "Set P(A), P(B | A) and P(B | A′) with sliders and see the tree, the four path probabilities, P(B) by total probability, P(A | B) by Bayes' theorem and an independence check. 1000 dots show the same numbers as people, which makes it clear why a positive result on a test for something rare is often a false alarm."
status: live
ads: false
order: 1191
icon: chart
works: offline
updated: 2026-11-16
related: [venn-diagram, distribution-explorer, diagnostic-test-calculator]
sources:
  - "Standard probability: the multiplication rule, the theorem of total probability, Bayes' theorem and independence. Written for fibub; no textbook text, figures or exercises are used. All story numbers are made up, and the screening example is a teaching model, not medical advice."
  - "Checked against exact fractions computed with Python's fractions module for four trees."
flow:
  - { icon: sliders, label: "Set chances" }
  - { icon: chart, label: "Tree" }
  - { icon: calculator, label: "Bayes" }
  - { icon: target, label: "1000 dots" }
---

## What it shows

Many probability questions happen in two stages: first something happens or not (event A), then something else happens or not (event B), and the chance of B depends on what happened first. A **tree diagram** shows this: two branches for A and A′, then two branches for B and B′ from each. You multiply along a path to get the chance of that path, and add paths to get the chance of an outcome.

This page draws the tree from three numbers, P(A), P(B | A) and P(B | A′), and works out:

- the four **path probabilities** P(A ∩ B), P(A ∩ B′), P(A′ ∩ B) and P(A′ ∩ B′);
- **P(B)** by the theorem of total probability;
- **P(A | B)**, the chance of A once you know B happened, by **Bayes' theorem**;
- whether A and B are **independent**.

Underneath, **1000 dots** show the same tree as people (or days, or marbles), which makes Bayes' theorem a matter of counting.

It follows probability in Class 12 maths (conditional probability, the multiplication rule, total probability, Bayes' theorem and independent events). Sets and their regions come first in the [[venn-diagram]] calculator; afterwards, the [[distribution-explorer]] covers binomial and other distributions, and the [[diagnostic-test-calculator]] applies the same idea to real test statistics.

## How to use it

1. Pick a **story** (two bags of marbles, rain and a late bus, a screening test, two coin tosses) or choose *My own names* and name the events.
2. Slide **P(A)**, **P(B | A)** and **P(B | A′)**. The tree, the facts and the dots update as you slide.
3. Read **P(A | B)** in the facts and the sentence under them.
4. In the dots, the **filled** dots are the cases where B happened. Count how many of those are blue (A as well): that fraction is P(A | B).

## Your own numbers, the working and marbles

Each chance has a box as well as a slider. Type a decimal (0.25), a percentage (25%) or a fraction (1/4), and the slider follows; something that is not a chance (2, a letter, a blank) gets a friendly message and the last good numbers stay on screen. Under the sliders, one line gives the result straight away: P(A ∩ B), P(B) and P(A | B). *Show the working* writes it out the way an exam answer does, with your numbers in: the two joint probabilities, P(B) by total probability, P(A | B) by Bayes' theorem and the independence check.

Under *More options*, **draws from a bag of marbles** turns a textbook question straight into a tree. Type the red and blue counts, tick *Put the first marble back* if the draw is with replacement, and press *Use these marbles*: A becomes "the first marble is red", B "the second marble is red", and the three chances are filled in (for 3 red and 2 blue without putting back: 3/5, 2/4 and 3/4, giving P(B) = 3/5 and P(A | B) = 1/2). With the marble put back the draws are independent, which the page says.

A new story, **two machines and a defective part**, uses made-up numbers (machine 1 makes 60 % of the parts, 2 % of its parts are defective against 3 % for machine 2) to show how to find the chance a defective part came from machine 1.

Common mistakes: confusing P(A | B) with P(B | A), and forgetting that without putting the marble back the second draw has one fewer marble.

## Worked example (a teaching model)

Suppose 1 % of people have a condition (P(A) = 0.01), a test catches 90 % of them (P(B | A) = 0.9) and wrongly flags 5 % of the rest (P(B | A′) = 0.05). Then P(A ∩ B) = 0.01 × 0.9 = **0.009** and P(A′ ∩ B) = 0.99 × 0.05 = **0.0495**, so P(B) = **0.0585**. Bayes gives P(A | B) = 0.009 / 0.0585 ≈ **0.1538**: only about 15 % of positive results are true. In dots: of 1000 people, 9 true positives and 50 false alarms, and 9 ÷ 59 ≈ 15 %. The numbers are made up for teaching and are not medical advice.

## Independence

A and B are independent when knowing A does not change the chance of B, that is P(B | A) = P(B | A′). Then P(A ∩ B) = P(A) × P(B) and P(A | B) = P(A). The coin-toss story shows this.

## Check yourself

Five questions with fresh numbers: a path probability, P(B), P(A | B), a two-bags problem and independent events. Nothing is saved.

## FAQ

**How do I find P(A | B) with Bayes' theorem?** Enter P(A), P(B | A) and P(B | A′) in the boxes; the answer line gives P(A | B) and *Show the working* writes out P(A ∩ B) / P(B) with your numbers.

**Why is P(A | B) so different from P(B | A)?** P(B | A) looks only at the A branch; P(A | B) compares the A ∩ B path with every path that ends in B, including the big A′ ∩ B path when A is rare.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid.
