---
title: Binomial Theorem
seoTitle: 'Binomial Theorem Class 11 notes and examples'
summary: 'Class 11 Binomial Theorem with animations: expansion of (a + b)^n, Pascal''s triangle, general term, middle terms, sum of coefficients and quick estimates.'
minutes: 75
updated: 2026-11-23
quiz:
  - q: 'How many terms are there in the expansion of (x + y)^9?'
    choices: ['10', '9', '8', '11']
    ans: 0
    why: 'The expansion of (a + b)^n has n + 1 terms, so (x + y)^9 has 10.'
  - q: 'The coefficient of x^3 in (1 + x)^7 is:'
    choices: ['35', '21', '7', '70']
    ans: 0
    why: 'It is 7C3 = 7×6×5 ÷ (3×2×1) = 35.'
  - q: 'The sum of all the coefficients in (1 + x)^6 is:'
    choices: ['64', '36', '32', '12']
    ans: 0
    why: 'Put x = 1: (1 + 1)^6 = 2^6 = 64.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 7 “Binomial Theorem” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Binomial theorem for non-negative integer exponents (see e.g. Graham, Knuth and Patashnik, Concrete Mathematics, 2nd ed., chapter 5); every worked coefficient was recomputed by repeated multiplication in code.'
---

**Maths · Class 11 · Chapter 7 · about 75 minutes.** By the end you will be able to expand `$(a + b)^n$` for any whole number `$n$` without multiplying brackets one by one, read the coefficients from Pascal's triangle, write down any term using the general term, find the middle term, and use the theorem for sums of coefficients and quick numerical estimates.

<div class="bigidea">Multiplying <code>(a + b)</code> by itself n times by hand is slow and easy to get wrong. The binomial theorem gives the whole answer in one line: every term has the form (a number) × a<sup>n−k</sup> × b<sup>k</sup>, and the number is simply "in how many ways can I pick b from exactly k of the n brackets", which is nCk. The numbers form Pascal's triangle.</div>

## 1. Small expansions and a picture

You already know `$(a + b)^2 = a^2 + 2ab + b^2$`. Why "2ab"? Draw a square with side `$a + b$` and cut it. It splits into a square `$a^2$`, a square `$b^2$` and two rectangles `$ab$`.

<figure class="fig" data-fig="c11m-binom-square"><figcaption>(a + b)² as an area: a² + ab + ab + b². Switch to (a − b)² and see why the middle term has a minus sign.</figcaption></figure>

Multiply once more to get the cube:

```math
(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3, \qquad (a + b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4
```

Look at the pattern. Each expansion of `$(a + b)^n$` has **`$n + 1$` terms**; the power of `$a$` falls from `$n$` to 0, the power of `$b$` rises from 0 to `$n$`, and in every term the two powers add up to `$n$`. The coefficients, `1, 3, 3, 1` and `1, 4, 6, 4, 1`, read the same from both ends.

## 2. Where do the coefficients come from?

Write `$(a + b)^4$` as four brackets: `$(a + b)(a + b)(a + b)(a + b)$`. To make a term, pick **one letter from each bracket** and multiply. If you pick `$b$` from exactly two brackets and `$a$` from the other two, you get `$a^2b^2$`. How many ways give `$a^2b^2$`? You have to choose *which 2 of the 4 brackets* give the `$b$`: `$^4C_2 = 6$` ways. That is the coefficient 6. Tap the brackets to see this for yourself.

<figure class="fig" data-fig="c11m-binom-paths"><figcaption>Pick a or b from each bracket. A term with k b's appears nCk times, once for each choice of which k brackets give b. The bars show how many ways each power of b can be made.</figcaption></figure>

This is exactly the idea of combinations (the previous chapter), and it proves the theorem.

## 3. The binomial theorem

For any positive whole number `$n$`:

```math
(a + b)^n = {}^nC_0\,a^n + {}^nC_1\,a^{n-1}b + {}^nC_2\,a^{n-2}b^2 + \cdots + {}^nC_n\,b^n = \sum_{k=0}^{n} {}^nC_k\; a^{n-k}\,b^k
```

