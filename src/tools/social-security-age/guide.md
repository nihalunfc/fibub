---
name: Social Security age
num: 1787
shelf: money
section: retirement
title: "When to claim Social Security: benefit at 62 to 70 and break-even age calculator"
summary: "Type the benefit from your Social Security statement and your birth year to see your full retirement age, your monthly benefit at every age from 62 to 70, and the break-even ages."
seoTitle: "When to claim Social Security: 62 to 70 calculator"
status: live
ads: true
order: 1787
icon: calendar
works: offline
updated: 2026-11-10
related: [cpp-oas-age, retirement-planner]
sources:
  - "Full retirement age by year of birth: SSA, https://www.ssa.gov/oact/progdata/nra.html (checked 2026-11-10)"
  - "Early reduction (5/9 of 1% a month for 36 months, 5/12 of 1% beyond) and delayed retirement credits (8% a year for births 1943 and later): SSA, https://www.ssa.gov/oact/quickcalc/early_late.html and https://www.ssa.gov/oact/ProgData/ar_drc.html (checked 2026-11-10)"
  - "2026 earnings test limit $24,480: SSA 2026 COLA fact sheet, https://www.ssa.gov/news/en/cola/factsheets/2026.html (checked 2026-11-10)"
flow:
  - { icon: resume, label: "Statement" }
  - { icon: calendar, label: "Birth year" }
  - { icon: clock, label: "Start age" }
  - { icon: scale, label: "Break-even" }
---

## What it does

You can start your Social Security retirement benefit any time from 62 to 70. Start early and every check is smaller for life; wait and every check is bigger. This calculator takes the benefit at full retirement age from your Social Security statement (your PIA), works out your full retirement age from your birth year, and shows your monthly benefit at every age from 62 to 70, the share of your PIA, the age at which waiting pays off, and the total paid by the age you plan to.

Fit the benefit into your whole plan with the [[retirement-planner]], or see Canada's version of this choice with [[cpp-oas-age|CPP and OAS start age]].

## How to use it

1. Sign in to my Social Security at ssa.gov and find your **benefit at full retirement age**. Type it as a monthly amount.
2. Type the **year you were born**, and tick the box if you were born on 1 January.
3. Pick a **start age** and the age to **plan to**.

## What each number means

- **Full retirement age**: 66 for 1943 to 1954, then 2 months later each year, up to 67 for 1960 and later.
- **Share of your PIA**: 70% at 62 for anyone born 1960 or later, 124% at 70.
- **Break-even**: the age at which the bigger, later checks have caught up with the smaller, earlier ones in total. Live past it and waiting paid more.
- **Total**: every check from your start age to your plan-to age, in today's dollars.

## Worked example

Jordan was born in 1964, so full retirement age is 67, and the statement shows $2,000 a month at 67. Starting at 62 pays 70%, **$1,400** a month. Waiting until 70 pays 124%, **$2,480**. Starting at 67 rather than 62 pays more in total after **age 78.7**; waiting until 70 rather than 62 pays more after **age 80.4**; 70 rather than 67, after 82.5.

## FAQs

**Does the break-even include yearly increases?** Everything is in today's dollars. Cost-of-living increases raise every option by the same percentage, so the break-even ages hardly move.

**I am married. Does this matter?** Yes: a higher earner who waits also raises the survivor benefit. Spouse benefits are not shown here.

**Is anything saved?** No. Nothing you type leaves the page. Not financial advice; check the official source.
