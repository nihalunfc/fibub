---
name: Claim or pay for the repair yourself?
num: 1957
shelf: money
code: T831
section: car-insurance
title: "Claim or pay for the repair yourself? No-claim discount calculator"
summary: "Work out whether a small car repair is worth claiming, by comparing what the claim pays with the extra premiums from losing your no-claim discount."
status: live
ads: false
order: 1957
icon: sliders
works: offline
updated: 2026-11-10
related: [insurance-deductible, idv-ncb, budget-calculator, should-i-insure, liability-limits]
sources:
  - "India: no-claim bonus ladder 0, 20, 25, 35, 45, 50% after 0 to 5 claim-free years, a claim resets it to 0 (India Motor Tariff GR.27, still used by insurers after detariffing). Checked 2026-11-10, check the official source."
  - "Canada, the US and the UK: insurers publish their own discount tables, so use 'My insurer's table' and copy yours."
flow:
  - { icon: coin, label: "Policy" }
  - { icon: percent, label: "Discount" }
  - { icon: chart, label: "Extra cost" }
  - { icon: check, label: "Verdict" }
---

## What it does

After a minor accident you can claim, or pay the repair yourself and keep your no-claim discount. A claim pays you the repair minus your deductible, but your discount drops, so you pay more at the next renewals. This tool adds up those extra premiums and sets them against what the claim pays.

It follows the chance of future claims too, so a discount you may lose again is counted. Before choosing a deductible, see [[insurance-deductible]]; to see what your car is insured for, use [[idv-ncb]].

## How to use it

1. Choose India, or "My insurer's table" and type your insurer's discount levels and the levels lost per claim.
2. Enter the premium before any discount, your level now, the repair cost and your deductible. The numbers shown are examples: change them to yours.
3. Set the chance of a claim in later years, how many years to look ahead and a discount rate.

## What each setting does

- **Premium before any discount**: the full price, so each level can take its percentage off.
- **Chance of another claim**: yearly chance, 0 if you do not expect one.
- **Discount rate**: money later is worth less than money now. 0 treats them the same.
- **Levels lost**: how far a claim sends you down the table.

## Worked example

Premium 10,000 before discount, India table, level 5 (50%), no future claims, 3 years. If you claim you pay 10,000, 8,000 and 7,500; if you do not, you pay 5,000 each year. Extra premiums are 10,500. A repair of 8,000 with a deductible of 1,000 pays you 7,000, so paying yourself costs less.

## FAQs

**Does a claim always reset the discount?** In the India table yes. Some insurers elsewhere drop you only a few levels, or offer discount protection.

**Does it count premium rises from your claims history?** No, only the discount table you give it.

**Are my numbers stored?** No, nothing leaves this page.

How it's worked out: for each year, premium = base × (1 − discount at your level), averaged over the levels you may be at; extra = premium after a claim − premium without; present value = sum of extra ÷ (1 + rate)^year.
