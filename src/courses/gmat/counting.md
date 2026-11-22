---
title: 'Counting: arrangements and choices'
seoTitle: 'Permutations and combinations for the GMAT, explained'
summary: 'The multiplication principle, arrangements (permutations) when order matters, choices (combinations) when it does not, repeated items, and restrictions such as people who must sit together, with a branching tree figure.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: How many ways can 4 books be arranged on a shelf?
    choices: ['24', '16', '4']
    ans: 0
    why: '4 × 3 × 2 × 1 = 4! = 24.'
  - q: How many ways can you choose 2 people from 6 for a team?
    choices: ['15', '30', '12']
    ans: 0
    why: 'Order does not matter: 6 × 5 ÷ 2 = 15.'
  - q: 'How many arrangements of the letters in ADD?'
    choices: ['3', '6', '2']
    ans: 0
    why: '3! ÷ 2! = 3: ADD, DAD, DDA.'
sources:
  - 'OpenStax, Contemporary Mathematics (CC BY 4.0), chapter 7 Probability, sections 7.1 to 7.4 (counting, permutations, combinations): https://openstax.org/books/contemporary-mathematics/pages/7-1-the-multiplication-rule-for-counting'
  - 'fibub, Statistics for analysts: Counting, combinations and permutations: https://fibub.com/learn/courses/statistics/counting/'
---

**Module 5 · about 16 minutes.** By the end you will decide in seconds whether order matters and count any arrangement or choice.

<div class="bigidea">Count by filling places one at a time and multiplying the choices. If order does not matter, divide out the orders you counted more than once.</div>

## 1. The multiplication principle

<figure class="fig" data-fig="count-tree"><figcaption>Each choice branches. The number of leaves is the product of the choices at each step.</figcaption></figure>

If one decision has a options and another has b, together there are **a × b** outcomes. "And" multiplies; "or" (one route or another, with no overlap) adds.

## 2. Arrangements: order matters

Arranging n different things in a row: **n! = n × (n − 1) × … × 1**. 5 people in 5 chairs: 120 ways.

Choosing and arranging k of n (president, then vice-president): **n × (n − 1) × … (k numbers)**, written P(n, k) = n! ÷ (n − k)!.

<div class="problem" data-problem="co-g02"></div>

## 3. Choices: order does not matter

A team, a committee or a hand of cards has no order. Count as if order mattered, then divide by the k! orders of each group:

**C(n, k) = n! ÷ (k!(n − k)!)**

<div class="steps" data-title="Worked example: choose 3 of 7 volunteers">
<div class="step">Ordered: 7 × 6 × 5 = 210.</div>
<div class="step">Each team of 3 was counted 3! = 6 times (ABC, ACB, BAC, …).</div>
<div class="step">Teams: 210 ÷ 6 = <b>35</b>.</div>
</div>

**How to tell:** swap two people. If it is a different outcome (different jobs, different seats), order matters. If it is the same team, it does not.

<div class="problem" data-problem="co-g01"></div>

<div class="problem" data-problem="co-g03"></div>

<div class="myth">

**"Choosing 2 from 6 is 6 × 5 = 30."** That counts "Ana then Ben" and "Ben then Ana" as different. For a team they are the same, so divide by 2: 15.

</div>

## 4. Repeated items

Arrangements of a word with repeated letters: divide by the factorial of each repeat count. BANANA: 6! ÷ (3! × 2!) = 60.

## 5. Restrictions

- **Must be together:** glue them into one block, arrange the blocks, then multiply by the arrangements inside the block.
- **Must not be together:** total arrangements minus the "together" ones.
- **A fixed position or a banned digit:** fill the restricted place first.

<div class="problem" data-problem="co-g04"></div>

<div class="keypoints">

- "And" multiplies; separate cases add.
- n things in a row: n!. Ordered choice of k from n: n(n − 1)…, k numbers.
- Unordered choice: C(n, k) = n!/(k!(n − k)!).
- Swap test: if swapping two picks changes the outcome, order matters.
- Repeats: divide by the factorial of each repeat. Together: glue into a block. Not together: total − together.

</div>
