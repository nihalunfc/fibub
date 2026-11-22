---
title: 'Exponents and radicals'
seoTitle: 'SAT exponent rules, fractional exponents and radicals'
summary: 'All the exponent rules with the reasons behind them, fractional and negative exponents, simplifying square roots, and solving radical equations without keeping fake solutions.'
minutes: 18
updated: 2026-11-22
quiz:
  - q: 'x³ · x⁴ = ?'
    choices: ['x⁷', 'x¹²', '2x⁷']
    ans: 0
    why: 'Multiplying powers of the same base adds the exponents: 3 + 4 = 7.'
  - q: 'What is 8^(2/3)?'
    choices: ['4', '16/3', '64']
    ans: 0
    why: 'Cube root of 8 is 2; 2 squared is 4.'
  - q: 'Solve √(x + 3) = 5.'
    choices: ['22', '2', '28']
    ans: 0
    why: 'Square both sides: x + 3 = 25, so x = 22. Check: √25 = 5 ✓.'
sources:
  - 'College Board, SAT Math content domains: Advanced Math (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, exponents and radicals (original questions) https://fibub.com/learn/courses/sat/radicals-exponents/'
---

**Module 3 · about 18 minutes · read first: [3.1](/learn/courses/sat/equivalent-expressions/).** By the end you will simplify any expression with powers or roots and solve radical equations safely.

<div class="bigidea">An exponent counts how many times a number is multiplied by itself. Every exponent rule, including the strange-looking zero, negative and fractional ones, follows from that one idea.</div>

## 1. The rules, and why they work

<div class="steps">
<div class="step">x³ · x² = (x·x·x)(x·x) = five x's = <b>x⁵</b>. Multiplying adds exponents.</div>
<div class="step">x⁵ ÷ x² = (x·x·x·x·x)/(x·x): two x's cancel, three left = <b>x³</b>. Dividing subtracts.</div>
<div class="step">(x²)³ = x²·x²·x² = <b>x⁶</b>. A power of a power multiplies.</div>
<div class="step">x³ ÷ x³ = 1, but the subtraction rule says x⁰. So <b>x⁰ = 1</b>.</div>
<div class="step">x² ÷ x⁵ = x⁻³, and also 1/x³. So a <b>negative exponent means "one over"</b>.</div>
</div>

| Rule | Example |
|---|---|
| xᵃ · xᵇ = xᵃ⁺ᵇ | 2³ · 2⁴ = 2⁷ |
| xᵃ / xᵇ = xᵃ⁻ᵇ | y⁹ / y⁴ = y⁵ |
| (xᵃ)ᵇ = xᵃᵇ | (5²)³ = 5⁶ |
| (xy)ᵃ = xᵃyᵃ | (3x)² = 9x² |
| x⁰ = 1, x⁻ᵃ = 1/xᵃ | 4⁻² = 1/16 |

<div class="problem" data-problem="re-g01"></div>

## 2. Fractional exponents are roots

```math
x^{m/n} = \left(\sqrt[n]{x}\right)^{m} = \sqrt[n]{x^{m}}
```

<div class="meaning">

<dl>
<dt>n (bottom)</dt><dd>which root: 2 is the square root, 3 the cube root</dd>
<dt>m (top)</dt><dd>which power, taken after (or before) the root</dd>
<dt>Physical meaning</dt><dd>x^(1/2) times itself must give x¹ (add the exponents: ½ + ½ = 1), so x^(1/2) has to be √x. The rule is forced by the adding rule.</dd>
</dl>

</div>

Take the root first to keep numbers small: 27^(2/3) = (∛27)² = 3² = 9.

<div class="problem" data-problem="re-g02"></div>

**Same base trick:** 9ˣ = 3ʸ? Write 9 as 3²: (3²)ˣ = 3²ˣ, so y = 2x.

<div class="problem" data-problem="re-g05"></div>

## 3. Simplifying square roots

Pull out the biggest perfect square: √72 = √(36 · 2) = 6√2. With letters (x > 0): √(25x⁴) = 5x².

## 4. Radical equations

Get the root alone, square both sides, solve, and <b>check</b>. Squaring can add solutions that do not work in the original.

<div class="problem" data-problem="re-g03"></div>

<div class="myth">

**"√(a + b) = √a + √b."** Try 9 + 16: √25 = 5, but √9 + √16 = 7. Roots do not split over addition (they do split over multiplication: √(ab) = √a · √b).

</div>

## Practice set

Ten questions on this lesson, from warm-up to hard, in the SAT's own formats (four options or a typed answer). Press New numbers for a fresh set; every question has a full worked solution.

<div class="qbank" data-bank="sat" data-topics="radicals-exponents" data-exam="sat" data-n="10"></div>

<div class="keypoints">

- Multiply powers: add exponents; divide: subtract; power of a power: multiply.
- x⁰ = 1 and x⁻ᵃ = 1/xᵃ.
- x^(m/n) is the nth root raised to the m; take the root first.
- Write numbers with the same base to compare exponents.
- In radical equations, isolate, square, solve, then check every answer.

</div>
