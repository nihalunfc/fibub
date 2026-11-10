---
name: IDV and NCB calculator (India)
num: 1958
shelf: money
code: T833
section: car-insurance
title: "IDV and NCB calculator (India): car insured value, no-claim bonus, claim payout"
summary: "Work out your car's insured declared value (IDV), your no-claim bonus and what a repair claim pays with and without a zero-depreciation add-on, for private cars in India."
status: live
ads: false
order: 1958
icon: sliders
works: offline
updated: 2026-11-10
related: [claim-or-pay, insurance-deductible, fuel-cost]
sources:
  - "India Motor Tariff GR.8 (IDV depreciation by age), GR.9 (depreciation on parts), GR.27 (no-claim bonus 0, 20, 25, 35, 45, 50%) and GR.40 (compulsory deductible, 1,000 up to 1,500 cc and 2,000 above). Insurers still follow these after detariffing. Checked 2026-11-10, check the official source."
  - "IRDAI, the insurance regulator, for the general rules on motor own-damage cover."
flow:
  - { icon: coin, label: "Car" }
  - { icon: percent, label: "Age" }
  - { icon: chart, label: "IDV, NCB" }
  - { icon: check, label: "Claim" }
---

## What it does

The IDV (insured declared value) is the most the insurer pays if your car is stolen or written off. It is the ex-showroom price plus accessories, less depreciation for the car's age. The no-claim bonus (NCB) is a discount for each claim-free year. This tool shows both, and what a repair claim would pay.

Compare a quote's IDV with the table value, then see whether a small repair is worth claiming with [[claim-or-pay]], or weigh a higher deductible with [[insurance-deductible]].

## How to use it

1. Enter the ex-showroom price, accessories, purchase date (or the age in months), engine size and claim-free years. The numbers shown are examples: change them to yours.
2. Optionally enter the IDV from a quote to see the difference.
3. For a claim, list each part with its kind and cost, and the labour charge.

## What each setting does

- **Purchase date or age in months**: sets the depreciation. Typing months overrides the date.
- **Engine size**: decides the compulsory deductible you pay on every claim.
- **Part kind**: metal is depreciated by the car's age; plastic, rubber and nylon 50%; fibreglass 30%; glass not at all.
- **Zero-depreciation add-on**: the insurer does not take off depreciation on parts.

## Worked example

An 8,00,000 car bought 30 months ago: depreciation is 30%, so the IDV is 5,60,000. Three claim-free years give 35% NCB. A 1,200 cc engine has a deductible of 1,000. A metal part costing 20,000 loses 15% at that age: 17,000, plus 5,000 labour, minus the deductible. Over 5 years the IDV is agreed with the insurer.

## FAQs

**Is a higher IDV better?** It pays more at a total loss but costs more premium. Check what it would cost to replace the car.

**Is the NCB tied to the car?** It belongs to you as the owner and can move to a new car; ask your insurer.

**Are my numbers stored?** No, nothing leaves this page.

How it's worked out: IDV = (price + accessories) × (1 − age depreciation); payout = parts × (1 − part depreciation) + labour − compulsory deductible, floored at 0.
