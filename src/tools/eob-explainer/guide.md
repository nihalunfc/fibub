---
name: Explanation of benefits (EOB) checker
num: 2105
shelf: money
code: T882
section: health-insurance
title: "EOB checker: does my explanation of benefits add up?"
summary: "Check the lines of an insurance explanation of benefits against your plan terms: what you should owe after the deductible and coinsurance, and where the statement differs."
status: live
ads: false
order: 2105
icon: sliders
works: offline
updated: 2026-11-10
related: [health-plan-comparer, insurance-terms, policy-fine-print]
sources:
  - "Cost-sharing arithmetic (deductible, then coinsurance, up to the out-of-pocket maximum) as described in HealthCare.gov's glossary, https://www.healthcare.gov/glossary/ (checked 2026-11-10, check the official source). Your own plan summary has the actual terms."
flow:
  - { icon: sliders, label: "Plan terms" }
  - { icon: table, label: "EOB lines" }
  - { icon: check, label: "Compare" }
---

## What it does

An explanation of benefits (EOB) is the statement your insurer sends after a visit. It is not a bill, but it shows what the provider charged, what your plan allowed, what it paid and what you owe. This tool takes your plan terms and each EOB line, works out what you should owe, and flags any line where the statement differs by more than 1.

It checks arithmetic only. If a line differs, call the insurer: the cause may be a different deductible balance, a denied item or care outside the network. Compare plans before you choose with [[health-plan-comparer]], look up unfamiliar words in [[insurance-terms]], and read exclusions in [[policy-fine-print]].

## How to use it

1. Enter your deductible, how much of it you have met, your coinsurance, any copay, and your out-of-pocket maximum and amount spent so far. The numbers shown are examples: change them to yours.
2. Add one row per EOB line: service, billed, allowed, plan paid, you owe.
3. Read the line-by-line table. "Matches" or "Differs" tells you where to ask.

## What each setting does

- **Deductible met so far**: what you already paid toward the deductible this year.
- **Coinsurance**: your share of the allowed amount after the deductible.
- **Copay**: if entered, taken as the whole amount you owe on the first line.
- **Out-of-pocket maximum**: once reached, the plan pays everything allowed.

## Worked example

Allowed 1,000, deductible 500 with none met, coinsurance 20%, no copay. You owe 500 + 20% of 500 = 600 and the plan pays 400. If the EOB says you owe 700, the line is flagged: 100 more than the plan terms give. Billed 1,500 means a 500 network discount you should not pay.

## FAQs

**Is an EOB a bill?** No. The bill comes from the provider; compare the two.

**Does it work for Canada?** Claim statements from many Canadian plans follow the same pattern; use your plan's own percentages.

**Is anything stored?** No, nothing leaves this page.

How it's worked out: owe = min(allowed, unmet deductible) + coinsurance x the rest, capped by what is left of your out-of-pocket maximum; plan pays = allowed - owe.
