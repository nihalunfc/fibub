---
name: Peak-energy savings estimator
num: 3085
shelf: money
code: T1066
section: small-business
title: "Peak-energy savings estimator: Ontario Global Adjustment and Class A"
summary: "Estimate what an Ontario business could save on the Global Adjustment by cutting power use in the five provincial peak hours, with payback and a Class A or B check."
status: live
ads: false
order: 3085
icon: chart
works: offline
updated: 2026-11-22
related: [electricity-cost, break-even, budget-calculator]
sources:
  - "Ontario Global Adjustment and the Industrial Conservation Initiative (Class A and Class B): published by the IESO (ieso.ca) and the Ontario Energy Board (oeb.ca). The starting rates and thresholds were entered on 2026-11-22 from earlier published rules and not checked live. They change each year: check the official source."
  - "The example building and equipment are made up. An estimate, not a quote."
flow:
  - { icon: chart, label: "Power use" }
  - { icon: sliders, label: "Equipment" }
  - { icon: coin, label: "Saving" }
  - { icon: check, label: "Class A or B" }
---

## What it does

In Ontario, a large part of a business's electricity bill depends on its use during just five hours a year. The Global Adjustment (GA) is the charge that pays for the province's power plants and contracts. Most businesses pay it per kilowatt hour (Class B). Larger users can choose Class A under the Industrial Conservation Initiative: they pay GA according to their share of the province's demand in the five highest-demand hours of the year, so using less power in those hours lowers the bill for the next year.

This estimator shows what that could be worth for any Ontario business, such as a shop, office, factory, hotel, farm or school. You list the equipment you could turn down in a peak hour, say how many peaks you expect to catch, and it estimates the yearly saving, the cost of pre-cooling, the payback on any setup cost and whether Class A or Class B costs less. It also builds a checklist for the day of an alert. For everyday power costs see the [[electricity-cost]] calculator, and for the wider numbers use the [[break-even]] and [[budget-calculator]] tools.

## How to use it

1. **Your power use:** enter your average monthly peak demand and your demand in the province's peak hours (usually hot summer afternoons). A monthly profile is optional but makes the eligibility check more accurate.
2. **What you could turn down:** list equipment, its normal load in kW and the share you could cut in a peak hour, with a note on what staff do.
3. **How well you will respond:** the share of peaks you expect to catch, the alert days you will act on, how many hours on each, and any setup cost.
4. **Assumptions:** check the starting values with your utility.
5. **Read the estimate,** the split by equipment and the Class A against Class B comparison. Download it as a CSV.

## What each setting does

- **Peak hours you expect to catch:** nobody knows exactly which hours will be the peaks, so you act on every alert day and catch some. 80% of 5 hours is 4 hours.
- **Alert days and hours:** more alert days means more chances to catch a peak, but more pre-cooling or shifting, which uses extra energy.
- **GA cost per kW:** what each kW of your share of the peak costs a year. It changes every year.
- **Class A thresholds:** above 5 MW Class A applies automatically, above about 1 MW you can opt in, and a lower band is open to some sectors.

## Worked example

A building has a 1,054 kW average monthly peak and uses 1,240 kW in the peak hours. It can cut 360 kW (cooling 126, laundry 86, chargers 66, heating 40, ovens 21 and other loads 21). It expects to catch 80% of 5 peaks and pays about 450 per kW. Each peak hour caught is worth 360 / 5 x 450 = 32,400, so 4 of them save 129,510 a year. Pre-cooling on 12 alert days costs about 285. After an 18,000 setup cost the payback is about 2 months. The average peak is above 1,000 kW, so the business can opt in to Class A.

## FAQs

**Does this apply outside Ontario?** No. The rules are Ontario's. You can change the assumptions, but other places use different charges.

**Are the rates current?** They are starting values entered on 2026-11-22 from earlier published rules. Rates change each year, so check with your utility and the IESO.

**Why is the saving so large?** Class A bills the whole year by your share of five hours, so a small change in those hours can move a large amount. That is also the risk: miss the peaks and you save nothing.

**Is it a quote?** No. It is an estimate to decide whether to ask your utility about Class A.
