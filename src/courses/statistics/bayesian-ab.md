---
title: Bayesian A/B testing
summary: 'Instead of a p-value, get the chance that B is better and the expected loss if you pick it. How Beta posteriors work for conversion rates, what the numbers mean, and where Bayesian testing does and does not save you.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'A Bayesian test says P(B better than A) = 94 %. What does that mean?'
    choices: ['Given the data and the prior, there is a 94 % chance B''s true rate is higher than A''s', 'B is 94 % better', 'If there were no difference, this result would happen 6 % of the time']
    ans: 0
    why: 'It is a direct statement about the two rates, which is what managers usually think a p-value says. The third option is closer to a (one-sided) p-value.'
  - q: 'Why do many teams decide on expected loss rather than P(B better)?'
    choices: ['It is easier to compute', 'It weighs how likely B is to be worse by how much worse it would be, so a likely tiny loss can be acceptable', 'It is always larger']
    ans: 1
    why: 'A 90 % chance of being better is fine if the 10 % downside is tiny; expected loss captures that trade-off in one number.'
  - q: 'Does Bayesian testing make peeking harmless?'
    choices: ['Yes, completely', 'No: stopping the first time P(B better) passes 95 % still produces many false wins when there is no real difference', 'Only with a flat prior']
    ans: 1
    why: 'Repeated checks give noise many chances, whatever the method (Lesson 7.4). An expected-loss threshold helps, because when the groups are truly equal the expected loss rarely gets tiny early on.'
---

**Module 7 · about 25 minutes · uses Lessons 2.2 and 7.5.** You'll be able to read a Bayesian A/B result, explain "chance B is better" and "expected loss", and say when the approach helps.

## 1. The question managers actually ask

A p-value answers: "if there were no difference, how surprising is this?" Managers usually want: "what's the chance B is better, and how much do we risk if we pick it?" Bayes' rule (Lesson 2.2) answers that directly, at the cost of stating a **prior**: what you believed about the rates before the test.

<!--fig:bayes-ab-->

Start with 80 vs 100 conversions out of 2,000 each. The curves overlap a little: B is probably better, but not certainly. Raise the visitors (keeping the rates the same) and watch the curves narrow and separate.

## 2. Posteriors for conversion rates

For a conversion rate, a convenient prior is a **Beta distribution**. With a flat prior Beta(1, 1), after `$x$` conversions from `$n$` visitors the **posterior** is Beta(`$x + 1$`, `$n - x + 1$`): a curve of how plausible each rate is.

From the two posteriors you can read:

- **P(B better than A):** the share of plausible (A, B) pairs where B is higher.
- **Expected loss of choosing B:** the average shortfall if B is actually worse, counting the cases where B is better as zero loss.
- **Credible interval** for B − A: the middle 95 % of plausible differences.

Teams typically agree in advance to ship when the expected loss is below a tiny threshold (say 0.01 percentage points), which they can turn into money.

## 3. Priors

- A **flat prior** lets the data speak; with thousands of visitors its effect is negligible.
- An **informative prior** from past tests (most changes move conversion by less than a few percent) shrinks wild early results towards zero. That's a strength, but it must be set before the test and written down.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** posterior ∝ likelihood × prior; for 0/1 outcomes the Beta prior stays Beta after the data (it is *conjugate*).

**Update:**

```math
\text{Beta}(a, b) \xrightarrow{\;x \text{ of } n\;} \text{Beta}(a + x,\; b + n - x)
```

**Chance B is better and expected loss** (estimated by drawing many pairs from the two posteriors):

```math
P(p_B > p_A), \qquad E[\text{loss}_B] = E\big[\max(p_A - p_B,\, 0)\big]
```

**Check with the starting numbers:** Beta(81, 1921) and Beta(101, 1901) give P(B better) ≈ 93.6 %, expected loss ≈ 0.018 points, 95 % credible interval −0.29 to +2.30 points (a million draws in Python). The classic two-sided p-value is 0.13; half of it, 0.064, is close to 1 − 0.936, as it usually is with a flat prior.
</details>

## 4. Worked example

*Made-up test:* new product photos. A: 80 of 2,000 bought (4.0 %). B: 100 of 2,000 (5.0 %).

- Frequentist: +1.0 point, 95 % CI −0.3 to +2.3, p = 0.13. "Not significant."
- Bayesian: 93.6 % chance B is better; if you pick B and it's actually worse, you lose on average 0.018 points.
- The decision rule agreed beforehand: ship when expected loss < 0.01 points. Not yet met; keep running to the planned size.
- Two weeks later, at 4,000 per group with the same rates, P(B better) is about 98 % and expected loss is about 0.003 points, under the 0.01 threshold. Ship.

Both views agree on the evidence. The Bayesian one states it in terms people can act on.

## 5. Where it doesn't help

- **Peeking:** in a quick simulation (no real difference, 4 % conversion, 500 users a group a day, checked daily for 28 days), stopping the first time P(B better) > 95 % gave a false win about **24 %** of the time, close to the frequentist figure in Lesson 7.4.
- **Bad data:** SRM, bots and broken tracking break any method.
- **Many metrics:** checking ten metrics' "chance of being better" still invites cherry-picking.

## 6. Practice

1. With a flat prior, what is the posterior after 30 conversions out of 600?
2. P(B better) = 80 %, expected loss 0.002 points, threshold 0.01. Ship?
3. Why might a team prefer an informative prior centred on zero lift?

<details>
<summary>Answers</summary>

1. Beta(31, 571).
2. Yes by that rule: B is not certainly better, but the likely downside is tiny.
3. Most changes do little, so a prior centred on zero tames lucky early swings and reduces false wins.
</details>

**Try it on your own data:** the [[bayesian-ab-test]] tool computes posteriors, P(B better) and expected loss for your counts; [[distribution-explorer]] draws Beta curves.

**New words:** *prior*, *posterior*, *Beta distribution*, *conjugate prior*, *credible interval*, *expected loss*.
