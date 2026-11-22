---
title: Probability
seoTitle: 'Probability: JEE maths'
summary: 'Sample spaces and classical probability, the addition rule and complements, conditional probability, independence, total probability and Bayes theorem, random variables with their mean and variance, and the binomial distribution, up to the game and geometric-trial questions of JEE Advanced.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'P(A) = 0.5, P(B) = 0.4 and A, B are independent. What is P(A ∪ B)?'
    choices: ['0.9', '0.7', '0.2', '0.5']
    ans: 1
    why: 'Independent means P(A ∩ B) = 0.5 × 0.4 = 0.2. Then P(A ∪ B) = 0.5 + 0.4 − 0.2 = 0.7.'
  - q: 'A fair coin is tossed 4 times. The probability of at least one head is:'
    choices: ['1/2', '3/4', '15/16', '1/16']
    ans: 2
    why: 'P(no head) = (1/2)⁴ = 1/16, so P(at least one) = 1 − 1/16 = 15/16.'
  - q: 'For a binomial variable with n = 10 and p = 0.2, the variance is:'
    choices: ['2', '1.6', '0.16', '8']
    ans: 1
    why: 'Variance = npq = 10 × 0.2 × 0.8 = 1.6. The mean np = 2 is a different number.'
sources:
  - 'NCERT Mathematics Class 11 (Probability) and Class 12 (Probability): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Statistics and probability'
---

**Maths · Class 12 · about 34 minutes.** By the end you will be able to count outcomes correctly, use the addition, multiplication and complement rules, update a probability when new information arrives (conditional probability and Bayes theorem), and work with random variables and the binomial distribution, including "who wins the game" questions.

<div class="bigidea">Probability is counting with a fair eye: list what can happen, decide which outcomes are equally likely, and count the ones you want. Conditional probability is the same counting done inside a smaller world, the world where you already know something happened.</div>

## 1. Sample space and classical probability

A **random experiment** has outcomes you cannot predict in advance. The set of all outcomes is the **sample space** S, and an **event** is any subset of S. When all outcomes are equally likely,

```math
P(E) = \frac{n(E)}{n(S)}
```

Two dice give 36 equally likely ordered pairs, not 11 sums: a sum of 7 has 6 pairs, a sum of 2 has only one. Cards: 52 cards, 4 suits of 13, 12 face cards (J, Q, K), 4 aces.

For selections without replacement, count with combinations: drawing 2 red from a bag of 5 red and 3 black has probability `$\dfrac{{}^5C_2}{{}^8C_2} = \dfrac{10}{28}$`.

<div class="myth">

**"There are 11 possible sums, so a sum of 7 has probability 1/11."** The 11 sums are not equally likely. Always count in a sample space whose outcomes are equally likely: for two dice, the 36 ordered pairs.

</div>

## 2. Addition rule and complements

```math
P(A \cup B) = P(A) + P(B) - P(A \cap B), \qquad P(A') = 1 - P(A)
```

Subtracting `$P(A \cap B)$` removes the outcomes counted twice. For three events, add the singles, subtract the pairs and add back the triple. **Mutually exclusive** events cannot happen together, so `$P(A \cap B) = 0$`.

The complement is the quickest route for "at least one": P(at least one six in n throws) = `$1 - (5/6)^n$`.

Useful pieces: P(only A) = P(A) − P(A ∩ B); P(exactly one of A, B) = P(A) + P(B) − 2P(A ∩ B); P(neither) = 1 − P(A ∪ B).

## 3. Conditional probability and independence

The probability of A **given** that B has happened:

```math
P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \qquad P(B) \neq 0
```

Think of it as shrinking the sample space to B and asking what fraction of B is also A. Rearranged, it is the **multiplication rule**: `$P(A \cap B) = P(B)\,P(A \mid B)$`, used for one draw after another.

A and B are **independent** when knowing one does not change the other: `$P(A \cap B) = P(A)P(B)$`. Three events are mutually independent only if every pair **and** the triple satisfy the product rule.

<div class="myth">

**"Mutually exclusive events are independent."** The opposite is true. If A and B cannot happen together and both have positive probability, then knowing B happened tells you A did not: P(A | B) = 0 ≠ P(A). Exclusive events (with nonzero probabilities) are always dependent.

</div>

## 4. Total probability and Bayes theorem

Suppose the sample space splits into causes E₁, E₂, …, Eₙ that do not overlap and cover everything. An effect A can happen through any of them:

```math
P(A) = \sum_i P(E_i)\,P(A \mid E_i), \qquad P(E_k \mid A) = \frac{P(E_k)\,P(A \mid E_k)}{\sum_i P(E_i)\,P(A \mid E_i)}
```

