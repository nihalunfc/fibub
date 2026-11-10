---
name: Health insurance tax saving (India 80D, US HSA)
num: 2104
shelf: money
code: T881
section: health-insurance
title: "Health insurance tax saving: India 80D and US HSA calculator"
summary: "Estimate the tax you save on health insurance premiums under India section 80D (old regime) or on US HSA contributions, with the 2026 limits and your tax rate."
status: live
ads: false
order: 2104
icon: sliders
works: offline
updated: 2026-11-10
related: [india-income-tax, health-plan-comparer, budget-calculator]
sources:
  - "India: Income-tax Act 1961 section 80D, carried into the Income-tax Act 2025 from April 2026: Rs 25,000 (Rs 50,000 if senior) per group, check-up up to Rs 5,000 inside the limit, no cash premiums, old regime only. Income Tax Department, https://www.incometax.gov.in (checked 2026-11-10, check the official source)"
  - "US: 2026 HSA limits $4,400 self-only, $8,750 family, +$1,000 at 55 or older; HDHP deductible at least $1,700 / $3,400, out-of-pocket maximum at most $8,500 / $17,000: IRS Rev. Proc. 2025-19 (checked 2026-11-10, check the official source)"
flow:
  - { icon: coin, label: "Premiums" }
  - { icon: percent, label: "Your rate" }
  - { icon: check, label: "Tax saved" }
---

## What it does

Some countries let you take money spent on health cover off your taxable income. In India, section 80D lets people on the old tax regime deduct health premiums for themselves, their family and their parents. In the US, money put into a health savings account (HSA) with a high-deductible plan is tax free. This tool adds up what counts and shows the tax you would save at your own rate.

It estimates a saving; it cannot confirm that you qualify. To see which plan suits your year of care, try [[health-plan-comparer]]; for the rest of your Indian tax, use [[india-income-tax]], and to fit the premium in your month, [[budget-calculator]].

## How to use it

1. Pick India or the United States.
2. India: enter premiums, check-up costs and your slab for each group. Tick the box if a person in that group is 60 or older.
3. US: choose self-only or family, enter your age, your contribution, your employer's, and your federal and state rates.

## What each setting does

- **Premium paid in cash**: not allowed under 80D, so it is taken out.
- **Preventive check-up**: counts up to Rs 5,000 inside the group limit and may be paid in cash.
- **Medical bills for a senior with no insurance**: count up to the senior limit.
- **Employer contribution**: uses up part of your HSA limit.
- **Paycheque or on your own**: paycheque contributions also skip 7.65% FICA.

## Worked example

India, old regime, 30% slab: you pay 30,000 for your own cover (under 60, limit 25,000, so 25,000 counts) and 40,000 for parents who are seniors (limit 50,000, so 40,000 counts). Deduction 65,000; tax saved 65,000 x 31.2% = 20,280. US: self-only, under 55, 4,400 by paycheque, 22% federal and 5% state: 4,400 x 34.65% = 1,524.60.

## FAQs

**Does the new tax regime allow 80D?** No. Check which regime you file under.

**What happens if I put in more than the HSA limit?** The extra is taxed and may bring a yearly excise tax until removed.

**Is anything stored?** No, nothing leaves this page.

How it's worked out: India, allowed = min(limit, premium + check-up up to 5,000 + bills if senior) per group, saved = total x slab x 1.04. US, saved = allowed contribution x (federal + state + 7.65% by paycheque).
