---
name: Endowment, money-back and ULIP return (IRR)
num: 1959
shelf: money
code: T833
section: life-insurance
title: "Endowment, money-back and ULIP return (IRR) calculator"
summary: "Find the real yearly return (IRR) of an endowment, money-back or ULIP policy from its premiums and payouts, and compare it with buying term cover and investing the rest."
status: live
ads: false
order: 1959
icon: sliders
works: offline
updated: 2026-11-10
related: [npv-irr-calculator, term-fair-price, life-cover-needed, should-i-insure, surrender-or-keep]
sources:
  - "Internal rate of return: the rate r that makes the sum of each cash flow divided by (1+r)^t equal zero. Checked: paying 100 at the start of years 0 and 1 and receiving 231 at year 2 gives exactly 10.00%. Payouts come from the benefit illustration your seller gives you, checked 2026-11-10; check the official source for tax rules."
flow:
  - { icon: coin, label: "Premiums" }
  - { icon: chart, label: "Payouts" }
  - { icon: percent, label: "Return" }
  - { icon: check, label: "Compare" }
---

## What it does

Savings-type life policies (endowment, money-back, ULIP) mix life cover with a payout later, so the price is hard to judge. This tool takes what you pay and what the policy says it will pay back, and works out one number: the yearly return (IRR) you actually earn on your premiums.

It then compares with a common alternative: buy a plain term policy for the same cover and invest the premium you save. The numbers are examples until you replace them with yours. Sellers in India show benefit illustrations at 4% and 8%, so try both. To check any cash flows by hand use the [[npv-irr-calculator]], and to see what a term quote should cost use [[term-fair-price]] or [[life-cover-needed]].

## How to use it

1. Enter the yearly premium and how many years you pay.
2. Add each payout from the illustration (the year and the amount). Maturity and money-back payouts each get a row.
3. Enter the term premium for the same cover and the return you assume on investing.
4. Read the policy return, the two final values and the break-even return.

## What each setting does

- **Year:** 0 is the day you start. Premiums are paid at the start of years 0, 1, 2 and so on; a payout in year 10 arrives ten years after you start.
- **Term premium:** the cost of term cover for the same sum assured. The rest of your premium is assumed invested each year.
- **Return you assume:** the yearly growth of the invested amount. Payouts are grown at the same rate so the two sides are fair.
- **Break-even return:** the investing return at which both ways end equal.

## Worked example

Pay 100 at the start of years 0 and 1, and receive 231 in year 2. The policy return is exactly 10.00% a year. With a term premium of 0 and investing at 8%, the investment path ends at 224.64, below 231, so the policy ends higher; the break-even return is 10%.

## FAQs

**Why is my IRR lower than the illustration's 8%?** The illustrated rate is on the fund or the bonus, not on what you pay in after charges and cover costs. IRR counts every premium.

**Are tax and charges included?** No. They are left out, so check them separately. Tax rules differ by country and change; check the official source.

**Does the policy's cover count?** Not in the return. Its value is the life cover you would otherwise buy as term, which the term premium prices.

How it's worked out: IRR solves sum of flow(t) / (1+r)^t = 0 by bisection; term and invest grows (premium - term premium) each year at your assumed return.
