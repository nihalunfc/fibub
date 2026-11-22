---
title: Arithmetic Progressions
seoTitle: 'Arithmetic Progressions Class 10 notes and examples'
summary: 'Class 10 Arithmetic Progressions with animations: common difference, nth term, sum of n terms, Gauss pairing trick and word problems, with practice.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'The common difference of the AP 12, 9, 6, 3, … is:'
    choices: ['−3', '3', '−12', '4']
    ans: 0
    why: 'Subtract each term from the next one: 9 − 12 = −3. The terms fall by 3 each time, so d is negative.'
  - q: 'The 15th term of the AP 4, 7, 10, … is:'
    choices: ['46', '49', '43', '45']
    ans: 0
    why: 'a = 4 and d = 3, so a₁₅ = 4 + 14 × 3 = 46. There are only 14 steps of d between the first term and the 15th.'
  - q: 'The sum of the first 10 terms of 2, 4, 6, 8, … is:'
    choices: ['110', '100', '55', '220']
    ans: 0
    why: 'S = n/2 × [2a + (n − 1)d] = 5 × (4 + 18) = 110. Check: the 10th term is 20 and 10 × (2 + 20) / 2 = 110.'
sources:
  - 'NCERT Class 10 Mathematics, Chapter 5 “Arithmetic Progressions” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school algebra: n-th term and sum of an AP. The Gauss pairing story is a widely told anecdote (Sartorius von Waltershausen, 1856); the trick itself is the proof used here.'
---

**Maths · Class 10 · Chapter 5 · about 50 minutes.** By the end you will be able to spot an arithmetic progression, find any term of it without writing out all the earlier ones, add up many terms in one line, and use all this in real problems like seats in a stand or monthly savings.

<div class="bigidea">Some lists of numbers go up (or down) by the same amount at every step, like the steps of a staircase or the metre readings of an auto rickshaw. Such a list is an arithmetic progression. Because it is so regular, there are two short formulas: one finds any term, and one adds up as many terms as you like.</div>

## 1. What is an arithmetic progression?

An **arithmetic progression (AP)** is a list of numbers in which each term is got by **adding the same fixed number** to the one before. That fixed number is the **common difference**, written `$d$`. The first term is written `$a$`.

Think of the fare for an auto: ₹30 for the first km and then ₹15 more for every extra km gives 30, 45, 60, 75, … Or the steps up to a temple: every step is the same height higher than the last. Press the sliders to build your own staircase. Make `d` negative and the stairs go down.

<figure class="fig" data-fig="c10-ap-staircase"><figcaption>An AP is a staircase: every step is d higher than the last. Bars below the line are negative numbers. When d = 0 the staircase is flat: still an AP.</figcaption></figure>

To find `$d$`, subtract any term from the term **after** it:

```math
d = a_2 - a_1 = a_3 - a_2 = a_4 - a_3 = \cdots
```

If these differences are not all equal, the list is **not** an AP. Test several lists:

<figure class="fig" data-fig="c10-ap-identify"><figcaption>Choose a list and the figure subtracts neighbours. The same difference all the way means an AP. The squares 1, 4, 9, 16 have differences 3, 5, 7: they keep growing, so they are not an AP.</figcaption></figure>

<div class="meaning">
<dl>
<dt>a (or a₁)</dt><dd>the first term of the progression.</dd>
<dt>d</dt><dd>common difference: second minus first. Positive d makes the list rise, negative d makes it fall, d = 0 keeps it constant.</dd>
<dt>aₙ</dt><dd>the nth term, for example a₇ is the seventh term.</dd>
<dt>n</dt><dd>the number of terms (or the position of a term).</dd>
<dt>l</dt><dd>the last term of a finite AP (the nth term).</dd>
</dl>
</div>

A list that ends (like 3, 7, 11, 15) is a **finite AP**; one that goes on for ever (3, 7, 11, 15, …) is an **infinite AP**.

<div class="myth">

**“The common difference is always positive.”** It can be negative or zero. For 20, 17, 14, … we have `$d = -3$`. Also `$d$` is *second minus first*, not first minus second.

</div>

## 2. The nth term

Suppose you want the 100th term of 5, 8, 11, … You could keep adding 3 a hundred times, but there is a faster way. Look at what each term is made of:

