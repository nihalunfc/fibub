---
name: Load profit
num: 1817
shelf: vehicles
code: T906
section: trucking
title: "Load profit calculator: is this freight load worth taking?"
summary: "Enter the rate, loaded and empty distance, your cost per mile, tolls and days to see the profit, the rate per total mile, profit per day and whether the load beats your minimum."
status: live
ads: true
order: 1817
icon: calculator
works: offline
updated: 2026-11-10
related: [cost-per-mile, fuel-cost, rideshare-earnings, mileage-log]
sources:
  - "Profit = rate (flat, or per loaded mile times loaded miles) plus detention, minus total distance (loaded plus empty) times your cost per mile, minus tolls. fibub's own formulas; all figures are yours."
flow:
  - { icon: coin, label: "Rate" }
  - { icon: ruler, label: "Distance" }
  - { icon: calculator, label: "Profit" }
  - { icon: check, label: "Decide" }
---

## What it does

A load that pays well per loaded mile can still lose money once you count the empty miles to reach it or to come home. This tool counts every mile you drive for the load, so you see what the load really pays.

Enter what the broker or customer offers, how far you go loaded and empty, and what each mile costs you. You see the profit, the rate for every total mile, the profit for each day the load takes, and a plain accept or decline against the minimums you set. If you do not know your cost for every mile, work it out first with [[cost-per-mile]]; for the fuel on a single run, [[fuel-cost]] is the quick check.

## How to use it

1. Say whether the rate is a flat amount or per loaded mile, and type it.
2. Type the loaded distance and the empty distance.
3. Type your cost for every mile, any tolls, any detention pay, and the days the load takes.
4. Optionally set a minimum profit a day and a minimum rate for every total mile.

## What each setting does

- **Empty distance**: miles with no load that you drive because of this job. They cost money but earn nothing.
- **Detention or extra pay**: waiting time pay you expect. It is added to the money in.
- **Minimums**: the load is declined if the profit a day or the rate per total mile is under the number you set, or if it loses money.
- **Kilometres**: the same sums in km, for loads priced per km.

## Worked example

The load pays 2,000 flat for 800 loaded miles, and you drive 200 empty miles to reach it. Your cost is 1.50 a mile. Total distance 1,000 miles, cost 1,500, profit 500. The rate for every total mile is 2,000 / 1,000 = 2.00. If the load takes 2 days the profit is 250 a day.

## FAQs

**Why is the rate per total mile lower than the posted rate?** Because empty miles are included. That is the number to compare between loads.

**Should I include my own pay?** Yes, in the cost for every mile or by keeping the profit as your pay. Be consistent.

**Is a small profit always bad?** Not if the truck would otherwise sit idle, but check it against [[cost-per-mile]] so fixed costs are covered.
