---
title: Permutations and Combinations
seoTitle: 'Permutations and Combinations Class 11 notes'
summary: 'Class 11 Permutations and Combinations with animations: counting principle, factorials, nPr, repeated letters, restrictions, nCr and Pascal''s triangle.'
minutes: 85
updated: 2026-11-23
quiz:
  - q: 'In how many ways can 5 different books be arranged on a shelf?'
    choices: ['120', '25', '60', '720']
    ans: 0
    why: 'Five choices for the first place, 4 for the next, and so on: 5! = 120.'
  - q: 'A team of 3 is chosen from 7 students. The number of different teams is:'
    choices: ['35', '210', '21', '343']
    ans: 0
    why: 'Order does not matter, so use 7C3 = 7×6×5 ÷ (3×2×1) = 35. (210 is 7P3, which counts the order.)'
  - q: 'The number of different arrangements of the letters of MAMA is:'
    choices: ['6', '24', '12', '4']
    ans: 0
    why: '4! ÷ (2! × 2!) = 24 ÷ 4 = 6, because M repeats twice and A repeats twice.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 6 “Permutations and Combinations” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard counting results (see e.g. Brualdi, R., Introductory Combinatorics, Pearson, chapters 1 and 2); every worked count was recomputed by listing in code.'
---

**Maths · Class 11 · Chapter 6 · about 85 minutes.** By the end you will be able to count outcomes with the multiplication and addition rules, use factorials, find the number of arrangements (permutations) with or without repeated objects and with simple conditions, and count selections (combinations) using nCr.

<div class="bigidea">Counting is the art of finding "how many" without listing everything. Two rules do almost all the work: when jobs happen <em>one after another</em>, multiply the ways; when you pick <em>one option out of separate kinds</em>, add them. A <strong>permutation</strong> is an arrangement, where order matters. A <strong>combination</strong> is a selection, where order does not matter. Every combination of r things can be arranged in r! orders, which links the two.</div>

## 1. The fundamental principle of counting

You are packing for a trip. You have 3 shirts, 3 trousers and 2 pairs of shoes. How many different outfits (one of each)? Choose a shirt: 3 ways. For each shirt there are 3 trousers, and for each of those, 2 pairs of shoes. The tree below shows every outfit as one path from the root to a leaf. The total is simply the number of leaves.

<figure class="fig" data-fig="c11m-pnc-tree"><figcaption>The multiplication principle. Each leaf is one complete outfit. Change the numbers: the count of leaves is always shirts × trousers × shoes. Press Play to walk through every path.</figcaption></figure>

**Multiplication principle.** If one job can be done in `$m$` ways, and after it a second job can be done in `$n$` ways (whichever way the first was done), then the two jobs together can be done in `$m \times n$` ways. It extends to any number of jobs in a row.

**Addition principle.** If a job can be done *either* in one of `$m$` ways *or* in one of `$n$` completely different ways, with no way counted in both, then it can be done in `$m + n$` ways.

The word to listen for is **and then** (multiply) versus **or** (add).

<figure class="fig" data-fig="c11m-pnc-andor"><figcaption>Delhi to Agra by one of the trains OR one of the buses: add. Delhi to Agra AND THEN Agra to Jaipur: multiply the number of ways for each leg.</figcaption></figure>

<div class="problem" data-problem="c11m-pnc-outfits"></div>

<div class="myth">

**"More choices always means add."** Adding is only for a *single* job done in different styles. If you pick a shirt <em>and</em> a trouser you are doing two jobs, so you multiply. A quick test: if each way of the first job can be followed by every way of the second, multiply. If you are choosing between two kinds of the same single job, add.

</div>

## 2. Factorials and permutations

### 2.1 Arranging all n things

In how many ways can 4 friends A, B, C, D sit in 4 chairs in a row? Fill the chairs from left to right. The first chair can go to any of 4 people. Then 3 people remain for the second chair, then 2, then 1. Step through it:

<div class="steps" data-fig="c11m-pnc-factorial">
<div class="step">Seat 1: all 4 people are free, so 4 choices.</div>
<div class="step">Seat 2: one person is already seated, so 3 choices. Multiply: 4 × 3.</div>
<div class="step">Seat 3: 2 people remain. 4 × 3 × 2.</div>
<div class="step">Seat 4: only 1 person is left. 4 × 3 × 2 × 1 = 24 = 4!.</div>
</div>

The product `$n \times (n-1) \times \cdots \times 2 \times 1$` is written `$n!$` and read "n factorial". So the number of arrangements of `$n$` different things is `$n!$`. For convenience we define `$0! = 1$` (there is exactly one way to arrange nothing: do nothing). Useful facts: `$n! = n \times (n-1)!$`, so `$5! = 5 \times 4! = 120$`.

### 2.2 Arranging r of n things: nPr

Suppose only `$r$` seats are available and you choose from `$n$` people. The first seat has `$n$` choices, the second `$n - 1$`, and so on for `$r$` seats:

```math
{}^nP_r = n(n-1)(n-2)\cdots(n-r+1) = \frac{n!}{(n-r)!}, \qquad 0 \le r \le n
```

<div class="meaning">
<dl>
<dt>`$^nP_r$`</dt><dd>the number of ordered arrangements of `$r$` things chosen from `$n$` different things (order matters).</dd>
<dt>`$n!/(n-r)!$`</dt><dd>`$n!$` counts all, and dividing by `$(n-r)!$` removes the order of the unused things.</dd>
<dt>`$^nP_n = n!$`</dt><dd>using all `$n$` things; and `$^nP_1 = n$`, `$^nP_0 = 1$`.</dd>
</dl>
</div>

Slide `$n$` and `$r$` below. The seats show the choices, and the list shows the actual arrangements so you can see that ABC and ACB count as different.

<figure class="fig" data-fig="c11m-pnc-arrange"><figcaption>nPr: the seat numbers are the choices n, n−1, ..., and their product is the count. The list shows the arrangements themselves (the first 24).</figcaption></figure>

<div class="problem" data-problem="c11m-pnc-digits"></div>

### 2.3 Permutations when repetition is allowed

If each of the `$r$` places can be filled in `$n$` ways every time (a thing may be used again), the count is `$n \times n \times \cdots \times n = n^r$`. A 4-digit PIN from digits 0 to 9 with repeats allowed has `$10^4 = 10{,}000$` possibilities. A code of 3 letters from 26, repeats allowed: `$26^3 = 17{,}576$`.

### 2.4 When some things are alike

How many different words can you make from the letters of BANANA? If all six letters were different we would get `$6! = 720$`. But the three A's are identical: swapping two A's does not make a new word, and the 3 A's can be swapped among themselves in `$3! = 6$` ways. The same goes for the two N's (`$2! = 2$`). So every real arrangement was counted `$3! \times 2!$` times, and the true count is

```math
\frac{n!}{p!\,q!\,r!\cdots} = \frac{6!}{3!\,2!} = \frac{720}{12} = 60
```

where `$p$`, `$q$`, `$r$` are the numbers of identical objects of each kind. Use the slider to divide by each repeated letter, one at a time.

<figure class="fig" data-fig="c11m-pnc-repeat"><figcaption>Treat identical letters as different and you get n!. Then divide by p! for each letter that repeats p times to remove the swaps that change nothing.</figcaption></figure>

<div class="problem" data-problem="c11m-pnc-word"></div>

### 2.5 Counting with conditions

Most board questions add a condition. The trick is to deal with the condition **first**.

- **Two things must be together:** glue them into one block, arrange the blocks, then arrange inside the block.
- **Two things must not be together:** total arrangements minus the arrangements with them together.
- **A place has a restriction** (a number must be even, a number must not start with 0): fill the restricted place first.

<div class="steps" data-fig="c11m-pnc-together">
<div class="step">Five friends A, B, C, D, E stand in a row. Without any condition there are 5! = 120 ways. We want A and B next to each other.</div>
<div class="step">Glue A and B into a block "AB". Now there are only 4 units to arrange: AB, C, D, E.</div>
<div class="step">Four units in a row: 4! = 24 ways.</div>
<div class="step">Inside the block, A and B can be in the order AB or BA: 2! = 2 ways.</div>
<div class="step">Multiply (two jobs in a row): 4! × 2! = 48 ways with A and B together.</div>
<div class="step">For "not together" subtract from the total: 120 − 48 = 72.</div>
</div>

<div class="problem" data-problem="c11m-pnc-together"></div>

**Example: even numbers.** How many 3-digit even numbers can be formed from the digits 1 to 5 without repeating a digit? The last digit must be 2 or 4 (2 choices). The first two places are filled from the remaining 4 digits: `$4 \times 3 = 12$`. Total `$2 \times 12 = 24$`. Note we filled the *restricted* place first.

<div class="myth">

**"Just multiply everything left to right."** Starting with the hundreds place in the example above would leave you unsure how many choices the last place has (it depends on whether you already used a 2 or 4). The cure is to choose the most restricted place first.

</div>

<!--fig:tool counting-machine-->

## 3. Combinations

A permutation cares about order. Often it does not matter: choosing a cricket team of 3 from 7 players, or 5 cards from a pack. The group `{A, B, C}` is one team, however you list it. Such a selection is a **combination**.

Take 3 letters A, B, C. There are `$3! = 6$` arrangements of them (ABC, ACB, BAC, BCA, CAB, CBA) but only **one** combination `{A, B, C}`. In general each combination of `$r$` things gives `$r!$` permutations, so

```math
{}^nP_r = {}^nC_r \times r! \quad\Longrightarrow\quad {}^nC_r = \frac{n!}{r!\,(n-r)!}
```