<div class="steps" data-fig="c10-ap-nth">
<div class="step">The first term is just a. It has no d added to it yet.</div>
<div class="step">The second term is the first term plus one d.</div>
<div class="step">The third term is the first term plus two d's: one step to get to the second, another to reach the third.</div>
<div class="step">The fourth term has three d's. Pattern: the number of d's is always one fewer than the position of the term.</div>
<div class="step">So the nth term is a plus (n − 1) d's. For a = 5 and d = 3, the 20th term is 5 + 19 × 3 = 62.</div>
</div>

```math
a_n = a + (n-1)d
```

Another way to see it: you stand on the number line at `$a$` and make `$n-1$` hops, each of size `$d$`. Where you land is `$a_n$`. Change `a`, `d` and `n`, and watch the frog.

<figure class="fig" data-fig="c10-ap-hops"><figcaption>Start at a, make (n − 1) hops of size d, and you land on the nth term. With n = 1 there are no hops: a₁ = a. A negative d sends the frog left.</figcaption></figure>

<div class="problem" data-problem="c10m-ap-term"></div>

**Which term is a given number?** Put the formula equal to the number and solve for `$n$`. For 5, 11, 17, … and the number 119: `$5 + (n-1) \times 6 = 119$`, so `$n - 1 = 19$` and `$n = 20$`. If `$n$` comes out as a fraction or a negative number, the number is **not** a term of the AP.

<div class="problem" data-problem="c10m-ap-which"></div>

**Number of terms.** The same idea tells you how many terms are in a finite AP: set the last term equal to `$a + (n-1)d$` and solve for `$n$`.

<div class="problem" data-problem="c10m-ap-count"></div>

**Finding d from two terms.** From the `$p$`th term to the `$s$`th term you add `$d$` exactly `$s - p$` times, so `$a_s - a_p = (s - p)d$`. You do not need `$a$` at all.

<div class="problem" data-problem="c10m-ap-finddiff"></div>

Play with the whole thing, with the staircase, the formula and fresh practice questions:

<!--fig:tool ap-explorer-->

<div class="myth">

**“The nth term is `$a + nd$`.”** The first term has *no* d added, so the nth term has `$n-1$` of them. Test with `$n = 1$`: the formula must give `$a$`.

</div>

## 3. The sum of the first n terms

A teacher once asked a class to add 1 + 2 + 3 + … + 100 and expected a quiet half hour. A young boy, Carl Friedrich Gauss, is said to have answered in seconds. His trick works for **every** AP. See it for 1 to 10:

<div class="steps" data-fig="c10-ap-gauss">
<div class="step">We want S = 1 + 2 + 3 + … + 10.</div>
<div class="step">Write the same sum again underneath, but backwards: 10 + 9 + 8 + … + 1. It is still S.</div>
<div class="step">Add column by column. 1 + 10 = 11, 2 + 9 = 11, 3 + 8 = 11 … every column gives 11. This is no accident: as one term goes up by d, the one above it goes down by d.</div>
<div class="step">There are 10 columns, each 11, so the two rows together make 10 × 11 = 110. That is S + S, which is 2S.</div>
<div class="step">So S = 110 ÷ 2 = 55. In words: number of terms × (first + last) ÷ 2.</div>
</div>

With letters, for any AP with first term `$a$`, last term `$l$` and `$n$` terms, writing the sum forwards and backwards:

```math
\begin{aligned}
S &= a + (a+d) + \cdots + (l-d) + l \\
S &= l + (l-d) + \cdots + (a+d) + a \\
2S &= n\,(a + l)
\end{aligned}
```

and since `$l = a + (n-1)d$` we get the two forms of the formula:

```math
S_n = \frac{n}{2}\,(a + l) \qquad\text{or}\qquad S_n = \frac{n}{2}\,\big[\,2a + (n-1)d\,\big]
```

Use the first when you know the last term, the second when you know `$d$`.

Here is the same idea as an **area**. The terms are the heights of columns of squares. The sum is the number of squares. A second, upside-down copy fits exactly onto the first to make a rectangle that is `$n$` wide and `$a + l$` tall. Toggle the flipped copy.

<figure class="fig" data-fig="c10-ap-trapezium"><figcaption>Two staircases fit into a rectangle n wide and (a + l) tall, so S = n(a + l)/2. The picture of one staircase on its own is a trapezium, and its area formula is the same: half the sum of the parallel sides times the width.</figcaption></figure>

<div class="problem" data-problem="c10m-ap-sum"></div>

**Sum of the first n natural numbers.** With `$a = 1$`, `$d = 1$`, `$l = n$`:

