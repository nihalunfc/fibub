---
name: NPV and IRR
num: 743
shelf: science
code: T511
section: economics
title: "NPV and IRR"
summary: "Enter a project's cash flows and a discount rate to get the net present value, every internal rate of return (with a warning when there is more than one), the modified IRR, payback and discounted payback, the profitability index and the equivalent yearly amount, plus an NPV profile chart. Matches numpy-financial."
status: live
ads: true
order: 743
icon: calculator
works: offline
updated: 2026-11-09
related: [loan-payoff-planner, budget-calculator, currency-converter, uncertainty-calculator, inflation-calculator, lcoe-calculator, grant-budget]
sources:
  - "Standard capital budgeting formulas (discounted cash flow, internal rate of return, modified IRR, payback, profitability index, equivalent annual annuity) as in corporate finance textbooks. No tables copied."
  - "Written by fibub. Checked in the tests against numpy-financial 1.1 (npv, irr, mirr), every IRR against the real roots of the cash-flow polynomial from numpy.roots, and payback against numpy.cumsum."
  - "The example project is made up."
flow:
  - { icon: table, label: "Cash flows" }
  - { icon: percent, label: "Rate" }
  - { icon: calculator, label: "NPV, IRR" }
  - { icon: chart, label: "Profile" }
---

## What it does

Should you invest in a project, a machine, a course or a rental property? Money now is worth more than the same money later, so this calculator **discounts** each future cash flow back to today. It shows:

- **NPV** (net present value): today's value of all the money in and out, at your discount rate. Above zero, the project beats the discount rate.
- **IRR** (internal rate of return): the rate at which NPV is exactly zero. The tool finds **every** IRR, and warns you when there are several, which happens when money goes out again later (for example a clean-up cost at the end).
- **MIRR** (modified IRR): one rate that assumes money out is financed at one rate and money in is reinvested at another, so it always has a single answer.
- **Payback** and **discounted payback**: how long until the money is back, without and with discounting.
- **Profitability index**: present value of later cash flows per unit invested today.
- **Equivalent yearly amount**: the level yearly sum with the same NPV, handy for comparing projects of different lengths.
- An **NPV profile** chart: NPV against the discount rate, crossing zero at each IRR.

Everything runs in your browser.

Turn past or future prices into today's money with the [[inflation-calculator]], and compare energy projects by their cost per unit with the [[lcoe-calculator]].

## How to use it

1. Type or paste the cash flows, one row per period, oldest first. Money out is negative. The first row is today (period 0); a period column is optional and may use calendar years.
2. Enter the discount rate per period, such as your cost of borrowing or the return you could earn elsewhere.
3. Leave the MIRR rates blank to use the discount rate, or set a finance and a reinvestment rate.
4. Download the table as CSV, or the report as an image, PDF or Word file.

## Worked example (made-up project)

A project costs $10,000 today and brings in $3,000, $4,200, $4,800, $2,500 and $1,500 over five years. At 10 % a year:

- **NPV = $2,443.57**, so it adds value.
- **IRR = 20.01 %** a year; the MIRR at 10 % is **14.92 %**.
- **Payback 2.58 years**; discounted payback **3.11 years**.
- Profitability index 1.244, and an equivalent yearly amount of $644.61.

## Several IRRs

Cash flows −1,600, +10,000, −10,000 have IRRs of 25 % and 400 %: NPV is negative below 25 %, positive between, and negative again above 400 %. Neither rate tells you whether to invest; NPV at your discount rate (−$773.55 at 10 %) does. The tool marks every IRR on the profile chart.

## FAQ

**Which discount rate should I use?** For a business, its weighted average cost of capital; for a household, the interest rate on its debt or the return on its savings. Try a few rates and watch the profile.

**Why might NPV and IRR disagree when ranking projects?** IRR ignores the size of a project and assumes cash is reinvested at the IRR itself. When they disagree, NPV is the safer guide.
