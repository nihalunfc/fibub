---
title: 'Wisdom of crowds: why many models beat one'
seoTitle: 'Ensemble learning explained: why many models beat one'
summary: 'Many voters who are each only a little better than a coin can be right almost every time, if their mistakes are independent. That is the idea behind ensembles. Change the crowd and see when it works and when it fails.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: Three independent voters are each right 70 % of the time. How often is the majority right?
    choices: ['70 %', 'About 78 %', '100 %']
    ans: 1
    why: 'All three right: 0.343; exactly two right: 3 × 0.49 × 0.3 = 0.441. Total 0.784.'
  - q: What makes an ensemble work?
    choices: ['Models that are better than guessing and make different mistakes', 'Identical models', 'Models that are each perfect']
    ans: 0
    why: Averaging cancels mistakes only if they differ from model to model. Copies of one model make the same mistakes together.
  - q: Every voter is right only 45 % of the time. Adding more independent voters
    choices: ['Helps', 'Makes the majority worse', 'Changes nothing']
    ans: 1
    why: Below 50 % the majority is more often wrong, and more voters make that more certain.
---

**Module 6 · about 20 minutes · read first: 1.6, 5.5.** You'll be able to explain why averaging many models works, compute a majority vote's accuracy, and say what an ensemble needs.

## 1. Why this matters

Ensembles, groups of models whose answers are combined, are behind most winning entries in data competitions and many production systems: random forests and gradient boosting (this module), stacked models, even the habit of averaging several runs of a neural network. The reason they work fits in one simulation.

## 2. A crowd of weak voters

In 1906 Francis Galton saw 787 people at a country fair guess the weight of an ox. Individual guesses were all over the place; the middle guess was within 1 % of the truth. The errors, some too high and some too low, cancelled out.

The same happens with classifiers. Suppose each of `$n$` models is right with probability `$p$`, and their mistakes are **independent**. The majority vote is right whenever more than half are right, and for `$p > 0.5$` that becomes more and more likely as `$n$` grows.

<!--fig:crowd-vote-->

## 3. The catch: independence

Real models trained on the same data make many of the same mistakes. In the simulation, "copying" is the chance that the whole crowd simply follows one shared vote. At 100 % copying, 101 voters are no better than one.

So an ensemble needs two things:

- **Each model better than guessing** (`$p > 0.5$` for two classes). A crowd of bad voters is confidently wrong.
- **Diversity:** models that differ, so their mistakes overlap as little as possible.

The rest of this module is about manufacturing diversity: random samples of rows (bagging, Lesson 6.2), random choices of columns (random forests, 6.3), or models trained one after another on each other's mistakes (boosting, 6.5).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** averaging reduces variance, but only the part of it that is not shared.

**Majority vote** of `$n$` (odd) independent voters each right with probability `$p$`: the number right is binomial, so

```math
P(\text{majority right}) = \sum_{k > n/2} \binom{n}{k} p^k (1-p)^{n-k}
```

**Averaging numbers:** `$n$` predictions, each with variance `$\sigma^2$` and correlation `$\rho$` between any two, have an average with variance

```math
\operatorname{Var}(\bar{f}) = \rho \sigma^2 + \frac{1 - \rho}{n} \sigma^2
```

As `$n$` grows, the second part vanishes, but `$\rho \sigma^2$` stays. Lowering `$\rho$` is the whole game.

**Analogy:** asking for directions. Five strangers who each guess are more reliable together; five people who all read the same wrong sign are not.

**Try it:** five independent voters, each right 60 % of the time. Majority right? (`$P(3) + P(4) + P(5) = 10(0.6^3)(0.4^2) + 5(0.6^4)(0.4) + 0.6^5 = 0.3456 + 0.2592 + 0.0778 = 0.683$`.)
</details>

## 4. Worked example

*Made-up numbers.* Three spam filters, each 80 % accurate, are combined by majority vote.

- **Independent mistakes:** right if at least two are right: `$0.8^3 + 3(0.8^2)(0.2) = 0.512 + 0.384 = 0.896$`. About 90 %, from three 80 % models.
- **Always the same mistakes** (three copies of one filter): 80 %. No gain.
- **Correlation 0.5** in their numeric scores, each with variance 1: the averaged score has variance `$0.5 + 0.5/3 = 0.67$` instead of 1. Some gain, much less than the `$1/3$` that full independence would give.

## 5. Practice

1. In the simulation, with each voter right 60 %, how many independent voters do you need for the majority to be right 90 % of the time?
2. Why would three copies of the same model add nothing?
3. Why must the voters be better than a coin?

<details>
<summary>Answers</summary>

1. About 41 (the curve passes 90 % in the low 40s).
2. They make exactly the same mistakes, so the vote always equals any one of them.
3. If each is more often wrong than right, the majority is wrong even more reliably.
</details>

**Try it on your own data:** the [[small-model-trainer]] trains several kinds of model on the same CSV; compare where each one goes wrong.

**New words:** *ensemble*, *majority vote*, *independent errors*, *diversity*, *correlation between models*.
