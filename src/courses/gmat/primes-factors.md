---
title: Primes, factors, GCD and LCM
seoTitle: 'Prime factorization, GCD and LCM for the GMAT'
summary: 'Prime numbers, factor trees, counting factors from the prime factorization, greatest common divisor and least common multiple, perfect squares and trailing zeros, with an interactive factor tree and endless practice.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: How many positive factors does 72 have?
    choices: ['8', '12', '6']
    ans: 1
    why: '72 = 2³ × 3², so (3 + 1)(2 + 1) = 12 factors.'
  - q: What is the LCM of 12 and 18?
    choices: ['6', '36', '216']
    ans: 1
    why: '12 = 2² × 3 and 18 = 2 × 3². Take each prime at its highest power: 2² × 3² = 36.'
  - q: Which number is prime?
    choices: ['51', '57', '59']
    ans: 2
    why: '51 = 3 × 17 and 57 = 3 × 19, but 59 has no factor other than 1 and itself.'
sources:
  - 'OpenStax, Prealgebra 2e (CC BY 4.0), section 2.5 Prime factorization and the least common multiple: https://openstax.org/books/prealgebra-2e/pages/2-5-prime-factorization-and-the-least-common-multiple'
  - 'GMAC, GMAT exam structure (checked 2026-11-22): https://www.mba.com/exams/gmat-exam/about/exam-structure'
---

**Module 2 · about 16 minutes.** By the end you will break any number into primes and use that to count factors, find the GCD and LCM, and spot perfect squares.

<div class="bigidea">Every whole number above 1 is built from primes in exactly one way. That prime "recipe" answers almost every factor question on the test.</div>

## 1. Primes

A **prime** has exactly two positive factors: 1 and itself. The first primes are 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47. Learn them up to 50.

- **1 is not prime** (it has only one factor).
- **2 is the only even prime.** Every other even number has 2 as a factor.
- To test whether n is prime, try dividing by primes up to √n. For 97, try 2, 3, 5 and 7 (since 10² = 100): none work, so 97 is prime.

## 2. The factor tree

<figure class="fig" data-fig="factor-tree" data-n="360"><figcaption>Slide to any number. It splits off its smallest prime again and again until only primes are left (circled). The line below lists the recipe, the factor count and every factor.</figcaption></figure>

Write the result with powers: 360 = 2 × 2 × 2 × 3 × 3 × 5 = **2³ × 3² × 5**.

## 3. Counting factors

A factor of 360 picks how many 2s (0, 1, 2 or 3: 4 choices), how many 3s (3 choices) and how many 5s (2 choices). So 360 has **4 × 3 × 2 = 24** factors.

**Rule:** add 1 to each exponent in the prime factorization and multiply.

<div class="problem" data-problem="pr-g01"></div>

<div class="myth">

**"Multiply the exponents to count factors."** 2³ × 3² does not have 3 × 2 = 6 factors; it has 4 × 3 = 12. The +1 counts the choice of taking none of that prime.

</div>

## 4. GCD and LCM

- **Greatest common divisor (GCD):** the biggest number that divides both. Take the primes they **share**, each at its **lowest** power.
- **Least common multiple (LCM):** the smallest number both divide into. Take **every** prime, each at its **highest** power.

<div class="steps" data-title="Worked example: GCD and LCM of 84 and 90">
<div class="step">84 = 2² × 3 × 7 and 90 = 2 × 3² × 5.</div>
<div class="step">GCD: shared primes are 2 and 3. Lowest powers: 2¹ × 3¹ = <b>6</b>.</div>
<div class="step">LCM: all primes 2, 3, 5, 7 at highest powers: 2² × 3² × 5 × 7 = <b>1,260</b>.</div>
<div class="step">Check with the shortcut GCD × LCM = product of the two numbers: 6 × 1,260 = 7,560 = 84 × 90. ✓</div>
</div>

**Which one does a word problem want?** "Split into the largest equal groups" or "biggest tile that fits" → GCD. "When do they happen together again", "smallest number of items that can be shared by both" → LCM.

<div class="problem" data-problem="pr-g02"></div>

<div class="problem" data-problem="pr-g03"></div>

## 5. Perfect squares and cubes

In a perfect square every prime appears an **even** number of times (36 = 2² × 3²). In a perfect cube every exponent is a multiple of 3. So a question like "what is the smallest k that makes 180k a perfect square?" is a prime question: 180 = 2² × 3² × 5, so k = 5.

A neat consequence: **perfect squares have an odd number of factors** (factors pair up, except the square root). Every other number has an even number.

<div class="problem" data-problem="pr-g04"></div>

## 6. Trailing zeros

Each zero at the end of a number comes from a 10 = 2 × 5. In a factorial there are always more 2s than 5s, so count the 5s: 50! has 50 ÷ 5 = 10 multiples of 5, plus 50 ÷ 25 = 2 extra for 25 and 50, so **12 zeros**.

<div class="keypoints">

- 1 is not prime; 2 is the only even prime; test primes up to √n.
- Number of factors: add 1 to each exponent and multiply.
- GCD = shared primes at lowest powers; LCM = all primes at highest powers; GCD × LCM = a × b.
- "Largest equal groups" → GCD; "together again" → LCM.
- Perfect squares have even exponents and an odd number of factors.
- Trailing zeros of n!: count the 5s (n ÷ 5 + n ÷ 25 + …).

</div>

## Practise: GMAT-style questions on this lesson

Each set is new every time: the numbers change, so you can practise as often as you like. They start easy and get harder. Answer, check, then read the full solution and the trap note.

<div class="qbank" data-bank="grad-quant" data-topics="primes" data-exam="gmat" data-mode="practice" data-n="10"></div>

