---
name: How much health insurance cover do I need?
num: 2103
shelf: money
code: T880
section: health-insurance
title: "How much health insurance cover do I need? Sum insured calculator"
summary: "Work out the health insurance sum insured you need from the cost of a serious hospital stay, medical price rises and the cover you already have."
status: live
ads: false
order: 2103
icon: coin
works: offline
updated: 2026-11-10
related: [health-plan-comparer, room-rent-cap, inflation-calculator]
sources:
  - "Medical price rise: no figure is bundled, because it changes. Look up the official health price series for your country: India, MoSPI consumer price index (health), mospi.gov.in; US, Bureau of Labor Statistics CPI medical care, bls.gov/cpi; Canada, Statistics Canada CPI health and personal care, statcan.gc.ca. The 7% shown is only an example. Checked 2026-11-10, check the official source."
flow:
  - { icon: coin, label: "Stay cost" }
  - { icon: percent, label: "Price rise" }
  - { icon: chart, label: "Need" }
  - { icon: check, label: "Gap" }
---

## What it does

Health insurance is priced by sum insured: the most it pays in a year. Too low and you pay the rest. This tool starts from what one serious hospital stay costs today, takes how many such stays you might have in one bad year, and grows that by medical price rises to show the cover you would need now and in some years' time.

It then compares the need with your own cover and, separately, with your own cover plus your employer's, in case that ends when you leave the job. Compare plans with [[health-plan-comparer]], check how a room-rent limit shrinks payouts with [[room-rent-cap]], and see how prices grow with [[inflation-calculator]].

## How to use it

1. Type what one serious hospital stay costs today, from a recent bill or a hospital estimate.
2. Choose how many such stays in one bad year (1 to 3) and the number of family members on the plan.
3. Enter the medical price rise a year and the years ahead. The numbers shown are example numbers: change them to yours.
4. Enter your own cover and any employer cover.

## What each setting does

- **Stays in a bad year**: how many big hospital stays you want to be ready for.
- **Family members**: for a floater, everyone shares one sum insured, so the stays may be for different people.
- **Medical price rise**: how fast hospital costs grow. Use the official series linked on the page.
- **Employer cover ends if I leave**: shows the gap if only your own policy remains.

## Worked example

A stay of 5,00,000, one stay, no price rise, today, with cover of 3,00,000: the gap is 2,00,000. With a 10% rise for 2 years the need grows to 6,05,000.

## FAQs

**Is this what I should buy?** No, it is a way to size the number. Policies differ in limits and exclusions.

**Why add family members?** On a floater one sum insured is shared, so a bad year for two people uses it faster. Raise the number of stays to show that.

**Is my data saved?** No, nothing leaves this page.

How it's worked out: need = cost of a stay × stays × (1 + price rise)^years. Gap = need − cover, or 0 if you are covered.
