---
name: Car loan
num: 1745
shelf: money
code: T779
section: vehicle-buying
title: "Car loan calculator: monthly payment with trade-in, sales tax and balloon"
summary: "Work out a car, bike or truck loan payment with trade-in, down payment, sales tax, fees and an optional balloon payment, plus total interest and total cost."
status: live
ads: false
order: 1745
icon: calculator
works: offline
updated: 2026-11-10
related: [loan-comparison, loan-payoff-planner, sales-tax-calculator, fuel-cost]
sources:
  - "Payment: the standard level-payment formula; with a balloon, the balloon is discounted at the loan rate and taken off what the payments repay."
  - "Sales tax rules differ: in many US states and some Canadian provinces tax applies to the price minus the trade-in, elsewhere to the full price. Check your own state, provincial or national tax office and the dealer's quote. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Price" }
  - { icon: calculator, label: "Payment" }
  - { icon: coin, label: "Interest" }
  - { icon: check, label: "Total" }
---

## What it does

Enter the price of the vehicle, what you get for your trade-in, your down payment, the sales tax and fees, then the interest rate and length of the loan. You see the monthly payment, the total interest and the full cost of the vehicle.

It works the same for a car, a bike, a scooter or a truck. To compare offers from two dealers or banks use [[loan-comparison]], to work out the tax on its own use [[sales-tax-calculator]], and [[fuel-cost]] adds the running costs to the picture.

## How to use it

1. Type the price, trade-in and down payment.
2. Enter the sales tax percent and fees, and say whether tax is on the price minus the trade-in.
3. Enter the rate and the number of months. Add a balloon if your finance has one.
4. Read the payment and totals.

## What each setting does

- **Tax on price minus trade-in**: the trade-in lowers the taxed amount when ticked. Untick if you are taxed on the full price.
- **Add the fees to the loan**: financed fees are charged interest; unticked, you pay them in cash.
- **Balloon**: a lump sum due at the end, as a percent of the price. It lowers the payment, but you still owe it.

## Worked example

A 30,000 car, trade-in 5,000, down payment 2,000, tax 8% on the price minus the trade-in (2,000), fees 500 added to the loan. You borrow 25,500. At 6% for 60 months the payment is 492.99, and the interest is about 4,079.

## FAQs

**Is a longer loan better?** It lowers the payment but costs more interest, and you may owe more than the vehicle is worth for longer.

**What if I still owe money on my trade-in?** Subtract it from the trade-in value (a negative number works), since it must be paid off.

**Is the rate the same as APR?** The rate here is the loan's interest rate. Fees can make the APR higher; compare offers with [[loan-comparison]].

Not financial or tax advice.
