---
title: Probability
seoTitle: 'Probability for the GMAT: rules and worked examples'
summary: 'Probability as favourable over possible, "and" and "or" rules, independent and dependent events, drawing without replacement, the "at least one" shortcut, and probabilities from combinations, with a simulation that converges.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: A die is rolled twice. What is the probability of two sixes?
    choices: ['1/36', '1/6', '1/12']
    ans: 0
    why: 'Independent events multiply: 1/6 × 1/6 = 1/36.'
  - q: What is the probability of at least one head in 3 coin tosses?
    choices: ['7/8', '3/8', '1/2']
    ans: 0
    why: '1 − P(no heads) = 1 − 1/8 = 7/8.'
  - q: 'P(A) = 0.3, P(B) = 0.5 and A and B cannot both happen. P(A or B) = ?'
    choices: ['0.8', '0.15', '0.65']
    ans: 0
    why: 'Mutually exclusive events add: 0.3 + 0.5 = 0.8.'
sources:
  - 'OpenStax, Introductory Statistics 2e (CC BY 4.0), chapter 3 Probability topics: https://openstax.org/books/introductory-statistics-2e/pages/3-introduction'
  - 'fibub, Statistics for analysts: Probability rules with pictures: https://fibub.com/learn/courses/statistics/probability-rules/'
---

**Module 5 · about 16 minutes.** By the end you will solve GMAT probability questions with three rules and one shortcut.

<div class="bigidea">Probability = favourable outcomes ÷ all equally likely outcomes. "And" usually means multiply, "or" usually means add, and "at least one" means 1 minus "none".</div>

## 1. The basic idea

P(event) = number of favourable outcomes ÷ number of equally likely outcomes. A probability is always between 0 (impossible) and 1 (certain), and P(not A) = 1 − P(A).

## 2. "And": multiply

For **independent** events (one does not affect the other, such as two coin tosses), P(A and B) = P(A) × P(B).

For **dependent** events (drawing without putting back), multiply by the probability of the second **given the first happened**.

<div class="steps" data-title="Worked example: 4 red and 6 blue marbles; draw 2 without replacement. P(both red)?">
<div class="step">First red: 4/10.</div>
<div class="step">Now 3 red are left out of 9: second red is 3/9.</div>
<div class="step">P = 4/10 × 3/9 = 12/90 = <b>2/15</b>.</div>
</div>

<figure class="fig" data-fig="prob-sim"><figcaption>Press Play to draw two marbles thousands of times. The share of draws where both are red settles on the exact probability (dashed line).</figcaption></figure>

<div class="problem" data-problem="pb-g01"></div>

## 3. "Or": add, minus the overlap

P(A or B) = P(A) + P(B) − P(A and B). If A and B cannot both happen (mutually exclusive), the overlap is 0 and you just add. This is the same idea as overlapping sets in Lesson 4.5.

## 4. "At least one": use the complement

Counting all the ways to get at least one success is slow. Count the one way to get none, and subtract from 1.

P(at least one six in 3 rolls) = 1 − (5/6)³ = 1 − 125/216 = 91/216.

<div class="problem" data-problem="pb-g02"></div>

<div class="myth">

**"Three rolls, each with a 1/6 chance, gives 3/6 = 1/2."** Adding probabilities of events that can happen together double-counts. With 7 rolls the same mistake would give 7/6, more than certain. Use 1 − P(none).

</div>

## 5. Probability with combinations

When several items are picked at once, count favourable groups and all groups with combinations (Lesson 5.3).

P(exactly 1 man when 3 people are picked from 4 men and 5 women) = C(4, 1) × C(5, 2) ÷ C(9, 3) = 4 × 10 ÷ 84 = 10/21.

<div class="problem" data-problem="pb-g03"></div>

<div class="keypoints">

- P = favourable ÷ equally likely outcomes; P(not A) = 1 − P(A).
- Independent "and": multiply. Without replacement: adjust the second probability.
- "Or": P(A) + P(B) − P(A and B).
- "At least one" = 1 − P(none).
- Groups picked together: use combinations for favourable and total.

</div>

**Try it:** Change the three probabilities and light up each event.

<figure class="fig" data-fig="@tp-prob-tree"><figcaption>Multiply down a path, add across paths; A given B is one leaf divided by the total of B's leaves.</figcaption></figure>

## Practise: GMAT-style questions on this lesson

Each set is new every time: the numbers change, so you can practise as often as you like. They start easy and get harder. Answer, check, then read the full solution and the trap note.

<div class="qbank" data-bank="grad-quant" data-topics="probability" data-exam="gmat" data-mode="practice" data-n="10"></div>

