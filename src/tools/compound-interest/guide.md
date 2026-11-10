---
name: Compound interest
num: 1723
shelf: money
section: interest
title: "Compound interest calculator: see how savings grow with regular deposits"
summary: "Work out how a start amount and regular deposits grow with compound interest, after fees and in today's money, with a chart and a year-by-year table."
status: live
ads: false
order: 1723
icon: sliders
works: offline
updated: 2026-11-10
related: [inflation-calculator, budget-calculator, rent-vs-buy]
sources:
  - "Standard compound interest formula, FV = P(1 + r/m)^(m t). Checked against the textbook example: 1,000 at 5% for 10 years is 1,628.89 compounded yearly and 1,647.01 compounded monthly. Rule of 72 is a common rule of thumb."
flow:
  - { icon: coin, label: "Start" }
  - { icon: calendar, label: "Deposits" }
  - { icon: chart, label: "Growth" }
  - { icon: check, label: "Result" }
---

## What it does

Compound interest means you earn interest on the interest you already earned. Over a few years the effect is small; over twenty or thirty it is large. This calculator shows what a start amount plus regular deposits will grow to, how much of that is your own money and how much is interest.

You can add a yearly fee (many funds and accounts charge one) and a yearly inflation figure, so you also see what the final amount is worth in today's money. To plan the deposits themselves, try the [[budget-calculator|budget planner]]; to see how prices change over time, the [[inflation-calculator]].

## How to use it

1. Pick your currency and type the **Start amount** (it can be 0).
2. Enter a **Regular deposit**, and choose whether you pay it every month or every year, at the start or the end of that period.
3. Enter the **Interest rate**, how often interest is added, and the **Years**.
4. Optionally add a **Yearly fee** and **Inflation**.
5. Read the result cards, the chart and the **Year by year** table. Download the table as a CSV file for a spreadsheet.

## What each setting does

- **Interest added:** how often interest is credited. Daily or monthly gives slightly more than yearly at the same rate.
- **Deposit at the start or end:** a deposit at the start of a period earns interest for that period; one at the end does not.
- **Yearly fee:** taken off the balance a little each month, like a fund's ongoing charge.
- **Inflation:** the "In today's money" figure divides the final balance by the price rise over the years.
- **Rule of 72:** 72 divided by your rate (after fees) is roughly the years needed to double your money.

## Worked example

You put in 1,000 at 5% a year with no deposits. Interest added yearly, it becomes 1,628.89 after 10 years. Added monthly, it becomes 1,647.01. Now add 100 a month: you put in 13,000 in total, and the interest part grows much larger than from the start amount alone.

## FAQs

**Why is my bank's figure a little different?** Banks may add interest on a different day, round each month, or pay a rate that changes. This tool assumes one fixed rate for the whole time.

**Is the return guaranteed?** No. Shares and funds go up and down. Use a cautious rate and test a few values.

**Does it include tax?** No. Interest may be taxable where you live. Not financial or tax advice.

**What does a fee of 1% do?** Over 30 years, a 1% yearly fee can take a large share of the final amount. Try it and compare.
