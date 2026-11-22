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
sources:
  - 'Kohavi, R., Tang, D. and Xu, Y. (2020), Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing, Cambridge University Press, Chapter 17 (statistics behind experiments)'
  - 'van Belle, G. (2008), Statistical Rules of Thumb, 2nd edition, Wiley, Section 2.4 (the 16/Δ² rule)'
---

**Module 7 · about 25 minutes · school maths.** You'll be able to compute the users needed for a conversion test, turn that into a duration, and choose what to do when traffic is short.

<div class="bigidea">The smaller the effect you want to catch, the bigger the test: halve the minimum detectable effect and you need four times the users.</div>

**In everyday terms:** spotting a friend in a crowd. A friend in a bright red coat is easy to see from far away; one in grey needs you to get much closer. Small effects are grey coats: you need many more users to see them.

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

<div class="meaning">

<dl>
<dt>Baseline p</dt><dd>Today's rate, such as 4 % conversion.</dd>
<dt>MDE</dt><dd>Minimum detectable effect: the smallest lift worth acting on.</dd>
<dt>n per group ≈ 16·p(1 − p) ÷ MDE²</dt><dd>Rule of thumb for 80 % power at α = 5 %.</dd>
<dt>Duration</dt><dd>Total users ÷ eligible users per day, rounded up to whole weeks.</dd>
<dt>Physical meaning</dt><dd>The test must be long enough for the signal (the lift) to stand clear of the noise (the wobble of the rates). Noise shrinks with √n, so to see half the signal you need four times the data.</dd>
</dl>

</div>

<div class="myth">

**"We will stop when it looks significant."** That is peeking (Lesson 7.4). Fix the size in advance; if the test is too long to be practical, test a bolder change or accept a larger MDE.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Baseline.</b> 4 % of users buy. The team cares about +10 % relative: 4.0 % → 4.4 %.</div>
<div class="step"><b>Rule of thumb.</b> 16 × 0.04 × 0.96 ÷ 0.004² ≈ 38,400 per group (the exact formula gives about 39,500).</div>
<div class="step"><b>Traffic.</b> 6,000 eligible users a day: 79,000 ÷ 6,000 ≈ 13.2 days.</div>
<div class="step"><b>Round up.</b> 2 full weeks.</div>
<div class="step"><b>Smaller MDE?</b> +5 % relative would need about 4 times as many users: 8 weeks. Probably too long.</div>
</div>

<div class="problem" data-problem="ab-n-rule"></div>

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

<div class="keypoints">

- n per group ≈ 16·p(1 − p) ÷ MDE² (80 % power, α = 5 %).
- Halving the MDE quadruples n.
- Duration = total users ÷ daily traffic, rounded up to whole weeks.
- Fix size and duration before launch.

</div>
