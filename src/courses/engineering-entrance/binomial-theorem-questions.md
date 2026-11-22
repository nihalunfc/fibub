---
title: 'Binomial theorem: question types and traps'
seoTitle: 'Binomial theorem JEE questions: types and traps'
summary: 'Every way entrance exams test the binomial theorem: general and middle terms, the term independent of x, coefficients in products, number of terms, greatest term, sums of coefficients and binomial identities, remainders and last digits, integral parts and multinomials, each with its method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The coefficient of x⁵ in (1 + x)⁵(1 − x)⁵ is:'
    choices: ['0', '10', '−10', '1']
    ans: 0
    why: '(1 + x)⁵(1 − x)⁵ = (1 − x²)⁵ has only even powers of x, so the coefficient of x⁵ is 0.'
  - q: 'C(10, 1) + 2C(10, 2) + 3C(10, 3) + … + 10C(10, 10) equals:'
    choices: ['10 × 2⁹', '2¹⁰', '10 × 2¹⁰', '9 × 2¹⁰']
    ans: 0
    why: 'Σ r C(n, r) = n 2ⁿ⁻¹ (differentiate (1 + x)ⁿ and put x = 1), so 10 × 2⁹ = 5120.'
  - q: 'The remainder when 7¹⁰⁰ is divided by 48 is:'
    choices: ['1', '7', '47', '0']
    ans: 0
    why: '7¹⁰⁰ = (49)⁵⁰ = (48 + 1)⁵⁰. Every term except the last has a factor 48, and the last term is 1.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Binomial theorem and its simple applications; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Binomial theorem](/learn/courses/engineering-entrance/binomial-theorem/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Two moves solve nearly every binomial question: write the general term and fix r from the power of x, or start from (1 + x)ⁿ and do something to both sides (substitute, differentiate, integrate, multiply). Learn to see which move a question wants.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. General term and a given power.</b> Collect the exponent, solve for r. <i>Trap:</i> T(r + 1) versus Tᵣ.</div>
<div class="step"><b>2. Middle term.</b> One middle term for even n, two for odd n. <i>Trap:</i> counting n terms instead of n + 1.</div>
<div class="step"><b>3. Term independent of x.</b> Exponent equal to 0. <i>Trap:</i> if r comes out as a fraction, there is no such term and the answer is 0.</div>
<div class="step"><b>4. Coefficient in a product.</b> Pair powers that add to k, or regroup first: (1 + x)ⁿ(1 − x)ⁿ = (1 − x²)ⁿ. <i>Trap:</i> missing pairs.</div>
<div class="step"><b>5. Number of terms and rational terms.</b> Merge equal powers; rational terms need fractional exponents to become whole. <i>Trap:</i> (a + b)ⁿ + (a − b)ⁿ loses half its terms.</div>
<div class="step"><b>6. Greatest term or coefficient.</b> Use the ratio Tᵣ₊₁/Tᵣ. <i>Trap:</i> confusing the greatest coefficient (always the middle) with the greatest term (depends on x).</div>
<div class="step"><b>7. Sums of coefficients.</b> Put x = 1 (all), x = −1 (alternating); for (a polynomial)ⁿ the sum of coefficients is its value at x = 1. <i>Trap:</i> forgetting the constant term when it is excluded.</div>
<div class="step"><b>8. Binomial identities.</b> Σ r C(n, r), Σ C(n, r)², Σ C(n, r)/(r + 1): differentiate, multiply two expansions, integrate. <i>Trap:</i> wrong limits after integrating.</div>
<div class="step"><b>9. Remainders and last digits.</b> Base = m ± 1. <i>Trap:</i> with m − 1 and odd power, the remainder is m − 1, not −1.</div>
<div class="step"><b>10. Integral part and multinomial.</b> Add the conjugate; n!/(p! q! r!). <i>Trap:</i> sign of the conjugate part when the power is odd.</div>
</div>

## Worked examples

**Example 1 (level 3, rational terms).** How many rational terms are in `$(\sqrt2 + \sqrt[3]{3})^{12}$`? *Solution.* `$T_{r+1} = \binom{12}r 2^{(12-r)/2} 3^{r/3}$`. It is rational when (12 − r)/2 and r/3 are whole numbers: r even and a multiple of 3, so r = 0, 6, 12. **3 rational terms.**

**Example 2 (level 4, greatest term).** Find the greatest term in the expansion of (3 + 2x)⁹ at x = 3/2. *Solution.* Write it as 3⁹(1 + y)⁹ with y = 2x/3 = 1. Then m = (n + 1)y/(1 + y) = 10/2 = 5, a whole number, so T₅ and T₆ are equal and greatest. **T₅ = T₆ = C(9, 4) × 3⁵ × 3⁴ = 126 × 3⁹.**

**Example 3 (level 4, identity).** Find C(n, 0) − C(n, 1)/2 + C(n, 2)/3 − … + (−1)ⁿC(n, n)/(n + 1). *Solution.* Integrate (1 − x)ⁿ = Σ (−1)ʳ C(n, r) xʳ from 0 to 1. The left side gives 1/(n + 1); the right side gives exactly the sum. **Answer 1/(n + 1).**

**Example 4 (level 5, integral part).** Let `$(5 + 2\sqrt6)^n = I + f$` with I an integer and 0 ≤ f < 1. Show that (I + f)(1 − f) = 1. *Solution.* Let f′ = (5 − 2√6)ⁿ, which lies in (0, 1) because 5 − 2√6 ≈ 0.1. Then I + f + f′ is an integer (the √6 terms cancel), so f + f′ = 1 and 1 − f = f′. Now (I + f)(1 − f) = (5 + 2√6)ⁿ(5 − 2√6)ⁿ = (25 − 24)ⁿ = **1**.

<div class="myth">

**"The sum of the coefficients of (1 + x)ⁿ and the sum of the binomial coefficients are always the same thing."** Only for (1 + x)ⁿ. For (2x − 3)⁵ the sum of coefficients is (2 − 3)⁵ = −1, found by putting x = 1, while the binomial coefficients C(5, r) still add to 32.

</div>

<div class="meaning">
<dl>
<dt>Sum of coefficients</dt><dd>the value of the expression at x = 1</dd>
<dt>m = (n + 1)x/(1 + x)</dt><dd>the test number that locates the greatest term of (1 + x)ⁿ</dd>
<dt>Physical meaning</dt><dd>Substituting, differentiating and integrating (1 + x)ⁿ turn one known expansion into infinitely many identities. Most "find the sum" questions are one of these in disguise.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="binomial-theorem" data-mode="practice"></div>

<div class="keypoints">

- Fix r from the power of x; a fractional r means the term does not exist.
- Regroup products before expanding: (1 + x)ⁿ(1 − x)ⁿ = (1 − x²)ⁿ.
- Greatest coefficient is the middle one; greatest term needs the ratio test.
- Sum of coefficients = value at x = 1; alternating sum = value at x = −1.
- Σ r C(n, r) = n2ⁿ⁻¹; Σ C(n, r)² = C(2n, n); Σ (−1)ʳC(n, r)/(r + 1) = 1/(n + 1).
- Remainders: base = m ± 1; integral parts: add the conjugate.

</div>
