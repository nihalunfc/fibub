---
title: 'Capstone: an experiment readout'
summary: 'Analyse a realistic 24,000-user A/B test from raw data, check the split and guardrails, estimate the lift with intervals, look at segments without cherry-picking, and write a one-page experiment readout memo for your portfolio.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'In what order should the readout memo present things?'
    choices: ['Method, data, tables, then the decision at the end', 'Decision and headline result first, then evidence, checks and caveats', 'Only the p-value']
    ans: 1
    why: 'Busy readers stop after the first paragraph. Lead with what to do and why; the detail is there for those who want it.'
  - q: 'Page load rose by 46 ms (p < 0.0001). The plan''s guardrail was "must not rise by more than 100 ms". Is the guardrail breached?'
    choices: ['Yes, p is tiny', 'No: the rise is real but its whole interval (about 37 to 56 ms) is below the 100 ms limit', 'Cannot tell']
    ans: 1
    why: 'Guardrails are about size, not significance. A real but small cost within the agreed limit is acceptable; report it.'
  - q: 'B wins in every device and visitor segment. How should segments appear in the memo?'
    choices: ['As extra wins to make the case stronger', 'As a consistency check: the effect is not driven by one segment; no segment was used to make the decision', 'Not at all']
    ans: 1
    why: 'Segments support or question the main result; deciding on them would be multiple testing (Lesson 6.8).'
---

**Module 9 · about 90 minutes · uses all of Module 7.** You'll analyse a full test from raw data and write the kind of readout memo analysts send to product teams. It becomes a portfolio piece that shows an employer you can run an experiment end to end.

## 1. The brief

*Made-up company, made-up data.* An online store tested a **one-page checkout** (B) against the current three-step checkout (A) for **14 days**. Here is the plan the team froze before launch (Lesson 7.1):

| Item | Plan |
|---|---|
| Hypothesis | One-page checkout raises purchase conversion because fewer steps means fewer drop-offs |
| Unit, split | User, hashed ID, 50/50 |
| Primary metric | Share of users who purchase (converted) |
| Secondary | Revenue per user; conversion by device and new/returning |
| Guardrails | Refund rate among buyers must not rise significantly; page load must not rise by more than 100 ms |
| Size | 10,300 users per group detect 4.0 % → 4.8 % with 80 % power; planned about 12,000 for a margin |
| Decision rule | Ship if the 95 % CI for the conversion lift is above 0 and no guardrail is breached |

**Download the data:** [checkout-test.csv](/data/courses/statistics/checkout-test.csv) (24,000 rows, 870 KB). Columns: `user_id`, `group` (A/B), `device` (phone/computer), `visitor` (new/returning), `day` (1 to 14), `converted` (0/1), `revenue` ($, 0 if no purchase), `refunded` (0/1), `page_load_ms`.

## 2. Your tasks

1. **Check the split** (Lesson 7.6): counts per group and the chi-square p-value.
2. **Primary metric** (Lesson 7.5): conversion in each group with 95 % intervals, absolute and relative lift with a 95 % CI, z and p. Enter your counts below to check them.
3. **Guardrails:** refund rate among buyers in each group (two-proportion test); mean page load in each group and the difference with a 95 % CI.
4. **Secondary:** revenue per user with a Welch t-test or a bootstrap (Lesson 4.5), since revenue is mostly zeros.
5. **Segments:** conversion by device and by new/returning, as a consistency check only.
6. **Novelty check** (Lesson 7.8): lift by day or by week. Is it fading?
7. **Decision:** apply the rule and write the memo (section 4).

<!--fig:ab-readout-->

**Tools that do each step in your browser:** [[csv-profiler]] to look at the file first; [[grouped-data-stats]] for counts and means by group; [[hypothesis-tests]] for the proportion and Welch tests; [[bootstrap-permutation]] for revenue; [[bayesian-ab-test]] for the chance B is better. Or use Python: [pandas Lesson 8.6](/learn/courses/pandas/ab-test-pandas/) does this whole readout in code.

## 3. What a strong analysis shows

- Numbers with **units and intervals**, never a bare p-value.
- **Checks before results:** split, data quality (missing values, impossible values, duplicates).
- **Guardrails judged by size** against the limit in the plan, not by significance alone.
- **Segments as context**, clearly labelled as not decisive.
- **One clear recommendation**, with what it's expected to be worth (extra orders or revenue per month) and the main risk.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the readout answers three questions in order: can we trust the data (split, quality), what happened (estimate and interval), and what should we do (decision rule, value, risk).

**Formulas you'll use:** split check `$\chi^2 = \sum (O - E)^2/E$` (Lesson 7.6); difference in proportions with its interval and pooled z (Lesson 7.5); Welch's t for means (Lesson 6.3):

```math
t = \frac{\bar y_B - \bar y_A}{\sqrt{s_A^2/n_A + s_B^2/n_B}}
```

**Value:** extra orders per month ≈ absolute lift × monthly eligible users; give the range using the CI's ends.
</details>

## 4. The memo (one page)

Write it in this order. Aim for about 400 words plus one table and one chart.

1. **Title and one-line recommendation.** "Ship the one-page checkout."
2. **Headline result.** The lift with its interval, in plain words, and what it's worth.
3. **Was the test sound?** Split, data checks, duration.
4. **Guardrails.** Each with its result against its limit.
5. **Supporting evidence.** Revenue per user, segments, novelty check.
6. **Risks and next steps.** What could make this wrong; what to monitor after launch.
7. **Appendix.** The frozen plan, the method, a link to your analysis (notebook or spreadsheet).

**For your portfolio:** publish the memo as a project page (on nihalsulaiman.com, under Projects, or your own site), with the chart, the table and a link to the code on GitHub. In interviews, walk through it in two minutes: the question, the checks, the result, the decision.

<details>
<summary>Answer key (check your numbers after you've done the work)</summary>

- **Split:** A 11,968, B 12,032; χ² p = 0.68. Fine.
- **Conversion:** A 493 / 11,968 = 4.12 %; B 586 / 12,032 = 4.87 %. Lift +0.75 points (95 % CI +0.23 to +1.28), +18 % relative; z = 2.81, p = 0.005.
- **Refunds among buyers:** A 6.7 %, B 6.0 %; no significant rise. Pass.
- **Page load:** B is 46 ms slower (95 % CI about 37 to 56 ms), p < 0.0001: real, but below the 100 ms limit. Pass, and mention it.
- **Revenue per user:** A $2.42, B $2.87; Welch t = 2.37, p = 0.018.
- **Segments:** B higher on phones (2.7 % → 3.3 %) and computers (6.4 % → 7.4 %), and for new (3.8 % → 4.4 %) and returning visitors (4.5 % → 5.5 %). Consistent.
- **Novelty:** week 1 lift +0.64 points, week 2 +0.86 points. No sign of fading.
- **Decision:** ship. Every condition of the frozen rule is met.
</details>

**New words:** *readout*, *pre-registration*, *decision memo*, *guardrail breach*.
