---
name: How much life insurance do I need?
num: 1960
shelf: money
code: T860
section: life-insurance
title: "How much life insurance do I need? Cover calculator"
summary: "Estimate how much life cover your family needs with three standard methods side by side: the needs approach, human life value and DIME."
status: live
ads: false
order: 1960
icon: sliders
works: offline
updated: 2026-11-10
related: [term-fair-price, policy-return, loan-payoff-planner]
sources:
  - "Present value of a growing payment, PV = sum of A x (1+g)^t / (1+i)^t for t = 0 to n-1; DIME (debt, income, mortgage, education) and needs-analysis are common planning methods. Checked: income 100,000 for 5 years with no growth or discount gives 500,000. Checked 2026-11-10; check the official source for tax rules where you live."
flow:
  - { icon: coin, label: "Income" }
  - { icon: sliders, label: "Needs" }
  - { icon: chart, label: "Methods" }
  - { icon: check, label: "Cover" }
---

## What it does

There is no single right amount of life cover, so this tool shows three common ways to work it out side by side. The needs approach adds what your family would miss and owes, then takes off what they already have. Human life value turns your future income into today's money. DIME adds up debt, income, mortgage and education.

It also shows "10 times income" but only as a comparison, because a rule of thumb ignores your debts and savings. All numbers are examples until you change them. Once you have a figure, see what a term quote should cost with [[term-fair-price]], compare savings policies with [[policy-return]], or plan paying off debts with the [[loan-payoff-planner]].

## How to use it

1. Enter your yearly income after tax and the share you spend on yourself.
2. Enter the years your family needs support, income growth and a discount rate.
3. Add debts, goals such as education, funeral costs, savings and any cover you already have.
4. Compare the three results and read the line about why they differ.

## What each setting does

- **Share you spend on yourself:** this part of your income would not be missed by the family.
- **Income growth:** how fast your pay would have risen.
- **Discount rate:** the return your family could earn on a payout; a higher rate means a smaller amount needed today.
- **Cover you already have:** work cover and existing policies are subtracted.

## Worked example

Income 100,000, own share 0%, 5 years, no growth, no discount and nothing else. The human life value is 5 x 100,000 = 500,000, and so is the needs approach. Add 200,000 of debts and 100,000 of existing cover and the needs approach becomes 600,000.

## FAQs

**Which method should I use?** None is exact. Many people look at the needs approach first and use the others as a check.

**Should the payout last for life?** Choose the years your family would need support, such as until children are independent.

**Does this include tax?** No. Use after-tax income and check the official source for how a payout is taxed where you live.

How it's worked out: needs = PV of family income + debts + goals + final costs - savings - existing cover.
