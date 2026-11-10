---
name: Top-up vs super top-up
num: 2101
shelf: money
code: T878
section: health-insurance
title: "Top-up vs super top-up health insurance: which pays more?"
summary: "See side by side what a plain top-up and a super top-up health policy pay on your hospital bills in a year, and what you pay yourself."
status: live
ads: false
order: 2101
icon: sliders
works: offline
updated: 2026-11-10
related: [room-rent-cap, health-plan-comparer, policy-fine-print, waiting-periods, health-cover-needed]
sources:
  - "How the two kinds pay: a top-up pays each claim above its deductible, a super top-up pays once the year's claims add up past it. This is the usual way India's health insurers describe them. Policy wording differs, so read yours. Checked 2026-11-10, check the official source (IRDAI, irdai.gov.in)."
flow:
  - { icon: coin, label: "Cover" }
  - { icon: sliders, label: "Bills" }
  - { icon: chart, label: "Compare" }
  - { icon: check, label: "You pay" }
---

## What it does

A top-up and a super top-up both sit on top of your base health policy and start paying after a threshold, called the deductible. The difference is how they count. A plain top-up looks at each hospital bill on its own, so it pays nothing unless one bill is bigger than the deductible. A super top-up adds all the year's bills together and pays once the total passes the deductible.

Type your bills for one year and this tool shows what each kind would pay, bill by bill, and what you pay yourself. It also shows what your base policy pays first. To check the base policy's limits, see [[room-rent-cap]] and [[policy-fine-print]]; to compare whole plans, use [[health-plan-comparer]].

## How to use it

1. Enter the deductible, the top-up sum insured and your base policy sum insured. The numbers shown are example numbers: change them to yours.
2. Add one row for each hospital bill in the year, in the order they happen. Remove rows you do not need.
3. Read the two columns and the "You pay" line under each.

## What each setting does

- **Deductible**: the amount the top-up starts paying above. Usually the same as the base sum insured.
- **Top-up sum insured**: the most the top-up or super top-up pays in the year.
- **Base policy sum insured**: what your base policy pays first, until it runs out for the year.
- **Bills**: each separate hospital stay or claim.

## Worked example

Three bills of 3,00,000, a deductible of 5,00,000 and a top-up sum insured of 10,00,000. No single bill is above 5,00,000, so a plain top-up pays 0. A super top-up counts the total of 9,00,000, so it pays 4,00,000.

## FAQs

**Why can a top-up pay nothing?** Because it needs one bill above the deductible. Many smaller bills never reach it.

**Does the base policy count?** Here it pays first, up to its own sum insured. The deductible is a separate number you type, because policies differ.

**Is my data saved?** No, nothing leaves this page.

How it's worked out: base pays the smaller of the bill and what is left of its sum insured. Top-up pays bill minus deductible on each bill. Super top-up pays the part of the running total that is above the deductible. Both stop at the top-up sum insured.
