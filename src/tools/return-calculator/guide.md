---
name: Return calculator
num: 1753
shelf: money
code: T787
section: investing
title: "Return calculator: CAGR and XIRR for your investment"
summary: "Work out your yearly return (CAGR) from a start and end value, or from dated deposits and withdrawals (XIRR), and compare it with the simple average."
status: live
ads: false
order: 1753
icon: sliders
works: offline
updated: 2026-11-10
related: [inflation-calculator, compound-interest, sip-calculator]
sources:
  - "CAGR = (end / start)^(1 / years) - 1, checked: 1,000 to 2,000 in 10 years is 7.18%. XIRR solves for the yearly rate that makes dated cash flows add to zero (the method spreadsheets use), checked: -1,000 on 2021-01-01 and 1,210 on 2023-01-01 is 10.00%."
flow:
  - { icon: coin, label: "Enter" }
  - { icon: sliders, label: "Choose" }
  - { icon: chart, label: "Result" }
  - { icon: check, label: "Check" }
---

## What it does

A return is how much an investment grew, but the number that is easy to compare is the **yearly** one. This calculator gives you two kinds. **CAGR** (compound annual growth rate) is for a single start value and end value over a number of years. **XIRR** is for real life, where you added or took out money on different dates.

It also shows the **simple** yearly average, which is the total return divided by the years. It is always a little different from the annualised figure because it ignores compounding. To see how a rate turns into a future amount, use the [[compound-interest]] or [[sip-calculator]] calculators; to see what the money is worth after prices rise, try the [[inflation-calculator]].

## How to use it

1. Choose **Start value, end value and years** or **Dated deposits and withdrawals**.
2. For the first, type the start value, the end value and the years held.
3. For the second, type one line per cash flow as `2024-03-15, -1000`. Money you put in is negative. Money you take out, and what the whole investment is worth today, is positive.
4. Read the yearly return, the total return and the gain.

## What each setting does

- **Annualised return:** the steady yearly rate that would give the same result with compounding.
- **Simple yearly average:** total return divided by years. Easy to read, but it overstates or understates growth over long periods.
- **XIRR:** counts every cash flow on its own date, so money added late counts for less time.

## Worked example

You turn 1,000 into 2,000 in 10 years. The total return is 100%, the simple average is 10% a year, but the annualised return (CAGR) is 7.18%. For XIRR: put in 1,000 on 2021-01-01 and have 1,210 on 2023-01-01. The return is 10.00% a year.

## FAQs

**Why can I not enter a negative end value?** CAGR needs positive start and end values. If you lost everything, the return is -100%.

**Does it include fees or tax?** Only if you include them in your amounts. Not financial or tax advice.

**Why does XIRR say it cannot solve?** It needs at least one amount in and one amount out, on different dates.

**Is a past return a forecast?** No. Past results do not predict future ones.
