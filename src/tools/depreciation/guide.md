---
name: Depreciation
num: 1759
shelf: money
section: accounting
title: "Depreciation calculator: straight line, declining balance, sum of years' digits"
summary: "Spread the cost of an asset over its life with straight-line, declining balance, sum of the years' digits or units of production, with a schedule and CSV."
status: live
ads: false
order: 1759
icon: sliders
works: offline
updated: 2026-11-10
related: [break-even, percentage-calculator, invoice-maker]
sources:
  - "Standard accounting formulas: straight line (cost - salvage) / life; declining balance = book value x rate; sum of the years' digits = (cost - salvage) x remaining life / sum of years; units of production = (cost - salvage) x units used / total units. Tax depreciation follows your country's rules, so check the official source."
flow:
  - { icon: coin, label: "Asset" }
  - { icon: sliders, label: "Method" }
  - { icon: table, label: "Schedule" }
---

## What it does

Depreciation spreads the cost of something long-lasting, such as a van, laptop or machine, over the years you use it, instead of counting it all in year one. Bookkeepers use it for accounts, and owners use it to see what an asset really costs each year.

Enter the cost, the value you expect at the end (salvage), the life in years and a method. The tool gives a year-by-year schedule of expense, total depreciation and book value, which you can download as CSV. Before buying, test the numbers with [[break-even]]; use [[percentage-calculator]] to check rates.

## How to use it

1. Enter the **cost** and the **salvage value**.
2. Pick the **life** in years and a **method**.
3. For declining balance, leave the rate blank for double-declining, or type your own rate.
4. For units of production, enter the total units and the units used each year.
5. Read the schedule and use **Download CSV** if you need it.

## What each setting does

- **Straight line:** the same amount every year.
- **Declining balance:** a fixed percentage of the remaining book value, so early years are bigger. Double-declining uses twice the straight-line rate.
- **Sum of the years' digits:** a falling share each year, with no rate to choose.
- **Units of production:** depreciation follows how much you use the asset.
- **Depreciate to salvage in the last year:** tops up the final year so book value ends on salvage.

## Worked example

A machine costs 10,000, will be worth 1,000 and lasts 5 years. Straight line gives (10,000 - 1,000) / 5 = 1,800 a year. Double declining uses 40%: 4,000 in year 1, then 2,400, 1,440 and 864, and the last year is trimmed so book value ends at 1,000. Sum of the years' digits (15) gives 3,000 in year 1.

## FAQs

**Which method should I use?** Your accountant or tax rules decide. Straight line is the simplest.

**Does book value go below salvage?** Never; the tool stops there.

**Is this tax depreciation?** No. Tax systems have their own classes and rates, so check the official source. Not financial or tax advice.
