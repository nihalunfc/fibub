---
title: Sequences and Series
seoTitle: 'Sequences and Series Class 11 notes: AP, GP, AM-GM'
summary: 'Class 11 Sequences and Series with animations: sequences, series, AP recap, geometric progressions, AM and GM, and sums of n, n squared and n cubed.'
minutes: 80
updated: 2026-11-23
quiz:
  - q: 'The 6th term of the GP 3, 6, 12, ... is:'
    choices: ['96', '48', '192', '36']
    ans: 0
    why: 'a = 3, r = 2, so a6 = 3 × 2^5 = 96.'
  - q: 'The sum 1 + 2 + 3 + ... + 20 equals:'
    choices: ['210', '200', '420', '190']
    ans: 0
    why: 'n(n+1)/2 = 20 × 21 / 2 = 210.'
  - q: 'The arithmetic mean of 4 and 16 is 10. Their geometric mean is:'
    choices: ['8', '10', '9', '6.4']
    ans: 0
    why: 'GM = √(4 × 16) = √64 = 8, which is less than the AM 10 (AM ≥ GM).'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 8 “Sequences and Series” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard results on arithmetic and geometric progressions and the AM-GM inequality (see e.g. Hardy, G. H., A Course of Pure Mathematics, 10th ed., chapters 1 and 4); every worked example was recomputed in code.'
---

**Maths · Class 11 · Chapter 8 · about 80 minutes.** By the end you will be able to describe a sequence by a rule or by a recurrence, tell a series from a sequence, use arithmetic and geometric progressions (nth term and sum), find AM and GM and compare them, insert means between two numbers, and sum the series `$1 + 2 + 3 + \cdots$`, `$1^2 + 2^2 + \cdots$` and `$1^3 + 2^3 + \cdots$`.

