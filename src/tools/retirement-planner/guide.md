---
name: Retirement planner
num: 1734
shelf: money
section: retirement
title: "Retirement planner: will your savings last, and what is the shortfall"
summary: "Enter your ages, savings, monthly saving, returns, inflation and retirement spending to see how long your money lasts and any shortfall or surplus."
status: live
ads: false
order: 1734
icon: chart
works: offline
updated: 2026-11-10
related: [fire-calculator, inflation-calculator, compound-interest, rrsp-tfsa, cpp-oas-age, epf-calculator, nps-calculator]
sources:
  - "Standard growth and annuity formulas run month by month. Returns are turned into real returns as (1 + return) / (1 + inflation) - 1, so every figure is in today's money. Needed pot = monthly shortfall x (1 - (1 + i)^-n) / i."
flow:
  - { icon: calendar, label: "Ages" }
  - { icon: piggy, label: "Saving" }
  - { icon: wallet, label: "Spending" }
  - { icon: chart, label: "Lasts?" }
---

## What it does

This planner answers one question: if you save what you plan to, will your money last through retirement? It grows your savings until you retire, then pays out your monthly spending (less any pension) until you run out or reach the age you plan for.

You get the age your money lasts until, the pot you will have at retirement, and the gap between that and what you need, shown as a surplus or a shortfall. Everything is in today's money, so you can compare it with what you spend now. For a target built from your spending, try the [[fire-calculator]], and to see what prices do over the years, the [[inflation-calculator]].

## How to use it

1. Enter your age now, the age you want to retire and the age you plan to live until. Planning to 90 or 95 is common.
2. Enter your savings so far and what you save each month.
3. Enter the yearly return before and after retiring (many people use a lower figure after, for safer investments), and inflation.
4. Enter your monthly spending in retirement and any pension or other income, in today's prices.

## What each setting does

- **Return before and after retiring:** growth while you save and while you spend.
- **Inflation:** prices rising each year. Your saving and spending keep their buying power.
- **Pension or other income:** subtracted from spending, so only the difference comes from savings.

## Worked example

You are 60, retire at 65 and plan to 85. You have 100,000, save 1,000 a month, expect no growth or inflation, and spend 2,000 a month with no pension. By 65 you have 160,000. That pays 80 months, so it lasts until about age 71 and 8 months. To reach 85 you need 480,000, so you are short by 320,000.

## FAQs

**What can I change if I am short?** Retire later, save more, spend less, or plan for some work income. Try each one.

**Why are the returns lower than I see advertised?** Returns here are before inflation and are only an estimate. Use cautious figures.

**Does it include tax?** No. Not financial or tax advice.

**What about state or company pensions?** Enter the monthly amount as other income, in today's money.
