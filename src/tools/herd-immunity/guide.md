---
name: Herd immunity
num: 493
shelf: science
code: T344
section: public-health
title: "Herd immunity"
summary: "Work out the herd immunity threshold from R0, the vaccine coverage needed for a vaccine of a given effectiveness, and the effective R at your coverage, with a chart of the threshold against R0."
status: live
ads: false
order: 33
icon: percent
works: offline
updated: 2026-11-09
related: [epidemic-model, sample-size, plot-maker, biodiversity-indices]
sources:
  - "Threshold 1 − 1/R0: Anderson and May (1985), Nature 318: 323-329; Fine (1993), Epidemiologic Reviews 15: 265-302."
  - "Coverage with an imperfect vaccine, (1 − 1/R0) / E: Anderson and May (1991), Infectious Diseases of Humans, Oxford University Press."
  - "Example R0 values are made up for teaching."
flow:
  - { icon: sliders, label: "R0" }
  - { icon: target, label: "Vaccine" }
  - { icon: percent, label: "Threshold" }
  - { icon: chart, label: "Compare" }
---

## What it does

When enough people are immune, each case passes the infection to fewer than one other person on average, and outbreaks shrink. That share is the **herd immunity threshold**. This calculator works it out from R0, shows how much of the population must be **vaccinated** when the vaccine does not protect everyone, and tells you the **effective R** at the coverage you choose. A table and chart compare several R0 values at once.

To see the whole outbreak over time, use the [[epidemic-model|epidemic model simulator]]; to weigh the health gained, the [[daly-qaly|DALY and QALY calculator]].

## How to use it

1. Type **R0**, the basic reproduction number: how many people one case infects when nobody is immune.
2. Type the **vaccine effectiveness**: the share of vaccinated people who are protected from catching and passing on the infection.
3. Type the **coverage**: the share of the whole population vaccinated.
4. Read the threshold, the coverage needed, and the effective R. Below 1, outbreaks shrink; at or above 1 they can grow.
5. In **Compare diseases**, list names and R0 values, one per line. The five rows you see are **made-up round numbers**, not real diseases; replace them with your own. Real R0 values vary with place, season, crowding and behaviour.
6. Download the table as CSV, or the report as an image, PDF or Word file.

## The formulas

- **Threshold:** H = 1 − 1/R0 (Anderson and May, 1985; Fine, 1993).
- **Coverage needed:** Vc = (1 − 1/R0) / E, for effectiveness E. If Vc is above 100 %, this vaccine alone cannot reach the threshold.
- **Effective R:** R = R0 × (1 − c × E) for coverage c, assuming everyone else is susceptible.
- **Highest R0 held below 1** at your coverage: 1 / (1 − c × E).

These assume a well-mixed population: everyone equally likely to meet everyone else, immunity that lasts, and a vaccine that fully protects a share E of those who get it. Real populations mix unevenly (schools, households, cities), so pockets of low coverage can still have outbreaks above the average threshold. Prior infection also adds immunity, which these formulas leave out.

## Worked example

With R0 = 3, a vaccine that is 90 % effective and 80 % coverage, the page shows a **threshold of 66.7 %** and **coverage needed of 74.1 %**. At 80 % coverage, 72 % of people are immune, so the **effective R is 0.84**: outbreaks shrink. The same programme would hold any R0 up to **3.57** below 1.

In the made-up comparison, Example C (R0 = 6) needs 92.6 % coverage, so 80 % leaves R at 1.68. Examples D and E (R0 = 12 and 18) would need more than 100 %, which this vaccine cannot reach: the table marks them ✗.

## Tips

- Try raising effectiveness instead of coverage: for high R0, a better vaccine helps more than chasing the last few per cent of coverage.
- To see what happens over time, run the same numbers in the [epidemic model simulator](/science/epidemic-model/), with the vaccinated share set to coverage × effectiveness.

## Frequently asked questions

**Is the threshold the share that will be infected?** No. Above the threshold, outbreaks shrink. Without vaccination, an epidemic overshoots it: far more than 1 − 1/R0 get infected before it ends.

**Where do I get R0?** From published studies for your setting. This tool does not ship real values on purpose; always check the official source.

**Is my data stored?** No. Everything runs in your browser and nothing is sent anywhere.