<div class="meaning">
<dl>
<dt>`$^nC_r$` (or `$\binom{n}{r}$`)</dt><dd>the number of ways to choose `$r$` things from `$n$` different things, order ignored.</dd>
<dt>`$r!$` in the denominator</dt><dd>removes the `$r!$` orderings of the chosen group that were counted as different in nPr.</dd>
<dt>`$^nC_0 = {}^nC_n = 1$`</dt><dd>there is one way to choose nothing and one way to choose everything.</dd>
</dl>
</div>

Tap the cards below to pick `$r$` out of `$n$` and see both the permutations and the combinations of your selection.

<figure class="fig" data-fig="@math-pc-cards"><figcaption>Pick r cards out of n. The same cards in a different order are one combination but different permutations.</figcaption></figure>

<div class="problem" data-problem="c11m-pnc-committee"></div>

### 3.1 Symmetry: nCr = nC(n−r)

When you choose 3 players out of 8 for a match, you are also choosing the 5 who will sit on the bench. Choosing who goes is the same as choosing who stays: `$^nC_r = {}^nC_{n-r}$`. So `$^{100}C_{98} = {}^{100}C_2 = 4950$`; use the smaller r to calculate. Slide `$r$` to see the bars mirror around the middle.

<figure class="fig" data-fig="c11m-pnc-symmetry"><figcaption>Choosing r to take is the same as choosing n − r to leave. The bars of nCr are the same height for r and n − r, with the peak in the middle.</figcaption></figure>

### 3.2 Pascal's triangle

Another identity: `$^nC_r + {}^nC_{r-1} = {}^{n+1}C_r$`. Reason in words: to choose `$r$` from `$n + 1$` people, look at one special person. Either the special person is **in** (choose the other `$r - 1$` from `$n$`: `$^nC_{r-1}$` ways) or **out** (choose all `$r$` from the other `$n$`: `$^nC_r$` ways). Add them. Written as a triangle, each entry is the sum of the two above it. This is *Pascal's triangle*.

<figure class="fig" data-fig="c11m-pnc-pascal"><figcaption>Tap an entry to see the two entries above it that add up to it. Row n holds nC0, nC1, ..., nCn; it reads the same from both ends.</figcaption></figure>

<div class="problem" data-problem="c11m-pnc-handshake"></div>

<!--fig:tool combinatorics-calculator-->

### 3.3 Typical applications

- **Committees and teams:** choose `$r$` of `$n$`. With a condition (at least one woman) count the opposite and subtract, or add the cases.
- **Handshakes and matches:** each pair is a combination of 2, so `$n$` people give `$^nC_2 = n(n-1)/2$` handshakes.
- **Diagonals of a polygon:** an `$n$`-sided polygon has `$^nC_2$` pairs of corners; `$n$` of those are sides, so the number of diagonals is `$^nC_2 - n$`. A hexagon has `$15 - 6 = 9$`.
- **Lines and triangles:** `$n$` points with no three in a line give `$^nC_2$` lines and `$^nC_3$` triangles.
- **Choose and then arrange:** first select the objects with nCr, then arrange them with a factorial. For example, a 3-letter word from 5 different letters, using each letter once, is `$^5C_3 \times 3! = 10 \times 6 = 60$` (which is just `$^5P_3$`).

<div class="myth">

**"Permutation and combination are the same thing."** The test is one question: does swapping the order give something new? A 3-letter locker code is a permutation (123 and 321 are different codes). The 3 students sent for a quiz are a combination (the same three, whichever way you list them).

</div>

<div class="history">

- **c. 200 BCE:** Pingala's work on poetic metres in India describes the pattern of binomial coefficients (the Meru Prastara, later called Pascal's triangle).
- **c. 1150 CE:** Bhaskaracharya's *Lilavati* explains the rule for counting arrangements and selections.
- **1654:** Blaise Pascal and Pierre de Fermat found the laws of chance by counting, which started probability.

</div>

<div class="keypoints">

- Multiplication principle: jobs one after another multiply. Addition principle: separate options for one job add.
- `$n! = n(n-1)\cdots 1$`, `$0! = 1$`. Arrangements of n different things: `$n!$`.
- `$^nP_r = \dfrac{n!}{(n-r)!}$` (order matters); with repetition allowed the count is `$n^r$`.
- With identical objects, divide by the factorial of each repeat: `$\dfrac{n!}{p!\,q!}$`.
- For a condition, handle the restricted place first; "together" means glue, "not together" means total minus together.
- `$^nC_r = \dfrac{n!}{r!(n-r)!}$` (order ignored), `$^nP_r = r!\;{}^nC_r$`, `$^nC_r = {}^nC_{n-r}$`, `$^nC_r + {}^nC_{r-1} = {}^{n+1}C_r$`.

</div>

Going further for JEE/NEET: [Permutations and combinations](/learn/courses/engineering-entrance/permutations-combinations/). Related tools: [Counting machine](/learn/counting-machine/), [Combinatorics calculator](/science/combinatorics-calculator/) and [Binomial expansion](/learn/binomial-expansion/).
