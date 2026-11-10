---
name: Health plan cost comparer
num: 1953
shelf: money
code: T828
section: health-insurance
title: "Health plan cost comparer: which plan costs less in a year"
summary: "Compare 2 to 4 health plans by premium, deductible, your share, out-of-pocket maximum and plan maximum, and see the spend where the cheaper plan changes."
status: live
ads: false
order: 1953
icon: scale
works: offline
updated: 2026-11-10
related: [room-rent-cap, budget-calculator, should-i-insure]
sources:
  - "US: healthcare.gov glossary definitions of deductible, coinsurance and out-of-pocket maximum. Checked 2026-11-10, check the official source."
  - "Canada: provincial health plans cover hospital and doctor care; supplementary plans have their own yearly maximums, set by each plan. Checked 2026-11-10, check the official source."
  - "India: IRDAI health insurance rules describe co-payment and sum insured. Checked 2026-11-10, check the official source."
  - "UK: private medical insurance excess and yearly benefit limits, as set by each policy. Checked 2026-11-10, check the official source."
flow:
  - { icon: wallet, label: "Add plans" }
  - { icon: calculator, label: "Set care" }
  - { icon: curve, label: "Compare" }
  - { icon: check, label: "Cheapest" }
---

## What it does

A plan with a low premium often asks more of you when you use it, and a plan with a high premium asks less. Which one costs less depends on how much care you use in the year. This tool adds the premium to what you would pay yourself, for any amount of care, and shows where the cheaper plan changes.

You see a line for each plan, the spends where two plans cost the same, and a table for a low, a typical and a bad year, with the lowest total marked. The numbers on the page are examples: change them to yours. Next, check the room limits in [[room-rent-cap]] if you are in India, and fit the premium into your year with the [[budget-calculator]].

## How to use it

1. Choose your currency and where you are. This only changes the labels and the help line.
2. Enter each plan's numbers from its summary page. Use 0 where a plan has no such limit.
3. Enter a low, a typical and a bad year of care, and how far up the chart should go.
4. Read the table and the break-even line. Download the table as CSV if you want to keep it.

## What each setting does

- **Premium**: what you pay for the year whether or not you use care.
- **Deductible**: you pay the first part of the bill yourself.
- **Your share after the deductible**: the percentage of the rest you pay (coinsurance, or co-pay in India).
- **Out-of-pocket maximum**: the most you pay in cost sharing in a year. 0 means no limit.
- **Plan maximum**: the most the plan pays in a year. Anything above is yours.
- **Copays**: fixed fees you expect, such as visits, added as they are.
- **Employer HSA money** (US): money that lowers your total.

## Worked example

Plan A: premium 5,000, deductible 1,000, you pay 10% after that, out-of-pocket maximum 3,000. Plan B: premium 2,000, deductible 4,000, you pay 30%, maximum 8,000. With 10,000 of care, A costs 5,000 + 1,000 + 900 = 6,900 and B costs 2,000 + 4,000 + 1,800 = 7,800. The plans cost the same at 5,500 of care: below that B costs less, above it A costs less.

## FAQs

**Which plan should I pick?** The tool shows costs, not quality, networks or what is covered. It does not say which is best: it says which costs less in the cases you enter.

**What if I do not know my care spend?** Try several. The chart shows every spend from 0 to the limit you set.

**Are taxes included?** No. Tax treatment differs by place and is left out.

How it's worked out: you pay min(S, D) + c × max(0, S − D), capped at the out-of-pocket maximum, plus anything the plan does not pay above its maximum; total = premium + that + copays.
