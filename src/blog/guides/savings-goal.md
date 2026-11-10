---
title: "Savings goal calculator: how much to save a month, and for how long"
summary: "How a savings target becomes a monthly amount or a finish date, how interest shares the work, and how to plan an emergency fund with the savings goal tool."
tools: [savings-goal, compound-interest, budget-calculator, fd-calculator]
updated: 2026-11-10
sources:
  - "Future value of a starting sum plus end-of-month deposits: FV = S(1 + i)^n + P((1 + i)^n - 1) / i, with i the monthly rate. The worked example was run through the site's own calculation code."
  - "Covering 3 to 6 months of essential costs is a common rule of thumb for an emergency fund, not a rule. Interest on savings may be taxed, and account rules differ by country; check the official source."
---

A goal like "a 10,000 cushion" or "a new laptop by summer" is easier to reach once it becomes one number you can set up as a monthly transfer. The [[savings-goal]] tool does that in either direction: it tells you how much to put away each month to hit a target by a date, or how long it will take at an amount you can already manage. It also has an emergency-fund mode that builds the target from your essential monthly costs. It suits students, families and anyone starting to save, and it is general education, not personal advice. To find money to save in the first place, start with the [[budget-calculator]]; to see interest growth on its own, try [[compound-interest]]; and if you plan to lock the money in a term deposit, the [[fd-calculator]] shows what it would pay.

## What it is

Saving towards a goal is a sum with three parts: what you have now, what you add each month, and the interest the balance earns. The tool uses the standard formula for a starting sum plus regular deposits paid at the end of each month:

FV = S × (1 + i)^n + P × ((1 + i)^n − 1) ÷ i

- **FV** is the balance at the end.
- **S** is what you have already saved.
- **P** is the monthly deposit.
- **i** is the monthly interest rate, the yearly rate ÷ 12 ÷ 100.
- **n** is the number of months.

To find the monthly amount, the tool sets FV to your target and solves for P. To find the time, it fixes P and solves for n, then rounds up to a whole month. At 0% interest the sum is plain division: (target − already saved) ÷ months.

In emergency-fund mode the target is your essential monthly costs times the number of months you want covered. Essentials are what you must pay even in a bad month: housing, food, utilities, transport, insurance and minimum debt payments.

## How to use it

1. Pick a currency, then choose what to work out: how much to save each month, or how long it will take.
2. Choose the goal type. For "An amount I choose", type the target. For "An emergency fund", enter your essential costs a month and how many months to cover.
3. Enter what you have already saved and the yearly interest rate on the account (0 for cash).
4. For the monthly amount, enter the months to go or pick a target date; changing one fills in the other.
5. For the time it takes, enter what you can save each month.
6. Read the three boxes (the monthly amount or the time, what you put in, and the interest earned), the line with the goal and the month you reach it, and the chart of your balance against the money you put in.

## A worked example

Leo wants an emergency fund covering 6 months of essential costs of 1,800 a month. He has 1,500 saved in an account paying 2.5% a year.

- Target: 1,800 × 6 = 10,800.
- Still to find: 10,800 − 1,500 = 9,300.

**Monthly mode, 18 months.** With no interest Leo would need 9,300 ÷ 18 ≈ 516.67 a month. With 2.5% interest the tool says about **504.45 a month**. Over 18 months he puts in about 10,580.15 in total (1,500 plus 18 deposits), and interest adds about 219.85 to reach 10,800.

**Time mode, 400 a month.** If Leo can only spare 400 a month, the tool says it takes **1 year and 11 months** (23 months). By then he has put in 1,500 + 23 × 400 = 10,700, and with about 287.49 of interest the balance is about 10,987.49, just over the goal.

## Where it is used

- **Emergency funds.** The most common use: a cushion for job loss, repairs or medical bills.
- **Planned purchases.** A car, a course fee, a wedding or a holiday, saved for instead of borrowed.
- **A home down payment.** Pair it with the rent or buy and mortgage tools to see how big a deposit you need.
- **Teaching money skills.** A clear way to show children and students how regular small amounts add up.

## Common mistakes

- **Using the headline rate on a short promotion.** Some accounts pay a bonus rate only for a few months. Enter the rate you expect on average.
- **Forgetting inflation on far-off goals.** If the thing you want will cost more in three years, raise the target to match.
- **Counting the emergency fund in the wrong costs.** Use essentials only, not your full spending, or the target can grow so large it feels out of reach.
- **Ignoring tax on interest.** In some countries interest is taxed above a limit. The tool does not include tax, so check the official source for your country.
- **Setting a target date that is too close.** If the monthly figure is more than your budget allows, switch to time mode and let the tool find a realistic date.

## Questions people ask

**Why is the interest so small on short goals?** Interest grows with time and balance. Over a year or two at a low rate, almost all of the goal comes from your own deposits.

**Can I use it for a goal I am already part-way through?** Yes. Put what you have in "Already saved" and the months left, and the monthly amount is worked out from there.

**Why does picking a date change the months?** The date box counts the whole calendar months from now to the date you choose, so the two always agree.

**Is a higher interest rate always better?** For the sum, yes. In real life, higher rates can come with lock-in periods or risk. Compare the terms, not just the rate.
