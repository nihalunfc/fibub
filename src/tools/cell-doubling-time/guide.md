---
name: Doubling time
num: 189
shelf: science
code: T189
section: cell-biology-and-cell-culture
title: "Doubling time"
summary: "Type two or more cell counts and get the doubling time from a log-linear fit, with the growth rate, generations and a 95 % interval. Then plan the next passage: how many cells to seed per flask or well to reach a target confluence on the day you want, the split ratio, the volume to pipette and a schedule of the next passages."
status: live
ads: false
order: 11
icon: calculator
works: offline
updated: 2026-11-09
related: [hemocytometer, media-recipe-scaler, plate-layout, solution-calculator]
sources:
  - "Exponential growth, N = N₀ × 2^(t / Td), the two-count formula Td = (t₂ − t₁) × ln 2 / ln(N₂ / N₁) and the least-squares fit of ln(count) against time are general science knowledge, written by fibub."
  - "Checked in the tests against an independent NumPy least-squares script with its own Student-t quantile, on the example and four random growth series (doubling time, its 95 % interval, R², generations), and the passage planner against hand working and the same script."
  - "Vessel areas and medium volumes are typical rounded values chosen by fibub, not any maker's table; 1 × 10⁵ cells per cm² at 100 % confluence is a round starting value. All are editable."
  - "The example counts are made up for this tool."
flow:
  - { icon: pencil, label: "Counts" }
  - { icon: chart, label: "Fit" }
  - { icon: flask, label: "Seed" }
  - { icon: calendar, label: "Schedule" }
---

## What it does

Cells in steady growth double at a constant pace, so the number of cells rises as N = N₀ × 2^(t / Td), where **Td** is the doubling time. This page works out Td from your own counts and then uses it to plan the next split.

- **Two counts.** Td = (t₂ − t₁) × ln 2 / ln(N₂ / N₁). Four times as many cells after 48 hours is two doublings, so Td = 24 h.
- **Three or more counts.** On a log scale steady growth is a straight line. The page fits ln(count) against time by least squares: the slope is the **growth rate** r (per hour), Td = ln 2 / r, and the slope's standard error gives a **95 % interval** for Td. R² shows how straight the line is.
- **Generations** are the doublings over the fitted span: r × time ÷ ln 2.
- **Between each pair of counts** the table shows a doubling time for every interval, so you can see a slow start (lag) or growth levelling off (plateau) and untick those counts.

Count the cells for each point with the [[hemocytometer]], and keep the frozen stocks in order with the [[cryovial-inventory]].

## Plan the next passage

The planner runs the same law backwards. To have a target confluence on a given day, seed the target number of cells divided by 2^((hours − lag) / Td). It tells you:

- **Cells to seed per vessel**, as cells, cells per cm² and percent confluence.
- **Split ratio**, by area: the density now divided by the seeding density (1 : 8 means the cells from one flask spread over the area of eight).
- **Volumes**: how much cell suspension and how much medium to put in each vessel, how many cells your vessels need and how many you could seed.
- **The next passages**: dates, the split each time, population doublings since today and how many cells you would have if you kept every cell, with a plot of the predicted confluence.

## How to use it

1. **Counts.** Type the time and count for each sample, or paste two columns from a spreadsheet. Counts can be cells/mL, cells per well or confluence, as long as they are all measured the same way. Choose hours or days.
2. **Fit.** Untick counts from the lag or the plateau. Read the doubling time, its interval and R².
3. **Seed.** The doubling time is copied into the planner; you can type your own. Pick the vessels the cells are in now and either their confluence or your count (cells/mL and the volume they are resuspended in). Then pick the new vessels, how many, the target confluence and when you want them ready.
4. **Schedule.** Read the plan and the next passages, and download the counts or the schedule as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The example uses made-up counts in cells/mL: 100,000 at 0 h, 180,000 at 24 h, 410,000 at 48 h, 820,000 at 72 h, 1,600,000 at 96 h and 1,900,000 at 120 h. The last count is left unticked because growth has levelled off (its own interval shows a doubling time of 96.8 h). The fit through the other five gives a **doubling time of 23.56 h (0.9816 days)**, a growth rate of 0.02942 per hour (0.7062 per day), a 95 % interval of 21.77 to 25.67 h, R² = 0.9980 and 4.075 generations in 96 hours (16.85-fold). Tick the last count too and the doubling time drifts up to 26.5 h with a warning that growth slows down.

For the passage, a T75 flask (75 cm²) is 80 % confluent. At 1 × 10⁵ cells per cm² for a full layer that is about 6,000,000 cells, resuspended in 5 mL (1,200,000 cells/mL). To have two T75 flasks 80 % confluent in 3 days, with no lag, the cells need 3.056 doublings, so **seed 721,400 cells per T75 flask** (9,619 cells/cm², about 9.619 % confluent). The split ratio is **1 : 8.317**. Put 601 µL of suspension and 14.4 mL of medium in each flask. The two flasks take 1,443,000 cells, and you have enough for 8.

## Tips

- Count at the same time of day, in the same way, from the same vessels. Mix well before every count.
- Seed a few vessels and count one each day: a series of four to six counts gives a much steadier doubling time than two.
- Freshly split cells often take half a day to a day to start dividing. Put that in **Lag after seeding**.
- Growth slows as cells fill the surface, so plans that aim above about 90 % arrive late. Most lines are best split before they are fully confluent.
- Very sparse cells may grow slowly or not at all; the page warns below 5 % confluence.

## FAQ

**What counts as one doubling?** One population doubling: the number of cells goes from N to 2N. Generations, population doublings and doublings are the same thing here.

**Why does my two-count doubling time differ from the fit?** Two counts fit exactly and carry every error of both counts. A fit through several counts averages those errors out and gives an interval.

**Can I use confluence instead of counts?** Yes, while the cells are well below confluence. Near a full layer, confluence stops rising exponentially.

**Are the vessel areas exact?** No. They are typical rounded values; check your own flasks and type the real area and medium volume.

**Is anything sent or saved?** No. Everything is worked out in your browser and nothing is stored.
