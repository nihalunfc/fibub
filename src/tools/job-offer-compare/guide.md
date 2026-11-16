---
name: Offer compare
num: 2254
shelf: money
code: T990
section: pay
title: "Job offer comparison calculator: compare offers in different currencies"
summary: "Put two or three job offers side by side in one currency. See the yearly package, take-home and savings after living costs for each."
status: live
ads: true
order: 2254
icon: scale
works: offline
updated: 2026-11-16
related: [hourly-salary, currency-converter, gratuity-calculator]
sources:
  - "Plain arithmetic on the numbers you type: yearly cash = 12 months of pay plus yearly extras; take-home = cash minus your tax estimate; savings = take-home minus 12 months of living costs. Exchange rates are typed by you."
flow:
  - { icon: coin, label: "Each offer" }
  - { icon: currency, label: "Rates" }
  - { icon: calculator, label: "Compare" }
  - { icon: check, label: "Best saver" }
---

## What it does

A bigger salary does not always mean more money in the bank. One offer may pay less but include housing, another may pay more in a place where everything costs more. This tool lines up two or three offers, each in its own currency, and works out what is left over at the end of the year.

You type the pay, your own guess of the tax and what living costs you each month. Exchange rates are typed by you too, so nothing is looked up online. For single-offer pay conversions use [[hourly-salary]]; to check a rate use the [[currency-converter]]; for the end-of-service figure see the [[gratuity-calculator]].

## How to use it

1. Pick the currency you want to see everything in.
2. For each offer, choose its own currency and type the monthly basic pay, housing, transport and other allowances, and the yearly extras (school help, flights, bonus).
3. If the job has end-of-service pay, choose a percent of basic a year or days of basic a year, and type the number.
4. Type your estimate of income tax in percent and your monthly living costs there.
5. Check the rates (units of each currency for one US dollar) and type today's rate.

## What each setting does

- **Yearly package:** 12 months of pay, plus yearly extras, plus the end-of-service amount that builds up in a year.
- **Take-home:** cash pay (not end-of-service) minus your tax estimate.
- **Savings:** take-home minus 12 months of living costs.
- **Savings plus end-of-service:** the number used to pick the best offer.

## Worked example

Offer A pays 10,000 basic, 5,000 housing, 1,000 transport and 1,000 other each month, 20,000 extras a year, no tax, and 21 days of basic a year. Cash is 17,000 x 12 + 20,000 = 224,000. End-of-service is 10,000 / 30 x 21 = 7,000, so the package is 231,000. With living costs of 9,000 a month (108,000 a year), savings are 116,000, or 123,000 with end-of-service.

## FAQs

**Which rate do I type?** How many units of that currency one US dollar buys today. Pegged currencies hardly move; Kuwait uses a basket, so 0.307 is only a guide.

**Is tax included?** Only as the percent you type. This is not tax advice.

**Is end-of-service always paid?** No, rules differ by country and contract, so leave it at 0 if unsure.
