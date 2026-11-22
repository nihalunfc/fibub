---
title: 'Functions, symbols and sequences'
seoTitle: 'Functions, made-up symbols and sequences on the GMAT'
summary: 'Reading function notation, composite functions, made-up symbol questions, arithmetic and geometric sequences, sums of evenly spaced numbers and sequences defined step by step.'
minutes: 14
updated: 2026-11-22
quiz:
  - q: If f(x) = x² − 3, what is f(f(2))?
    choices: ['−2', '1', '−3']
    ans: 0
    why: 'f(2) = 4 − 3 = 1, then f(1) = 1 − 3 = −2.'
  - q: An arithmetic sequence starts 7, 11, 15, ... What is the 20th term?
    choices: ['83', '87', '80']
    ans: 0
    why: 'a₂₀ = 7 + 19 × 4 = 83.'
  - q: What is the sum 1 + 2 + 3 + ... + 100?
    choices: ['5,050', '5,000', '10,100']
    ans: 0
    why: '100 terms with average (1 + 100)/2 = 50.5: 100 × 50.5 = 5,050.'
sources:
  - 'OpenStax, Intermediate Algebra 2e (CC BY 4.0), chapter 12 Sequences, series and binomial theorem: https://openstax.org/books/intermediate-algebra-2e/pages/12-introduction'
  - 'OpenStax, College Algebra 2e (CC BY 4.0), section 3.4 Composition of functions: https://openstax.org/books/college-algebra-2e/pages/3-4-composition-of-functions'
---

**Module 3 · about 14 minutes.** By the end you will handle any function, made-up symbol or sequence the test invents, because they all follow the same idea: follow the rule exactly.

<div class="bigidea">A function is a machine with one rule. Put a number in, follow the rule exactly, and read what comes out.</div>

## 1. Function notation

f(x) = 3x² − 2x means "square the input, times 3, minus twice the input". So f(−2) = 3(4) − 2(−2) = 12 + 4 = 16. Put brackets around every input, especially negatives.

**Composite functions** work from the inside out: f(g(x)) means "do g first, then f". f(g(x)) and g(f(x)) are usually different.

<div class="problem" data-problem="fn-g01"></div>

## 2. Made-up symbols

The GMAT sometimes invents an operation, such as a ◆ b = ab − a + b. It is just a function of two inputs. Replace the letters with the numbers, **do brackets first**, and never assume the operation works like + or × (a ◆ b may not equal b ◆ a).

<div class="steps" data-title="Worked example: x ⊕ y = 2x − y. Find (3 ⊕ 1) ⊕ 4.">
<div class="step">Brackets first: 3 ⊕ 1 = 2(3) − 1 = 5.</div>
<div class="step">Now 5 ⊕ 4 = 2(5) − 4 = <b>6</b>.</div>
<div class="step">Compare 3 ⊕ (1 ⊕ 4): 1 ⊕ 4 = −2, then 3 ⊕ (−2) = 8. The order matters.</div>
</div>

<div class="problem" data-problem="fn-g04"></div>

## 3. Arithmetic sequences

Each term adds the same **difference d**: 5, 8, 11, 14, … (d = 3).

- nth term: **aₙ = a₁ + (n − 1)d**. (From term 1 to term n there are n − 1 steps.)
- Sum of n terms: **n × (first + last) ÷ 2**, the number of terms times the average.

<div class="problem" data-problem="fn-g02"></div>

<div class="problem" data-problem="fn-g03"></div>

## 4. Geometric sequences and step rules

A **geometric** sequence multiplies by the same ratio: 3, 6, 12, 24, … (r = 2), with aₙ = a₁ × rⁿ⁻¹.

Some sequences are defined **step by step** ("each term is 3 more than twice the previous one"). Do not look for a formula: write out terms one at a time, or work backwards by undoing the steps in reverse order.

<div class="myth">

**"I need a formula for every sequence."** Most GMAT sequence questions ask for the 4th or 5th term, or follow a short cycle. Writing out a few terms is faster and safer than any formula. Look for a repeating pattern after 4 to 6 terms.

</div>

<div class="keypoints">

- Put every input in brackets; work composite functions from the inside out.
- Made-up symbols: substitute exactly, brackets first, assume nothing about order.
- Arithmetic: aₙ = a₁ + (n − 1)d; sum = number of terms × average of first and last.
- Geometric: aₙ = a₁ × rⁿ⁻¹.
- Step-defined sequences: write out terms or work backwards.

</div>
