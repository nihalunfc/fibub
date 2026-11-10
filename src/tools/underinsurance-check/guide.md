---
name: Home insurance underinsurance check
num: 1955
shelf: money
code: T829
section: home-insurance
title: "Home insurance underinsurance check: will a claim be cut?"
summary: "Enter the rebuild cost, contents, sum insured and your policy's average or coinsurance clause, and see what a claim pays and the sum insured that avoids a cut."
status: live
ads: false
order: 1955
icon: scale
works: offline
updated: 2026-11-10
related: [mortgage-calculator, budget-calculator, should-i-insure, insurance-terms, home-inventory]
sources:
  - "India: the condition of average in fire and home policies pays a claim in the ratio sum insured / full value. Checked 2026-11-10, check the official source and your policy wording."
  - "US and Canada: many home policies use a coinsurance or insurance-to-value clause, often 80%, set by each policy. Checked 2026-11-10, check the official source and your policy wording."
flow:
  - { icon: calculator, label: "Value" }
  - { icon: bank, label: "Sum insured" }
  - { icon: scale, label: "Clause" }
  - { icon: check, label: "Payout" }
---

## What it does

If your sum insured is lower than what your home would really cost to rebuild, some policies do not just pay up to the sum insured. A condition of average (India) or a coinsurance clause (often 80% elsewhere) cuts every claim, even a small one, in proportion to how short you are.

This tool shows what a claim would pay, the share of the loss paid, what you would pay yourself, and the sum insured that avoids the cut. The numbers are examples: change them to yours. If you are buying the home with a loan, the [[mortgage-calculator]] shows what you owe, and the [[budget-calculator]] shows where the premium fits.

## How to use it

1. Enter the rebuild cost, or the floor area and rebuild cost per area. This is the cost to rebuild, not the sale price.
2. Enter the contents value if they are covered, and your sum insured.
3. Choose the clause in your policy wording.
4. Enter a loss and the deductible, and read the payout.

## What each setting does

- **Rebuild cost**: what it takes to build the home again today.
- **Clause**: the share of full value the policy asks you to insure. India's average clause asks for 100%.
- **Deductible**: taken off after the cut.
- **Sum insured to avoid the cut**: clause share × full value.

## Worked example

Rebuild cost 800,000 and contents 200,000 make a value of 1,000,000. The sum insured is 600,000 and the clause is 80%, so the policy asks for 800,000. You hold 600,000 ÷ 800,000 = 75%. A loss of 200,000 pays 150,000, less a deductible of 1,000: 149,000. Insuring for 800,000 would have paid the loss in full.

## FAQs

**Does every policy have a clause?** No. Many have none, and some use other rules. Read your wording.

**Which value counts?** Usually the rebuild cost, plus contents if they are on the same sum insured. Ask your insurer.

**Does the cut apply to small claims?** Yes, with such a clause it applies to every claim.

How it's worked out: payout = loss × min(1, sum insured ÷ (clause share × value)), less the deductible, at most the sum insured.
