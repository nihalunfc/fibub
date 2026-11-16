---
name: School fees
num: 2256
shelf: money
code: T992
section: budgeting
title: "School fee planner: total school fees for each child until the end of school"
summary: "Add your children and see year-by-year school fees to the final grade with a yearly fee rise, per-term payments and the monthly saving you need."
status: live
ads: true
order: 2256
icon: book
works: offline
updated: 2026-11-16
related: [budget-calculator, currency-converter, job-offer-compare]
sources:
  - "Plain arithmetic on the numbers you type: each year's fee = last year's fee x (1 + rise %). Extras rise at the same rate. A second-currency rate drifts by the yearly percent you type."
flow:
  - { icon: book, label: "Children" }
  - { icon: percent, label: "Fee rise" }
  - { icon: table, label: "Each year" }
  - { icon: piggy, label: "Save" }
---

## What it does

School fees usually go up every year, and with more than one child the bill is bigger than it looks. This planner adds up what you will pay from this year to each child's last grade, so you can plan before the numbers surprise you.

Add one row per child with their grade, fee and how often the school bills. You can also see the total in a second currency, for example if you earn in one and plan in another. Turn the monthly saving into a plan with the [[budget-calculator]], check a rate with the [[currency-converter]], or compare jobs with [[job-offer-compare]].

## How to use it

1. Pick your currency and type the **usual yearly fee rise** in percent.
2. For each child type a label, the current grade, the final grade (12 by default), this year's fee, terms a year and yearly extras.
3. To give one child a different rise, type it in that row; empty uses the shared rise.
4. Optionally pick a second currency, the rate and a yearly drift.
5. Read the year-by-year table, the grand total and the saving.

## What each setting does

- **Terms a year:** splits the fee into equal payments (1 to 4).
- **Extras:** books, transport or uniform each year; they rise too.
- **Rate drift:** how much the second currency's rate may change each year, in percent.
- **Monthly saving:** next year's total divided by 12.

## Worked example

One child in grade 10, final grade 12, fee 10,000, rise 5%, 3 terms. Fees are 10,000, then 10,500, then 11,025: a total of 31,525. This year's payment is 3,333.33 a term. To cover next year's 10,500 you would save 875 a month.

## FAQs

**Are labels saved?** No. They stay on this page only.

**Does this year count?** Yes, the current grade is the first year.

**What if a child finishes?** Their column stops after the final grade and the others carry on.
