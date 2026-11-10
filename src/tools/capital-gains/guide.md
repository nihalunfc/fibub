---
name: Capital gains
num: 1756
shelf: money
section: investing
title: "Capital gains calculator: average cost (ACB) or FIFO"
summary: "Type your buys and sells and see the gain or loss on each sale and each year, using average cost (Canada's ACB) or first in first out, with an editable taxable share."
status: live
ads: false
order: 1756
icon: sliders
works: offline
updated: 2026-11-10
related: [return-calculator, canada-income-tax, uk-income-tax, india-income-tax]
sources:
  - "Average cost (adjusted cost base) and FIFO matching of sales to purchases. Canada's capital gains inclusion rate is 50% at the time of writing, see canada.ca (Line 12700, capital gains), and is editable here; check the official source. Checked by hand: buy 100 at 10 and 100 at 20, sell 100 at 25 gives a gain of 1,000 by average cost and 1,500 by FIFO."
flow:
  - { icon: coin, label: "Enter" }
  - { icon: sliders, label: "Choose" }
  - { icon: chart, label: "Result" }
  - { icon: check, label: "Check" }
---

## What it does

A capital gain is the difference between what you sold something for and what it cost you. When you bought the same thing at several prices, you need a rule to say which cost goes with each sale. This calculator lists your trades and works out the gain or loss on every sale and for every year, by **average cost** (the method Canada calls the adjusted cost base, ACB) or **FIFO** (the oldest shares are sold first).

It also shows a **taxable part**: the gain multiplied by a percentage you can edit. In Canada that share (the inclusion rate) is 50%, per canada.ca, but check the official source because it can change. It does not apply any tax rate; for that, see the [[canada-income-tax]], [[uk-income-tax]] or [[india-income-tax]] tools, and to measure your yearly return the [[return-calculator]].

## How to use it

1. Type or paste one line per trade: `2024-06-20, ABC, sell, 100, 25, 0` (date, name, buy or sell, quantity, price, fee).
2. Choose the cost method and check the taxable share.
3. Read each sale, the yearly totals and download the sales as CSV.

## What each setting does

- **Average cost:** the cost of a sale is the average cost of everything you hold of that name.
- **FIFO:** the cost of a sale comes from your oldest purchases first.
- **Fees:** buying fees add to the cost; selling fees reduce the proceeds.
- **Taxable share:** the part of a gain that counts as income, such as 50% in Canada.

## Worked example

You buy 100 shares at 10 and 100 more at 20, then sell 100 at 25. By average cost the cost is 15 a share, so the gain is 2,500 - 1,500 = 1,000, and at 50% the taxable part is 500. By FIFO the cost is 10 a share, so the gain is 1,500.

## FAQs

**Does it handle superficial-loss or wash-sale rules, splits or currencies?** No. Enter figures already in one currency and adjust for those yourself.

**Which method must I use?** It depends on your country; Canada uses average cost. Check the official source. Not financial or tax advice.

**Can I sell more than I bought?** No; the tool shows a message because that would be a short sale.
