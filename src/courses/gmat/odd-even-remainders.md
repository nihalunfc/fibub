---
title: 'Odd, even, positive, negative and remainders'
seoTitle: 'Odd and even rules, signs and remainders for the GMAT'
summary: 'The odd and even rules for adding and multiplying, sign rules for products and quotients, testing "must be true" answers with smart numbers, and how remainders work, with a remainder clock you can play with.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: If n is an integer, which must be even?
    choices: ['3n', 'n² + n', 'n + 1']
    ans: 1
    why: 'n² + n = n(n + 1), a product of two consecutive integers, so one of them is even.'
  - q: 'If ab < 0 and b > 0, then:'
    choices: ['a > 0', 'a < 0', 'a = 0']
    ans: 1
    why: 'A negative product needs opposite signs. b is positive, so a is negative.'
  - q: When 47 is divided by 6, the remainder is...
    choices: ['5', '7', '1']
    ans: 0
    why: '47 = 6 × 7 + 5. The remainder must be less than 6.'
sources:
  - 'OpenStax, Prealgebra 2e (CC BY 4.0), chapter 3 Integers: https://openstax.org/books/prealgebra-2e/pages/3-introduction'
  - 'GMAC, GMAT exam structure (checked 2026-11-22): https://www.mba.com/exams/gmat-exam/about/exam-structure'
---

**Module 2 · about 15 minutes.** By the end you will answer "must be true" questions with quick test numbers and handle any remainder question.

<div class="bigidea">For "must be true" questions, try to break each answer with one clever example. The answer you cannot break is right.</div>

## 1. Odd and even

| Operation | Rule |
|---|---|
| even ± even | even |
| odd ± odd | even |
| even ± odd | odd |
| even × anything | even |
| odd × odd | odd |

Two quick consequences: a product is odd **only** if every factor is odd, and n(n + 1) is always even.

## 2. Positive and negative

- A product or quotient is **negative** when it has an **odd** number of negative parts.
- An even power is never negative: x² ≥ 0 for every x.
- An odd power keeps the sign: (−2)³ = −8.

## 3. Smart numbers for "must be true"

<div class="steps" data-title="Worked example: if x is negative and y is positive, which must be true?">
<div class="step">Choices: (A) x + y &lt; 0 (B) xy &lt; 0 (C) x − y &gt; 0 (D) x/y &gt; 0 (E) x² &lt; y².</div>
<div class="step">Pick numbers that try to <b>break</b> each choice. Try x = −1, y = 5: (A) 4, not &lt; 0. Broken.</div>
<div class="step">(C) −6, not &gt; 0. Broken. (D) −0.2, not &gt; 0. Broken.</div>
<div class="step">(E) Try x = −10, y = 1: 100 &lt; 1 is false. Broken.</div>
<div class="step">(B) negative × positive is always negative. It cannot be broken: <b>B</b>.</div>
</div>

Good test numbers: **0, 1, −1, a fraction such as 1/2, a negative fraction, and a big number**. They expose most traps.

<div class="myth">

**"If my example works, the answer must be true."** One example that works proves nothing; one that fails proves "not always true". "Must be true" answers need a reason (a rule from the tables above), or every other choice broken.

</div>

## 4. Remainders

When n is divided by d, n = d × q + r, where the remainder r is a whole number from 0 up to d − 1.

<figure class="fig" data-fig="mod-clock"><figcaption>Counting n steps round a clock with d positions: the full turns are the quotient and the stopping point is the remainder.</figcaption></figure>

Four facts that solve most questions:

1. **Smallest example.** "n leaves remainder 3 when divided by 7": the possible n are 3, 10, 17, 24, … Start listing.
2. **Remainders add and multiply.** If a leaves 2 and b leaves 4 (dividing by 5), then a + b leaves 2 + 4 = 6 → 1, and ab leaves 8 → 3.
3. **Dividing by a factor.** If n leaves 4 when divided by 6, then dividing n by 3 leaves 4 → 1 (since 6 is a multiple of 3).
4. **As a decimal.** n ÷ d = q + r/d. If 37 ÷ 8 = 4.625, the remainder is 0.625 × 8 = 5.

<div class="problem" data-problem="oe-g01"></div>

<div class="problem" data-problem="oe-g02"></div>

<div class="problem" data-problem="oe-g03"></div>

<div class="keypoints">

- odd ± odd = even; odd × odd = odd; anything × even = even.
- A product is negative when it has an odd number of negative factors; even powers are never negative.
- For "must be true", try to break each choice with 0, 1, −1, fractions and big numbers.
- n = dq + r with 0 ≤ r &lt; d. List the numbers that fit: r, r + d, r + 2d, …
- Remainders add and multiply; reduce at the end.

</div>
