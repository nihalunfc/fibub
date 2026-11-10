---
title: "How to calculate cell doubling time (with a worked example)"
summary: "Work out the doubling time of a cell culture from two or more counts, using the log-linear fit, and spot the lag phase that throws it off."
tools: [cell-doubling-time, hemocytometer, growth-curve-od600]
updated: 2026-11-10
sources:
  - "Exponential growth N = N₀ × 2^(t / Td), the two-count formula Td = (t₂ − t₁) × ln 2 ÷ ln(N₂ ÷ N₁) and the least-squares fit of ln(count) against time: general science knowledge."
  - "The counts in the example are made up."
---

Doubling time is the time a growing culture takes to double its cell number: with two counts it is the time between them times ln 2, divided by the natural log of how many times the count grew. The [[cell-doubling-time|doubling time calculator]] does this for two counts, or fits a straight line through three or more on a log scale and gives an interval.

## What you need

- Two or more cell counts from the same culture, each with the time it was taken. Four to six counts, one a day, work much better than two.
- Counts measured the same way every time: cells per mL, cells per well or total cells. Mixing units breaks the maths.
- A rough idea of when the cells were growing steadily. Counts taken just after seeding (the lag) or after the dish filled up (the plateau) should be left out.

## Step by step

1. **Get the counts.** Count each sample with a hemocytometer or a cell counter. The [[hemocytometer|hemocytometer cell counter]] gives cells per mL from a square-by-square tally.
2. **Type them in.** On the doubling time page, choose hours or days, then add a row for each count with its time. You can also open **Paste a table** and paste two columns (time and count) from a spreadsheet.
3. **Read the headline.** With two counts the tool uses the exact two-point formula. With three or more it fits ln(count) against time by least squares and shows the doubling time, the growth rate, a 95 % interval, R² (how close the points lie to a straight line) and the number of generations.
4. **Look at each interval.** The table "Between each pair of counts" gives a doubling time for every step. A step much slower than the rest, at the start or the end, is usually lag or plateau.
5. **Untick the odd counts.** Clear the box next to a count to leave it out of the fit, and watch the doubling time and R² update.

The formulas are:

Two counts: Td = (t₂ − t₁) × ln 2 ÷ ln(N₂ ÷ N₁)

Several counts: fit ln N = ln N₀ + r × t, where r is the growth rate per hour; then Td = ln 2 ÷ r.

Generations over the fitted span = r × (t_end − t_start) ÷ ln 2.

The same page then has a passage planner that uses your doubling time to say how many cells to seed for a target confluence on a chosen day. For bacteria measured by optical density instead of counts, use the [[growth-curve-od600|OD600 growth curve]] tool.

## A worked example

A made-up culture, counted once a day in cells/mL:

| Time (h) | Count (cells/mL) |
|---|---|
| 0 | 50,000 |
| 24 | 82,000 |
| 48 | 160,000 |
| 72 | 330,000 |
| 96 | 610,000 |

With all five counts ticked, the fit gives a doubling time of **26.01 h**, a 95 % interval of 23.47 to 29.18 h and R² = 0.9965.

The step table tells a clearer story. From 0 to 24 h the doubling time is 33.6 h; after that it is 24.9 h, 23.0 h and 27.1 h. The first day looks slow, which is typical of freshly split cells settling in.

Untick the 0 h count and fit the last four:

- Growth rate r = 0.02810 per hour (0.6744 per day)
- Doubling time = ln 2 ÷ 0.02810 = **24.67 h**
- 95 % interval 22.58 to 27.17 h, R² = 0.9991
- Generations over the 72 h from 24 to 96 h: 0.02810 × 72 ÷ 0.6931 = 2.919, a 7.563-fold rise

As a hand check with just two counts, 24 h and 96 h: Td = 72 × 0.6931 ÷ ln(610,000 ÷ 82,000) = 49.91 ÷ 2.007 = 24.87 h. That is close to the fit, as it should be.

## Check your answer

- Count the doublings by eye. From 82,000 to 610,000 is a bit under 8-fold, which is just under 3 doublings (2³ = 8). Three doublings in 72 hours is 24 h each, so an answer near 25 h makes sense.
- Run it forwards: 82,000 × 2^(72 ÷ 24.67) ≈ 620,000, close to the 610,000 you counted.
- If R² is below about 0.95, or the tool warns that growth slows towards the end, some counts are from the lag or plateau. Untick them and fit only the steady part.

## Questions people ask

**Is doubling time the same as cell cycle time?** Not always. Doubling time is for the whole population, so cells that die or stop dividing make it longer than the time one cell takes to divide.

**Why log the counts?** Steady growth multiplies the count by the same factor each hour, so on a log scale it becomes a straight line. A straight line is easy to fit, and its slope is the growth rate.

**How many counts do I need?** Two give an answer but no idea of its error. Three or more steady-growth counts give an interval, and five or six give a narrow one.
