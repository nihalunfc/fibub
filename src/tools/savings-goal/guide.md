---
name: Savings goal
num: 1732
shelf: money
section: interest
title: "Savings goal calculator: how much to save each month to reach a target"
summary: "Find how much to save each month to reach a target by a date, or how long it takes at the amount you can save, with interest and an emergency-fund option."
status: live
ads: false
order: 1732
icon: piggy
works: offline
updated: 2026-11-10
related: [compound-interest, budget-calculator, fd-calculator]
sources:
  - "Standard future value of an annuity formula, FV = S(1+i)^n + P((1+i)^n - 1)/i with i the monthly rate. At 0% interest it is simply (target - saved) / months. The 3 to 6 months of essential costs for an emergency fund is a common rule of thumb, not a rule."
flow:
  - { icon: target, label: "Goal" }
  - { icon: calendar, label: "Date" }
  - { icon: piggy, label: "Monthly" }
  - { icon: check, label: "Result" }
---

## What it does

A savings goal turns "I want 12,000 for a deposit, a trip or a rainy day" into a plain monthly number. Tell the tool the target, how much you already have, the interest you expect and how many months you have. It tells you how much to put aside each month.

You can also turn it round: enter what you can afford each month and it tells you how long the goal will take. For an emergency fund, switch the goal type and it works out the target from your essential monthly costs. To see how interest builds on its own, try the [[compound-interest]] calculator, and to find the spare money each month, the [[budget-calculator|budget planner]].

## How to use it

1. Choose what to work out: the monthly amount, or the time it takes.
2. Pick the goal type: an amount you choose, or an emergency fund.
3. Enter the target (or your essential costs and the months to cover) and what you have saved so far.
4. Enter the interest rate your account pays. Use 0 if you keep it as cash.
5. Enter the months to go, or pick a target date. Or, in time mode, enter what you can save each month.

## What each setting does

- **Already saved:** a start amount that also earns interest.
- **Interest rate:** a fixed yearly rate, added every month.
- **Months to go / target date:** change one and the other follows.
- **Emergency fund:** the target is your essential costs times the months you want covered.

## Worked example

You want 12,000 in 24 months, have nothing saved and your account pays 0%. You need 12,000 / 24 = 500 a month. If the account pays 4% a year, you need about 480 a month, because interest does some of the work.

## FAQs

**Why does it say I will not reach the goal?** With no saving each month and no interest, the balance never grows. Enter a monthly amount.

**Are deposits at the start or the end of the month?** The end. Paying at the start of the month would earn slightly more.

**Does it include tax or inflation?** No. If prices will rise before you spend the money, aim a little higher. Not financial or tax advice.

**How many months of costs should an emergency fund cover?** Many people aim for 3 to 6. A single income or an uncertain job suggests more.
