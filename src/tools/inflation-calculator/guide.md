---
name: Inflation calculator
num: 739
shelf: science
section: economics
title: "Inflation calculator: real vs nominal value from CPI, average inflation rate, rebase a price index, Fisher real interest rate"
summary: "Turn money from one date into money of another with the price index (CPI) numbers you enter, or with a steady yearly rate. Paste a whole index series to rebase it, see inflation each period and year on year, and convert wages or sales into real values. Includes the Fisher equation for real interest rates, exact and approximate."
status: live
ads: true
order: 739
icon: percent
works: offline
updated: 2026-11-09
related: [currency-converter, loan-payoff-planner, budget-calculator, trend-analyser, plot-maker]
sources:
  - "Standard index-number formulas: price ratios, compound average rates, rebasing, deflating by a price index, and the Fisher equation (Irving Fisher, The Theory of Interest, 1930). No index data is included; the user enters official figures."
  - "Written by fibub. Checked in the tests against pandas (pct_change, rebasing, period dates) and the closed forms."
  - "The example index and wage series are made up."
flow:
  - { icon: calendar, label: "Two dates" }
  - { icon: table, label: "Index" }
  - { icon: percent, label: "Inflation" }
  - { icon: currency, label: "Real value" }
---

## What it does

Prices rise over time, so a sum of money buys less than it used to. This calculator answers the everyday questions that follow: what an amount from one year is worth in another, how fast prices rose on average, how much a pay rise really was after inflation, and what a savings rate earns in real terms.

It does **not** include any official price data. Instead you type in the consumer price index (CPI) for your dates, or paste a whole series, from your country's statistics office. That keeps the numbers current and lets you use any index you like: national CPI, a regional index, food prices, house prices or a producer price index. You can also work with a steady yearly rate instead. Everything runs in your browser and nothing is sent anywhere.

## Where to find official price indexes

Every country's national statistics office publishes its CPI, usually monthly, free of charge. Look for "consumer price index" on the office's website: for example the U.S. Bureau of Labor Statistics (bls.gov), Statistics Canada (statcan.gc.ca), the UK Office for National Statistics (ons.gov.uk), India's Ministry of Statistics and Programme Implementation (mospi.gov.in), and the statistics authorities of the Gulf states (such as the GCC Statistical Center, gccstat.org). Always check the official source, note the date you downloaded the figures, and use the same index series for both dates.

## How to use it

1. **Two index values:** enter the amount, the two dates and the index value at each date. Dates can be a year (2015), a month (2015-06 or Jun 2015) or a quarter (2015Q2); they are only needed for the yearly average.
2. **A yearly rate:** enter an amount, a rate such as 2.5 % and a number of years.
3. **An index series:** paste or open a file with one row per period: date, index, and optionally a money value such as an average wage. Pick the period to rebase to 100, and two periods to convert an amount between. The table shows each period's inflation, the change over a year for monthly or quarterly data, and the money values in the prices of the rebase period, with their real change. The charts show the rebased index and the nominal against the real values.
4. The **Fisher** box below turns a nominal interest rate or pay rise into a real one, using the inflation from your result unless you type your own.

## Worked example (made-up index)

With an index of 100 in 2015 and 132.4 in 2025, **$100 in 2015 = $132.40 in 2025**. Prices rose 32.4 %, an average of **2.85 % a year**, and money lost 24.5 % of its buying power: $100 in 2025 buys what $75.53 bought in 2015.

In the made-up series, the average wage rose from 40,000 to 54,300, a nominal rise of about 36 %, but in 2025 prices the real rise is only **2.53 %**. A savings account paying 5 % while prices rise 2.85 % a year earns a real **2.09 %** a year (the quick approximation 5 − 2.85 gives 2.15 %).

## FAQ

**Why does the base year of the index not matter?** Only the ratio of two index values is used, so an index with 2010 = 100 and one with 2020 = 100 give the same answer as long as they are the same series.

**What is the difference between "change" and "over a year"?** Change is from one row to the next (a month, for monthly data). Over a year compares with the same period twelve months earlier, the headline inflation figure in the news.

**Exact or approximate Fisher?** The exact form, (1 + nominal) ÷ (1 + inflation) − 1, is correct at any rate. Subtracting inflation from the nominal rate is close only when both are small.
