---
name: Fertility rates
num: 757
shelf: science
code: T525
section: demography
title: "Fertility rate calculator: ASFR, TFR, GRR, NRR, mean age at childbearing, CBR and GFR (free)"
summary: "From births by mother's age and the number of women in each age group, work out age-specific fertility rates, the total fertility rate, gross and net reproduction rates, mean age at childbearing, the general fertility rate and the crude birth rate."
status: live
ads: true
order: 757
icon: calculator
works: offline
updated: 2026-11-09
related: [plot-maker, data-cleaner, sample-size, life-table, population-pyramid, cohort-component-projection, rate-standardisation]
sources:
  - "Formulas only: standard period fertility measures as in Preston, Heuveline and Guillot (2001), chapter 5. Example births, women and nLx are made up."
flow:
  - { icon: table, label: "Births" }
  - { icon: calculator, label: "ASFR" }
  - { icon: sigma, label: "TFR, NRR" }
  - { icon: download, label: "Report" }
---

## What it does

How many children are being born, and is a population replacing itself? This tool answers with the standard set of **period fertility measures**, worked out from two columns you probably already have: births by the mother's age group and the number of women in each group (mid-year).

- **Age-specific fertility rate (ASFR):** births ÷ women in the group, per year (shown per 1,000).
- **Total fertility rate (TFR):** the sum of the ASFRs times the group width. It is the number of children a woman would have if she lived through her childbearing years at this year's rates.
- **Gross reproduction rate (GRR):** the same, counting only daughters.
- **Net reproduction rate (NRR):** daughters per woman after allowing for some women dying before or during their childbearing years. An NRR of 1 means each generation of women just replaces itself.
- **Mean age at childbearing**, **general fertility rate** (births per 1,000 women aged 15–49) and **crude birth rate** (births per 1,000 people).

Use the rates in the [[cohort-component-projection]] to see how the population grows, and draw its age structure with the [[population-pyramid]].

## How to use it

1. Paste a table with the columns **Age, Births, Women**. Age groups like 15-19 are usual, but single years or other widths work too, as long as they follow on without gaps. Or open a CSV or Excel file.
2. Optional columns: **Female births** (births of girls by mother's age, for an exact GRR) and **nLx** (female person-years lived in each group, from a life table, for the NRR).
3. If the births are a total over several years, say how many in **Births cover**.
4. For the NRR, use your nLx column with its radix, or choose **Survival to mean age** and type the chance that a girl lives to the mean age at childbearing (about 0.99 where infant and child deaths are low).
5. Type the total population to get the crude birth rate. Download the rates as CSV or a report as an image, PDF or Word file.

## Worked example

The made-up town has 20,720 women aged 15–49 and 954 births in a year, out of 86,310 people. The ASFRs peak at 95.0 per 1,000 among women aged 30–34. The **TFR is 1.56** children per woman, well below the replacement level of about 2.1. With 1.05 boys per girl, the GRR is 0.761, and with the made-up life table's nLx the **NRR is 0.751**: each generation of women is replaced only three-quarters. The mean age at childbearing is 30.60 years, the general fertility rate is 46.0 per 1,000 women and the crude birth rate is 11.05 per 1,000 people.

## Frequently asked questions

**Why is replacement 2.1 and not 2?** Slightly more boys than girls are born, and some girls die before they have children. NRR already allows for both, so its replacement level is exactly 1.

**What is the difference between TFR and the crude birth rate?** The crude rate depends on the age structure: a young population has a high birth rate even at the same TFR. TFR and ASFRs remove the age structure.

**Is TFR the number of children women actually have?** No, it is a period measure for one year's rates. Completed cohort fertility, counted when women reach 50, can differ when people have children later or earlier than before.
