---
name: Gini and Lorenz curve
num: 742
shelf: science
section: economics
title: "Gini coefficient calculator with Lorenz curve, Palma ratio, Theil and Atkinson indices, from incomes or income shares"
summary: "Paste incomes (with optional weights such as household size or survey weights) or grouped income shares, and get the Gini coefficient, the Lorenz curve, quintile, top 10 % and top 1 % shares, the Palma ratio, Theil T and L, Atkinson indices and the P90/P10 ratio."
status: live
ads: true
order: 742
icon: chart
works: offline
updated: 2026-11-09
related: [biodiversity-indices, data-cleaner, plot-maker, sample-size]
sources:
  - "Standard definitions: Lorenz (1905) curve, Gini (1912) coefficient, Theil (1967) indices, Atkinson (1970) index, Palma ratio as in Cobham and Sumner (2013). No tables copied."
  - "Written by fibub. Checked in the tests against an independent NumPy calculation (Gini from the weighted mean absolute difference over all pairs, shares by interpolation, Theil and Atkinson from their definitions) on made-up, random weighted and grouped data."
  - "The example incomes and shares are made up."
flow:
  - { icon: table, label: "Incomes" }
  - { icon: curve, label: "Lorenz" }
  - { icon: sigma, label: "Gini" }
  - { icon: download, label: "Report" }
---

## What it does

How unequal is a set of incomes, wages, wealth or any other amount shared among people? This tool draws the **Lorenz curve** and works out the most used inequality measures, all in your browser:

- the **Gini coefficient** (0 is perfect equality, 1 is one person with everything), with the small-sample correction for unweighted data;
- **income shares** of each fifth (quintile), of the bottom 40 %, the top 10 % and the top 1 %;
- the **Palma ratio**, the top 10 %'s share divided by the bottom 40 %'s;
- **Theil T** and **Theil L** (mean log deviation), the two "generalised entropy" indices that can be split into within-group and between-group parts;
- the **Atkinson index** for any inequality aversion ε, the share of total income society would give up to have the rest shared equally;
- the **P90/P10** ratio of the incomes at the 90th and 10th percentiles.

## How to use it

1. **Incomes:** paste one income per row, or open a CSV or Excel file. Add a second column of weights when each row stands for several people (household size) or for a survey weight.
2. **Grouped (shares):** when you only have published shares, such as the share of income going to each fifth of households, give one row per group with its population (count or %) and its income (total or %). Everyone inside a group is treated as equal, so the results are lower bounds.
3. Set the Atkinson ε values you want, such as 0.5, 1 and 2.
4. Download the measures, the quintile table and the Lorenz curve points as CSV, or the report as an image, PDF or Word file.

## Worked example (made-up incomes)

The 18 made-up incomes (in thousands) have a **Gini of 0.399** (0.422 with the sample correction). The poorest fifth gets 6.1 % of all income and the richest fifth 46.8 %. The Palma ratio is 1.803: the top 10 % earn 1.8 times as much in total as the bottom 40 %. Theil T is 0.264, and the Atkinson index with ε = 1 is 0.233: the same welfare could be had with 23.3 % less income shared equally.

With the made-up quintile shares (6.5, 11, 15.5, 22 and 45 %), the Gini is **0.352** and the Palma ratio 1.286.

## Tips

- Use the same income concept when comparing (before or after tax, per household or per person, with or without an equivalence scale).
- The Gini is most sensitive to the middle of the distribution, the Palma and top shares to the top, and the Atkinson index with high ε to the bottom.
- Zero incomes are fine for the Gini, Theil T and Palma, but Theil L is not defined and the Atkinson index for ε ≥ 1 becomes 1.

## FAQ

**Why is the corrected Gini higher?** For a sample of n people the largest possible Gini is (n − 1)/n, so multiplying by n/(n − 1) lets small samples reach 1 and removes the downward bias.

**Can I use wealth or other amounts?** Yes, any amount that is zero or more: wealth, land, sales by firm, or citations by author.
