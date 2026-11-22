---
title: Overlapping sets and tables
seoTitle: 'Overlapping sets: Venn diagrams and double-set tables'
summary: 'Two overlapping groups with a Venn diagram, the formula Total = A + B − Both + Neither, the double-set table for two yes/no traits, and the smallest and largest possible overlap.'
minutes: 13
updated: 2026-11-22
quiz:
  - q: 100 people; 60 like tea, 50 like coffee, 20 like both. How many like neither?
    choices: ['10', '30', '20']
    ans: 0
    why: 'At least one: 60 + 50 − 20 = 90. Neither: 100 − 90 = 10.'
  - q: Which tool fits two traits that each are yes or no, such as gender and smoker?
    choices: ['A double-set table', 'A number line', 'A factor tree']
    ans: 0
    why: 'A 2 × 2 table with totals in the margins holds every combination.'
  - q: 'In a class of 30, 18 play football and 20 play cricket. The least number who play both is...'
    choices: ['8', '2', '18']
    ans: 0
    why: 'Overlap is smallest when nobody plays neither: 18 + 20 − both = 30, so both = 8.'
sources:
  - 'OpenStax, Contemporary Mathematics (CC BY 4.0), section 1.4 Set operations with two sets: https://openstax.org/books/contemporary-mathematics/pages/1-4-set-operations-with-two-sets'
  - 'GMAC, GMAT exam structure (checked 2026-11-22): https://www.mba.com/exams/gmat-exam/about/exam-structure'
---

**Module 4 · about 13 minutes.** By the end you will choose between a Venn diagram and a table and fill either in seconds.

<div class="bigidea">When two groups overlap, the people in both are counted twice if you just add. Subtract the overlap once.</div>

## 1. The formula

<figure class="fig" data-fig="venn"><figcaption>Move the sliders. The middle region is counted in A and again in B, which is why it is subtracted once.</figcaption></figure>

**Total = A + B − Both + Neither.**

<div class="problem" data-problem="st-g01"></div>

## 2. The double-set table

When every person has **two yes/no traits** (morning or evening shift, joined the course or not), draw a 2 × 2 table with totals:

| | Joined | Did not | Total |
|---|---|---|---|
| Morning | | | |
| Evening | | | |
| Total | | | |

Each row and each column must add up. Fill what the question gives; the empty cells follow by subtraction.

<div class="steps" data-title="Worked example: 200 staff, 60% on mornings; 25% of morning staff and 40% of all staff joined. How many evening staff did not join?">
<div class="step">Morning 120, evening 80 (row totals).</div>
<div class="step">Joined: morning 25% of 120 = 30; all 40% of 200 = 80; so evening joined = 80 − 30 = 50.</div>
<div class="step">Evening did not join: 80 − 50 = <b>30</b>.</div>
</div>

<div class="problem" data-problem="st-g02"></div>

## 3. Smallest and largest overlap

- **Largest overlap:** the smaller group fits entirely inside the bigger one: Both ≤ min(A, B).
- **Smallest overlap:** push as many people as possible into "neither = 0": Both ≥ A + B − Total (or 0 if that is negative).

<div class="myth">

**"If 70% like tea and 60% like coffee, 130% is impossible, so the data is wrong."** It just means at least 30% like both. Percentages of overlapping groups can add to more than 100%.

</div>

<div class="keypoints">

- Total = A + B − Both + Neither.
- Two yes/no traits → a 2 × 2 table with totals; rows and columns must add up.
- Largest overlap = the smaller group; smallest overlap = A + B − Total (not below 0).
- Overlapping percentages can add to more than 100%.

</div>

## Practise: GMAT-style questions on this lesson

Each set is new every time: the numbers change, so you can practise as often as you like. They start easy and get harder. Answer, check, then read the full solution and the trap note.

<div class="qbank" data-bank="grad-quant" data-topics="sets" data-exam="gmat" data-mode="practice" data-n="10"></div>

