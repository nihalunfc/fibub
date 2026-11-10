---
name: PPF calculator
num: 1740
shelf: money
code: T774
section: investing
title: "PPF calculator: Public Provident Fund maturity value with yearly table"
summary: "Work out what your PPF account will be worth after 15 years, or after 5-year extensions, at the current 7.1% rate, with a year-by-year table of deposits and interest."
seoTitle: "PPF calculator: maturity value, interest and extensions"
status: live
ads: true
order: 1740
icon: piggy
works: offline
updated: 2026-11-10
related: [sip-calculator, compound-interest, india-income-tax]
sources:
  - "PPF rate 7.1% for 1 October to 31 December 2026, unchanged from the previous quarter: Ministry of Finance, Department of Economic Affairs, office memorandum of 30 September 2026 (copy at https://www.staffnews.in/wp-content/uploads/2026/10/ECE_15533.pdf; rate as reported at https://www.businesstoday.in/personal-finance/story/small-savings-scheme-interest-rates-unchanged-for-q3-fy27-check-ppf-scss-ssy-rates-558892-2026-09-30) (checked 2026-11-10). Check the official source: https://www.nsiindia.gov.in"
  - "Deposit limits (Rs 500 to Rs 1,50,000 a year), monthly interest on the lowest balance between the 5th and the month end credited at the year end, 15-year term and 5-year extensions: Public Provident Fund Scheme, 2019, G.S.R. 915(E), 12 December 2019 (summary at https://taxguru.in/income-tax/public-provident-fund-scheme-2019.html, checked 2026-11-10)"
flow:
  - { icon: piggy, label: "Yearly sum" }
  - { icon: percent, label: "PPF rate" }
  - { icon: calendar, label: "15+ years" }
  - { icon: table, label: "Year table" }
---

## What it does

The Public Provident Fund (PPF) is a government savings account in India with a 15-year term, tax-free interest and a deposit limit of ₹1,50,000 a year. This calculator shows what your account will be worth at maturity, how much of it is your own money and how much is interest, and how the balance builds year by year. You can also see what happens if you extend the account in 5-year blocks, with or without new deposits.

To compare PPF with a market-linked monthly plan, try the [[sip-calculator]]; to see how much tax the 80C deduction saves you in the old regime, use the [[india-income-tax|India income tax calculator]].

## How to use it

1. Enter how much you pay in each financial year (₹500 to ₹1,50,000).
2. Check the interest rate. It starts at 7.1%, the rate for October to December 2026.
3. Choose when you pay in, and whether to extend the account after 15 years.
4. Read the maturity value, then the chart and the year-by-year table. Download the table as CSV if you like.

## What each setting does

- **Deposit each year:** your total for the financial year (April to March).
- **Interest rate:** the yearly PPF rate. The government sets it every quarter, so change it if it moves.
- **When you pay in:** paying by 5 April earns interest for all 12 months; paying monthly by the 5th earns a little less; paying in March earns nothing that year.
- **Already in the account:** a balance you have today, if the account is already open.
- **Extend after 15 years:** keeps the account open in 5-year blocks, with or without new deposits.

## Worked example

₹1,50,000 paid by 5 April every year at 7.1% for 15 years gives about **₹40,68,209** (40.68 lakh). You paid in ₹22,50,000, so about ₹18.18 lakh is interest. Extending for 5 more years with deposits takes it past ₹66 lakh.

## FAQs

**Why does paying by 5 April matter?** Interest for each month is worked out on the lowest balance between the 5th and the month end, so money that arrives after the 5th misses that month.

**Is the maturity amount taxed?** No. PPF interest and maturity are tax-free, and deposits can count under 80C in the old regime.

**Is the rate fixed for 15 years?** No. It can change every quarter, so treat the result as an estimate. Not financial or tax advice; check the official source.
