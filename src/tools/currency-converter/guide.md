---
name: Currency converter
num: 1791
shelf: money
code: T849
section: shopping
title: "Currency converter: INR, CAD, USD, GBP, AED, SAR and more at today's rate, free"
summary: "Convert money between 22 currencies at the daily mid-market rate, and check how much your bank or exchange shop really charges. Nothing about you is sent anywhere."
status: live
ads: true
order: 1791
icon: currency
works: offline
updated: 2026-11-10
related: [trip-splitter, sales-tax-calculator, unit-price, tip-calculator]
sources:
  - "Daily rates: the free exchange-api by Fawaz Ahmed (github.com/fawazahmed0/exchange-api, CC0 public domain). fibub's own server fetches it a few times a day; your browser only asks fibub.com."
  - "Gulf pegs used in the fallback: UAE 3.6725, Saudi 3.75, Qatar 3.64, Oman 0.3845, Bahrain 0.376 per US dollar (each country's central bank). Other fallback values are rough late-2025 levels."
flow:
  - { icon: currency, label: "Amount" }
  - { icon: convert, label: "Convert" }
  - { icon: percent, label: "Bank rate" }
  - { icon: check, label: "Real cost" }
---

## What it does

The currency converter turns an amount in one currency into another at the day's mid-market rate: the rate halfway between what banks buy and sell at, which is the fairest single number. It covers the Indian rupee, Canadian, US, Australian, New Zealand and Singapore dollars, the pound, euro, yen, Swiss franc, the Gulf currencies (dirham, riyals, dinars, rial) and the main South Asian currencies.

It also answers the question people really have when sending money home or buying travel money: how much is the bank keeping? Type the rate you were offered and any fee, and the tool shows the markup and what you actually get compared with the fair rate. Splitting trip costs in several currencies? Use [[trip-splitter]]; checking a price with tax abroad, try [[sales-tax-calculator]].

## How to use it

1. Type the **amount** and pick the currency it is in (**From**).
2. Pick the currency you want (**To**). The answer and both one-unit rates appear at once. **Swap** turns the conversion around.
3. To check a bank or money-transfer offer, type **their rate** and any **fee**. The tool shows the markup in percent and how much less you get than at the mid-market rate.
4. The table under it shows the same amount in every currency.

## What each setting does

- **Amount / From / To**: what you are converting and between which currencies.
- **Swap**: exchanges From and To.
- **Their rate**: the rate on the bank's, card's or exchange shop's offer, written as 1 From = this many To. Leave it empty to just convert.
- **Fee**: a fixed fee in the From currency and/or a percent of the amount, as on the offer.
- **Use my own rate for the whole page**: replaces today's rate with yours, for an old receipt or when you are offline and know the rate.

## Where the rates come from

When the page opens, your browser asks **fibub.com itself** for the rates (`/api/prices`). fibub's server collects one public rate file a few times a day and passes it on, so the rate provider never sees you, and fibub sends nothing about you. The page checks every rate is a sensible number before using it. If the rates can't be loaded (no internet, or the feed is down), the page says so clearly and uses built-in rough values, which you can replace with your own rate.

Mid-market rates are for information. The rate you get from a bank, card or transfer service is always a little worse; check with them before you send money.

## Worked example

Rates for one test day: 1 US dollar = 88.50 Indian rupees and 1.40 Canadian dollars. Converting 1,000 CAD to INR: 1,000 ÷ 1.40 × 88.50 = **63,214.29 INR**, so 1 CAD = 63.2143 INR.

A transfer service offers 61.50 INR per CAD with a 5 CAD fee. You get (1,000 − 5) × 61.50 = 61,192.50 INR. That is 2,021.79 INR (3.20%) less than the fair amount; the rate alone is 2.71% below mid-market.

## FAQs

**Why is my bank's rate different?** Banks and card companies add a margin to the mid-market rate, often 1% to 5%, and sometimes a fee on top. The "Their rate" box shows the real cost.

**How often do rates change?** Markets move all day on weekdays. This page uses one daily rate, which is right for planning, budgets and receipts, not for trading.

**Does it work offline?** Yes, once the page is open. If the page was opened offline, it uses the rough built-in rates and tells you; type a current rate in "Use my own rate" for a correct answer.

**Is anything stored?** No. Amounts and rates you type stay on the page and disappear when you close it.