<div class="bigidea">A sequence is a list of numbers in a definite order, each fixed by a rule: 5, 10, 15, ... or 1, 2, 4, 8, ... A series adds the terms. Two patterns matter most: an arithmetic progression adds the same amount each time (a bus fare chart), and a geometric progression multiplies by the same amount each time (compound interest, a ball's bounces). Each has a neat formula for the nth term and for the sum, and comparing the two kinds of average, AM and GM, gives a famous inequality.</div>

## 1. Sequences

A **sequence** is an ordered list `$a_1, a_2, a_3, \dots$`. The number `$n$` is the **position** and `$a_n$` the **nth term**. So a sequence is really a function of the positions `$1, 2, 3, \dots$`. A **finite** sequence stops (the marks of a class in roll-number order); an **infinite** one goes on.

The usual way to describe one is by a rule: `$a_n = 4n - 1$` gives 3, 7, 11, 15, ... Another way is a **recurrence**: give the first term and a rule from one term to the next. The famous example is the Fibonacci sequence, `$a_1 = a_2 = 1$` and `$a_{n+1} = a_n + a_{n-1}$`, which gives 1, 1, 2, 3, 5, 8, 13, ... Pick a rule below, see the dots, and switch to the running sum.

<figure class="fig" data-fig="c11m-seq-pattern"><figcaption>Five rules. The dots are a₁, a₂, a₃, ...; "series" shows the running sums S₁, S₂, ... as bars. The GP leaps up quickly, the AP climbs steadily and (−1)ⁿ jumps between two values.</figcaption></figure>

<div class="problem" data-problem="c11m-seq-recur"></div>

## 2. Series

Add the terms of a sequence and you get a **series**: `$a_1 + a_2 + a_3 + \cdots + a_n$`. We write it with the sigma sign, `$\sum$`, and call the sum of the first `$n$` terms `$S_n$`:

```math
S_n = a_1 + a_2 + \cdots + a_n = \sum_{k=1}^{n} a_k, \qquad a_n = S_n - S_{n-1}
```

The second relation is handy: the nth term is what the sum gained when the nth term was added. A *sequence* is a list; a *series* is a sum. "1, 3, 5, 7" is a sequence; "1 + 3 + 5 + 7 = 16" is a series.

<div class="myth">

**"Sequence and series mean the same thing."** In maths they do not. Write the sequence 2, 4, 6, 8 and its series 2 + 4 + 6 + 8 = 20. The sum is a single number (the series up to the 4th term), and the sequence is the list. In everyday talk (a "TV series") the word means a list, which is the reason for the mix-up.

</div>

## 3. Arithmetic progressions (a recap)

In an **arithmetic progression (AP)** each term is the previous one plus a fixed number, the **common difference** `$d$`: `$a, a + d, a + 2d, \dots$`. A taxi fare of ₹50 plus ₹12 per km gives 62, 74, 86, ... for 1, 2, 3 km, an AP with `$d = 12$`. The nth term and the sum of `$n$` terms are:

```math
a_n = a + (n-1)d, \qquad S_n = \frac{n}{2}\left[2a + (n-1)d\right] = \frac{n}{2}(a + l)
```

where `$l$` is the last term. The bars below show an AP; bars of the same colour are pairs whose total is always the same, which is the reason for the sum formula.

<figure class="fig" data-fig="c11m-seq-ap"><figcaption>An arithmetic progression. Make d negative for a falling AP. The first and last bars add to the same total as the second and second-last, and so on: n/2 pairs.</figcaption></figure>

The story goes that the young Gauss added 1 to 100 this way in seconds. Step through the trick for 1 to 10:

<div class="steps" data-fig="c11m-seq-gauss">
<div class="step">We want S = 1 + 2 + 3 + ... + 10.</div>
<div class="step">Write the same sum again, backwards, underneath: 10 + 9 + 8 + ... + 1.</div>
<div class="step">Add the two rows column by column. Every column adds to 11.</div>
<div class="step">There are 10 columns, so 2S = 10 × 11 = 110. In general 2S = n(n + 1).</div>
<div class="step">Divide by 2: S = 55, and in general S = n(n + 1)/2.</div>
</div>

## 4. Geometric progressions

In a **geometric progression (GP)** each term is the previous one *multiplied* by a fixed number, the **common ratio** `$r$`: `$a, ar, ar^2, \dots$`. A rumour that is told to 3 new people by each person, a sum of money growing at 10% a year (`$r = 1.1$`) and a ball that rises to half its previous height (`$r = 0.5$`) are all geometric.

```math
a_n = a\,r^{\,n-1}, \qquad r = \frac{a_{n+1}}{a_n}
```

<div class="meaning">
<dl>
<dt>`$a$`</dt><dd>the first term.</dd>
<dt>`$r$`</dt><dd>the common ratio: divide any term by the one before it. `$r > 1$` grows, `$0 < r < 1$` shrinks, `$r < 0$` alternates in sign.</dd>
<dt>`$a_n = ar^{n-1}$`</dt><dd>the exponent is `$n - 1$` because the first term has `$r^0$`.</dd>
</dl>
</div>

<div class="problem" data-problem="c11m-seq-gpterm"></div>

### 4.1 The sum of n terms

To add `$a + ar + ar^2 + \cdots + ar^{n-1}$` use a trick similar to Gauss's: multiply by `$r$` and subtract, so that nearly everything cancels.

<div class="steps" data-fig="c11m-seq-gpsteps">
<div class="step">Write the sum: S = a + ar + ar² + ... + ar^(n−1).</div>
<div class="step">Multiply every term by r: rS = ar + ar² + ar³ + ... + arⁿ. Each term moves one place to the right.</div>
<div class="step">Subtract: S − rS = a − arⁿ. All the middle terms cancel in pairs.</div>
<div class="step">Factor: S(1 − r) = a(1 − rⁿ).</div>
<div class="step">Divide by (1 − r) (so r ≠ 1): S = a(rⁿ − 1)/(r − 1). If r = 1 all the terms equal a, so S = na.</div>
<div class="step">Check with 3 + 6 + 12 + 24 + 48: a = 3, r = 2, n = 5 gives 3(32 − 1)/1 = 93, and the terms add to 93.</div>
</div>

Play with `$a$`, `$r$` and `$n$`: the bars are the terms and the line is the running sum.

<figure class="fig" data-fig="c11m-seq-gp"><figcaption>A geometric progression. For r > 1 the bars explode; for 0 < r < 1 they shrink; for negative r they alternate in sign. The line is the running sum Sₙ.</figcaption></figure>

<div class="problem" data-problem="c11m-seq-gpsum"></div>

<!--fig:tool gp-explorer-->

**Example.** A video is shared by 1 person on day 1. Each day every sharer shares it with 2 new people, so the numbers who share on days 1, 2, 3, ... are 1, 2, 4, 8, .... After 10 days the total number of people who have shared it is `$S_{10} = \dfrac{1(2^{10} - 1)}{2 - 1} = 1023$`.

<div class="myth">

**"A GP with r = 2 grows twice as fast as one with r = 1.5."** The ratio is a *multiplier*, so after n steps the difference is `$2^n$` against `$1.5^n$`. After 10 steps that is 1024 against only 58, almost eighteen times as large. Small changes in `$r$` change the outcome enormously, which is why compound interest is so powerful over long periods.

</div>

## 5. Arithmetic mean and geometric mean

For two positive numbers `$a$` and `$b$`:

```math
\text{AM} = \frac{a + b}{2}, \qquad \text{GM} = \sqrt{ab}
```

The AM is the middle number of an AP `$a, \text{AM}, b$` (equal gaps). The GM is the middle number of a GP `$a, \text{GM}, b$` (equal ratios: `$\text{GM}/a = b/\text{GM}$`). For 4 and 16: AM = 10, GM = 8.

**Relationship:** `$\text{AM} \ge \text{GM}$`, with equality only when `$a = b$`. Proof in one line:

```math
\frac{a+b}{2} - \sqrt{ab} = \frac{(\sqrt a - \sqrt b)^2}{2} \ge 0
```

because a square is never negative. Here is a picture of the same thing: on a diameter of length `$a + b$` the radius is the AM, and the perpendicular height where the diameter splits into `$a$` and `$b$` is the GM. A chord cannot be longer than the radius.

<figure class="fig" data-fig="c11m-seq-amgm"><figcaption>The semicircle proof of AM ≥ GM. The radius (AM) is always at least the height (GM) at the dividing point. They are equal only when a = b and the point is the centre.</figcaption></figure>

<div class="problem" data-problem="c11m-seq-gm"></div>

### 5.1 Inserting means

To insert `$n$` arithmetic means between `$a$` and `$b$`, you need an AP with `$n + 2$` terms starting at `$a$` and ending at `$b$`: `$d = (b - a)/(n + 1)$`. To insert `$n$` geometric means, find the ratio from `$b = ar^{n+1}$`, so `$r = (b/a)^{1/(n+1)}$`. For example, 3 geometric means between 2 and 32 need `$r^4 = 16$`, so `$r = 2$`, and the means are 4, 8, 16.

<div class="problem" data-problem="c11m-seq-means"></div>

## 6. Sums of special series

Three sums turn up again and again:

```math
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}, \qquad \sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}, \qquad \sum_{k=1}^{n} k^3 = \left[\frac{n(n+1)}{2}\right]^2
```

The first we proved with Gauss's trick. You can *see* two facts with dots: stacking rows of 1, 2, 3, ... dots makes a triangle; adding the odd numbers 1, 3, 5, ... as L-shaped layers builds a square, so the sum of the first `$n$` odd numbers is `$n^2$`. The cubes formula says the sum of cubes is the **square of the sum**: 1³ + 2³ + 3³ = 36 = 6².

<figure class="fig" data-fig="c11m-seq-special"><figcaption>Choose a series and slide n. Dots show the triangle and the odd-number square; the bars show the squares and cubes adding up. The formula always matches the sum you get by adding term by term.</figcaption></figure>

<div class="problem" data-problem="c11m-seq-squares"></div>

<!--fig:tool sequence-explorer-->

You can combine these to sum other expressions. Example: `$1 \cdot 2 + 2 \cdot 3 + \cdots + n(n+1) = \sum (k^2 + k) = \dfrac{n(n+1)(2n+1)}{6} + \dfrac{n(n+1)}{2} = \dfrac{n(n+1)(n+2)}{3}$`.

<div class="history">

- **c. 800 BCE to 200 BCE:** Indian *Sulba Sutras* and Jain texts use sums of series; Pingala's metres produce the Fibonacci-like patterns (called *Mātrāmeru*).
- **499 CE:** Aryabhata gives rules for the sum of an AP and for the sums of squares and cubes.
- **1202:** Leonardo of Pisa (Fibonacci) writes about the sequence 1, 1, 2, 3, 5, ... in *Liber Abaci*, a rabbit-breeding problem.
- **1790s:** The young Gauss adds 1 to 100 in seconds using the pairing trick.

</div>

**Beyond the syllabus (not examined in the Class 11 paper): the sum to infinity.** A GP with `$|r| < 1$` has terms that shrink to nothing. Then the partial sums settle to a limit `$\dfrac{a}{1 - r}$`. Walk 1 m, then half a metre, then a quarter, ...: you get to 2 m but never beyond. For `$|r| \ge 1$` there is no limit. This is the idea behind recurring decimals: `$0.333\ldots = \dfrac{0.3}{1 - 0.1} = \dfrac13$`. Check the current CBSE syllabus for what is asked this year.

<figure class="fig" data-fig="c11m-seq-converge"><figcaption>Beyond the syllabus: for |r| < 1 the running sum of 1 + r + r² + ... homes in on 1/(1 − r). Play to add the terms one by one. For |r| ≥ 1 it never settles.</figcaption></figure>

<div class="keypoints">

- A sequence is an ordered list given by a rule or a recurrence; a series is the sum of its terms, `$S_n = a_1 + \cdots + a_n$`, and `$a_n = S_n - S_{n-1}$`.
- AP: `$a_n = a + (n-1)d$`, `$S_n = \tfrac n2[2a + (n-1)d]$`.
- GP: `$a_n = ar^{n-1}$`, `$S_n = \dfrac{a(r^n - 1)}{r - 1}$` for `$r \ne 1$` (and `$na$` if `$r = 1$`).
- `$\text{AM} = \tfrac{a+b}{2}$`, `$\text{GM} = \sqrt{ab}$`, and `$\text{AM} \ge \text{GM}$` with equality only if `$a = b$`.
- To insert `$n$` means between `$a$` and `$b$`: use `$n + 2$` terms; `$d = \tfrac{b-a}{n+1}$` for an AP and `$r = (b/a)^{1/(n+1)}$` for a GP.
- `$\sum k = \tfrac{n(n+1)}2$`, `$\sum k^2 = \tfrac{n(n+1)(2n+1)}6$`, `$\sum k^3 = \left[\tfrac{n(n+1)}2\right]^2$`.

</div>

Going further for JEE/NEET: [Sequences and series](/learn/courses/engineering-entrance/sequences-series/). Related tools: [GP explorer](/learn/gp-explorer/), [AP explorer](/learn/ap-explorer/) and [Sequence explorer](/learn/sequence-explorer/).