<div class="meaning">
<dl>
<dt>`$^nC_k$`</dt><dd>the binomial coefficient, "n choose k" = `$\dfrac{n!}{k!(n-k)!}$`.</dd>
<dt>`$a^{n-k}b^k$`</dt><dd>the powers always add up to `$n$`; `$a$` goes down, `$b$` goes up.</dd>
<dt>`$n + 1$` terms</dt><dd>`$k$` runs from 0 to `$n$`.</dd>
<dt>Replacing `$b$` by `$-b$`</dt><dd>`$(a - b)^n = \sum {}^nC_k\,a^{n-k}(-b)^k$`: the signs alternate `+, −, +, −, ...`.</dd>
</dl>
</div>

Slide `$n$` to see the whole list at once, tap any row, and switch to `$(a - b)$` to watch the alternating signs.

<figure class="fig" data-fig="c11m-binom-expand"><figcaption>The terms of (a + b)ⁿ. Powers of a fall from n to 0, powers of b rise from 0 to n, and the coefficients are row n of Pascal's triangle. For (a − b)ⁿ the odd-numbered k carry a minus sign.</figcaption></figure>

**Example.** Expand `$(2x - 3)^4$`. Here `$a = 2x$`, `$b = -3$`, `$n = 4$`:

```math
(2x-3)^4 = 16x^4 - 4 \cdot 8x^3 \cdot 3 + 6 \cdot 4x^2 \cdot 9 - 4 \cdot 2x \cdot 27 + 81 = 16x^4 - 96x^3 + 216x^2 - 216x + 81
```

Check at `$x = 1$`: `$(2-3)^4 = 1$` and `$16 - 96 + 216 - 216 + 81 = 1$`. Always check with an easy number.

<div class="myth">

**"(a + b)ⁿ = aⁿ + bⁿ."** This is the most common mistake in the chapter. Take `$a = b = 1$` and `$n = 2$`: `$(1 + 1)^2 = 4$`, but `$1^2 + 1^2 = 2$`. The missing middle terms `$2ab$` are what make up the difference. Another slip: forgetting that in `$(2x - 3)^4$` the whole `$2x$` is raised to a power, so `$(2x)^3 = 8x^3$`, not `$2x^3$`.

</div>

<div class="problem" data-problem="c11m-binom-terms"></div>

## 4. Pascal's triangle

Write the coefficients of `$(a + b)^n$` for `$n = 0, 1, 2, \dots$` as rows:

```math
\begin{array}{ccccccccc} & & & & 1 & & & & \\ & & & 1 & & 1 & & & \\ & & 1 & & 2 & & 1 & & \\ & 1 & & 3 & & 3 & & 1 & \\ 1 & & 4 & & 6 & & 4 & & 1 \end{array}
```

Every number is the sum of the two above it, because `$^nC_k = {}^{n-1}C_{k-1} + {}^{n-1}C_k$`. Pascal's triangle gives the coefficients for small `$n$` without any factorial. (Indian mathematicians knew it long before Pascal, as the *Meru Prastara* in Pingala's work on metres.) Tap entries to see the two parents.

<figure class="fig" data-fig="c11m-pnc-pascal"><figcaption>Pascal's triangle. Each entry is the sum of the two above it, and row n holds nC0, nC1, ..., nCn.</figcaption></figure>

<!--fig:tool binomial-expansion-->

### 4.1 Some facts you can read from it

Put `$a = b = 1$`: `$2^n = {}^nC_0 + {}^nC_1 + \cdots + {}^nC_n$`, the sum of a row is `$2^n$`. Put `$a = 1$`, `$b = -1$`: `$0 = {}^nC_0 - {}^nC_1 + {}^nC_2 - \cdots$`, so the even-position and odd-position coefficients have the same sum, `$2^{n-1}$` each.

<figure class="fig" data-fig="c11m-binom-rowsum"><figcaption>Put x = 1 and the coefficients of (1 + x)ⁿ add up to 2ⁿ. Put x = −1 and they add up to 0.</figcaption></figure>

<div class="problem" data-problem="c11m-binom-sum"></div>

## 5. The general term

The `$(k+1)$`-th term of `$(a + b)^n$` is called the **general term**:

```math
T_{k+1} = {}^nC_k\; a^{n-k}\, b^k, \qquad k = 0, 1, \dots, n
```

Mind the numbers: the term with `$b^k$` is the `$(k+1)$`-th, not the `$k$`-th, because the counting starts with the term `$a^n$` (that is `$k = 0$`). With the general term you can find any single term, such as "the coefficient of `$x^2$`", without expanding anything. The method is the same every time.

