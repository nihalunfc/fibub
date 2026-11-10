---
name: EPF calculator
num: 1741
shelf: money
section: retirement
title: "EPF calculator: PF balance at retirement with employer share and EPS"
summary: "Estimate your EPF (provident fund) balance at retirement from your Basic + DA: your 12%, the employer's share after the 8.33% pension (EPS) cut, yearly pay rises and the 8.25% rate."
seoTitle: "EPF calculator: PF corpus at retirement, EPS split"
status: live
ads: true
order: 1741
icon: bank
works: offline
updated: 2026-11-10
related: [gratuity-calculator, india-income-tax, compound-interest]
sources:
  - "EPF interest 8.25% for 2025-26, recommended by the 239th Central Board of Trustees meeting: PIB, Ministry of Labour & Employment, 2 March 2026, https://www.pib.gov.in/PressReleasePage.aspx?PRID=2234502 (checked 2026-11-10). Later ratified by the government as reported in the press; the 2026-27 rate is not yet declared. Check the official source: https://www.epfindia.gov.in"
  - "Wage ceiling raised from Rs 15,000 to Rs 25,000 a month from 17 September 2026 (Ministry of Labour & Employment gazette notification, 17 September 2026), so EPS 8.33% is on wages up to Rs 25,000 (about Rs 2,083 a month): Khaitan & Co, Ergo, 22 September 2026, https://www.khaitanco.com/sites/default/files/2026-09/Ergo_Revision%20of%20Ceiling%20on%20EPF%20Contributions_22%20September%202026.pdf (checked 2026-11-10). Estimate, check the official source at https://www.epfindia.gov.in"
  - "12% employee and employer shares, 8.33% to EPS, interest on the monthly running balance credited yearly: Employees' Provident Funds Scheme, 1952 and Employees' Pension Scheme, 1995, as summarised by EPFO; estimate, check the official source"
flow:
  - { icon: wallet, label: "Basic + DA" }
  - { icon: percent, label: "12% + 12%" }
  - { icon: bank, label: "EPF + EPS" }
  - { icon: chart, label: "At 58" }
---

## What it does

If you work for an employer covered by EPF in India, 12% of your Basic + DA goes into your provident fund every month, and your employer pays 12% too. But part of the employer's money, 8.33% of wages up to the wage ceiling, goes to the Employees' Pension Scheme (EPS) instead of your EPF balance. This calculator does that split for you, adds yearly pay rises and interest, and estimates your EPF balance when you retire.

When you leave a job, the [[gratuity-calculator]] works out the other lump sum you may be owed; to see how your PF share affects your tax, try the [[india-income-tax|India income tax calculator]].

## How to use it

1. Enter your monthly Basic + DA (from your payslip), your age and the age you plan to retire.
2. Add your expected yearly pay rise and any EPF balance you already have (from your EPFO passbook).
3. Check the interest rate (8.25% for 2025-26).
4. Open **Contribution rules** if your employer does things differently.

## What each setting does

- **Basic + DA:** the wages PF is worked out on, not your gross pay.
- **Pay rise:** your Basic + DA goes up by this much at the start of each year.
- **Your share / Employer's share:** usually 12% each. Some small employers pay 10%.
- **EPS wage ceiling:** EPS takes 8.33% of wages up to this amount. It is ₹25,000 from 17 September 2026.
- **PF is worked out on:** many employers cap PF at the ceiling; others use your full Basic + DA.
- **In EPS:** untick if you are not an EPS member (for example, you joined after September 2014 earning above the ceiling then); all the employer's 12% then goes to EPF.

## Worked example

Basic + DA of ₹20,000 a month: you pay ₹2,400, the employer pays ₹2,400, of which ₹1,666 goes to EPS and ₹734 to EPF. So ₹3,134 a month goes in. Over one year at 8.25%, that is ₹37,608 paid in plus about ₹1,681 of interest: ₹39,289.

## FAQs

**Is EPF interest taxed?** Interest on your own contributions above ₹2.5 lakh a year is taxable; the rest is tax-free.

**Why is the EPS amount not growing?** EPS pays a monthly pension worked out from your service and wages, not a balance with interest.

**Is the result exact?** No. The rate is declared each year and EPFO's monthly timing differs slightly. Not financial or tax advice; check the official source.
