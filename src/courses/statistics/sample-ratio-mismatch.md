---
title: Sample ratio mismatch
summary: 'When a 50/50 test ends with 50.5 % of users in one group, something in the setup is broken and the result cannot be trusted. How to test the split with a chi-square, and the usual causes.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'A 50/50 test has 101,000 users in A and 99,000 in B. What should you do?'
    choices: ['Read the result; 1 % is small', 'Stop and find the cause; the chi-square p-value is far below 0.001', 'Delete users from A until it is even']
    ans: 1
    why: 'With 200,000 users, chance alone almost never gives a 2,000 gap. Something is adding or losing users on one side, so the groups are no longer comparable.'
  - q: 'Why do SRM checks use a strict threshold such as p < 0.001?'
    choices: ['Because large tests have so many users and teams run so many tests that 0.05 would raise many false alarms', 'Because 0.001 is the legal standard', 'Because SRM never happens']
    ans: 0
    why: 'The check runs on every test, so a strict line keeps false alarms rare while still catching real breakages, which usually give tiny p-values.'
  - q: 'B has a heavier page that sometimes fails to load the tracking script. What happens?'
    choices: ['Nothing', 'B loses users from the data, likely the slowest-connection users, so B looks different for reasons that have nothing to do with the change', 'A loses users']
    ans: 1
    why: 'The missing users are not random: they are the ones with slow connections, so B''s remaining users are a different mix.'
---

**Module 7 · about 15 minutes · uses Lesson 6.5.** You'll be able to test whether a split matches the plan and list the common causes when it doesn't.

## 1. Why the split matters

Randomisation makes the groups alike in everything except the change (Lesson 7.1). If users go missing from one group, or extra ones arrive, the groups stop being alike, and the result measures *who* is in each group as well as the change. That is a **sample ratio mismatch (SRM)**.

It's surprisingly common. Large experimentation teams report it in a few percent of all tests, and it usually reveals a real bug.

<!--fig:srm-check-->

Move the visitors slider: the band of "normal" shares narrows as the test grows. A 50.5 % share is nothing with 1,000 users and a red flag with 200,000.

## 2. The check

Compare the observed counts with the planned split using a **chi-square goodness-of-fit test** (Lesson 6.5) with one degree of freedom. Run it on every test, before reading any metric, and use **p < 0.001** as the alarm.

## 3. Common causes

- **Redirects or extra page loads** in one variant: users drop off (or get counted twice) before logging.
- **Tracking that fails more in one variant**: a heavier page, a script that loads late, an ad blocker that blocks one design.
- **Bot filtering** that treats one variant differently.
- **Assignment bugs**: the hash isn't stable, users switch groups, or a test started on one platform earlier than the other.
- **Triggering on something the change affects**: "users who clicked the new button" exists only in B.
- **A ramp** (10 % → 50 %) analysed as if it were one 50/50 test.

**What to do:** don't "fix" it by dropping users. Find the cause, fix it, and rerun. Sometimes a mismatch limited to one browser or one day can be cut out and the rest analysed, but say so plainly.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the split itself is a random outcome with a known distribution, so it can be tested like any other.

**Equation** (observed `$O_A, O_B$`; expected `$E_A = n\,q_A$`, `$E_B = n\,q_B$` for planned shares `$q$`):

```math
\chi^2 = \frac{(O_A - E_A)^2}{E_A} + \frac{(O_B - E_B)^2}{E_B}, \quad df = 1
```

**Check:** 101,000 vs 99,000 against 100,000 each: `$\chi^2 = 2 \times 1000^2/100{,}000 = 20$`, p ≈ 0.000008. The same 50.5 % share with 1,000 users (505 vs 495) gives `$\chi^2 = 0.1$`, p = 0.75.

**Rule of thumb:** for a 50/50 split, B's share has SD `$\sqrt{0.25/n}$`; the 99.9 % band is about `$0.5 \pm 3.29\sqrt{0.25/n}$`.
</details>

## 4. Worked example

*Made-up story.* A test of a new product page shows +4 % revenue per user. The split: A 52,140, B 50,610 (planned 50/50).

- Expected 51,375 each. `$\chi^2 = 2 \times 765^2 / 51{,}375 \approx 22.8$`, p ≈ 0.000002. SRM.
- Breaking it down by browser: the gap is all in one older mobile browser, where B's new image gallery crashed the page before the tracking fired.
- Those users (likely on older, cheaper phones, who spend less) are missing from B, which explains much of B's "higher revenue per user".
- Decision: no conclusion. Fix the gallery, rerun.

## 5. Practice

1. 50/50 test: 5,060 vs 4,940. SRM?
2. 90/10 test (90 % control): 90,500 vs 9,500. SRM?
3. Why not just reweight the groups to 50/50?

<details>
<summary>Answers</summary>

1. Expected 5,000 each: `$\chi^2 = 2 \times 60^2/5{,}000 = 1.44$`, p = 0.23. Fine.
2. Expected 90,000 and 10,000: `$\chi^2 = 500^2/90{,}000 + 500^2/10{,}000 \approx 2.8 + 25 = 27.8$`, p < 0.000001. SRM.
3. Reweighting fixes the counts, not the mix: the missing users are a particular kind of user, and weighting the rest can't bring them back.
</details>

**Try it on your own data:** the [[crosstab-chi-square]] tool runs goodness-of-fit tests on counts; the readout in Lesson 7.5 checks the split automatically.

**New words:** *sample ratio mismatch (SRM)*, *goodness of fit*, *ramp-up*, *triggering bias*.
