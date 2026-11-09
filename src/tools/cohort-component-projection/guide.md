---
name: Cohort-component projection
num: 756
shelf: science
section: demography
title: "Cohort-component population projection calculator with survival, fertility and migration (free)"
summary: "Project a population by age and sex in 5-year steps from survival ratios (or life-table nLx), age-specific fertility rates, the sex ratio at birth and net migration by age, with projected pyramids, totals, median age and CSV."
status: live
ads: true
order: 756
icon: chart
works: offline
updated: 2026-11-09
related: [plot-maker, data-cleaner, trend-analyser, life-table, fertility-rates, population-pyramid, population-growth-models]
sources:
  - "Method only: cohort-component projection as in Preston, Heuveline and Guillot (2001), chapter 6, and the Leslie (1945) matrix. Example population and rates are made up."
flow:
  - { icon: table, label: "Base pop" }
  - { icon: sliders, label: "Rates" }
  - { icon: calculator, label: "Project" }
  - { icon: chart, label: "Pyramids" }
---

## What it does

The **cohort-component method** is how statistical offices project populations. It follows each 5-year age group (a cohort) forward in time and adds the three components of change: **deaths** (through survival ratios), **births** (through age-specific fertility rates) and **net migration**. This tool runs it for women and men separately, for up to 40 steps (200 years), and shows the total population, births, growth rate, share of children and older people, median age, and the projected **population pyramid** for any year, drawn against the base year.

Get the survival ratios from the [[life-table]] and the birth rates from the [[fertility-rates]] tool, then draw the result as a [[population-pyramid]].

## How to use it

1. Paste one table with a row per 5-year age group, from 0-4 to an open group such as 85+, and these columns: **Age, Female, Male, Female survival, Male survival, ASFR, Female migrants, Male migrants**. You can also open a CSV or Excel file. Migrant columns are optional.
2. Choose what the survival columns hold:
   - **Survival ratios**: the share of each group alive 5 years later in the next group. The open group's row is the share of that group still alive. Then type the share of **births surviving to 0-4** for each sex.
   - **Life-table nLx**: person-years lived in each group from a life table (the open row holds T for that age) and the radix. The tool works out the ratios, using T(85) ÷ T(80) for everyone aged 80 and over, and births' survival as 5L0 ÷ (5 × l0).
3. Set the **sex ratio at birth** (about 1.05 boys per girl in most populations), the base year and the number of steps. Switch migration off to see the closed population.
4. Pick a year for the pyramid and the age table. Download every year by age as CSV, or the report as an image, PDF or Word file.

## How each step works

- Every group moves up one: P(x + 5, t + 5) = P(x, t) × S(x). The open group gains the survivors of the group below and keeps its own survivors.
- Births over the 5 years = 5 × Σ ASFR(x) × (women aged x at the start + women aged x at the end) ÷ 2.
- Births are split into girls (÷ (1 + SRB)) and boys, then survived to age 0-4.
- Net migrants by age are added at the end of the step, so migrant women count among the women at the end when births are worked out.

Without migration this is exactly the Leslie matrix projection, and the growth rate settles at the matrix's intrinsic rate.

## Worked example

The made-up town has 86,310 people in 2025, a total fertility rate of 1.56 and modest net immigration of young adults. Projected for 10 steps, it grows to **98,353 in 2075** (+14.0 %), with 4,767 births in the first five years. Growth slows to −0.08 % a year by the end as the population ages: the median age rises from 38.6 to 47.3 and the share aged 65+ from 15.8 % to 28.5 %. With migration left out, the town shrinks to 77,169 by 2075, the median age reaches 51.7 and the growth rate approaches its long-run value of about −0.93 % a year.

## Frequently asked questions

**Is this a forecast?** No. It shows what would happen if today's rates held for every step. Real projections use rates that change over time and several scenarios.

**Why 5-year steps?** With 5-year age groups and 5-year steps, each group moves exactly one row per step. For single years, use single-year groups and rates in a dedicated program.

**What if emigration exceeds the people in a group?** The group is set to 0 and the tool tells you how many people that removed.