```math
1 + 2 + 3 + \cdots + n = \frac{n(n+1)}{2}
```

so 1 + 2 + … + 100 = 100 × 101 ÷ 2 = 5050. And the first `$n$` odd numbers 1 + 3 + 5 + … add up to exactly `$n^2$`.

**Sum of multiples.** To add the multiples of 7 up to 100, write them as an AP: 7, 14, …, 98, with `$a = 7$`, `$l = 98$` and 14 terms, so `$S = 14 \times 105 / 2 = 735$`.

<div class="problem" data-problem="c10m-ap-multiples"></div>

**When does the sum stop growing?** If `$d$` is negative the terms eventually become negative, and adding a negative term makes the sum smaller. Try `a = 20`, `d = −3` below. The sum climbs while the terms are positive, peaks, and falls.

<figure class="fig" data-fig="c10-ap-sumcurve"><figcaption>Bars show S₁, S₂, S₃, … With d positive and a positive, the sum only grows. With a negative d the sum peaks at the last positive term (the orange bar), then shrinks.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Sₙ</dt><dd>the sum of the first n terms. Note S₁ = a₁ and aₙ = Sₙ − Sₙ₋₁: the nth term is what you added to get from the sum of n − 1 terms to the sum of n terms.</dd>
<dt>n/2 × (a + l)</dt><dd>the average of the first and last term times the number of terms. In an AP the terms are spread evenly, so their average is the average of the ends.</dd>
</dl>
</div>

## 4. Word problems with APs

Real situations fit an AP when something changes by a fixed amount again and again: rows of seats, instalments that rise by a fixed sum, bricks stacked in a pile, depth of a well charged at a rising rate per metre. The recipe: find `$a$`, `$d$`, `$n$`; decide whether you need `$a_n$` or `$S_n$`; use the formula; read the answer in the story.

<div class="steps" data-fig="c10-ap-seats">
<div class="step">A stand has 15 rows. The first row has 20 seats and each row behind has 2 more than the one in front. How many seats in all?</div>
<div class="step">The rows form an AP: 20, 22, 24, … so a = 20 and d = 2, and the number of rows is n = 15.</div>
<div class="step">The last row is the 15th term: l = 20 + 14 × 2 = 48 seats. The picture shows it is the widest.</div>
<div class="step">The total is the sum of the 15 terms: S = n(a + l)/2 = 15 × (20 + 48) / 2.</div>
<div class="step">15 × 68 / 2 = 15 × 34 = 510 seats in all.</div>
</div>

<div class="problem" data-problem="c10m-ap-seats"></div>

<div class="history">

<ul class="timeline">
<li><b>about 1650 BCE</b> The Egyptian Rhind papyrus has a problem about dividing 100 loaves among five people so that the shares are in AP.</li>
<li><b>499 CE</b> Aryabhata, in the Aryabhatiya, gives rules for the sum and the number of terms of an AP.</li>
<li><b>about 628 CE</b> Brahmagupta states the rule for the sum of a series with a common difference in the Brahmasphutasiddhanta.</li>
<li><b>about 1150 CE</b> Bhaskara II’s Lilavati has many AP problems in verse, such as finding the number of terms.</li>
<li><b>1780s</b> The young Gauss is said to find 1 + 2 + … + 100 by pairing.</li>
</ul>

</div>

<div class="keypoints">

- An AP is a list where each term is the one before plus a fixed number `$d$`, the common difference (second − first).
- `$d>0$` rises, `$d<0$` falls, `$d=0$` stays constant.
- nth term: `$a_n = a + (n-1)d$`. There are `$n-1$` steps of `$d$` from the first term to the nth.
- `$a_s - a_p = (s-p)d$`: find `$d$` from any two terms.
- Number of terms: solve `$l = a + (n-1)d$` for `$n$`. It must be a positive whole number.
- Sum: `$S_n = \dfrac{n}{2}(a + l) = \dfrac{n}{2}[2a + (n-1)d]$`, from writing the sum forwards and backwards.
- `$1 + 2 + \cdots + n = \dfrac{n(n+1)}{2}$`; the sum of the first `$n$` odd numbers is `$n^2$`.
- `$a_n = S_n - S_{n-1}$`.

</div>

Ready for exam-style questions? Go to [Arithmetic Progressions: practice questions](/learn/courses/ncert-class-10-maths/arithmetic-progressions-practice/).
