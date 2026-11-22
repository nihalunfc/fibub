---
title: Binomial theorem
seoTitle: 'Binomial theorem: JEE maths'
summary: "The expansion of (a + b)ⁿ, Pascal's triangle, the general and middle terms, the term independent of x, coefficients in products of expansions, number of terms and rational terms, the greatest coefficient and greatest term, sums of binomial coefficients by substitution, differentiation and integration, remainders, last digits, integral parts and the multinomial expansion."
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'How many terms are there in (x + y)¹⁵?'
    choices: ['15', '16', '14', '30']
    ans: 1
    why: '(a + b)ⁿ has n + 1 terms, from aⁿ down to bⁿ. So 16.'
  - q: 'The middle term of (x + 1/x)¹⁰ is:'
    choices: ['T₅', 'T₆', 'T₅ and T₆', 'T₇']
    ans: 1
    why: 'n = 10 is even, so there are 11 terms and one middle term, T(n/2 + 1) = T₆. It equals C(10, 5) = 252, which is also the term independent of x.'
  - q: 'C(8, 0) + C(8, 1) + … + C(8, 8) equals:'
    choices: ['128', '256', '64', '512']
    ans: 1
    why: 'Put x = 1 in (1 + x)⁸: the sum of all coefficients is 2⁸ = 256.'
sources:
  - 'NCERT Mathematics Class 11 (Binomial theorem): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Binomial theorem and its simple applications'
---

**Maths · Class 11 · about 36 minutes.** By the end you will be able to write any term of a binomial expansion directly, find particular coefficients in products of expansions, locate the greatest term, add up series of binomial coefficients and use the theorem for remainders and approximations.

<div class="bigidea">Expanding (a + b)ⁿ means choosing, from each of the n brackets, either a or b. A term with r copies of b comes from choosing which r brackets give b: that can be done in C(n, r) ways. So the binomial coefficients are counting numbers, and that is why they appear in counting, probability and series alike.</div>

## 1. The expansion

```math
(a+b)^n = \sum_{r=0}^{n}\binom nr a^{n-r}b^r, \qquad T_{r+1} = \binom nr a^{n-r}b^r
```

<div class="meaning">
<dl>
<dt>n</dt><dd>the power (a positive integer in this chapter)</dd>
<dt>r</dt><dd>how many brackets gave b; it runs from 0 to n</dd>
<dt>T(r+1)</dt><dd>the general term: the (r + 1)th term counting from the left, because the first term has r = 0</dd>
<dt>C(n, r)</dt><dd>the binomial coefficient, the number of ways to choose those r brackets</dd>
<dt>Physical meaning</dt><dd>Every coefficient answers "in how many ways can this power of b be picked?" The powers of a and b in each term always add up to n.</dd>
</dl>
</div>

There are n + 1 terms. Coefficients equally far from the two ends are equal, because `$\binom nr = \binom n{n-r}$`. Each row of Pascal's triangle is one list of coefficients, and each entry is the sum of the two above it: `$\binom nr + \binom n{r-1} = \binom{n+1}r$`.

<figure class="fig" data-fig="pascal-triangle"><figcaption>Pascal's triangle up to row n, and the size of each term of (1 + x)ⁿ. The coefficients peak in the middle; the terms peak where the test value (n + 1)x/(1 + x) says.</figcaption></figure>

## 2. Particular terms

**Middle term.** If n is even, there is one middle term, `$T_{n/2+1}$`. If n is odd, there are two, `$T_{(n+1)/2}$` and `$T_{(n+3)/2}$`, with equal coefficients.

**Term with a given power of x.** Write the general term, collect all powers of x into one exponent, set it equal to the power you want, and solve for r. If r is not a whole number from 0 to n, that power does not appear.

**Worked example.** The term independent of x in `$\left(x^2 - \tfrac{2}{x}\right)^9$`. `$T_{r+1} = \binom9r (x^2)^{9-r}(-2/x)^r = \binom9r(-2)^r x^{18-3r}$`. Setting 18 − 3r = 0 gives r = 6, and the term is `$\binom96 \cdot 64 = 84 \times 64 = 5376$`.

<div class="problem" data-problem="bin-coef"></div>

<div class="problem" data-problem="bin-indep"></div>

**Coefficient in a product.** For the coefficient of `$x^k$` in `$(1+x)^m(1-x)^n$` or `$(1 + 2x - x^2)(1+x)^n$`, pair up terms whose powers add to k and add their products. Often a clever regrouping shortens it: `$(1+x)^n(1-x)^n = (1-x^2)^n$`.

