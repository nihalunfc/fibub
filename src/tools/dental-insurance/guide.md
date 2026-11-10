---
name: Is dental insurance worth it?
num: 2106
shelf: money
code: T883
section: health-insurance
title: "Is dental insurance worth it? Dental plan vs paying cash"
summary: "Compare a dental plan with paying cash or a discount plan: waiting periods, the deductible and the annual maximum applied to the treatment you expect this year."
status: live
ads: false
order: 2106
icon: sliders
works: offline
updated: 2026-11-10
related: [health-plan-comparer, should-i-insure, insurance-terms]
sources:
  - "Canada: Canadian Dental Care Plan eligibility and co-payments (no access to dental insurance, adjusted family net income under $90,000; co-pay 0% under $70,000, 40% from $70,000 to $79,999, 60% from $80,000 to $89,999): canada.ca/en/services/benefits/dental/dental-care-plan (checked 2026-11-10, check the official source)"
  - "Plan arithmetic (waiting period, deductible, percentage, annual maximum) is standard dental-plan cost sharing; use your own plan's figures."
flow:
  - { icon: sliders, label: "Plan" }
  - { icon: table, label: "Treatment" }
  - { icon: scale, label: "Compare" }
---

## What it does

Dental plans look generous but come with a waiting period, a deductible and a low yearly maximum. This tool runs the year's treatment through your plan, in month order, and shows what the plan pays, what you pay, and the total with the premium against paying cash. A discount plan (a fee for a percent off each bill) can be added for comparison.

It marks any treatment that fell in a waiting period or hit the annual maximum. To compare medical plans use [[health-plan-comparer]], to think about whether any cover pays for itself use [[should-i-insure]], and for unfamiliar words see [[insurance-terms]].

## How to use it

1. Enter the premium (per year or per month), deductible, annual maximum, the share the plan pays for preventive, basic and major care, and the waiting months for each. The numbers shown are examples: change them to yours.
2. Add each treatment you expect: type, cost and month (0 is the first month of the plan).
3. Optionally type a discount plan's fee and percent off.

## What each setting does

- **Waiting months**: treatment before that month is not paid.
- **Deductible on preventive**: tick if your plan applies it to check-ups too.
- **Annual maximum**: the most the plan pays in a year; 0 means no limit.

## Worked example

Premium 400, deductible 50 (not on preventive), maximum 1,500, plan pays 100/80/50%, waits 0/3/12 months. Treatments: preventive 200 in month 0, basic 500 in month 1, basic 300 in month 4, major 2,000 in month 6. The month 1 and month 6 items are in waiting periods. The plan pays 200 + (300 - 50) x 80% = 400, you pay 2,600, and with the premium 3,000, the same as 3,000 in cash.

## FAQs

**Why can cash win?** The premium and waiting periods can eat the plan's payout in a year with little work.

**Does Canada have public dental cover?** Some residents qualify for the Canadian Dental Care Plan; see the box on the page.

**Is anything stored?** No, nothing leaves this page.

How it's worked out: for each treatment in month order, nothing in a waiting period; otherwise deductible first, then the plan's percentage, capped by the annual maximum left. Total = premium + what you pay.