<div class="steps" data-fig="c11m-binom-general">
<div class="step">Question: find the coefficient of x² in (x + 2/x)⁶. Identify a = x, b = 2/x and n = 6.</div>
<div class="step">Write the general term: T(k+1) = 6Ck · x^(6−k) · (2/x)^k.</div>
<div class="step">Split the bracket power: (2/x)^k = 2^k · x^(−k). So T = 6Ck · 2^k · x^(6−k) · x^(−k).</div>
<div class="step">Add the powers of x: (6 − k) + (−k) = 6 − 2k. So T = 6Ck · 2^k · x^(6−2k).</div>
<div class="step">We want the power 2: 6 − 2k = 2, so k = 2. (If k came out as a fraction or a negative number, there would be no such term.)</div>
<div class="step">Put k = 2 back: 6C2 · 2² = 15 × 4 = 60. The coefficient of x² is 60.</div>
</div>

<div class="problem" data-problem="c11m-binom-general"></div>

A term free of `$x$` is called the **constant term**: set the power of `$x$` to 0 and solve for `$k$`. In `$(x + 2/x)^6$` that is `$6 - 2k = 0$`, `$k = 3$`, so the constant term is `$^6C_3 \cdot 2^3 = 160$`.

<div class="myth">

**Using k where you should use k + 1.** In `$T_{k+1}$` the binomial coefficient and the power of `$b$` use `$k$`, but the name of the term uses `$k + 1$`. If you are asked for the 5th term, take `$k = 4$`, not 5.

</div>

## 6. Middle terms

There are `$n + 1$` terms. Their middle depends on whether that is odd or even.

- **If `$n$` is even,** `$n + 1$` is odd, so there is exactly **one** middle term, `$T_{n/2+1}$`.
- **If `$n$` is odd,** `$n + 1$` is even, so there are **two** middle terms, `$T_{(n+1)/2}$` and `$T_{(n+3)/2}$`.

The coefficients rise up to the middle and then fall, so the middle terms have the *largest* binomial coefficients.

<figure class="fig" data-fig="c11m-binom-middle"><figcaption>The binomial coefficients form a hump. For even n one bar is the middle; for odd n two equal bars share the middle.</figcaption></figure>

<div class="problem" data-problem="c11m-binom-middle"></div>

## 7. Quick estimates

When `$x$` is small, the later powers of `$x$` are tiny, so a few terms are enough. For example `$1.02^{10} = (1 + 0.02)^{10} = 1 + 10(0.02) + 45(0.02)^2 + \cdots = 1 + 0.2 + 0.018 + \cdots \approx 1.219$`. A bank's compound interest, or the value of `$99^5$` written as `$(100 - 1)^5$`, are classic uses. Add terms one at a time:

<figure class="fig" data-fig="c11m-binom-approx"><figcaption>Add the first few terms of (1 + x)ⁿ. Each extra term shrinks the gap to the exact value; for small x two or three terms already agree to several decimals.</figcaption></figure>

<div class="problem" data-problem="c11m-binom-approx"></div>

Another use is divisibility. Write `$11^n = (10 + 1)^n$` and expand: every term except the last, `$1^n$`, is a multiple of 10. So `$11^n$` always leaves remainder 1 when divided by 10.

<div class="keypoints">

- `$(a + b)^n = \sum_{k=0}^{n} {}^nC_k\,a^{n-k}b^k$` for a whole number `$n$`; it has `$n + 1$` terms and the powers of `$a$` and `$b$` add up to `$n$`.
- `$^nC_k$` is the number of ways to pick `$b$` from `$k$` of the `$n$` brackets. The coefficients are row `$n$` of Pascal's triangle and read the same backwards.
- For `$(a - b)^n$` the signs alternate.
- General term: `$T_{k+1} = {}^nC_k\,a^{n-k}b^k$`. To find a given power of `$x$`, set the power equal and solve for `$k$`.
- Middle term: one term `$T_{n/2+1}$` for even `$n$`, two terms for odd `$n$`.
- The sum of the coefficients of `$(1 + x)^n$` is `$2^n$`, and the alternating sum is 0.
- Never write `$(a + b)^n = a^n + b^n$`.

</div>

Going further for JEE/NEET: [Binomial theorem](/learn/courses/engineering-entrance/binomial-theorem/). Related tools: [Binomial expansion](/learn/binomial-expansion/) and the [Binomial distribution lab](/learn/binomial-distribution-lab/).
