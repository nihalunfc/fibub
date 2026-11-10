---
name: FD calculator
num: 1735
shelf: money
section: interest
title: "FD calculator: fixed deposit, GIC, CD and recurring deposit maturity"
summary: "Work out the maturity amount of a fixed deposit, GIC, CD or recurring deposit with monthly, quarterly, half-yearly, yearly or simple interest, plus a deposit ladder."
status: live
ads: false
order: 1735
icon: bank
works: offline
updated: 2026-11-10
related: [compound-interest, savings-goal, ppf-calculator]
sources:
  - "Compound interest formula A = P(1 + r/m)^(m t). Indian recurring deposit (RD) formula with quarterly compounding: M = R[(1+i)^n - 1] / (1 - (1+i)^(-1/3)), i = rate/4, n = quarters. Banks may differ by a few rupees through rounding; check your bank's own figure."
flow:
  - { icon: coin, label: "Amount" }
  - { icon: percent, label: "Rate" }
  - { icon: calendar, label: "Length" }
  - { icon: check, label: "Maturity" }
---

## What it does

A fixed deposit (called an FD in India, a GIC in Canada, a CD in the US) locks money in for a set time at a set rate. This calculator tells you what you get back at the end. It also covers the recurring deposit (RD), where you put in a fixed amount every month.

Interest can be compounded monthly, quarterly, every six months or yearly, or paid as simple interest at the end. Indian banks usually compound FDs quarterly. A ladder splits your money across up to five terms so a deposit matures every step. For growth with extra deposits, see [[compound-interest]], and for a target date, the [[savings-goal]] tool.

## How to use it

1. Choose a lump-sum deposit or a recurring monthly deposit.
2. Enter the amount, the yearly rate and the length in months, days or years.
3. Choose how interest is compounded. Ask your bank if you are unsure.
4. Optionally pick a ladder of 2 to 5 terms and read the table.

## What each setting does

- **Compounded:** how often interest is added to the balance. More often means slightly more.
- **Simple, paid at the end:** interest is not added to the balance along the way.
- **Ladder:** the amount is split equally; deposit one has your length, deposit two twice that, and so on.

## Worked example

You deposit 1,00,000 at 7% a year, compounded quarterly, for one year. Each quarter earns 1.75%, so the maturity amount is 1,00,000 x 1.0175^4 = 1,07,186. A recurring deposit of 1,000 a month for 12 months at 6.5% compounded quarterly matures to about 12,429, of which 12,000 is yours.

## FAQs

**Why does my bank show a different amount?** Banks may round each quarter, count days differently, or change the rate. Use this as a close estimate.

**Is the interest taxed?** Often yes, and some banks deduct tax at source. This tool shows the amount before tax. Not financial or tax advice.

**What is a deposit ladder?** Splitting money across different terms so some of it frees up regularly, while longer deposits keep earning their rates.

**Can I use days?** Yes. Days are counted as days divided by 365.
