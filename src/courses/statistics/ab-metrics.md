---
title: 'Choosing metrics: primary, secondary and guardrails'
summary: 'One metric decides; a few explain; guardrails protect. How to pick a primary metric that is sensitive and tied to value, ratio metrics and the unit trap, and guardrails that stop a win from hiding a loss.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Why choose a single primary metric?'
    choices: ['Because one is enough to understand everything', 'So the decision does not depend on which of many metrics happened to win (multiple testing)', 'Dashboards only show one']
    ans: 1
    why: 'Many deciding metrics multiply false positives (Lesson 6.8) and invite cherry-picking. One primary metric keeps the decision honest.'
  - q: 'A test randomises users but reports "clicks per page view". What is the risk?'
    choices: ['None', 'The analysis unit (page view) differs from the randomisation unit (user), so a standard t-test underestimates the uncertainty', 'Clicks are not a metric']
    ans: 1
    why: 'Page views from the same user are not independent. Use per-user metrics, or the delta method / bootstrap by user.'
  - q: 'Which is a guardrail for a test of bigger "Buy now" buttons?'
    choices: ['Purchase conversion', 'Order cancellations and returns', 'Button size']
    ans: 1
    why: 'A bigger button might raise purchases but also accidental orders. Cancellations catch that.'
---

**Module 7 · about 20 minutes · no new maths.** You'll be able to choose a primary metric, secondary metrics and guardrails, and avoid the unit mismatch in ratio metrics.

## 1. One decides, some explain, some protect

<!--fig:metric-tree-->

**Primary metric** (decides): the one number the decision rule uses. A good one is

- **tied to value** (purchases, revenue per user, retained users), not just activity;
- **sensitive** enough to move within the test's length (annual retention won't);
- **hard to game** (clicks are easy to raise by making things confusing).

**Secondary metrics** (explain): the steps that should move if the hypothesis is right: add-to-cart, checkout starts, average order value. They tell you *why* the primary moved or didn't.

**Guardrails** (protect): things that must not get worse: refunds, complaints, page speed, unsubscribe rate, revenue. A win on the primary with a clear loss on a guardrail is not a win.

## 2. Common metric types

| Type | Example | Analysed with |
|---|---|---|
| Proportion per user | Did the user buy? | Two-proportion z-test (Lesson 7.5) |
| Mean per user | Revenue per user, orders per user | Welch t-test or bootstrap |
| Ratio of totals | Revenue ÷ orders (AOV), clicks ÷ views (CTR) | Delta method or bootstrap **by user** |
| Time to event | Days until second order | Survival methods (beyond this course) |

**The ratio trap.** If you randomise users but compute "clicks ÷ page views" and test it as if each page view were independent, the SE is too small and false positives soar. Either turn it into a per-user metric (each user's CTR, then average) or keep the ratio and resample users.

**Revenue per user** is often the best primary for commerce, but it is very noisy (mostly zeros, a few big orders). Options: a longer test, capping extreme values at, say, the 99th percentile (decided in advance), or CUPED (adjusting for each user's spend before the test), which can cut variance a lot.

## 3. Overall evaluation criterion

Some teams combine several metrics into one **overall evaluation criterion (OEC)** with agreed weights, such as revenue minus a cost per support contact. It makes trade-offs explicit before the test, not after.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the analysis must respect the randomisation unit, because only those units are independent.

**Delta method for a ratio** `$R = \bar{Y}/\bar{X}$` (per-user sums `$Y_i$`, `$X_i$`):

```math
\text{Var}(R) \approx \frac{1}{n\bar{X}^2}\left(s_Y^2 - 2R\,s_{XY} + R^2 s_X^2\right)
```

**Variance reduction (CUPED):** with each user's pre-test value `$X_i$`, analyse `$Y_i - \theta(X_i - \bar{X})$`, `$\theta = \text{cov}(X, Y)/\text{var}(X)$`. Variance falls by the factor `$1 - r^2$`, where `$r$` is the correlation between before and during.
</details>

## 4. Worked example

*Made-up test:* a "Recommended for you" row on the home page.

- Primary: **revenue per user** over 14 days (capped at the 99th percentile, decided in advance).
- Secondary: click-through on the new row; items per order; share of users who buy.
- Guardrails: home page load time (must not rise > 100 ms); returns rate.
- Result: revenue per user +1.8 % (95 % CI +0.2 % to +3.4 %); buyers +0.4 points; items per order +3 %; load time +140 ms (CI +120 to +160).
- Decision: the primary wins but a guardrail clearly fails. Fix the load time (lazy-load the row) and retest, rather than ship.

## 5. Practice

1. Pick a primary metric for a test of a simpler sign-up form.
2. Name two guardrails for a test of more aggressive push notifications.
3. Pre-test and in-test spend correlate at r = 0.6. By how much does CUPED cut the variance?

<details>
<summary>Answers</summary>

1. Share of visitors who complete sign-up (and, if possible, who are still active a week later, so a form that signs up the wrong people doesn't win).
2. Notification opt-outs and app uninstalls; complaints; long-run active users.
3. By the factor 1 − 0.36 = 0.64, so 36 % less variance, equivalent to about 56 % more traffic.
</details>

**Try it on your own data:** the [[bootstrap-permutation]] tool resamples by row, so put one row per user to get honest intervals for per-user metrics.

**New words:** *primary metric*, *secondary metric*, *guardrail metric*, *overall evaluation criterion*, *ratio metric*, *delta method*, *CUPED*, *capping*.
