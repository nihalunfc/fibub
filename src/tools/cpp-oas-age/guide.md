---
name: CPP start age
num: 1739
shelf: money
code: T773
section: retirement
title: "CPP and OAS start age calculator: 60, 65 or 70 and the break-even age"
summary: "See your CPP from age 60 to 70 and your OAS from 65 to 70, the break-even age for waiting, lifetime totals and the 2026 OAS clawback on your income."
seoTitle: "CPP and OAS start age calculator, break-even age"
status: live
ads: true
order: 1739
icon: calendar
works: offline
updated: 2026-11-10
related: [rrsp-tfsa, canada-income-tax, compound-interest]
sources:
  - "CPP: 0.6% less for each month before 65 (36% at 60), 0.7% more for each month after 65 (42% at 70): ESDC, CPP retirement pension: When to start your pension, https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-benefit/when-start.html (checked 2026-11-10)"
  - "OAS: 0.6% more for each month delayed after 65, up to 36% at 70; maximum $762.50 a month at 65 to 74 and $838.75 at 75 and over (October to December 2026); CPP maximum at 65 in 2026 $1,507.65: ESDC, Maximum benefit amounts, October to December 2026, https://www.canada.ca/en/employment-social-development/programs/pensions/pension/statistics/2026-quarterly-october-december.html (checked 2026-11-10)"
  - "OAS recovery tax: 15% of net world income above $95,323 for 2026 (fully repaid at about $155,320 at 65 to 74): ESDC, Old Age Security pension recovery tax, https://www.canada.ca/en/services/benefits/publicpensions/old-age-security/recovery-tax.html (checked 2026-11-10)"
  - "Partial OAS of 1/40 for each full year in Canada after 18 (at least 10 years): ESDC OAS eligibility rules (estimate, check the official source). Break-even and total maths is fibub's own."
flow:
  - { icon: wallet, label: "CPP at 65" }
  - { icon: calendar, label: "Start age" }
  - { icon: scale, label: "Break-even" }
  - { icon: check, label: "Clawback" }
---

## What it does

You can start your Canada Pension Plan (CPP) retirement pension any time from 60 to 70, and Old Age Security (OAS) any time from 65 to 70. Start early and every payment is smaller for life; wait and every payment is larger. This tool takes your CPP amount at 65, shows what you would get at each start age, and works out the **break-even age**: how long you need to live for waiting to pay off. It also estimates the OAS recovery tax (the "clawback") on your retirement income.

Your CPP estimate at 65 is on your My Service Canada Account statement. To see how RRSP withdrawals add to your income, try [[rrsp-tfsa]]; for the tax on your pension income, the [[canada-income-tax|Canada tax calculator]].

## How to use it

1. Type your **CPP at 65** as a monthly amount.
2. Pick the ages you are thinking of for **CPP** and **OAS**.
3. Enter your **years in Canada after 18** (40 or more means full OAS).
4. Enter the age to **plan to** and your expected **net income** in retirement.
5. Read the monthly amounts, the clawback and the two tables. Your chosen rows are in bold.

## What each setting does

- **Start CPP at:** 0.6% less for each month before 65, 0.7% more for each month after, up to 70.
- **Start OAS at:** 0.6% more for each month after 65, up to 70. OAS also rises 10% at 75.
- **Plan to age:** sets the lifetime totals. Pick a cautious, long age.
- **Net income:** OAS is taxed back at 15% of income above $95,323 (2026).

## Worked example

Your statement says $1,000 a month at 65. Starting at 60 gives $640 (64%); starting at 70 gives $1,420 (142%). Waiting from 65 to 70 pays more in total once you pass age 81.9. Starting at 60 rather than 65 wins only if you die before 73.9. With $120,000 of net income and full OAS at 65 ($9,150 a year), about $3,702 is paid back.

## FAQs

**Does inflation change the break-even?** Not much: both pensions rise with prices, so the amounts here are in today's dollars.

**Should I always wait?** Not always. Health, other savings and a spouse's needs matter. Waiting is a bet on living long.

**Are these figures exact?** They are estimates from canada.ca, checked November 2026. Check the official source. Not financial or tax advice.