<div class="meaning">
<dl>
<dt>E₁, …, Eₙ</dt><dd>the causes (which bag, which machine, which test result); exactly one of them happens</dd>
<dt>P(Eᵢ)</dt><dd>prior probability: how likely the cause was before you saw anything</dd>
<dt>P(A | Eᵢ)</dt><dd>how likely the effect is if that cause is true</dd>
<dt>P(Eₖ | A)</dt><dd>posterior probability: how likely cause k is now that the effect has been seen</dd>
<dt>Physical meaning</dt><dd>Bayes is a share of a total: of all the ways A can happen, what fraction came through Eₖ? Drawing a tree with one branch per cause makes this a two-line sum.</dd>
</dl>
</div>

**Worked example.** A test for a disease is 95% accurate on sick people and gives a false alarm for 2% of healthy people. 1% of people are sick. If a person tests positive, P(sick) = (0.01 × 0.95) ÷ (0.01 × 0.95 + 0.99 × 0.02) = 0.0095 ÷ 0.0293 ≈ 0.32. Only about a third: the healthy group is so large that its few false alarms outnumber the true positives.

<div class="problem" data-problem="prob-bayes"></div>

## 5. Random variables, mean and variance

A **random variable** X gives a number to each outcome (number of heads, money won). Its **probability distribution** lists each value xᵢ with its probability pᵢ, where every pᵢ ≥ 0 and the pᵢ add to 1.

```math
\mu = E(X) = \sum p_i x_i, \qquad \operatorname{Var}(X) = \sum p_i x_i^2 - \mu^2
```

The mean is the long-run average value; the variance measures the spread around it, and the standard deviation is its square root. Rules: E(aX + b) = aE(X) + b and Var(aX + b) = a²Var(X) (adding a constant does not change spread).

**Fair game.** A game is fair when the expected gain is zero. Expected gain = (expected amount received) − (fee paid).

## 6. Bernoulli trials and the binomial distribution

**Bernoulli trials**: a fixed number n of independent trials, each with two outcomes and the same success probability p (q = 1 − p). The number of successes X is **binomial**, B(n, p):

```math
P(X = r) = {}^nC_r\, p^r q^{n-r}, \qquad E(X) = np, \qquad \operatorname{Var}(X) = npq
```

ⁿCᵣ counts the positions the r successes can take; pʳqⁿ⁻ʳ is the probability of any one such sequence. The most likely value (mode) sits near np. Try it:

<figure class="fig" data-fig="prob-binomial"><figcaption>B(n, p). The coloured bars are the event you choose; the dashed line is the mean np. Notice the spread npq is largest when p = 0.5.</figcaption></figure>

<div class="problem" data-problem="prob-binom"></div>

**Given mean and variance.** If np = 4 and npq = 3, then q = 3/4, p = 1/4 and n = 16. Variance can never exceed the mean for a binomial, since q < 1.

## 7. JEE Advanced level: games and repeated trials

**Taking turns.** A and B throw a die in turn, A first; whoever throws a six first wins. A wins on throw 1, 3, 5, …:

```math
P(A) = p + q^2p + q^4p + \cdots = \frac{p}{1 - q^2} = \frac{1/6}{1 - 25/36} = \frac{6}{11}
```

**First success on trial k** (geometric trials): `$q^{k-1}p$`. **At least one success in n trials**: `$1 - q^n$`; to find the least n that makes this exceed a target, take logarithms.

<div class="problem" data-problem="prob-atleast"></div>

**Geometric probability.** When a point is chosen "at random" in a region, probability = favourable length, area or volume ÷ total. Example: two numbers x, y are picked in [0, 1]; P(x + y < 1) is the area of the triangle below the line, 1/2.

<div class="myth">

**"If heads came five times in a row, tails is now due."** Independent trials have no memory. The sixth toss is still 1/2 heads. Streaks feel unusual, but every particular sequence of six tosses has the same probability, 1/64.

</div>

Next: [Probability: question types and traps](/learn/courses/engineering-entrance/probability-questions/).

<div class="keypoints">

- P(E) = n(E)/n(S) only when outcomes are equally likely; for two dice use 36 ordered pairs.
- P(A ∪ B) = P(A) + P(B) − P(A ∩ B); "at least one" = 1 − P(none).
- P(A | B) = P(A ∩ B)/P(B); independence means P(A ∩ B) = P(A)P(B). Exclusive events with positive probabilities are dependent.
- Total probability adds the routes; Bayes takes one route's share of that total. Draw the tree.
- E(X) = Σpx, Var(X) = Σpx² − μ²; Var(aX + b) = a²Var(X).
- Binomial: P(X = r) = ⁿCᵣpʳqⁿ⁻ʳ, mean np, variance npq.
- Alternate turns: P(first player wins) = p/(1 − q²).

</div>
