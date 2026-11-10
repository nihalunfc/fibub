---
title: "Wheat stem rust (Ug99) resistance in elite lines: AUDPC field screen in Kenya"
summary: "A 2025 field study scores 25 wheat lines for stem rust at a Kenyan Ug99 screening site and ranks them by AUDPC. Here is how to work out AUDPC and AUDPS for your own ratings."
tools: [disease-progress-audpc, leaf-disease-severity, yield-trial-anova]
updated: 2026-11-10
sources:
  - "Kemboi JJ, Bhavani S, Ojwang PPO (2025), Frontiers in Plant Science 16: 1581007, CC BY, the paper described here. Title, authors, volume, article number and licence checked on the publisher's page, 2026-11-10."
  - "AUDPC by the trapezoid rule (Wilcoxson, Skovmand and Atif 1975, Phytopathology 65: 1063); AUDPS (Simko and Piepho 2012, Phytopathology 102: 381); modified Cobb scale for rust severity (Peterson, Campbell and Hannah 1948)."
paper:
  title: "Evaluation of elite wheat (Triticum aestivum L.) genotypes for resistance to stem rust (Puccinia graminis f.sp. tritici), yield and yield stability"
  authors: "Kemboi JJ, Bhavani S, Ojwang PPO"
  journal: "Frontiers in Plant Science"
  year: 2025
  doi: "10.3389/fpls.2025.1581007"
  url: "https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1581007/full"
  licence: "CC BY"
  reviewed: true
---

Stem rust is one of the oldest and most feared diseases of wheat. A fungus covers the stems with rusty pustules and can ruin a crop weeks before harvest. Since the Ug99 race of the fungus appeared in Uganda in 1999, many resistance genes that breeders relied on have stopped working. A June 2025 paper in *Frontiers in Plant Science* screened 25 wheat lines at a Kenyan field site built for exactly this test, and found several that kept the rust low while still giving good yields. The key measure is the area under the disease progress curve, or AUDPC, which you can work out for your own plots with the [[disease-progress-audpc]] calculator. Score each plot's severity first with the [[leaf-disease-severity]] tool, and compare the lines statistically afterwards with the [[yield-trial-anova]].

## What they found

Across three seasons, AUDPC differed hugely between lines. In one season it ran from about 2 to about 800, in another from about 30 to nearly 1,000. The authors treated an AUDPC below 100, together with a final severity below 30 %, as a sign of strong adult-plant resistance, also called slow rusting. This is resistance that does not stop infection outright but holds the disease back as the plant grows.

Several lines from the international maize and wheat breeding centre's elite set met that bar and also gave above-average grain yield. The authors name four of them as the best combination of resistance and yield, and a fifth that stayed resistant in all three seasons.

## Why it matters

Ug99 and its relatives are spreading through East Africa, the Middle East and beyond. Wheat feeds billions of people, and losing a crop to stem rust can be total. Field screens under heavy, known disease pressure are how breeders learn which lines are safe to release. Yield matters too: farmers will not grow a resistant variety that yields poorly.

## How they did it

1. The trial ran at a stem rust screening platform in Njoro, Kenya, about 2,300 m above sea level, in three seasons in 2022 and 2023.
2. Twenty-one elite lines and four check varieties were planted in a lattice design with three replicates. A lattice splits each replicate into small blocks, so patchy field conditions affect the comparison less.
3. Severity, the percentage of stem and leaf covered by rust, was scored on the modified Cobb scale three times at weekly intervals, from heading to ripening. The type of pustule each plant showed was also recorded.
4. AUDPC was calculated by the trapezoid rule, log-transformed and analysed alongside yield and stability statistics.

## Check it yourself with fibub

The trapezoid rule joins neighbouring ratings with a straight line and adds up the areas underneath:

AUDPC = Σ (yᵢ + yᵢ₊₁) ÷ 2 × (tᵢ₊₁ − tᵢ)

Here y is severity in % and t is the day of each rating.

**Our own made-up ratings**, not the paper's. Three lines were rated weekly, three times, as in the study's design. Day 0 is the first rating:

```
day	Line P	Line Q	Line R
0	5	20	1
7	10	35	5
14	40	40	15
```

1. Paste the table into the assessments box. Keep **Values are** on Percent and the time unit on days.
2. Read the area table. Line P has **AUDPC = 227.5 %-days**, from (5 + 10) ÷ 2 × 7 = 52.5 plus (10 + 40) ÷ 2 × 7 = 175. Line Q has **455 %-days**, and Line R has **91 %-days**.
3. Notice P and Q. Both end at 40 % severity, so a final score alone would rank them the same. Q was badly diseased from the start, so it carries twice the area. AUDPC captures how long the plant suffered, not just where it ended.
4. Look at AUDPS, the area under the "stairs", which gives the first and last ratings their full weight. It is 385 for P, 665 for Q and 147 for R. With only three ratings, the end points make up a big share, so AUDPS can matter.
5. Use the relative values to compare seasons of different length. Relative AUDPC is 0.163 for P, 0.325 for Q and 0.065 for R: the share of the largest possible area, 100 % for all 14 days.
6. Apply the paper's rule of thumb. Only Line R is under 100 %-days with a final severity under 30 %, so it would count as slow rusting.
7. Treat the infection-rate table with care. With three points, each model is fitted to almost nothing, and the "best" model changes from line to line. Here it picks logistic for P, monomolecular for Q and Gompertz for R. The areas are the solid result; the rates need more rating dates.

Paste the plot-level AUDPC values, or their logs as the paper did, into the ANOVA tool to test whether lines differ beyond the plot-to-plot noise.

## The fine print

- All results come from one site, though over three seasons. Rust races and weather differ elsewhere, and lines ranked differently between seasons.
- Three ratings a season is the usual minimum. Each AUDPC rests on only two trapezoids, so one misjudged score moves it a lot.
- Severity on the Cobb scale is a visual estimate, and different scorers can disagree.
- Marker data for known resistance genes were reported for only part of the set, so the genes behind each line's resistance are not all known.
- AUDPC and final severity were the only disease measures; no infection rates were fitted, so how fast the rust spread in each line is not reported.
- Our ratings above are made up. Use the paper for the real line values.
