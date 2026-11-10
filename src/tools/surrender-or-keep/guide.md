---
name: Surrender a life insurance policy or keep it?
num: 2110
shelf: money
code: T887
section: life-insurance
title: "Surrender a life insurance policy or keep it? Return calculator"
summary: "Compare the surrender value offered today with the return you get by keeping a savings-type life policy, with a paid-up option and an investing comparison."
status: live
ads: false
order: 2110
icon: sliders
works: offline
updated: 2026-11-10
related: [policy-return, term-fair-price, npv-irr-calculator]
sources:
  - "Internal rate of return: the rate that makes the cash flows add up to zero. Keeping a policy means giving up the surrender value today, paying the premiums still due and receiving the later benefits. Checked: surrender value 1,000 against 1,100 a year later returns exactly 10.00%."
  - "Surrender value, paid-up value and benefits come from the insurer's own letter or benefit illustration, checked 2026-11-10. Tax and surrender charges vary by country and policy: check the policy and the official source."
flow:
  - { icon: coin, label: "Offer" }
  - { icon: chart, label: "Benefits" }
  - { icon: percent, label: "Return" }
  - { icon: check, label: "Compare" }
---

## What it does

If your insurer offers a surrender value, you can take it now and stop the policy, or keep paying and wait for the later benefits. This tool treats the surrender value as the money you give up by keeping the policy, and works out the yearly return you earn from today by waiting (an IRR). It then compares that with surrendering and investing the surrender value, plus the premiums you stop paying, at a rate you type.

It can also check a paid-up option, where you stop premiums and take a smaller benefit later. To compare the policy from the start, see [[policy-return]]; if you still need cover afterwards, see [[term-fair-price]] and [[npv-irr-calculator]].

## How to use it

1. Type the surrender value from the insurer's letter, the premium a year and how many years of premiums are left.
2. Add each benefit still to come: the year from now and the amount (maturity or money-back).
3. Type the rate you could earn on the money elsewhere. The numbers shown are examples: change them to yours.
4. Optional: add a paid-up value, and a term premium if you would need cover after surrendering.

## What each setting does

- **Years from now**: 0 is today; each premium is paid at the start of its year.
- **Rate you could earn**: used to grow the surrender value and saved premiums.
- **Paid-up value**: what the policy would pay at its end if you stop paying now.

## Worked example

Surrender value 1,000, no premiums left, 1,100 paid in one year. Keeping returns 10.00% a year. If you surrender and invest at 10% for one year you have 1,100, so the two are equal at 10%: above it, surrendering wins.

## FAQs

**Will I pay tax or charges?** Possibly. Surrender charges and tax differ: check the policy and the official source.

**Does it count the life cover?** No. If you still need cover, the term cost box shows what it might cost.

**Are my numbers stored?** No, nothing leaves this page.

How it's worked out: keep = IRR of [−surrender value − premium, −premium, …, + benefits]; surrender = value × (1 + rate) each year, adding each saved premium.
