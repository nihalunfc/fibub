---
name: KPI dashboard
num: 3091
shelf: money
code: T1072
section: small-business
title: "KPI dashboard: your key numbers against last period, last year and budget"
summary: "Drop in your daily sales and capacity and see revenue, use of capacity, average price and revenue per place against the last period, last year and your budget, with a plain note on what changed."
status: live
ads: false
order: 3091
icon: curve
works: offline
updated: 2026-11-22
related: [revenue-dashboard, demand-forecaster, daily-close, pricing-recommender, trend-analyser]
sources:
  - "The measures are the standard ones: use of capacity is sold divided by available, average price is revenue divided by sold, and revenue per place is revenue divided by available (which equals use times price). Hotels call these occupancy, ADR and RevPAR; restaurants and clinics have the same ideas under other names."
  - "The example numbers are made up. Budget and last-year comparisons only use the rows you give it."
flow:
  - { icon: table, label: "Daily rows" }
  - { icon: sliders, label: "Period" }
  - { icon: curve, label: "Compare" }
  - { icon: check, label: "Budget" }
---

## What it does

A manager does not need fifty reports each morning; they need four or five numbers and to know whether they are good. This dashboard takes one row per site per day (date, places available, number sold, revenue) and works out revenue, use of capacity, average price and revenue per available place for any period you choose. Each number is shown against the previous period and against the same time last year, so you see at once if you are ahead or behind, and a short plain note explains whether the change came from volume or from price.

It works for any business that sells a limited number of places each day: hotel rooms, restaurant covers, clinic appointments, classes, parking bays or shop transactions. The example presets only change the words. Open the numbers from your own system, check the period, and read the note. When you want to know why a number moved, go to the [[revenue-dashboard]], and when you want to know what next month will look like, use the [[demand-forecaster]] or look at the [[daily-close]] for each day's takings.

## How to use it

1. **Step 1:** use the example, or paste or open your own rows. Columns are date, site (optional), places available, number sold and revenue, with total revenue and profit as optional extras.
2. **Step 2:** choose a period (last 7, 28 or 90 days, month to date, year to date or last 12 months) and one site or all of them.
3. **Read the cards,** the two charts and the by-site table. Download the summary as a CSV.
4. **Step 3:** type a target use and price for each month to see budget against actual. "Fill from last year plus 3%" gives you a starting point.

## What each setting does

- **Period**: counts back from the latest date in your data. The previous period is the same number of days just before it.
- **Site**: limits every number, chart and budget to one site.
- **Target use % and price**: budget revenue is the places available, times the target use, times the target price.
- **Remember my settings**: off by default. When ticked, only your settings and budget stay in this browser. The daily numbers file is never kept.

## Worked example

A shop has 100 places a day. Over 28 days it sold 2,100 of 2,800 and took 105,000. Use is 2,100 / 2,800 = 75.0%. The average price is 105,000 / 2,100 = 50.00. Revenue per place is 105,000 / 2,800 = 37.50, which is 75.0% times 50.00. If the previous 28 days sold 2,000 at the same price, revenue is up 5.0%, and the note says the use of capacity is the reason.

## FAQs

**What if I have no capacity numbers?** Enter the number of places you could have sold each day. Without it use and revenue per place cannot be worked out.

**Why does last year show n/a?** You need data going back a full year before the period starts.

**Are my numbers uploaded?** No. The file is read on your device and nothing is sent anywhere.

**Why is month to date compared with last month?** Because the same number of days at the start of the month are the fairest comparison; the cards also show last year.

**Can I use my own words for the measures?** The presets change the wording; the maths is the same for every kind of business.
