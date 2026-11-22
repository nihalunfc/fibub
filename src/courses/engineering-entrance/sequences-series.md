---
title: Sequences and series
seoTitle: 'Sequences and series: JEE maths'
summary: 'Arithmetic and geometric progressions, their nth terms and sums, the sum to infinity, choosing three or four terms cleverly, harmonic progressions, arithmetic, geometric and harmonic means and the AM ≥ GM ≥ HM inequality for greatest and least values, arithmetico-geometric series, sums of n, n² and n³, the method of differences and telescoping.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'The 20th term of the AP 7, 11, 15, … is:'
    choices: ['83', '87', '80', '91']
    ans: 0
    why: 'a = 7, d = 4, so a₂₀ = 7 + 19 × 4 = 83. Using 20 × 4 instead of 19 × 4 is the usual slip.'
  - q: 'The sum to infinity of 6 − 3 + 3/2 − 3/4 + … is:'
    choices: ['12', '4', '3', '8']
    ans: 1
    why: 'a = 6 and r = −1/2, so S = a/(1 − r) = 6/(3/2) = 4.'
  - q: 'For positive x, the least value of x + 9/x is:'
    choices: ['3', '6', '9', '10']
    ans: 1
    why: 'By AM ≥ GM, x + 9/x ≥ 2√9 = 6, with equality at x = 3.'
sources:
  - 'NCERT Mathematics Class 11 (Sequences and series): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Sequences and series'
---

**Maths · Class 11 · about 38 minutes.** By the end you will be able to work with arithmetic, geometric and harmonic progressions, use the inequality between the means to find greatest and least values, add arithmetico-geometric series, and sum series term by term with the standard sums, the method of differences and telescoping.

<div class="bigidea">A sequence is a list with a rule. An arithmetic progression keeps adding the same step, so it grows in a straight line. A geometric progression keeps multiplying by the same ratio, so it grows (or shrinks) like compound interest. Almost every series in JEE is one of these, a mix of the two, or something that collapses when you write each term as a difference.</div>

## 1. Arithmetic progressions (AP)

An AP has first term a and common difference d:

```math
a_n = a + (n-1)d, \qquad S_n = \frac n2\big[2a + (n-1)d\big] = \frac n2(a + l)
```

<div class="meaning">
<dl>
<dt>a</dt><dd>the first term</dd>
<dt>d</dt><dd>the common difference, the fixed amount added each time (it can be negative)</dd>
<dt>r</dt><dd>the common ratio of a GP, the fixed number each term is multiplied by</dd>
<dt>n, aₙ, Sₙ</dt><dd>the position of a term, the term in that position, and the sum of the first n terms</dd>
<dt>l</dt><dd>the last term of the part being added</dd>
<dt>Physical meaning</dt><dd>Sₙ = n × (average of first and last): pair the first with the last, the second with the second-last, and every pair has the same sum.</dd>
</dl>
</div>

Useful facts. `$a_n = S_n - S_{n-1}$`, so if Sₙ is a quadratic in n with no constant term, the sequence is an AP. Three numbers in AP are best taken as a − d, a, a + d (their sum is 3a), and four as a − 3d, a − d, a + d, a + 3d. If a, b, c are in AP, then 2b = a + c, and b is the **arithmetic mean**. Adding, subtracting or multiplying every term by a constant keeps an AP an AP.

The maximum of Sₙ for a decreasing AP is reached at the last positive term.

<div class="problem" data-problem="seq-ap"></div>

## 2. Geometric progressions (GP)

```math
a_n = ar^{n-1}, \qquad S_n = \frac{a(1-r^n)}{1-r} \;(r \ne 1), \qquad S_\infty = \frac{a}{1-r} \;(|r| < 1)
```

Three numbers in GP are best taken as a/r, a, ar (their product is a³). If a, b, c are in GP, then b² = ac and b = √(ac) is the **geometric mean**. Taking logarithms turns a GP into an AP.

<figure class="fig" data-fig="ap-gp-bars"><figcaption>Terms as bars, running sum as a line. An AP climbs in a straight ramp; a GP with |r| &lt; 1 shrinks, and its running sum levels off at a/(1 − r).</figcaption></figure>

**Recurring decimals** are infinite GPs: 0.3̄ = 3/10 + 3/100 + … = (3/10)/(1 − 1/10) = 1/3. In general 0.ab̄ (repeating ab) = ab/99.

<div class="myth">

**"An infinite sum of positive numbers must be infinite."** Not if the terms shrink fast enough. 1 + 1/2 + 1/4 + … never passes 2: each step covers half the remaining gap. The sum to infinity exists for a GP exactly when |r| &lt; 1.

