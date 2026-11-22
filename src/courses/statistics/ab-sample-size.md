---
title: Sample size and how long to run
summary: 'Plan an A/B test''s size from the baseline rate, the minimum detectable effect, α and power; turn it into days of traffic, round to whole weeks, and decide what to do when the traffic simply is not there.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Baseline conversion 10 %, you want to detect 12 % with 80 % power at α = 0.05 (two-sided). About how many users per group?'
    choices: ['About 400', 'About 3,800', 'About 38,000']
    ans: 1
    why: 'The formula gives 3,841 per group for 10 % → 12 %.'
  - q: 'You halve the minimum detectable effect. How does the sample size change?'
    choices: ['It doubles', 'It roughly quadruples', 'It halves']
    ans: 1
    why: 'n scales with 1/effect², so half the effect needs about 4 times the users.'
  - q: 'The test needs 9 days of traffic. How long should it run?'
    choices: ['9 days', '14 days (two full weeks)', '7 days']
    ans: 1
    why: 'Round up to whole weeks so every weekday is represented equally; behaviour often differs on weekends.'
---

**Module 7 · about 25 minutes · school maths.** You'll be able to compute the users needed for a conversion test, turn that into a duration, and choose what to do when traffic is short.

## 1. Four inputs

1. **Baseline rate** `$p_1$`: the current conversion (from recent data).
2. **Minimum detectable effect (MDE)**: the smallest lift worth detecting, set by value and cost, not by hope. Absolute (+0.4 points) or relative (+10 %).
3. **α**: usually 0.05, two-sided.
4. **Power**: usually 0.8.

<!--fig:ab-planner-->

## 2. The formula

Visitors per group for a two-sided two-proportion test:

```math
n = \frac{\left(z_{1-\alpha/2}\sqrt{2\bar p(1-\bar p)} + z_{1-\beta}\sqrt{p_1(1-p_1) + p_2(1-p_2)}\right)^2}{(p_2 - p_1)^2}
```

where `$p_2 = p_1 + \text{MDE}$` and `$\bar p = (p_1 + p_2)/2$`. A good quick approximation is

```math
n \approx \frac{16\,p(1-p)}{\delta^2}
```

with `$\delta$` the absolute difference (it's Lehr's rule from Lesson 6.4, since the SD of a 0/1 metric is `$\sqrt{p(1-p)}$`).

For a mean metric (revenue per user) use `$n \approx 16\sigma^2/\delta^2$` with σ from past data.

## 3. From users to days

- Days = 2n ÷ eligible users per day (for 50/50).
- **Round up to whole weeks.** Minimum one week; two is safer.
- Count **users**, not visits, if users are the unit; returning visitors add less new information than new ones.
- Don't plan to stop early on a good result (Lesson 7.4).

## 4. When traffic is short

If the test would take months:

- **Test bigger changes.** A bolder redesign has a bigger plausible effect.
- **Use a more sensitive metric** closer to the change (add-to-cart instead of purchase), knowing it's a step removed from value.
- **Reduce variance:** CUPED, capping outliers, triggering only affected users.
- **Accept more risk:** α = 0.10 or power 0.7, stated in advance.
- **Don't test:** for low-risk, easily reversed changes, sometimes shipping and monitoring is the sensible choice.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the test must make the difference you care about stand out from noise: `$\delta$` must be about 2.8 standard errors (1.96 + 0.84) for 80 % power at α = 0.05.

**Derivation of the quick rule:** SE of the difference ≈ `$\sqrt{2p(1-p)/n}$`. Setting `$\delta = 2.8 \times \text{SE}$` and solving: `$n = 2 \times 2.8^2\,p(1-p)/\delta^2 \approx 15.7\,p(1-p)/\delta^2$`.

**Check:** p = 0.10, δ = 0.02: `$16 \times 0.09 / 0.0004 = 3{,}600$`; exact formula 3,841 (tests/stats.mjs checks this).
</details>

## 5. Worked example

*Made-up numbers.* Checkout conversion is 4 %. The team cares about +10 % relative (to 4.4 %). 6,000 eligible users a day.

- Exact formula: about **39,500 per group** (the simulation gives the exact figure).
- Total 79,000 users ÷ 6,000 a day ≈ 13.2 days → **2 weeks**.
- If they wanted +5 % relative (4.2 %): about 154,000 per group, about 52 days → 8 weeks. Probably too long; the team might settle for detecting +7.5 %, or test a bolder change.

## 6. Practice

1. Quick rule: p = 0.2, detect +0.02 absolute. n per group?
2. Revenue per user has SD $80. Detect a $2 difference. n per group?
3. The plan needs 50,000 per group and you get 4,000 eligible users a day. How many weeks?

<details>
<summary>Answers</summary>

1. 16 × 0.16 ÷ 0.0004 = 6,400.
2. 16 × 6,400 ÷ 4 = 25,600.
3. 100,000 ÷ 4,000 = 25 days → 4 weeks.
</details>

**Try it on your own data:** the [[sample-size]] calculator does the exact sums for proportions and means, including unequal splits.

**New words:** *baseline rate*, *minimum detectable effect*, *power analysis*, *test duration*.
