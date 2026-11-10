---
name: Is collision / own-damage cover still worth it on an older car?
num: 2107
shelf: money
code: T884
section: car-insurance
title: "Is collision / own-damage cover still worth it on an older car?"
summary: "See year by year whether collision or own-damage cover is expected to pay back more than it costs as your car loses value."
status: live
ads: false
order: 2107
icon: sliders
works: offline
updated: 2026-11-10
related: [insurance-deductible, idv-ncb, should-i-insure, claim-or-pay]
sources:
  - "Maths: expected payout of a policy with a deductible and a cap at the car's value, claims counted as a Poisson rate with lognormal sizes (standard actuarial method). fibub's own drawing and code."
  - "Every insurer and region words this cover differently (own damage in India, collision in the US and Canada, comprehensive or fully comprehensive in the UK). Read your policy wording: check the official source."
flow:
  - { icon: coin, label: "Car" }
  - { icon: percent, label: "Claims" }
  - { icon: chart, label: "By year" }
  - { icon: check, label: "Verdict" }
---

## What it does

As a car gets older it is worth less, so own-damage (collision) cover can pay out less, while the premium may not fall as fast. This tool takes your car's value, its yearly drop, your premium and how often and how big claims are, and shows for each year what the cover is expected to pay compared with what it costs.

It marks the first year when the expected payout falls below the premium. That is an average over many cars and years, not a prediction for yours. To weigh a higher deductible see [[insurance-deductible]]; for what the car is insured for see [[idv-ncb]]; for a general view of any cover see [[should-i-insure]].

## How to use it

1. Enter the car's value today and how much it drops each year, as a percentage.
2. Enter the premium for this cover alone, how much it changes each year (negative if it falls), and your deductible.
3. Enter how many claims a year you expect (0.1 means one every 10 years), the typical claim and the size that 1 in 10 claims is bigger than. The numbers shown are examples: change them to yours.
4. Read the table and the chart. If you have a loan or lease, check whether the lender requires the cover.

## What each setting does

- **Value drop each year**: shrinks the car's value, which caps what any claim can pay.
- **Deductible**: you pay this part of every claim first.
- **Claims a year**: how often you expect to claim. A lower figure lowers the expected payout.
- **Typical claim and 1 in 10 bigger than**: set the spread of claim sizes, from many small to a few large.

## Worked example

With a car worth a huge amount (so the cap never bites), no deductible, 0.1 claims a year, a typical claim of 1,000 and 1 claim in 10 above 1,898, the expected payout in year 1 is 113.31. A premium of 100 is then paid back 1.13 times; a premium of 500 only 0.23 times.

## FAQs

**Should I drop the cover when the payout is below the premium?** Not automatically. A total loss or theft can be large and rare. Compare the worst case with your savings, and see [[should-i-insure]].

**Does it count the no-claim discount?** No. Use [[claim-or-pay]] for that.

**Are my numbers stored?** No, nothing leaves this page.

How it's worked out: expected payout = claims a year x (average of min(claim, car value) - average of min(claim, deductible)), with claim sizes lognormal from your typical and 1-in-10 figures; value falls by your percentage each year and the premium follows your yearly change.
