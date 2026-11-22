---
title: 'P-values: what they are and what they are not'
summary: 'A p-value is the chance of data at least this extreme if nothing were going on. What it measures, five things it does not mean, why it jumps around between repeats, and how to report it with the effect size.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'An A/B test gives p = 0.03. Which statement is correct?'
    choices: ['There is a 3 % chance the new version is no better', 'If there were truly no difference, a result at least this extreme would happen about 3 % of the time', 'The new version is 97 % likely to be better']
    ans: 1
    why: 'A p-value is computed assuming the null is true. It is not the probability that the null is true, nor that the alternative is.'
  - q: 'Test A gives p = 0.04, test B p = 0.06. What is the right reading?'
    choices: ['A found an effect, B proved there is none', 'The two results are very similar; the 0.05 line is a convention, not a cliff', 'B is twice as reliable']
    ans: 1
    why: 'p = 0.04 and p = 0.06 carry almost the same evidence. Treating 0.05 as a magic boundary turns tiny differences into opposite conclusions.'
  - q: 'You rerun the same experiment with the same sample size. What happens to the p-value?'
    choices: ['It comes out nearly the same', 'It can change a lot, because it depends on the random sample', 'It always gets smaller']
    ans: 1
    why: 'The p-value is itself a random quantity. With modest power, repeats can easily give 0.01 one time and 0.3 the next.'
---

**Module 6 · about 25 minutes · school maths.** You'll be able to define a p-value correctly, avoid the five common misreadings, and report it alongside an effect size and interval.

## 1. The definition

The **p-value** is the probability, *if the null hypothesis were true*, of getting a result at least as extreme as the one you observed.

```math
p = P(\text{result at least this extreme} \mid H_0 \text{ true})
```

Small p: the data would be surprising if nothing were going on. Large p: the data is the kind of thing chance produces often.

In practice: compute the test statistic (Lesson 6.1), then the area beyond it in the null distribution, in both tails for a two-sided test.

## 2. Five things a p-value is not

1. **Not the probability that the null is true.** p = 0.03 doesn't mean "3 % chance of no effect". That needs Bayes (Lesson 2.2) and a prior.
2. **Not the probability the result is due to chance.** Same mistake, different words.
3. **Not the size or importance of the effect.** A tiny effect with huge data gives a tiny p (Lesson 6.9).
4. **Not proof of no effect when large.** p = 0.4 means "can't tell", often because the sample was too small.
5. **Not a cliff at 0.05.** 0.049 and 0.051 carry the same evidence. The American Statistical Association's 2016 statement on p-values makes these same points.

## 3. P-values dance

<!--fig:p-value-dance-->

Run the same experiment 100 times with a real effect of half a standard deviation and 30 people per group. About half the runs reach p < 0.05; the rest don't, though the effect is identical. A single p-value is a noisy measurement. Set the effect to 0: p-values spread evenly between 0 and 1, and about 5 % fall below 0.05. That's the false alarm rate the threshold promises, not a bug.

## 4. How to report

Report **the effect, its interval and the p-value**, in that order of importance:

> "The new page raised conversion from 4.0 % to 4.8 % (difference 0.8 points, 95 % CI 0.0 to 1.6; p = 0.051, n = 5,000 per group)."

That sentence lets a reader judge both how big and how certain. Compare "the result was not significant", which throws away nearly everything.

Write small p-values as "p < 0.001" rather than "p = 0.000".

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the p-value measures how compatible the data is with the null model. It is a tail area of the null distribution of the test statistic.

**Equations:** two-sided z-test `$p = 2\,(1 - \Phi(|z|))$`; t-test `$p = 2\,(1 - F_{t,\,df}(|t|))$`.

| z | 1.645 | 1.96 | 2.576 | 3.29 |
|---|---|---|---|---|
| two-sided p | 0.10 | 0.05 | 0.01 | 0.001 |

**Under the null, p is uniform:** any value between 0 and 1 is equally likely, which is why exactly 5 % of null results fall below 0.05.
</details>

## 5. Worked example

*Made-up numbers (from Lesson 4.4).* A: 200 of 5,000 converted (4.0 %). B: 240 of 5,000 (4.8 %).

- Pooled rate under `$H_0$`: 440 ÷ 10,000 = 4.4 %.
- SE under `$H_0$`: √(0.044 × 0.956 × (1/5,000 + 1/5,000)) ≈ 0.0041.
- z = 0.008 ÷ 0.0041 ≈ **1.95**. Two-sided p ≈ **0.051**.

So: "just short of 0.05". The honest reading: there's suggestive evidence B is better, by somewhere between nothing and 1.6 points. If B is cheap to ship and has no downside, ship it and keep measuring; if it's costly, run the test longer. Neither reading depends on whether p fell on one side of 0.05.

## 6. Practice

1. Rewrite correctly: "p = 0.02, so there's a 98 % chance the campaign worked."
2. A test with 40 customers gives p = 0.35. A colleague says, "So the change has no effect." What do you reply?
3. Two-sided z = 2.576. What's p?

<details>
<summary>Answers</summary>

1. "If the campaign had no effect, results this extreme would occur about 2 % of the time." Report the size of the effect and its interval too.
2. "We couldn't detect one with 40 customers. The interval is wide and includes effects that would matter. We need more data to say there's no meaningful effect."
3. 0.01.
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool shows the null distribution with your statistic and the p-value area shaded.

**New words:** *p-value*, *tail area*, *statistical significance*, *null distribution*.