**Number of terms.** `$(a+b)^n + (a-b)^n$` keeps only the terms with even powers of b, so it has n/2 + 1 terms for even n. `$(x + y + z)^n$` has `$\binom{n+2}2$` terms. When two terms of an expansion have the same power, they merge, so simplify first.

<div class="myth">

**"T₃ means r = 3."** T₃ is the third term, and the first term has r = 0, so T₃ has r = 2. Off-by-one errors here cost more JEE marks than any hard idea in the chapter.

</div>

## 3. Greatest coefficient and greatest term

The greatest **coefficient** of `$(a+b)^n$` is the middle one: `$\binom n{n/2}$` for even n, `$\binom n{(n-1)/2}$` for odd n.

Slide n and x and watch the bar for each term ⁿCₖxᵏ of (1 + x)ⁿ.

<figure class="fig" data-fig="@math-binomial-terms"><figcaption>Notice that the tallest bar (the greatest term) moves right as x grows, and that with x = 1 the bars are the coefficients and add up to 2ⁿ.</figcaption></figure>

The greatest **term** depends on the actual values. For `$(1+x)^n$` with x > 0, compare consecutive terms:

```math
\frac{T_{r+1}}{T_r} = \frac{n-r+1}{r}\,x \ge 1 \iff r \le \frac{(n+1)x}{1+x}
```

So if m = (n + 1)x/(1 + x) is not a whole number, the greatest term is `$T_{[m]+1}$`; if m is a whole number, `$T_m$` and `$T_{m+1}$` are equal and greatest. Try it in the figure: set x = 1 and the bars match the coefficients.

## 4. Sums of binomial coefficients

Start from `$(1+x)^n = \sum \binom nr x^r$` and choose a value or an operation:

| Do this | Get this |
|---|---|
| put x = 1 | `$\sum\binom nr = 2^n$` |
| put x = −1 | `$\sum(-1)^r\binom nr = 0$`; odd and even sums are each `$2^{n-1}$` |
| differentiate, then x = 1 | `$\sum r\binom nr = n2^{n-1}$` |
| integrate from 0 to 1 | `$\sum \dfrac{1}{r+1}\binom nr = \dfrac{2^{n+1}-1}{n+1}$` |
| compare coefficients in `$(1+x)^n(1+x)^n$` | `$\sum\binom nr^2 = \binom{2n}n$` |

The last one is Vandermonde's idea: the coefficient of xⁿ in `$(1+x)^{2n}$` is made by pairing the term in xʳ from one bracket with the term in xⁿ⁻ʳ from the other. Useful also: `$r\binom nr = n\binom{n-1}{r-1}$`, which removes a factor r from a sum.

For sums of every third coefficient, put x = 1, ω and ω² (cube roots of unity) and add: the unwanted terms cancel because 1 + ω + ω² = 0.

## 5. Remainders, last digits and integral parts

**Remainders.** Write the base as (multiple of m) ± 1. Then `$(m+1)^k = 1 + km + \binom k2 m^2 + \cdots$`, so the remainder on dividing by m is 1. For (m − 1)ᵏ, the last term is (−1)ᵏ.

<div class="problem" data-problem="bin-rem"></div>

**Last digits.** Use the same idea with m = 10 or 100: `$11^{10} = (10+1)^{10}$` ends in 01.

**Integral parts.** For `$(\sqrt3 + \sqrt2)^{2n}$` and similar, add the conjugate `$(\sqrt3 - \sqrt2)^{2n}$`, which lies between 0 and 1. The sum is an integer because the irrational terms cancel. So if I + f is the number (I its integer part, 0 ≤ f < 1) and f′ is the conjugate, then f + f′ = 1.

**Approximation.** For small x, `$(1+x)^n \approx 1 + nx$`. So `$(1.002)^{10} \approx 1.02$`.

## 6. Multinomial expansion

The coefficient of `$a^p b^q c^r$` in `$(a + b + c)^n$` (with p + q + r = n) is `$\dfrac{n!}{p!\,q!\,r!}$`. It counts the ways to choose which brackets give a, which b and which c.

<div class="keypoints">

- T(r + 1) = C(n, r) a^(n − r) bʳ; the rth term has r − 1, not r.
- Middle term: one for even n, two for odd n; the middle coefficient is the greatest.
- Greatest term of (1 + x)ⁿ: compare with m = (n + 1)x/(1 + x).
- Sums: x = 1 gives 2ⁿ; differentiate for Σ r C(n, r) = n2ⁿ⁻¹; integrate for Σ C(n, r)/(r + 1); Σ C(n, r)² = C(2n, n).
- Remainders: write the base as m ± 1 and keep only the last term.
- Integral part of (√a + √b)ⁿ: add the conjugate, which lies in (0, 1).

</div>
