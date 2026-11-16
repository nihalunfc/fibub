---
name: Rent cheques
num: 2257
shelf: money
code: T993
section: renting
title: "Rent payment calculator: yearly rent in 1, 2, 4 or 12 cheques"
summary: "Split yearly rent into 1 to 12 payments. See each amount and date, the cash needed on day one, the true monthly cost and the cost of leaving early."
status: live
ads: true
order: 2257
icon: calendar
works: offline
updated: 2026-11-16
related: [rent-compare, budget-calculator, currency-converter]
sources:
  - "Plain arithmetic on the numbers you type: each payment = yearly rent (after any discount you type) / number of payments. The deposit is treated as refundable; agency fee and other move-in costs as costs you do not get back."
flow:
  - { icon: coin, label: "Rent" }
  - { icon: calendar, label: "Payments" }
  - { icon: calculator, label: "Move-in" }
  - { icon: check, label: "True cost" }
---

## What it does

In many places rent is paid for the whole year in a few post-dated cheques or payments. Paying in fewer payments can mean a discount, but you need much more cash at the start. This tool shows each payment and its month, the cash you need on day one, and what a month really costs once fees are included.

It also shows the cost of leaving early. To weigh two homes first use [[rent-compare]]; to fit the monthly figure into your plans use the [[budget-calculator]]; to check a foreign amount, the [[currency-converter]].

## How to use it

1. Type the yearly rent and choose how many payments (1, 2, 3, 4, 6 or 12).
2. Type the security deposit and agency fee, each as a percent of rent or a fixed amount, and any other move-in costs.
3. If the landlord offers a discount for fewer payments, type the percent. Leave it empty if not.
4. If you may leave early, type the months you would stay and the penalty in months of rent.

## What each setting does

- **Discount:** applies to the chosen number of payments, and to any option with fewer payments in the comparison. Empty means none.
- **True monthly cost:** (rent + agency fee + other costs) / 12. The deposit is left out because you get it back.
- **Cost of leaving early:** rent for the months stayed, the penalty and the fees.

## Worked example

Yearly rent 60,000 in 4 payments is 15,000 each, due at the start of months 1, 4, 7 and 10. A 5% deposit (3,000), 5% agency fee (3,000) and 500 of other costs make day one 15,000 + 3,000 + 3,000 + 500 = 21,500. The true monthly cost is (60,000 + 3,000 + 500) / 12 = 5,291.67. Leaving after 6 months with a 2-month penalty costs 6 x 5,000 + 2 x 5,000 + 3,500 = 43,500.

## FAQs

**Is the deposit counted in the monthly cost?** No, it is refundable if the home is returned in good order.

**Can I choose any count?** Pick from 1, 2, 3, 4, 6 or 12; they divide the year evenly.

**Are the rules the same everywhere?** No. Check your contract and the official rules.
