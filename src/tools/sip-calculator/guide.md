---
name: SIP calculator
num: 1724
shelf: money
section: investing
title: "SIP calculator: future value of a monthly investment plan"
summary: "Work out what a monthly SIP could grow to at an expected return, with an optional yearly step-up and lumpsum, shown with a chart and year-by-year table."
status: live
ads: false
order: 1724
icon: sliders
works: offline
updated: 2026-11-10
related: [compound-interest, inflation-calculator, india-income-tax]
sources:
  - "Standard future-value-of-an-annuity-due formula, FV = P x ((1+i)^n - 1) / i x (1+i), with monthly rate i = yearly return / 12. Checked: 10,000 a month at 12% for 10 years is 23,23,391."
flow:
  - { icon: coin, label: "Monthly SIP" }
  - { icon: percent, label: "Return" }
  - { icon: chart, label: "Growth" }
  - { icon: check, label: "Result" }
---

## What it does

A SIP (systematic investment plan) puts a fixed amount into a fund every month. Because you buy regularly, your money grows by compounding: gains earn gains. This calculator estimates the future value of a SIP at a return you choose, and shows how much is your own money and how much is growth.

It is useful for any monthly investing habit, in any currency. For a lump sum with other deposit options, use the [[compound-interest]] calculator, and to see what the final amount may buy in future, the [[inflation-calculator]].

## How to use it

1. Choose your currency and enter the **Monthly SIP**.
2. Enter the **Expected return** per year and the number of **Years**.
3. Optionally enter a **yearly raise** (step-up) and a **lumpsum** you invest on day one.
4. Read the future value, the money invested and the estimated gains, then check the chart and the table. Download the table as CSV if you want it in a spreadsheet.

## What each setting does

- **Expected return:** a yearly rate. It is divided by 12 to get the monthly rate, so 12% means 1% a month.
- **Yearly raise (step-up):** the SIP goes up by this percent at the start of every year, for example when your pay rises.
- **Lumpsum:** an amount invested once at the start that grows alongside the SIP.

The formula used is the annuity-due one: each instalment is paid at the start of the month, so it earns that month's return.

## Worked example

A monthly SIP of 10,000 at 12% a year for 10 years gives a future value of 23,23,391 (about 23.23 lakh). You invested 12,00,000, so the estimated gain is about 11.23 lakh. Raising the SIP by 10% each year grows the result a lot further.

## FAQs

**Is the return guaranteed?** No. Market-linked funds go up and down, so the real result will differ. Try several returns, such as 8%, 10% and 12%.

**Why is my fund's result different?** Funds are priced daily, charges are taken, and instalment dates vary. This is a planning estimate.

**Is tax included?** No. Tax on gains depends on where you live and the type of fund. Not financial or tax advice.
