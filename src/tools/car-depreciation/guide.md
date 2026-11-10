---
name: Car depreciation
num: 1805
shelf: money
code: T895
section: vehicle-buying
title: "Car depreciation calculator: what your vehicle will be worth each year"
summary: "See the value of a car, two-wheeler or truck after each year with a fixed yearly percent or an editable typical curve, adjusted for the km you drive, with a table, chart and loss per km."
status: live
ads: false
order: 1805
icon: curve
works: offline
updated: 2026-11-10
related: [depreciation, car-loan, lease-vs-buy]
sources:
  - "Declining-balance method: value after a year = last year's value x (1 - rate). The typical year-by-year curves are rough round numbers for illustration (estimate), not data from any maker or market; change them to match prices you see for the same model. The extra loss for high mileage is a simple rule of thumb you can edit. Drawings are fibub's own."
flow:
  - { icon: coin, label: "Price" }
  - { icon: sliders, label: "Rate" }
  - { icon: curve, label: "Value" }
  - { icon: check, label: "Loss" }
---

## What it does

A new vehicle loses value the moment you drive it away, and for most owners that loss is bigger than fuel or repairs. This tool shows what your car, two-wheeler or truck may be worth after each year, how much you lose in total, per year, per month and per kilometre.

Use it before you buy, to compare a new vehicle with a used one, or before you sell. For the finance side use [[car-loan]], to compare owning with leasing use [[lease-vs-buy]], and for other assets use [[depreciation]].

## How to use it

1. Choose the vehicle and type the price you pay.
2. Type the years you plan to keep it.
3. Pick a method: the same percent every year, or the typical curve, where each year has its own percent.
4. Optionally enter the kilometres you drive a year to see the loss per km.

## What each setting does

- **Same percent each year**: every year loses that share of what it was worth at the start of the year, so the loss shrinks in money terms.
- **Typical curve**: a rough shape with a big first-year drop that flattens out. Every year is editable.
- **Km you drive a year, typical km, extra loss**: driving more than typical makes the vehicle worth less. For each 10,000 km a year above typical, the yearly loss goes up by the points you set (1 by default). Leave the km empty to ignore this.

## Worked example

A vehicle costs 20,000 and loses 15% a year. After one year it is worth 17,000, after two 14,450 and after three 12,282.50. You have lost 7,717.50, about 2,572.50 a year. At 15,000 km a year over 3 years (45,000 km) that is roughly 0.17 per km.

## FAQs

**Is this what a dealer will pay me?** No. It is an estimate. Condition, colour, service history and demand change real prices, so check adverts for the same model.

**Why is the first year so big?** Buyers pay a premium for new. A one-year-old vehicle is already used, even with few kilometres.

**Do two-wheelers and trucks lose value the same way?** The shapes differ a little, so the typical curve changes with the vehicle you pick. The numbers are rough; edit them.

Not financial advice.
