---
title: "Confounding and Simpson's paradox"
summary: "A version can win in every segment and still lose overall, because the segments are mixed differently. How confounding causes Simpson's paradox, how to spot it, and when to trust the overall number or the split."
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Version B converts better on phones and on computers, but worse overall. How is that possible?'
    choices: ['A calculation error', 'B''s traffic is mostly phones, which convert worse for everyone, so its overall rate is dragged down', 'It is impossible']
    ans: 1
    why: 'The overall rate is a weighted average of the segment rates, and the two versions have different weights.'
  - q: 'In a properly randomised A/B test, should Simpson''s paradox appear between segments and the total?'
    choices: ['Often', 'Rarely: randomisation gives both groups the same mix of devices, so the weights match', 'Always']
    ans: 1
    why: 'When the mix is the same in both groups, a version that wins every segment also wins overall. A mismatch hints at a broken split.'
  - q: 'Which number should guide a decision when the segment split and the total disagree?'
    choices: ['Always the total', 'Always the segments', 'Whichever matches the causal story: split by a confounder that affects both who gets what and the outcome']
    ans: 2
    why: 'Splitting by a confounder (device, severity) usually gives the fair comparison; splitting by something the treatment itself changed can mislead.'
---

**Module 8 · about 20 minutes · no new maths.** You'll be able to explain Simpson's paradox with a weighted average, spot when a comparison is confounded, and choose the right level to report.

## 1. Win every segment, lose overall

<!--fig:simpson-bars-->

B beats A on phones (2.4 % vs 2.0 %) and on computers (6.6 % vs 6.0 %). With the starting settings, 80 % of B's visitors are on phones and only 30 % of A's, so B's overall rate (3.24 %) is far below A's (4.80 %). Set both shares to 50 % and B wins overall too.

This is **Simpson's paradox**: a trend in every group reverses (or vanishes) when the groups are combined. It isn't a trick of arithmetic; it's what happens when a **confounder** (here, device) is linked both to which version people got and to the outcome.

## 2. Where it shows up

- **Observational comparisons:** "customers who used the app spend more" (app users are already heavier spenders).
- **Hospital and store league tables:** the best hospital looks worst because it takes the hardest cases.
- **Before/after reports:** the average order value "fell" because many new, smaller customers joined, while every existing segment spent more.
- **Broken A/B tests:** when a mismatch in the mix between groups appears, check for SRM (Lesson 7.6).

## 3. Which number to trust

There's no purely statistical answer; it depends on what causes what.

- If the segment variable is a **confounder** (it affects both who got the treatment and the outcome, and the treatment didn't change it), compare **within segments** and combine with the same weights for both (standardisation).
- If the segment variable is **caused by the treatment** (a new page changes which device people finish on), splitting by it can mislead; use the overall comparison.
- In a clean randomised test the mix is equal by design, so the overall number is fine; segments are for exploring.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an overall rate is a weighted average of segment rates, with weights equal to each group's mix.

**Equation:** with share `$w$` of a group's visitors on phones,

```math
p_{\text{overall}} = w \, p_{\text{phone}} + (1 - w)\, p_{\text{computer}}
```

**Check:** A: `$0.3 \times 2.0\% + 0.7 \times 6.0\% = 4.80\%$`. B: `$0.8 \times 2.4\% + 0.2 \times 6.6\% = 3.24\%$`.

**Standardising:** use the same weights for both, such as the combined mix (55 % phones): A = 3.80 %, B = 4.29 %. B wins, as it does in each segment.
</details>

## 4. Worked example

*Made-up report.* "Average order value fell from $62 to $58 this quarter."

| Segment | Last quarter | This quarter |
|---|---|---|
| Returning customers | $70 (60 % of orders) | $72 (40 % of orders) |
| New customers | $50 (40 % of orders) | $48.67 (60 % of orders) |
| All | $62 | $58 |

- Returning customers spent $2 more; new customers spent about the same ($1.33 less).
- A marketing campaign brought many new customers, whose orders are smaller, so the mix shifted.
- At last quarter's mix, this quarter's average would be `$0.6 \times 72 + 0.4 \times 48.67 = 62.67$`, slightly up.
- Report: "AOV fell because the mix shifted to new customers; returning customers spent more and new customers about the same."

## 5. Practice

1. Store X has a higher refund rate than store Y overall, but a lower rate for both electronics and clothing. Explain.
2. In an A/B test, B wins on every device but loses overall. What do you check first?
3. Should you split a checkout test's result by "users who used the new express button"?

<details>
<summary>Answers</summary>

1. X sells far more electronics, which have high refund rates everywhere, so its overall rate is weighted towards the high-refund category.
2. The split (SRM) and the device mix in each group: in a working test they should match.
3. No: only B has the button, and who uses it is caused by the treatment. Compare all users in A with all users in B.
</details>

**Try it on your own data:** the [[crosstab-chi-square]] tool builds the segment tables; [[grouped-data-stats]] gives rates and means per group so you can compare the mix.

**New words:** *Simpson's paradox*, *confounder*, *mix shift*, *weighted average*, *standardisation*.
