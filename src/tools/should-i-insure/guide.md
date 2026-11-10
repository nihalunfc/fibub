---
name: Should I insure this?
num: 1951
shelf: money
code: T825
section: insurance-basics
title: "Should I insure this? Is the cover worth its price"
summary: "Compare a cover's price with the chance and size of the loss, and see the most it is worth paying for you, based on how much risk you can take."
status: live
ads: false
order: 1951
icon: sliders
works: offline
updated: 2026-11-10
related: [insurance-deductible, insurance-terms, budget-calculator, travel-insurance]
sources:
  - "Expected-loss arithmetic and constant relative risk aversion (CRRA) utility, a standard textbook model: u(w) = (w^(1-g) - 1) / (1 - g), with u(w) = ln(w) when g = 1. Checked 2026-11-10 against a hand-worked example. The presets are examples, not quotes."
flow:
  - { icon: coin, label: "Price" }
  - { icon: percent, label: "Chance" }
  - { icon: sliders, label: "Risk view" }
  - { icon: check, label: "Verdict" }
---

## What it does

Insurance costs more, on average, than it pays back, because the insurer has costs. It can still be worth it when a loss would hurt you badly. This tool compares the price with the expected loss, then asks how much a cautious person with your savings would pay to avoid the risk.

It gives a neutral verdict, not a recommendation. To choose between two deductibles use the [[insurance-deductible|deductible chooser]], to look up a word see [[insurance-terms]], and to check the price fits your month use the [[budget-calculator]].

## How to use it

1. Enter the **cover price per year**, the **chance of the loss** per year and the **size of the loss**.
2. Enter the **deductible** (the part you still pay) and the **savings you could use** after a loss.
3. Set your **risk attitude** and read the result. The example buttons fill all the boxes with made-up numbers.

## What each setting does

- **Chance:** 1% means 1 in 100 years. The line below shows "1 in N years".
- **Deductible:** you pay this on a loss; the cover pays the rest.
- **Risk attitude (0 to 4):** 0 means only averages count. 1 is typical. 4 is very cautious, so a big loss weighs a lot more.

## Worked example

Savings 100,000, loss 50,000, chance 1%, price 600, no deductible. The expected loss is 500 a year. At attitude 0 the most worth paying is 500, so 600 is 20% above the fair price. At attitude 1 it is about 690.8, so 600 is below that.

## FAQs

**What is the loading?** How much of the price is above the fair price (the expected payout).

**Why does attitude matter?** People who cannot absorb a loss reasonably pay more than the average to avoid it.

**Is this advice?** No. The chance you enter is a guess; try several values.

How it's worked out: the most worth paying is the price at which your expected utility with cover equals that without it (CRRA utility, found by bisection).
