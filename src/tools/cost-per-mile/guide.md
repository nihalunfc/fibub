---
name: Cost per mile
num: 1816
shelf: money
code: T906
section: trucking
title: "Cost per mile calculator for trucks: break-even rate and rate for your margin"
summary: "Add up a truck's fixed costs, fuel, maintenance, tyres, tolls and driver pay to get its cost per mile or km, the break-even rate and the rate for a profit margin you choose."
status: live
ads: true
order: 1816
icon: calculator
works: offline
updated: 2026-11-10
related: [load-profit, fuel-cost, commute-cost, mileage-log]
sources:
  - "Method: monthly fixed costs divided by distance driven, plus fuel (price divided by miles per gallon or km per litre), plus the per-distance costs you enter. The margin rate is cost divided by (1 minus the margin). All figures are yours; fibub's own drawing and formulas."
flow:
  - { icon: wallet, label: "Fixed" }
  - { icon: sliders, label: "Per mile" }
  - { icon: calculator, label: "Cost" }
  - { icon: coin, label: "Rate" }
---

## What it does

This tool turns everything a truck costs you into one number: the cost of every mile (or kilometre) it drives. Type the costs that do not change with distance (the truck payment, insurance, permits, parking), the costs that do (fuel, maintenance, tyres, tolls, driver pay) and how far you drive in a month.

You get the cost per mile, the break-even rate you must be paid just to cover costs, and the rate that gives you the profit margin you want. Once you know your number, [[load-profit]] tells you whether a particular load is worth taking, and [[fuel-cost]] helps with fuel on a single trip.

## How to use it

1. Pick miles and US gallons, or kilometres and litres.
2. Type the distance you drive in a typical month.
3. Fill in the fixed costs for the month, then the costs for every mile.
4. Choose whether the driver is paid by distance or by the hour.
5. Set your target margin. Add a typical load in tonnes if you want a cost per tonne-mile or tonne-km, which is how many Indian freight rates are quoted.

## What each setting does

- **Distance driven a month**: spreads the fixed costs. Drive less and every mile costs more.
- **Fuel economy**: miles per gallon, or km per litre. Fuel per mile is price divided by economy.
- **Paid by the hour**: driver pay is hours times hourly pay, divided by the distance, so slow months cost more per mile.
- **Target margin**: profit as a share of the rate you charge. A 10% margin on a cost of 1.77 gives a rate of 1.96, not 1.95, because the margin is a share of the rate.

## Worked example

Fixed costs 4,000 a month (2,200 + 1,000 + 300 + 500), 10,000 miles, fuel 4.00 a gallon at 6.5 mpg, maintenance 0.15 and driver pay 0.60 a mile. Fixed 0.40 + fuel 0.6154 + 0.15 + 0.60 = 1.77 a mile (1.7654 before rounding). That is the break-even rate. For a 10% margin the rate is 1.7654 / 0.9 = 1.96.

## FAQs

**Which costs am I forgetting?** Common misses are trailer costs, tyres, wash, communications, accounting, and your own pay if you drive. Add them to parking and other fixed costs.

**Does it include empty miles?** Only if you count them in the distance. Use total miles driven, loaded and empty, and see [[load-profit]] for a single load with empty return miles.

**Is it tax advice?** No. Check the figures with your own accountant.
