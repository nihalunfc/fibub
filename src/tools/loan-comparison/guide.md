---
name: Loan comparison
num: 1744
shelf: money
code: T778
section: loans
title: "Loan comparison: compare 2 to 4 loan offers by APR and total cost"
summary: "Put up to four loan offers side by side with their monthly payment, total cost and APR including fees, and convert a flat rate to a reducing rate."
status: live
ads: false
order: 1744
icon: calculator
works: offline
updated: 2026-11-10
related: [loan-payoff-planner, mortgage-calculator, budget-calculator]
sources:
  - "Payment: the standard level-payment formula. APR: the yearly rate that makes the money you receive (amount minus upfront fees) equal to all payments including monthly fees, found by repeated halving; shown as the nominal rate, as most lenders quote it."
  - "Flat to reducing rate: payment = amount x (1 + flat rate x years) / months, then the same rate-finding method. Check the official source or your lender's key facts sheet. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Offers" }
  - { icon: calculator, label: "Compare" }
  - { icon: percent, label: "APR" }
  - { icon: check, label: "Pick" }
---

## What it does

Lenders quote the rate they like best. This page puts two, three or four offers next to each other and works out what each really costs: the monthly payment, the total you pay back, the cost of borrowing (interest plus fees), and the APR, which is the yearly rate once the fees are counted in. The cheapest offer is marked.

At the bottom, a **flat rate converter** shows what a flat rate (common in India and the Gulf) means on a normal reducing balance. If you already have a loan, the [[loan-payoff-planner]] shows how extra payments help, and the [[mortgage-calculator]] and [[budget-calculator]] are the next steps for a home loan or for checking the payment fits.

## How to use it

1. Choose how many offers you have.
2. For each, type the amount, the yearly rate, the years, any upfront fee and any monthly fee.
3. Read the table. The lowest total cost is marked, and the others show how much more they cost.

## What each setting does

- **Upfront fees** are paid at the start, so you really receive less than you borrow. That raises the APR.
- **Monthly fee** is added to every payment.
- **APR** is the one number to compare. With no fees it equals the rate; with fees it is higher.
- **Flat rate**: interest is charged on the full amount for every year, even though you repay a little each month, so the real rate is much higher.

## Worked example

You borrow 10,000 for 3 years. Offer A is 6% with no fees: 304.22 a month. Offer B is 4.5% with a 250 upfront fee: a lower payment, but its APR is above 4.5% because of the fee. A flat rate of 10% for 3 years equals about 17.9% on a reducing balance, because you pay 1,000 a year in interest on the full 10,000 even as you repay it.

## FAQs

**Is the lowest APR always the best loan?** Usually, if the term is the same. A longer term lowers the payment but costs more in total, so look at the total cost too.

**Why is my lender's APR slightly different?** Some countries set rules for which fees count and how often interest compounds. The lender's quoted APR is the legal figure.

**Does it work for car or personal loans?** Yes, any loan with level monthly payments.

Not financial or tax advice.
