---
name: Life table
num: 754
shelf: science
section: demography
title: "Life table calculator: life expectancy from death rates, abridged or complete (free)"
summary: "Build a period life table from age-specific death rates or from deaths and population: nMx, nax (half-interval, Coale-Demeny or Andreev-Kingkade), nqx, lx, ndx, nLx, Tx and life expectancy ex, with charts and CSV."
status: live
ads: true
order: 754
icon: table
works: offline
updated: 2026-11-09
related: [sample-size, plot-maker, data-cleaner, population-pyramid, cohort-component-projection, fertility-rates, survival-analysis, rate-standardisation]
sources:
  - "Formulas only: Preston, Heuveline and Guillot (2001) Demography, chapter 3; Coale and Demeny (1983) a0 and 4a1 equations; Andreev and Kingkade (2015) a0 equations. Example deaths and population are made up."
flow:
  - { icon: table, label: "Deaths, pop" }
  - { icon: calculator, label: "nqx, lx" }
  - { icon: chart, label: "Life exp." }
  - { icon: download, label: "CSV" }
---

## What it does

A **life table** follows an imaginary group of newborns through life, exposed at each age to the death rates of one period. From it come **life expectancy at birth** and at every age, the chance of surviving to a given age, and the person-years lived that demographers use for projections and fertility measures. This tool builds the whole table from your numbers, in the standard notation:

- **nMx** — death rate in the age group x to x + n (deaths ÷ person-years, or mid-year population);
- **nax** — average years lived in the group by those who die in it;
- **nqx** — chance of dying in the group, from nqx = n·nMx ÷ (1 + (n − nax)·nMx);
- **lx** survivors at exact age x out of the radix, **ndx** deaths, **nLx** person-years lived, **Tx** person-years still to live, and **ex = Tx ÷ lx**, life expectancy at age x.

It works for **abridged** tables (0, 1–4, 5–9, …) and **complete** single-year tables, read from the ages you paste. The last group is always open-ended: everyone dies in it, nax = 1 ÷ M and L = l ÷ M.

Feed its survival ratios into the [[cohort-component-projection]], and draw the population you start from with the [[population-pyramid]].

## How to use it

1. Paste a table with a header: **Age, Deaths, Population**, or **Age** and a death-rate column headed **Mx** (choose whether the rates are per person, per 1,000 or per 100,000). Labels such as 1-4 or 85+ are read by their first number. Or open a CSV or Excel file.
2. Choose how **nax** is set. Infant deaths cluster in the first weeks, so a0 is well under 0.5: *Coale-Demeny* sets a0 and 4a1 from the infant death rate by sex, *Andreev-Kingkade* sets a0 by a newer formula, or add your own **ax** column.
3. Pick the chart (survivors, death rates on a log scale, or life expectancy) and download the table as CSV, or the report as an image, PDF or Word file.

## Worked example

The made-up example is a region of 421,800 people with 3,111 deaths in a year, in 19 age groups up to 85+. With Coale-Demeny female values (a0 = 0.068, 4a1 = 1.514), the infant death rate of 0.0052 gives 1q0 = 5.17 per 1,000. Life expectancy at birth is **79.37 years**, 86.7 % of newborns would reach 65, and life expectancy at 65 is 18.90 years. Of the 100,000 starting births, 42,193 reach 85, where the open group's death rate of 0.157 gives them 6.39 more years on average. Using half the interval for every group instead changes e0 only in the third decimal (79.373), because infant deaths are few.

## Frequently asked questions

**Is life expectancy a forecast of how long people will live?** No. A period table assumes today's death rates hold for a lifetime. If death rates keep falling, people born now will live longer than e0 suggests.

**Why does e1 come out lower than e0 sometimes, and sometimes higher?** When infant deaths are high, surviving the first year adds more than the year used up, so e1 can exceed e0.

**What if an age group had no deaths?** A rate of 0 is allowed for closed groups (q = 0), but the open group must have deaths. Small populations give jumpy rates: pool several years or wider age groups.
