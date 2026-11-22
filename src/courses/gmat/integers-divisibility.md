---
title: Integers and divisibility rules
seoTitle: 'Divisibility rules and integers for the GMAT'
summary: 'What integers, factors and multiples are, the divisibility tests for 2 to 12, counting multiples in a range, consecutive integers and units digits, with live practice that makes new numbers every time.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: Is 7,452 divisible by 4?
    choices: ['Yes, because 52 is divisible by 4', 'No, because 7 is odd', 'Yes, because the digit sum is 18']
    ans: 0
    why: 'A number is divisible by 4 when its last two digits are. 52 = 4 × 13.'
  - q: How many multiples of 6 are there from 10 to 70, inclusive?
    choices: ['10', '11', '12']
    ans: 0
    why: 'First 12, last 66: (66 − 12) ÷ 6 + 1 = 9 + 1 = 10.'
  - q: The product of any 4 consecutive integers is always divisible by...
    choices: ['24', '30', '48']
    ans: 0
    why: 'Four consecutive integers include a multiple of 4, another even number and a multiple of 3: 4 × 2 × 3 = 24 (and 1 × 2 × 3 × 4 = 24 itself).'
sources:
  - 'OpenStax, Prealgebra 2e (CC BY 4.0), section 2.5: prime factorization and divisibility: https://openstax.org/books/prealgebra-2e/pages/2-5-prime-factorization-and-the-least-common-multiple'
  - 'GMAC, GMAT Quantitative Reasoning content (checked 2026-11-22): https://www.mba.com/exams/gmat-exam/about/exam-structure'
---

**Module 2 · about 15 minutes.** By the end you will test divisibility at a glance, count multiples in any range, and use consecutive integers and units digits to answer questions without calculating.

<div class="bigidea">Number-property questions look like calculations, but they are about patterns. Find the pattern and the arithmetic disappears.</div>

## 1. The words the GMAT uses

- **Integer:** a whole number, positive, negative or zero: …, −2, −1, 0, 1, 2, …
- **a is a factor (divisor) of b:** b ÷ a leaves no remainder. 6 is a factor of 18.
- **b is a multiple of a:** the same fact the other way round. 18 is a multiple of 6.
- **Zero** is an integer, even, and a multiple of every integer (0 = 0 × 7). It is neither positive nor negative.

<div class="myth">

**"Integers are positive."** Not on the GMAT. Unless a question says "positive integer", negative numbers and zero are allowed, and many traps depend on that.

</div>

## 2. Divisibility tests

| Divisible by | Test | Example |
|---|---|---|
| 2 | last digit even | 1,358 |
| 3 | digit sum divisible by 3 | 2,742: 2+7+4+2 = 15 |
| 4 | last two digits divisible by 4 | 7,452: 52 |
| 5 | last digit 0 or 5 | 9,385 |
| 6 | divisible by 2 **and** 3 | 4,326: even, digit sum 15 |
| 8 | last three digits divisible by 8 | 21,120: 120 = 8 × 15 |
| 9 | digit sum divisible by 9 | 3,717: 18 |
| 10 | last digit 0 | 4,560 |
| 11 | alternating sum of digits divisible by 11 | 2,728: 2 − 7 + 2 − 8 = −11 |
| 12 | divisible by 3 **and** 4 | 1,716: digit sum 15, ends 16 |

The tests for 6 and 12 show a bigger idea: **to be divisible by a product of numbers that share no factor, be divisible by each one**.

<div class="problem" data-problem="in-g03"></div>

## 3. Counting multiples in a range

<div class="steps" data-title="Worked example: multiples of 7 from 50 to 300">
<div class="step">Find the first multiple of 7 at or above 50: 7 × 8 = <b>56</b>.</div>
<div class="step">Find the last at or below 300: 7 × 42 = <b>294</b>.</div>
<div class="step">Count the steps between them: (294 − 56) ÷ 7 = 34 steps.</div>
<div class="step">Add 1, because counting steps misses the first number: <b>35 multiples</b>. (Check: they are 7 × 8 up to 7 × 42, and 42 − 8 + 1 = 35.)</div>
</div>

The "+1" rule works for any evenly spaced list: **count = (last − first) ÷ step + 1**. Forgetting the +1 is one of the most common GMAT mistakes; it even has a name, the fence-post error (10 metres of fence with a post every metre needs 11 posts).

<div class="problem" data-problem="in-g01"></div>

## 4. Consecutive integers

Among any **n** consecutive integers, exactly one is a multiple of n. So:

- the product of 2 consecutive integers is always even;
- the product of 3 is always divisible by 3! = 6;
- the product of 4 is always divisible by 4! = 24.

For an **odd** number of consecutive integers, the middle one is the average. Five consecutive integers that add to 115 have average 23, so they are 21, 22, 23, 24, 25.

<div class="problem" data-problem="in-g04"></div>

## 5. Units digits repeat

<figure class="fig" data-fig="units-cycle"><figcaption>Pick the last digit of a base and a power. The units digits of 2, 3, 7 and 8 repeat every 4 powers; 4 and 9 every 2.</figcaption></figure>

Only the last digit of the base matters: 17<sup>20</sup> ends in the same digit as 7<sup>20</sup>. Divide the power by the cycle length and use the remainder (a remainder of 0 means the last position in the cycle).

<div class="problem" data-problem="in-g02"></div>

<div class="keypoints">

- Integers include negatives and zero unless the question says "positive".
- Know the divisibility tests for 2, 3, 4, 5, 6, 8, 9, 10, 11 and 12.
- Count in a range: (last − first) ÷ step + 1.
- n consecutive integers always contain one multiple of n; their product is divisible by n!.
- Units digits of powers repeat in short cycles: use the remainder of the power.

</div>

## Practise: GMAT-style questions on this lesson

Each set is new every time: the numbers change, so you can practise as often as you like. They start easy and get harder. Answer, check, then read the full solution and the trap note.

<div class="qbank" data-bank="grad-quant" data-topics="integers" data-exam="gmat" data-mode="practice" data-n="10"></div>

