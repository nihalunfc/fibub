---
name: Trip splitter
num: 1749
shelf: money
code: T783
section: budgeting
title: "Trip splitter: split trip and group expenses and settle up with the fewest payments"
summary: "Add who paid for what on a trip or shared event, and who it was for. See each person's balance and the fewest payments that settle everyone up."
status: live
ads: false
order: 1749
icon: coin
works: offline
updated: 2026-11-10
related: [bill-splitter, tip-calculator, budget-calculator, fuel-cost]
sources:
  - "Standard accounting: each balance is what a person paid minus their share. Payments are matched largest debtor to largest creditor, so at most one fewer than the number of people."
flow:
  - { icon: pencil, label: "People" }
  - { icon: wallet, label: "Expenses" }
  - { icon: check, label: "Settle up" }
---

## What it does

When friends or family share a holiday, one person pays for the hotel, another for fuel, another for dinner. This tool takes each expense, who paid, and who it was for, then shows what each person is owed or owes, and the short list of payments that settles everything.

Not everyone has to be in every expense: a dinner can be for three out of four people. To work out fuel for the drive first, use the [[fuel-cost]] calculator; for a single restaurant bill, the [[tip-calculator]]; for monthly household bills, the [[bill-splitter]].

## How to use it

1. Type the names of everyone on the trip, and pick the currency label.
2. Add each expense: what it was, who paid, the amount, and tick who it was for.
3. Read **Balances** and **Settle up**. Download the CSV to share the result.

## What each part does

- **Paid by**: the person who handed over the money.
- **For**: the people who share that cost equally. Untick someone who did not take part.
- **Balance**: what a person paid minus their share. Positive means they are owed money.
- **Settle up**: the payments that bring every balance to zero.
- **Remember on this device**: off by default. If ticked, the trip is kept in this browser only; Clear removes it.

## Worked example

Ana pays 90 for a hotel and Ben pays 30 for a taxi, both for all three of them (Ana, Ben and Cy). The total is 120, so each person's share is 40. Ana paid 90, so she is owed 50. Ben paid 30, so he owes 10. Cy paid nothing, so he owes 40. Two payments settle it: Cy pays Ana 40 and Ben pays Ana 10.

## FAQs

**Why not just split everything equally?** Because costs often are not equal: someone skips a meal, or only some people share a room. Choosing who each cost was for keeps it fair.

**What about odd cents?** Costs are split to the cent and the extra cent goes to one person, so the balances always add up to zero.

**Does it need an internet connection?** No. It works offline once the page is open, and nothing is sent anywhere.
