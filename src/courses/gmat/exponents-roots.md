---
title: Exponents and roots
seoTitle: 'Exponent rules and square roots for the GMAT'
summary: 'All the exponent rules (multiply, divide, power of a power, zero and negative powers, fractional powers), same-base equations, factoring out a common power, simplifying square roots and powers of ten.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: What is 2³ × 2⁴?
    choices: ['2⁷', '2¹²', '4⁷']
    ans: 0
    why: 'Multiplying powers of the same base adds the exponents: 3 + 4 = 7.'
  - q: What is 9^(1/2) + 8^(1/3)?
    choices: ['5', '6', '4.5']
    ans: 0
    why: 'A 1/2 power is a square root (3) and a 1/3 power is a cube root (2): 3 + 2 = 5.'
  - q: 'Simplify √72.'
    choices: ['6√2', '8√3', '36√2']
    ans: 0
    why: '72 = 36 × 2, so √72 = 6√2.'
sources:
  - 'OpenStax, Intermediate Algebra 2e (CC BY 4.0), section 5.2 Properties of exponents: https://openstax.org/books/intermediate-algebra-2e/pages/5-2-properties-of-exponents-and-scientific-notation'
  - 'OpenStax, Intermediate Algebra 2e, section 8.2 Simplify radical expressions: https://openstax.org/books/intermediate-algebra-2e/pages/8-2-simplify-radical-expressions'
---

**Module 2 · about 16 minutes.** By the end you will simplify any power or root on the test and solve equations where the unknown is in the exponent.

<div class="bigidea">Exponent rules are counting rules: aⁿ is n copies of a multiplied together. Every rule follows from counting copies.</div>

## 1. The rules

| Rule | Why | Example |
|---|---|---|
| aᵐ × aⁿ = aᵐ⁺ⁿ | m copies then n more | 3² × 3⁴ = 3⁶ |
| aᵐ ÷ aⁿ = aᵐ⁻ⁿ | cancel n copies | 5⁷ ÷ 5⁵ = 5² |
| (aᵐ)ⁿ = aᵐⁿ | n groups of m copies | (2³)⁴ = 2¹² |
| (ab)ⁿ = aⁿbⁿ | rearrange the copies | 6³ = 2³ × 3³ |
| a⁰ = 1 | aⁿ ÷ aⁿ | 7⁰ = 1 |
| a⁻ⁿ = 1/aⁿ | keep dividing | 2⁻³ = 1/8 |
| a^(1/n) = ⁿ√a | (a^(1/n))ⁿ = a | 27^(1/3) = 3 |

<div class="myth">

**"aᵐ + aⁿ = aᵐ⁺ⁿ."** There is no rule for adding powers. 2³ + 2³ = 16 = 2⁴, not 2⁶. To add or subtract powers, **factor out** the smaller one.

</div>

## 2. Same-base equations

If both sides are powers of the same base, the exponents must be equal.

<div class="steps" data-title="Worked example: 4ˣ = 8³ × 2">
<div class="step">Write everything as a power of 2: 4 = 2² and 8 = 2³.</div>
<div class="step">Left: (2²)ˣ = 2²ˣ. Right: (2³)³ × 2¹ = 2⁹ × 2¹ = 2¹⁰.</div>
<div class="step">So 2x = 10 and <b>x = 5</b>.</div>
</div>

<div class="problem" data-problem="ex-g01"></div>

## 3. Factor out the common power

When you see powers added or subtracted, take out the smallest one:

3²⁰ − 3¹⁸ = 3¹⁸(3² − 1) = 3¹⁸ × 8.

This turns huge-looking expressions into small ones, and it is the key to many "which is the value" questions.

<div class="problem" data-problem="ex-g03"></div>

## 4. Roots

- √(ab) = √a × √b, so pull out perfect squares: √50 = √25 × √2 = 5√2.
- √a + √b is **not** √(a + b). You can add only like roots: 5√2 + 3√2 = 8√2.
- √(x²) = |x|: the square root symbol always means the non-negative root.
- To clear a root from the bottom of a fraction, multiply top and bottom by it: 6/√3 = 6√3/3 = 2√3.

<div class="problem" data-problem="ex-g02"></div>

## 5. Powers of ten and growth

Multiply the plain numbers and add the powers of ten separately: (3 × 10⁵)(4 × 10⁻²) = 12 × 10³ = 12,000. The same "split it up" thinking helps with comparison questions: which is bigger, 2⁵⁰ or 3³⁰? Write both as tenth powers: 2⁵⁰ = (2⁵)¹⁰ = 32¹⁰ and 3³⁰ = (3³)¹⁰ = 27¹⁰. So 2⁵⁰ is bigger.

<div class="problem" data-problem="ex-g04"></div>

## 6. Fractions behave differently

For a number between 0 and 1, powers make it **smaller** and roots make it **bigger**: (1/2)² = 1/4 but √(1/4) = 1/2. GMAT "which is greatest" questions love this.

<div class="keypoints">

- Multiply → add exponents; divide → subtract; power of a power → multiply.
- a⁰ = 1, a⁻ⁿ = 1/aⁿ, a^(1/n) is the nth root.
- No rule for adding powers: factor out the smallest power instead.
- Same base on both sides → set the exponents equal.
- Simplify roots by pulling out perfect squares; only like roots add.
- Between 0 and 1, powers shrink a number and roots grow it.

</div>

## Practise: GMAT-style questions on this lesson

Each set is new every time: the numbers change, so you can practise as often as you like. They start easy and get harder. Answer, check, then read the full solution and the trap note.

<div class="qbank" data-bank="grad-quant" data-topics="exponents" data-exam="gmat" data-mode="practice" data-n="10"></div>