</div>

## 3. Harmonic progressions and the three means

Numbers are in **harmonic progression (HP)** when their reciprocals are in AP. There is no formula for the sum of an HP; turn it into an AP of reciprocals and work there. The harmonic mean of a and b is 2ab/(a + b).

For two positive numbers a and b:

```math
A = \frac{a+b}2, \qquad G = \sqrt{ab}, \qquad H = \frac{2ab}{a+b}, \qquad A \ge G \ge H, \qquad G^2 = AH
```

Equality holds only when a = b. The same AM ≥ GM inequality holds for n positive numbers: their average is at least the nth root of their product.

## 4. Greatest and least values with AM ≥ GM (JEE favourite)

**Fixed product, least sum.** If the product of positive parts is constant, their sum is least when the parts are equal. So for x > 0, `$x + \tfrac{k}{x} \ge 2\sqrt k$`.

**Fixed sum, greatest product.** If x + y + z = 12 with positive numbers, xyz ≤ (12/3)³ = 64.

**Split to balance.** For the greatest value of `$x^2y^3$` when x + y = 10, write x + y = x/2 + x/2 + y/3 + y/3 + y/3, five parts whose product contains x²y³. Equality at x/2 = y/3, so x = 4, y = 6.

<div class="problem" data-problem="seq-amgm"></div>

<div class="myth">

**"AM ≥ GM gives the least value of x + 1/x + 5 as 2 + 5 = 7 for any real x."** AM ≥ GM needs positive numbers. For x &lt; 0, x + 1/x ≤ −2, so the expression goes down to −∞. Always check the parts are positive and that equality can actually happen.

</div>

## 5. Arithmetico-geometric series

Each term is an AP term times a GP term: `$a + (a+d)r + (a+2d)r^2 + \cdots$`. Call the sum S, multiply by r, and subtract: S − rS leaves the first term plus a GP. For |r| &lt; 1,

```math
S_\infty = \frac{a}{1-r} + \frac{dr}{(1-r)^2}
```

**Worked example.** `$1 + \tfrac22 + \tfrac34 + \tfrac48 + \cdots$`. S − S/2 = 1 + 1/2 + 1/4 + … = 2, so S = 4.

<div class="problem" data-problem="seq-agp"></div>

## 6. Standard sums and summing term by term

```math
\sum_{k=1}^n k = \frac{n(n+1)}2, \qquad \sum_{k=1}^n k^2 = \frac{n(n+1)(2n+1)}6, \qquad \sum_{k=1}^n k^3 = \left(\frac{n(n+1)}2\right)^2
```

To add a series, find its general term `$T_k$` as a polynomial in k, expand, and use these sums. For 1·2 + 2·3 + 3·4 + …, `$T_k = k^2 + k$`, so `$S_n = \tfrac{n(n+1)(n+2)}3$`.

**Method of differences.** If the terms themselves are not a simple pattern but their differences are (for example 1, 3, 7, 13, 21, … has differences 2, 4, 6, 8, an AP), then `$T_n$` is a quadratic in n. Write `$T_n = an^2 + bn + c$` and fit it.

**Telescoping.** Write each term as a difference f(k) − f(k + 1), and almost everything cancels:

```math
\sum_{k=1}^n \frac1{k(k+1)} = \sum_{k=1}^n\left(\frac1k - \frac1{k+1}\right) = 1 - \frac1{n+1}
```

The same trick works with `$\tfrac{1}{k(k+1)(k+2)} = \tfrac12\left(\tfrac1{k(k+1)} - \tfrac1{(k+1)(k+2)}\right)$`, with `$\tfrac{1}{\sqrt{k+1}+\sqrt k} = \sqrt{k+1} - \sqrt k$` and with `$\tfrac{k}{(k+1)!} = \tfrac1{k!} - \tfrac1{(k+1)!}$`.

<div class="keypoints">

- AP: aₙ = a + (n − 1)d, Sₙ = n/2 (first + last). GP: aₙ = arⁿ⁻¹, S∞ = a/(1 − r) for |r| &lt; 1.
- Choose terms symmetrically: a − d, a, a + d and a/r, a, ar.
- HP: reciprocals in AP. A ≥ G ≥ H for positive numbers, with G² = AH.
- AM ≥ GM: equal parts give the least sum for a fixed product and the greatest product for a fixed sum; parts must be positive.
- AGP: multiply by r and subtract.
- Σk, Σk², Σk³; differences for unknown patterns; telescoping for fractions and roots.

</div>
