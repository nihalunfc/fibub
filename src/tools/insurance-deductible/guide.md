---
name: Car insurance deductible chooser
num: 1956
shelf: money
code: T831
section: car-insurance
title: "Car insurance deductible chooser: higher deductible or lower premium?"
summary: "Compare two insurance quotes with different deductibles. See the break-even claim rate, the expected saving and the chance the higher deductible wins."
status: live
ads: false
order: 1956
icon: sliders
works: offline
updated: 2026-11-10
related: [claim-or-pay, idv-ncb, budget-calculator, should-i-insure]
sources:
  - "Standard actuarial model: Poisson claim counts and lognormal claim sizes; expected cost per claim is the mean of the claim capped at the deductible (limited expected value). The numbers on the page are examples, not quotes."
flow:
  - { icon: coin, label: "Two quotes" }
  - { icon: percent, label: "Claim odds" }
  - { icon: chart, label: "Break-even" }
  - { icon: check, label: "Result" }
---

## What it does

A higher deductible (called excess in the UK) lowers your premium, but you pay more of each claim yourself. Whether that is a good trade depends on how often you claim and how big the claims are. This tool compares two quotes and shows the saving, the break-even and the range of outcomes.

It is written for car insurance but works the same for home and health deductibles. Next, see whether a single claim is worth making with [[claim-or-pay]], or check what your car is insured for with [[idv-ncb]].

## How to use it

1. Type the yearly premium and the deductible for each quote. The numbers shown are examples: change them to yours.
2. Say how often you claim, either as claims a year or as "1 claim every N years".
3. Give the typical claim (the middle one) and the size that 1 in 10 claims goes above.
4. Read the result. The 10,000 imagined runs appear a moment after you stop typing.

## What each setting does

- **Claims a year**: 0.1 means about one claim in ten years.
- **Typical claim**: half of claims are smaller, half bigger.
- **1 in 10 claims is bigger than**: sets how fat the tail of big claims is.
- **Years to look at**: how long you keep the choice.

## Worked example

Quote A costs 1,200 with a 500 deductible, quote B costs 1,000 with a 2,500 deductible. B saves 200 a year, and one full claim costs 2,000 more, so one claim uses up 10 years of savings. With claims 0.1 a year, a typical claim of 100,000 and 1 in 10 above 200,000, the break-even is 0.1 claims a year, so the expected saving is about zero.

## FAQs

**Does it tell me which to buy?** No. It shows what each choice costs on average and in good and bad luck.

**Why a chance below 100% when the saving is positive?** One big claim can wipe out many years of savings.

**Are my numbers stored?** No, nothing leaves this page.

How it's worked out: saving a year = premium A − premium B; extra cost per claim = E[min(claim, high deductible)] − E[min(claim, low deductible)]; break-even rate = saving ÷ extra cost per claim.
