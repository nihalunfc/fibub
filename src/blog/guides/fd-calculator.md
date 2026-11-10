---
title: "How fixed deposits grow: compounding, recurring deposits and ladders"
summary: "What a term deposit really pays, why the compounding interval matters, how a recurring deposit adds up, and how to plan a ladder with the FD calculator."
tools: [fd-calculator, compound-interest, savings-goal, ppf-calculator]
updated: 2026-11-10
sources:
  - "Compound growth of a lump sum: P(1 + r/m)^(m t). Recurring deposit with quarterly compounding as used by Indian banks: R[(1+i)^n - 1] / (1 - (1+i)^(-1/3)), with i the quarterly rate and n the number of quarters. The worked example was run through the site's own calculation code."
  - "Deposit rates, penalties for early withdrawal, deposit insurance limits and tax on interest are set by each bank and country. Check the official source, such as your bank's terms or your tax authority."
---

A term deposit is one of the simplest things a bank sells: you hand over money for an agreed time, and the bank promises a fixed rate. The hard part is turning that quoted rate into the number that lands in your account at the end. The [[fd-calculator]] does that for a single lump sum (an FD in India, a GIC in Canada, a CD in the US) and for a recurring deposit, where the same amount goes in every month. It can also split one sum across several terms. If you plan to keep adding money, the [[compound-interest]] calculator handles extra deposits; to work back from a target date, try [[savings-goal]]; and for a long, tax-free Indian option, compare with the [[ppf-calculator]].

## What it is

Banks rarely pay all the interest at the very end. Instead they add it to the balance at fixed points, and from then on that interest earns interest too. For a lump sum the result is:

A = P × (1 + r/m)^(m × t)

- **A** is the maturity amount, what you get back.
- **P** is the sum you deposit.
- **r** is the yearly rate as a decimal (6.8% is 0.068).
- **m** is how many times a year interest is added: 12 for monthly, 4 for quarterly, 2 for half-yearly, 1 for yearly.
- **t** is the term in years. A term in days is turned into years by dividing by 365.

If the bank pays **simple interest**, nothing is added along the way, so A = P × (1 + r × t).

The more often interest is added, the more you earn, but the gap is small. That is why the tool also prints the **effective yearly rate**: what the quoted rate is worth over one full year once compounding is counted. A quoted 6.8% added quarterly works out to about 6.98% a year.

A **recurring deposit** (RD) is a series of small deposits, one at the start of each month. Each payment grows for a different length of time, so the first earns the most and the last the least. The calculator adds up every payment's growth.

A **ladder** spreads one sum across terms of different lengths, so part of it comes free at regular steps.

## How to use it

1. Pick your currency, then choose the **Type**: one lump sum, or a deposit every month.
2. Type the amount. For a recurring deposit, this box becomes the monthly payment.
3. Enter the yearly **Interest rate** as the bank quotes it.
4. Enter the **Length** and choose months, days or years. A recurring deposit needs a whole number of months.
5. Choose how the bank adds interest, from monthly to yearly, or simple interest paid at the end.
6. For a lump sum, you can choose a **Ladder** of 2 to 5 parts. The table then shows each part's amount, length, maturity value and interest.
7. Read the three cards: maturity amount, what you put in, and interest earned.

## A worked example

Priya has ₹2,50,000 to set aside for 24 months. Her bank offers 6.8% a year.

- **Quarterly compounding:** the tool shows a maturity amount of about ₹2,86,093, so the interest is about ₹36,093. The effective yearly rate line reads about 6.98%.
- **Monthly compounding** would give about ₹2,86,311, only ₹217 more.
- **Yearly compounding** gives ₹2,85,156, and **simple interest** gives exactly ₹2,84,000 (2,50,000 × 0.068 × 2 = 34,000 of interest).

Next she tries a ladder. She sets the length to 12 months and picks "Split across 3 terms", still at 6.8% quarterly. The sum splits into three parts of about ₹83,333:

| Deposit | Length | Matures to |
|---|---|---|
| 1 | 12 months | about ₹89,146 |
| 2 | 24 months | about ₹95,364 |
| 3 | 36 months | about ₹1,02,016 |

Together they reach about ₹2,86,527, but the last part only arrives after three years. In return, a third of her money frees up each year.

Her brother instead starts an RD of ₹2,500 a month for 36 months at 6.5%, compounded quarterly. He pays in ₹90,000 and the tool shows about ₹99,561 at maturity.

## Where it is used

- **Choosing between banks:** two banks may quote similar rates with different compounding. The effective rate line puts them on the same footing.
- **Short goals:** fees for a course next year or a car deposit can sit in a term deposit that ends just before the money is needed.
- **Retirement income:** a ladder lets older savers have one deposit maturing every year, which they can spend or roll over at the new rate.

## Common mistakes

1. **Comparing quoted rates instead of effective ones.** A slightly lower rate compounded monthly can beat a higher one paid simply. Compare the effective yearly rate.
2. **Forgetting tax.** The tool shows interest before tax, and some banks take tax at source. Check the official source for your country.
3. **Expecting the exact bank figure.** Banks round each period and may count days differently. Treat the result as a close estimate and ask the bank for its own number.
4. **Reading a ladder's total as a same-date amount.** Each part matures at a different time, so the total is only all yours when the longest one ends.
5. **Ignoring early withdrawal rules.** Breaking a deposit early usually costs a penalty or a lower rate, which this calculator does not model.

## Questions people ask

**Does a higher compounding frequency make a big difference?** Not much at normal rates. On Priya's two-year deposit, monthly beat quarterly by about ₹217. The rate and the term matter far more.

**Is a recurring deposit better than one lump sum?** If you already have the money, a lump sum earns more because all of it works for the whole term. An RD suits people saving from each month's pay.

**What happens to my rate when a ladder part matures?** You reinvest at whatever rate is on offer then, which may be higher or lower. Run the calculator again with the new rate.

This article is general education, not financial advice.
