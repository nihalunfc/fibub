---
name: DALY and QALY
num: 492
shelf: science
section: public-health
title: "DALY and QALY"
summary: "Work out disability-adjusted life years (DALY = YLL + YLD) with optional discounting, QALYs from utilities you enter, and the incremental cost-effectiveness ratio per QALY gained and per DALY averted."
status: live
ads: false
order: 32
icon: calculator
works: offline
updated: 2026-11-09
related: [herd-immunity, epidemic-model, sample-size, uncertainty-calculator, plot-maker]
sources:
  - "DALY = YLL + YLD: Murray (1994), Bulletin of the World Health Organization 72: 429-445; Murray and Lopez (1996), The Global Burden of Disease, Harvard University Press."
  - "Continuous discounting without age weighting: Fox-Rushby and Hanson (2001), Health Policy and Planning 16: 326-331."
  - "QALYs, ICER and net monetary benefit: Drummond et al. (2015), Methods for the Economic Evaluation of Health Care Programmes, 4th ed., Oxford University Press."
  - "All example numbers, weights and utilities are made up for teaching."
flow:
  - { icon: table, label: "Burden" }
  - { icon: sliders, label: "Utilities" }
  - { icon: calculator, label: "QALY, DALY" }
  - { icon: target, label: "ICER" }
---

## What it does

Health economists and public-health teams count health in years. A **DALY** (disability-adjusted life year) is one year of healthy life lost, to early death or to illness. A **QALY** (quality-adjusted life year) is one year lived in full health, gained. This calculator does three things:

1. **Disease burden:** DALYs = YLL + YLD for one or more conditions.
2. **QALYs:** for a comparator and an intervention, from health stages and utilities you type.
3. **Cost-effectiveness:** the ICER, the extra cost per QALY gained and per DALY averted, and the net monetary benefit at a threshold you choose.

The tool ships **no disability weights or utilities** from published tables. Every example number is made up; type the weights and utilities from your own source.

To see how many cases a vaccine could prevent, use the [[herd-immunity|herd immunity calculator]] or the [[epidemic-model|epidemic model simulator]].

## How to use it

1. Set the **discount rate**. 0 % means no discounting. Discounting is continuous: a stretch of L years starting at year s counts as (e^(−rs) − e^(−r(s+L))) / r years, so 30 years from now at 3 % counts as 19.78 years.
2. In **Disease burden**, type one condition per line: name, deaths, years of life lost per death, cases, disability weight (0 = full health, 1 = as bad as death) and years lived with it. A header line is skipped, and you can open a CSV or Excel file.
3. In **Compare an intervention**, describe a typical person in each arm as stages: utility and years, one per line, with an optional disability weight as a third number. The person dies after the last stage. Add the cost per person.
4. Set the **horizon**, the life expectancy the DALYs are measured against, and optionally a **willingness to pay** per QALY.
5. Download the burden or comparison as CSV, or the report as an image, PDF or Word file.

## The formulas

- YLL = deaths × L, and YLD = cases × disability weight × duration, each with L or the duration discounted as above; DALY = YLL + YLD (Murray, 1994; Fox-Rushby and Hanson, 2001; no age weighting).
- QALYs = Σ utility × discounted years for each stage.
- DALYs for an arm = Σ disability weight × discounted years lived, plus the discounted years from death to the horizon. Without a weight, 1 − utility is used: a teaching shortcut, since real disability weights and utilities come from different surveys.
- ICER = (cost₁ − cost₀) / (QALY₁ − QALY₀). Cost per DALY averted = extra cost / (DALY₀ − DALY₁). Net monetary benefit = threshold × QALYs gained − extra cost (Drummond et al., 2015). When the new option is cheaper and better it **dominates**, and no ICER is shown.

## Worked example

With the made-up rows and 3 % discounting, Condition X (20 deaths losing 30 years each; 500 cases with weight 0.2 for 4 years) gives YLL 395.62 and YLD 376.93, so 772.55 DALYs. With Condition Y, the page shows **1,154.98 DALYs (YLL 480.28 + YLD 674.69)**.

In the comparison, usual care is 5 years at utility 0.6 for $2,000; the new treatment is 3 years at 0.8 then 5 years at 0.7 for $12,000. The QALYs are **2.79** and **5.27**, a gain of **2.48**, and the DALYs over a 10-year horizon are 5.39 and 2.81, so **2.58 averted**. The ICER is **$4,033 per QALY gained**, and $3,871 per DALY averted. Type 30000 as the willingness to pay and the net monetary benefit is $64,392.

## Tips

- Compare 0 % and 3 % discounting: gains far in the future shrink most.
- Thresholds for "good value" differ by country and agency; check the official source for yours.

## Frequently asked questions

**Why are QALYs gained and DALYs averted different?** QALYs use utilities, DALYs use disability weights, and the DALY count also includes years lost up to the horizon. With no weights given and the same horizon, the two would be equal.

**Is my data stored?** No. Everything runs in your browser and nothing is sent anywhere.
