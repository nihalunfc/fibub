---
name: Lease or buy
num: 1782
shelf: money
code: T816
section: loans
title: "Lease vs buy a car: total cost and net cost over the same period"
summary: "Compare a car lease with a loan purchase over the lease term: what you pay, what you still owe, the car's value left and the net cost of each."
status: live
ads: false
order: 1782
icon: calculator
works: offline
updated: 2026-11-10
related: [car-loan, loan-comparison, ev-vs-petrol]
sources:
  - "Loan payment: the standard level-payment formula. Balance after k payments: P(1+i)^k minus the payment x ((1+i)^k - 1) / i. Net cost of buying = down payment + payments made + balance still owed - the car's value at the end. Lease cost = signing payment + monthly payments x term + fees + extra-distance charge."
flow:
  - { icon: sliders, label: "Lease" }
  - { icon: bank, label: "Loan" }
  - { icon: calculator, label: "Compare" }
  - { icon: check, label: "Net cost" }
---

## What it does

A lease has lower monthly payments but you hand the car back and keep nothing. A loan costs more each month but you own a car with some value left. This page compares them fairly by looking at the same period, the length of the lease, and asking what each really cost you once the value of the car is counted.

For the purchase, it treats what you still owe on the loan at the end of the lease as paid and subtracts the car's value, as if you sold it then. For the lease it adds the signing payment, the monthly payments, fees and any charge for driving over the distance limit. Check the loan itself in [[car-loan]], other lenders in [[loan-comparison]], and an electric car's running costs in [[ev-vs-petrol]].

## How to use it

1. Enter the lease: monthly payment, money paid at signing, term, fees, yearly kilometre limit, the charge per extra km and how far you will really drive.
2. Enter the purchase: price, down payment, interest rate, loan length and the car's value at the end of the lease term.
3. Read which is cheaper and by how much.

## What each setting does

- **Paid at signing**: your down payment plus first payment and similar charges.
- **Fees**: acquisition fee when you start and disposition fee when you return it.
- **Kilometre limit and extra charge**: driving over the limit costs extra, shown separately.
- **Value of the car at the end**: a guess; used car values vary, so try a lower and a higher figure.

## Worked example

A 36-month lease at 450 a month with 2,000 down, 800 fees and 5,000 km a year over the limit at 0.20 a km costs 22,000 in total. Buying a 38,000 car with 2,000 down at 6% over 60 months has a payment of about 696 and leaves about 15,700 owed after 36 months. With the car worth 22,000, the net cost is about 20,800, so buying is about 1,200 cheaper.

## FAQs

**Does it include insurance and repairs?** No. Leases often come with warranty cover and buying with repair risk, so weigh that yourself.

**What if I want to keep the car after the lease?** Then add the buy-out price to the lease side.

**Not financial advice.** Ask the dealer for every fee in writing.
