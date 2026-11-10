---
name: NNT calculator
num: 465
shelf: science
code: T316
section: epidemiology
title: "Number needed to treat (NNT) and NNH calculator with confidence interval, ARR, RR and RRR"
summary: "Number needed to treat or harm from events in a treated and a control group, with the absolute risk reduction, relative risk, relative risk reduction and odds ratio, all with 95 % intervals. Shows the NNT interval the Altman way when it crosses zero."
status: live
ads: false
order: 5
icon: calculator
works: offline
updated: 2026-11-09
related: [diagnostic-test-calculator, sample-size, uncertainty-calculator, reliability-analysis]
sources:
  - "Formulas: Laupacis, Sackett and Roberts (1988, N Engl J Med 318:1728) for the NNT; Altman (1998, BMJ 317:1309) for NNT intervals that include no effect; Newcombe (1998, Stat Med 17:873, method 10) for the risk difference interval; Wilson (1927, J Am Stat Assoc); Katz et al. (1978, Biometrics 34:469) for the relative risk interval; Straus, Glasziou, Richardson and Haynes, Evidence-Based Medicine (textbook) for the NNT at another baseline risk."
  - "Example numbers are made up for teaching."
flow:
  - { icon: table, label: "Two groups" }
  - { icon: percent, label: "Risk change" }
  - { icon: calculator, label: "NNT" }
---

## What it does

The number needed to treat (NNT) is how many people must receive a treatment, rather than the comparison, for one more person to benefit. It is the reciprocal of the absolute risk reduction, and it is often easier to weigh against cost and side effects than a relative risk. When the treatment makes things worse, the same number is the number needed to harm (NNH).

From the number of people with the event and the size of each group, the calculator gives:

- the **risk** in each group, with a Wilson interval;
- the **risk difference** and the **absolute risk reduction** (or absolute benefit increase for a good event);
- the **relative risk (RR)**, **relative risk reduction (RRR)** and **odds ratio**;
- the **NNTB or NNTH** with its interval, written as Altman (1998) recommends when the effect could go either way;
- a chi-square test, and the NNT for a person whose risk without treatment differs from the control group.

For study and teaching, not medical advice. Check with a qualified professional.

For odds and risk ratios from the same table, use the [[odds-risk-ratio|odds ratio and risk ratio calculator]]; to pool several trials, the [[meta-analysis]] tool.

## How to use it

1. Type the people with the event and the people in each group, and name the groups if you like.
2. Choose whether the event is **bad** (death, relapse, infection) or **good** (cure, recovery). For a bad event, fewer events with treatment is a benefit; for a good event, more is.
3. Choose the **interval for the difference**. *Newcombe* combines the Wilson intervals of the two risks (his method 10) and keeps good coverage with small groups. *Wald* is the plain risk difference ± 1.96 standard errors found in most textbooks.
4. Choose 90, 95 or 99 % **confidence**.
5. Under **For a different baseline risk**, type the risk without treatment for the person or group you care about.

## The formulas

With risks p₁ (treated) and p₀ (control), ARR = p₀ − p₁ and NNT = 1/ARR. The NNT interval is the reciprocal of the ARR interval. When the ARR interval runs from a harm to a benefit, the NNT interval passes through infinity (no effect), so it is written "NNTB a to ∞ to NNTH b" (Altman 1998). RR = p₁/p₀ with limits exp(ln RR ± z·SE), SE = √(1/a − 1/n₁ + 1/c − 1/n₀). RRR = 1 − RR, and its limits are 1 minus the RR limits. For a baseline risk r, the expected benefit is r × RRR and the NNT is 1/(r × RRR).

## Worked example

The made-up trial has 30 deaths among 250 people on a new treatment and 50 among 250 on usual care. The risks are 12.0 % and 20.0 %, so the ARR is 8.0 % (Newcombe 95 % interval 1.6 % to 14.4 %). The page shows **NNTB 12.5 (round up: 13)**, with interval NNTB 6.94 to 64.0. The RR is 0.600 (0.395 to 0.911) and the RRR 40.0 % (8.9 % to 60.5 %). A patient whose risk without treatment is 40 % gains 16.0 %, an NNTB of 6.25 (4.13 to 28.0).

With 15 of 100 against 18 of 100, the interval crosses zero: NNTB 33.3, interval NNTB 7.48 to ∞ to NNTH 13.5. The study cannot rule out harm.

## Tips

- Always give the time span: an NNT of 13 over 5 years is not the same as 13 over 6 months.
- Compare NNTs only for the same outcome, time and kind of patient.
- A large relative effect with a rare outcome can still give a large NNT.

## Frequently asked questions

**Why round up?** You cannot treat part of a person, and rounding up is the cautious direction.

**Why is the interval written with ∞?** Because when the difference could be zero, its reciprocal can be any size. Writing it through infinity keeps the benefit and harm parts honest.

**Is my data stored?** No. Everything is worked out in your browser and nothing is sent anywhere.
