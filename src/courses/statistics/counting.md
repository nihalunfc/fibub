---
title: 'Counting: combinations and permutations'
summary: 'How many ways can things happen? Factorials, permutations (order matters) and combinations (order does not), with analyst uses: how many test variants, how many pairs to compare, and the binomial coefficient behind the next module.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'You want to compare every pair of 6 store formats. How many comparisons is that?'
    choices: ['12', '15', '30']
    ans: 1
    why: 'Pairs ignore order, so it is 6 choose 2 = 6 × 5 ÷ 2 = 15. Lesson 6.8 explains why that many tests needs care.'
  - q: 'How many ways can 3 banners fill the top, middle and bottom slots, chosen from 5 designs?'
    choices: ['10', '60', '125']
    ans: 1
    why: 'Order matters (top is different from bottom) and no design repeats: 5 × 4 × 3 = 60 permutations.'
  - q: 'An email test has 3 subject lines, 2 images and 4 send times. How many versions is a full test?'
    choices: ['9', '24', '12']
    ans: 1
    why: 'Independent choices multiply: 3 × 2 × 4 = 24. Each version needs enough traffic, so full combination tests grow expensive fast.'
---

**Module 2 · about 15 minutes · school maths.** You'll be able to count outcomes with the multiplication rule, factorials, permutations and combinations, and see why the number of tests or variants grows so fast.

## 1. Why analysts count

Counting tells you how big a problem is before you start: how many versions a test needs, how many pairs of groups you might compare, how many ways k of n customers can respond. It also supplies the "n choose k" in the binomial distribution (Lesson 3.2).

## 2. The multiplication rule

If one choice has `$a$` options and a second, independent choice has `$b$`, together there are `$a \times b$` options. Three subject lines × two images × four send times = 24 email versions. This is why "test everything at once" quickly needs enormous traffic.

## 3. Factorials and permutations

The number of ways to put `$n$` different things in order is `$n!$` ("n factorial"): `$n \times (n-1) \times \cdots \times 1$`. Five products can be lined up on a shelf in 5! = 120 ways.

If you only fill `$k$` ordered slots from `$n$` things, that's a **permutation**:

```math
{}^{n}P_{k} = \frac{n!}{(n-k)!} = n \times (n-1) \times \cdots \times (n-k+1)
```

## 4. Combinations

When order does not matter (a team, a set of pairs, which customers said yes), divide out the `$k!$` orderings of each group. That is a **combination**, "n choose k":

```math
\binom{n}{k} = \frac{n!}{k!\,(n-k)!}
```

- Pairs among `$m$` groups: `$\binom{m}{2} = m(m-1)/2$`. With 10 regions, 45 pairs.
- Which 3 of 10 customers responded: `$\binom{10}{3} = 120$` possible sets.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** count ordered arrangements first, then divide by the number of orderings you do not care about.

**Equations:** `$n!$`; `${}^nP_k = n!/(n-k)!$`; `$\binom{n}{k} = n!/(k!(n-k)!)$`. Note `$\binom{n}{k} = \binom{n}{n-k}$`: choosing 3 to include is the same as choosing 7 to leave out.

**In code:** Excel `COMBIN(10,3)` and `PERMUT(5,3)`; Python `math.comb(10, 3)` and `math.perm(5, 3)`.

**Analogy:** a pizza with 3 toppings from 10: pepperoni-mushroom-olive is the same pizza in any order (a combination). A podium of 3 runners from 10: gold-silver-bronze order matters (a permutation).
</details>

## 5. Worked example

*Made-up numbers.* A product manager wants to test 4 new checkout features. Each can be on or off.

- Full combination: 2 × 2 × 2 × 2 = **16** versions.
- With 1,600 buyers a week split 16 ways, each version gets 100 buyers a week: far too few to see small effects (Lesson 7.3).
- Testing each feature on its own against the current page: 4 tests, or one test with 5 arms.
- Comparing every pair among those 5 arms afterwards: `$\binom{5}{2} = 10$` comparisons, which raises the chance of a false "win" (Lesson 6.8).

Counting first turned an impossible plan into a workable one.

## 6. Practice

1. How many ways can 4 managers be ranked 1st to 4th?
2. How many ways can you choose 2 stores to visit from 12?
3. A menu test has 3 prices × 2 layouts × 2 photos. How many versions?

<details>
<summary>Answers</summary>

1. 4! = 24.
2. `$\binom{12}{2}$` = 12 × 11 ÷ 2 = 66.
3. 12.
</details>

**Try it on your own data:** the [[combinatorics-calculator]] works out factorials, permutations and combinations for any numbers, and the [[counting-machine]] lists every arrangement for small cases.

**New words:** *multiplication rule*, *factorial*, *permutation*, *combination*, *n choose k*.
