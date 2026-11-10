---
name: Rebalance portfolio
num: 1754
shelf: money
code: T788
section: investing
title: "Portfolio rebalancing calculator: how much to buy or sell"
summary: "Enter your holdings and target percentages, add new cash if you like, and see how much to buy or sell in each to reach your targets, with a buy-only option."
status: live
ads: false
order: 1754
icon: sliders
works: offline
updated: 2026-11-10
related: [compound-interest, sip-calculator, return-calculator]
sources:
  - "Arithmetic only: target value = (holdings + new cash) x target share; the buy or sell amount is the target value minus the current value. Checked by hand: 6,000 and 4,000 with 50/50 targets means sell 1,000 of the first and buy 1,000 of the second."
flow:
  - { icon: coin, label: "Enter" }
  - { icon: sliders, label: "Choose" }
  - { icon: chart, label: "Result" }
  - { icon: check, label: "Check" }
---

## What it does

Over time some holdings grow faster than others and your mix drifts away from the one you chose. This calculator takes what you hold now, the percentage you want in each, and any new cash, and shows how much to buy or sell in each to get back on target. It does not suggest what to hold or when to trade; the targets are yours.

If you would rather not sell (selling can create a taxable gain), tick **Buy only** and the new cash goes to the holdings furthest below target. To see what a selling decision may cost, try [[capital-gains]]; to check how the mix has performed, [[return-calculator]]; to plan regular additions, [[sip-calculator]].

## How to use it

1. Type each holding's name and its **value now**, and the **target %** you want.
2. Use **Add a row** for more holdings. Targets that do not add to 100 are scaled.
3. Enter any **new cash** to add.
4. Optionally tick **Buy only**.
5. Read the table: buy, sell or hold for each, and the mix after.

## What each setting does

- **New cash:** added to the total before the targets are applied.
- **Buy only:** nothing is sold. If your cash is too small to reach every target, the holdings furthest below target are topped up first.

## Worked example

You hold 6,000 in a shares fund and 4,000 in a bond fund, with a 50/50 target and no new cash. The total is 10,000, so each should be 5,000: sell 1,000 of the shares fund and buy 1,000 of the bond fund. With 2,000 of new cash and Buy only ticked, the whole 2,000 goes to the bond fund, giving 6,000 and 6,000.

## FAQs

**Does it round to whole shares?** No. It gives amounts of money; round to what your broker allows.

**Does it include fees and tax?** No. Selling may be taxable. Not financial or tax advice.

**How often should I rebalance?** That is your choice; this tool does not say.
