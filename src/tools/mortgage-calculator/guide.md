---
name: Mortgage calculator
num: 1720
shelf: money
section: mortgages
title: "Mortgage calculator: payment, interest and payoff date, with Canada mode"
summary: "Work out your mortgage payment for any price, down payment, rate and amortisation, with weekly or biweekly options, extra payments and CMHC insurance for Canada."
status: live
ads: false
order: 1720
icon: sliders
works: offline
updated: 2026-11-10
related: [loan-payoff-planner, budget-calculator, compound-interest]
sources:
  - "Payment formula: the standard level-payment annuity formula. Canadian mortgages compound semi-annually by law, so the monthly rate is (1 + rate/2)^(1/6) - 1."
  - "CMHC mortgage insurance premiums (4.00%, 3.10%, 2.80% by down payment) and minimum down payment rules: cmhc-schl.gc.ca, checked 2026-11-10. Check the official source."
flow:
  - { icon: sliders, label: "Your home" }
  - { icon: calendar, label: "Payments" }
  - { icon: chart, label: "Balance" }
  - { icon: download, label: "Save CSV" }
---

## What it does

Type the home price, your down payment, the interest rate and how many years you will take to repay. The calculator shows your payment, the total interest, and the year you are mortgage-free, with a chart of what you still owe and a year-by-year table.

Turn on **Canada mode** and it compounds the rate twice a year, the way Canadian lenders do, and adds the CMHC insurance that is required with less than 20% down. To see what your extra payments could save, continue with the [[loan-payoff-planner]], and to check the payment fits your life, the [[budget-calculator]].

## How to use it

1. Enter the **home price** and **down payment** (a percent or an amount).
2. Enter the **rate** and the **amortisation**, the total years you would take to repay.
3. Pick how often you pay. Add **extra** money with each payment, once a year, or both.
4. Read the payment and totals, open **Year by year**, or download the table as CSV for Excel.

## What each setting does

- **Accelerated** options pay half (every 2 weeks) or a quarter (weekly) of the monthly payment. That adds up to one extra monthly payment a year, so you finish sooner.
- **Extra with every payment** goes straight to what you owe, so interest falls from the next payment.
- **Canada mode** compounds semi-annually and shows the CMHC premium, which is added to the mortgage unless you untick the box. It also checks the minimum down payment.

## Worked example

A 500,000 home with 20% down borrows 400,000. At 5% over 25 years paid monthly, the payment is 2,338.36 with the standard monthly rate (common in the US) and 2,326.42 in Canada mode. In Canada mode with 5% down on the same home, 475,000 is borrowed and a 4.00% premium of 19,000 is added.

## FAQs

**Why is my bank's payment a little different?** Banks round the rate and the payment in their own ways, and may use a different compounding rule. Use your bank's figure for the real payment.

**Does the rate stay the same for the whole time?** The calculator assumes it does. In reality most mortgages reset every few years, so run it again with the new rate.

**Does it include property tax or insurance?** No. See the rent or buy tool to compare the full cost of owning with renting.
