---
name: Do I need travel insurance?
num: 2112
shelf: money
code: T889
section: insurance-basics
title: "Do I need travel insurance?"
summary: "Weigh the chance and cost of medical emergencies, cancellations and lost bags against a travel policy's price, after what you already have."
status: live
ads: false
order: 2112
icon: sliders
works: offline
updated: 2026-11-10
related: [should-i-insure, insurance-terms, policy-fine-print]
sources:
  - "Maths: expected loss and expected utility with constant relative risk aversion, the same method as the Should I insure this? tool. fibub's own code."
  - "Home health plans: Canadian provincial plans pay little for care outside the province, and India has no public health cover abroad. Checked 2026-11-10, check the official source (your provincial plan, or your insurer)."
  - "Travel advice: use your own government's travel advice page for the country you visit."
flow:
  - { icon: coin, label: "Trip" }
  - { icon: percent, label: "Risks" }
  - { icon: chart, label: "Price" }
  - { icon: check, label: "Verdict" }
---

## What it does

Travel insurance bundles several risks: a medical emergency abroad, a cancelled trip you can't get refunded, lost bags. This tool takes each risk with your own guess of its chance and cost, takes off cover you already have (a credit card, an employer, a health plan), and compares the total with the policy's price.

It shows the expected loss with and without the policy, the fair price, the most the policy is worth to you, and your largest loss against your savings. To look at a single risk see [[should-i-insure]]; for the words in a policy see [[insurance-terms]]; before you buy, read [[policy-fine-print]].

## How to use it

1. Enter the trip cost you can't get back, the days, your savings, the policy price and its deductible. The numbers shown are examples: change them to yours.
2. Check your own government's travel advice and your home health plan's rules for care abroad, then fill one row per risk: its chance, its cost and what you are already covered for.
3. Read the verdict and the table by risk.

## What each setting does

- **Chance**: your own estimate for this trip, in percent.
- **Already covered up to**: cover you already have for that risk; only the rest could be paid by the policy.
- **Deductible**: you pay this first on each claim.
- **Risk attitude**: 0 counts only averages, 1 is typical, 4 is very cautious.

## Worked example

One risk with a 1% chance and a cost of 50,000, savings of 100,000, no deductible, risk attitude 1. The fair price is 500 (1% of 50,000). The most worth paying is about 690.8, because a loss that big is worth insuring above its average. A price of 600 is under that, so it passes.

## FAQs

**Are the chances real statistics?** No, they are yours. Change them to see how the answer moves.

**Does a policy cover everything listed?** Not always; wording has exclusions. See [[policy-fine-print]].

**Are my numbers stored?** No, nothing leaves this page.

How it's worked out: per risk, expected loss = chance x loss after your cover; fair price = chance x (that loss - deductible); the most worth paying is where expected utility with and without the policy are equal; the totals add the risks up.
