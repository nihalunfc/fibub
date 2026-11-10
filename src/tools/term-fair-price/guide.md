---
name: Fair price of a term life quote
num: 1961
shelf: money
code: T861
section: life-insurance
title: "Fair price of a term life quote: is it too high?"
summary: "Work out the fair yearly price of a term life policy from death chances and compare it with the quote you were given."
status: live
ads: false
order: 1961
icon: sliders
works: offline
updated: 2026-11-10
related: [life-table, life-cover-needed, policy-return]
sources:
  - "Equivalence principle: premium = expected present value of the death benefit divided by the expected present value of premiums. Death chances from the official life tables (US SSA period life table, Statistics Canada life tables, India SRS abridged life tables), checked 2026-11-10; check the official source. Gompertz law: adult death rates roughly double every 8 years. Checked: q 0.1 and 0.1 on 1,000 at 0% gives 100.00."
flow:
  - { icon: curve, label: "Death chance" }
  - { icon: coin, label: "Sum assured" }
  - { icon: calculator, label: "Fair price" }
  - { icon: check, label: "Vs quote" }
---

## What it does

A term policy pays only if you die in the term, so a fair yearly price can be worked out from the chance of dying each year. This tool does that sum, then shows how your quote compares: how many times the fair price it is, how likely the policy is to pay out, and how likely it is that it never does.

The fair price leaves out the insurer's costs and profit, so a quote is expected to be higher. Insured people also pass medical checks, so they die less often than the whole population in the first years; the true loading on your quote is therefore higher than shown. The numbers are examples until you change them. To look up the death chance for your age use the [[life-table]], to decide the sum assured use [[life-cover-needed]], and to compare a savings policy use [[policy-return]].

## How to use it

1. Enter the sum assured, an interest rate and (if you have one) your quote per year.
2. Enter the death chance q for your age from an official life table, the yearly rise and the term; or paste one q per year.
3. Read the fair price, the loading and the claim chances.

## What each setting does

- **Death chance (q):** the chance of dying within a year at that age, as a decimal. 2.1 per 1,000 is 0.0021.
- **Yearly rise:** how much q grows each year. 9% a year roughly doubles it every 8 years.
- **Interest:** the return on premiums held until a claim. Higher interest lowers the fair price.
- **Pasted column:** one q per year; the number of values is the term.

## Worked example

Paste 0.1 and 0.1 for a 2-year policy of 1,000 with 0% interest. Year 1 pays 0.1 x 1,000 = 100 on average. Year 2 pays 0.9 x 0.1 x 1,000 = 90. Premiums are paid while alive: 1 + 0.9 = 1.9 years. The fair price is 190 / 1.9 = 100.00 a year, and the chance the policy pays is 19%.

## FAQs

**Why is my quote above the fair price?** The insurer has costs, profit, tax and a safety margin. Smokers, health and age also change your own q.

**Where do I find q?** The official tables in the sources list give q by age and sex. Use the column for your age.

**Is a high loading bad?** It is only a comparison. Different policies have different terms, so read the wording too.

How it's worked out: P = SA x sum of v^(k+1) x kp x q(k) / sum of v^k x kp.
