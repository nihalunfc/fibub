---
name: Population pyramid
num: 755
shelf: science
code: T523
section: demography
title: "Population pyramid maker with dependency ratio, median age and sex ratio (free)"
summary: "Draw a population pyramid from male and female counts by age group, as counts or percentages, with a second year or area as an outline, and get dependency ratios, interpolated median age and sex ratios. Download PNG, SVG or CSV."
status: live
ads: true
order: 755
icon: chart
works: offline
updated: 2026-11-09
related: [plot-maker, data-cleaner, sample-size, cohort-component-projection, life-table, fertility-rates, rate-standardisation]
sources:
  - "Formulas only: standard demographic measures (dependency ratios, sex ratio, grouped median by interpolation), as in Preston, Heuveline and Guillot (2001). Example counts are made up."
flow:
  - { icon: table, label: "Age, sex" }
  - { icon: chart, label: "Pyramid" }
  - { icon: sigma, label: "Ratios" }
  - { icon: download, label: "PNG, SVG" }
---

## What it does

A **population pyramid** shows a population's age and sex structure at a glance: males to the left, females to the right, the youngest at the bottom. A wide base means many children and a growing population; a narrow base and a wide middle mean falling births and an ageing population. This tool draws one from a simple table and works out the numbers that go with it:

- **Dependency ratios:** young (0–14) and old (65+, or 60+) per 100 people of working age, and the total;
- **Median age** for everyone, males and females, interpolated inside its age group;
- **Sex ratio** (males per 100 females), overall and for every age group;
- the share of the population at old age.

Add a **second year or area** and it is drawn as an outline over the bars, with its measures side by side, so you can see where the shape has changed.

Project the population forward with the [[cohort-component-projection]], and work out birth rates for it with the [[fertility-rates]] tool.

## How to use it

1. Paste or open a table with the columns **Age, Male, Female**. Age groups can be any width (5-year groups, single years); the last group is treated as open (such as 85+). Rows may run oldest first or youngest first.
2. Give it a name, such as the year or the place.
3. Tick **Compare with a second year or area** and paste the second table. It must use the same age groups.
4. Choose **% of each total** to compare shapes of populations of different sizes, or **Counts** to compare sizes too.
5. Download the pyramid as PNG or SVG (vector, for editing), the table as CSV, or a full report as an image, PDF or Word file.

## Worked example

The made-up town has 86,310 people in 2025 and 77,140 in 2000. In 2025 the median age is **38.6** (males 37.6, females 39.5) against 31.9 in 2000. The young dependency ratio has fallen from 37.1 to 25.9 children per 100 people aged 15–64, while the old-age ratio has risen from 16.3 to 23.6, so the total dependency ratio fell slightly, from 53.4 to 49.5. The share aged 65+ grew from 10.6 % to 15.8 %. The sex ratio is 98.0 males per 100 females, with women outnumbering men more and more at older ages (56 men per 100 women at 85+). On the pyramid, the 2025 bars are narrower than the 2000 outline at the bottom and wider at the top: a classic picture of falling births and longer lives.

## Frequently asked questions

**How is the median age worked out from groups?** Find the group holding the middle person, then assume people are spread evenly within it: median = start of group + (half the total − people in younger groups) ÷ people in the group × group width. If the middle person is in the open group, the tool can only say "at least".

**Why do the dependency ratios say they need groups at 15 and 65?** The ratios split the population at those ages, so the table must have groups that start exactly there.

**Does a high dependency ratio mean a weak economy?** Not by itself. It counts people by age, not who works, studies or cares for others.
