---
name: Driver earnings
num: 1783
shelf: money
code: T817
section: pay
title: "Rideshare and delivery driver earnings calculator: real profit per hour and per km"
summary: "Turn your gross fares into net pay per hour and per km after platform fee, fuel, maintenance, insurance and phone, with a tax set-aside."
status: live
ads: false
order: 1783
icon: calculator
works: offline
updated: 2026-11-10
related: [fuel-cost, hourly-salary, mileage-log]
sources:
  - "Net = fares + tips - platform fee - fuel - maintenance per km x km - insurance - phone. The tax set-aside is a rough percentage of net that you choose; real tax depends on your country and income. Check the official source for self-employment tax and sales tax rules."
flow:
  - { icon: coin, label: "Fares" }
  - { icon: sliders, label: "Costs" }
  - { icon: clock, label: "Hours" }
  - { icon: wallet, label: "Net" }
---

## What it does

Gross earnings look good on the app but the car, fuel and platform take a lot. Enter a week or month of driving and this page shows what is left per hour and per kilometre, before income tax, so you can compare it with a regular job and decide which hours are worth working.

It counts all the kilometres you drive, including the empty ones between rides, because you pay for them. Fuel for one trip is in [[fuel-cost]], a salaried comparison in [[hourly-salary]], and the tax records you need in [[mileage-log]].

## How to use it

1. Type fares and tips for the period, and the hours you were logged in.
2. Type the kilometres driven in total and your car's fuel use and the fuel price.
3. Fill in the platform fee, maintenance per km, insurance and phone for the same period.
4. Pick a tax set-aside percentage.

## What each setting does

- **Platform fee**: share of fares the platform keeps. Read it from the statement.
- **Maintenance per km**: tyres, oil, repairs and brakes. A common range is 0.05 to 0.15 per km; yours may differ.
- **Insurance**: rideshare insurance often costs more than personal cover; use the share for this period.
- **Set aside for tax**: money to put away. The page shows it and what you keep afterwards.

## Worked example

A week with 900 in fares and 80 in tips over 35 hours and 900 km: the platform keeps 225, fuel at 8 L/100 km and 1.60 is 115.20, maintenance at 0.08 is 72, insurance 45 and phone 10. Net is 512.80, which is 14.65 an hour and 0.570 per km. A 20% set-aside is 102.56, so you keep 410.24.

## FAQs

**Does it include car depreciation?** Not directly; raise maintenance per km to cover it.

**Are tips taxed?** Usually yes, as income. Ask your tax office.

**Not tax advice.** Self-employed drivers may owe more than the set-aside.
