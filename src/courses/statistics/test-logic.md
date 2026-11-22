---
title: 'The logic of a test: null, alternative and evidence'
summary: 'A hypothesis test is a proof by surprise: assume nothing is going on (the null), work out what chance alone would produce, and see whether your result is too unusual to believe. The steps, the words and the courtroom analogy.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A new page is tested against the old one. What is the null hypothesis?'
    choices: ['The new page is better', 'There is no difference between the pages in the population', 'The test was run correctly']
    ans: 1
    why: 'The null is the "nothing is going on" story. The test asks whether the data is too unusual to fit it.'
  - q: 'A test gives p = 0.30. What should you conclude?'
    choices: ['The pages are the same', 'The data is consistent with no difference; we did not find evidence of one', 'The new page is 30 % better']
    ans: 1
    why: 'Failing to reject the null is not proof it is true. There may be a small effect the test could not detect (Lesson 6.4).'
  - q: 'Why is a two-sided test the usual default?'
    choices: ['It is easier to compute', 'Because a change can help or hurt, and you want to notice either', 'It always gives smaller p-values']
    ans: 1
    why: 'A new design can make things worse. A one-sided test only looks in one direction, so use it only when the other direction truly does not matter, decided before seeing data.'
---

**Module 6 · about 20 minutes · no new maths.** You'll be able to set up a null and alternative hypothesis, explain how a test weighs evidence, and state a result correctly.

## 1. Proof by surprise

You run a side-by-side test: 100 visitors choose between the old and new checkout layout, and 62 pick the new one. Is the new layout preferred, or could a 62–38 split happen by chance even if people had no preference?

A **hypothesis test** answers by assuming the boring explanation and checking whether the data fits it:

1. **Null hypothesis** `$H_0$`: nothing is going on. Here, each visitor is equally likely to pick either layout (p = 0.5).
2. **Alternative** `$H_1$`: something is going on (p ≠ 0.5).
3. Work out what results chance alone would produce under `$H_0$`.
4. If your result would be **rare** under `$H_0$`, reject `$H_0$`. If not, you **fail to reject** it.

<!--fig:null-sim-->

With 5,000 simulated no-preference worlds, a split as lopsided as 62–38 (in either direction) happens about 2 % of the time. Rare, so the "no preference" story looks hard to believe. Try 56: it happens about 27 % of the time, so it's quite believable under no preference.

## 2. The courtroom analogy

| Courtroom | Test |
|---|---|
| Presumed innocent | Assume `$H_0$` (no effect) |
| Evidence | Data |
| "Beyond reasonable doubt" | Significance level α, often 5 % |
| Guilty | Reject `$H_0$` |
| Not guilty (not "innocent") | Fail to reject `$H_0$` |
| Convicting an innocent person | Type I error (Lesson 6.4) |
| Letting a guilty person go | Type II error |

"Not guilty" doesn't mean the defendant didn't do it; it means the evidence wasn't strong enough. Likewise, p = 0.30 doesn't show the pages are equal; it shows the data can't tell them apart.

## 3. The steps every test follows

1. State `$H_0$` and `$H_1$`, and pick α (usually 0.05), **before** looking at results.
2. Choose a **test statistic**: a number that measures how far the data is from `$H_0$`, usually (estimate − null value) ÷ SE.
3. Find its distribution under `$H_0$` (normal, t, chi-square...).
4. Compute the **p-value**: the chance, under `$H_0$`, of a statistic at least as extreme as yours (Lesson 6.2).
5. Decide: p ≤ α → reject `$H_0$`; otherwise, don't. Then report the **size** of the effect with a confidence interval.

**One-sided or two-sided?** A two-sided alternative (≠) catches effects in either direction and is the safe default. One-sided (>) is for when only one direction matters and you decided that in advance.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** measure how far the result is from the null in units of standard errors, then ask how often chance goes that far.

**Equation (most tests):**

```math
\text{test statistic} = \frac{\text{estimate} - \text{value under } H_0}{\text{standard error}}
```

For the layout test: `$\hat p$` = 0.62, null 0.5, SE under the null `$\sqrt{0.5 \times 0.5 / 100}$` = 0.05, so z = (0.62 − 0.5) ÷ 0.05 = **2.4**. Two-sided p = 2 × P(Z > 2.4) ≈ 0.016, close to the simulation (the exact count-based answer is 0.021).

**Link to intervals:** reject `$H_0$` at 5 % exactly when the null value lies outside the 95 % confidence interval.
</details>

## 4. Worked example

*Made-up numbers.* A supplier claims a mean pack weight of 500 g. You weigh 36 packs: mean 497.6 g, s = 6 g.

- `$H_0$`: μ = 500. `$H_1$`: μ ≠ 500. α = 0.05.
- SE = 6 ÷ √36 = 1. Statistic t = (497.6 − 500) ÷ 1 = **−2.4**, with 35 degrees of freedom.
- Two-sided p ≈ **0.022**. Below 0.05: reject `$H_0$`.
- Effect: packs average 2.4 g light (95 % CI about 0.4 g to 4.4 g light).

Report: "Packs averaged 497.6 g, 2.4 g below the claimed 500 g (95 % CI 0.4 to 4.4 g below, t = −2.4, p = 0.02, n = 36)." Whether 2.4 g matters is a business question, not a statistical one.

## 5. Practice

1. Write `$H_0$` and `$H_1$` for: "Does the loyalty email change average spend?"
2. A test gives p = 0.003 at α = 0.05. What do you conclude, and what should you report alongside it?
3. Why must α be chosen before seeing results?

<details>
<summary>Answers</summary>

1. `$H_0$`: average spend is the same with and without the email. `$H_1$`: it differs.
2. Reject `$H_0$`: the data is very unlikely under no effect. Report the size of the difference and its confidence interval.
3. Choosing it after lets you move the goalposts to get the answer you wanted, which makes the error rate meaningless.
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool runs z, t, proportion and chi-square tests on your numbers and explains each step.

**New words:** *hypothesis test*, *null hypothesis*, *alternative hypothesis*, *test statistic*, *significance level α*, *reject / fail to reject*, *one-sided*, *two-sided*.
