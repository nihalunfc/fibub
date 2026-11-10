---
name: Steps to distance
num: 2032
shelf: everyday
code: T915
section: running
title: "Steps to distance: convert steps to km or miles, and back"
summary: "Turn a step count into kilometres or miles from your height or a stride you measured, turn a distance into steps, and estimate the calories with a MET value."
status: live
ads: false
order: 2032
icon: ruler
works: offline
updated: 2026-11-10
related: [pace-calculator, calorie-calculator, one-rep-max]
sources:
  - "Stride ≈ 0.414 × height for walking and 0.65 × height for running: common rules of thumb, not a standard. A measured stride is better."
  - "Ainsworth BE et al. (2011). 2011 Compendium of Physical Activities. Med Sci Sports Exerc 43(8): 1575–1581 (walking about 3.5 MET, running at 5 mph about 8.3 MET)."
  - "Distance and calorie sums are fibub's own working. 1 in = 2.54 cm, 1 mile = 1.609344 km, 1 lb = 0.45359237 kg."
flow:
  - { icon: pencil, label: "Steps" }
  - { icon: ruler, label: "Stride" }
  - { icon: compass, label: "Distance" }
---

## What it does

Phones and fitness bands count steps, but most people think in kilometres or miles. This tool multiplies your steps by your stride length to give the distance, or divides a distance by your stride to tell you how many steps it takes. It also gives a rough calorie figure for the walk or run.

Everything runs in your browser and nothing is sent anywhere. To see how fast you went, use the [[pace-calculator]]; for a full day's energy needs, the [[calorie-calculator]].

## How to use it

1. Choose **Steps to distance** or **Distance to steps**, and metric or imperial units.
2. Type the steps or the distance.
3. Pick walking or running, then give your height or a stride you measured.
4. For calories, add your weight and the time it took.

## What each setting does

- **Walking or running**: sets the stride factor and the MET value to typical numbers for that activity. You can change both.
- **Stride from**: your height times a factor, or a stride you measured yourself.
- **Stride ÷ height factor**: 0.414 for walking and 0.65 for running are rules of thumb that many step counters use. Running stride changes a lot with speed, so measure it if it matters.
- **Measured stride**: walk 10 normal steps, measure the distance, divide by 10.
- **MET value**: how hard the activity is compared with sitting still. The 2011 Compendium of Physical Activities lists about 3.5 for walking at a moderate pace and 8.3 for running at 5 mph.
- **Reset**: brings back the example.

## Worked example

You are 170 cm tall and walked 10,000 steps. Your stride is about 170 × 0.414 = **70.4 cm**, so the distance is 10,000 × 70.4 cm = **7.04 km** (4.37 miles).

If you measured a stride of 75 cm instead, 10,000 steps is **7.5 km**.

Calories: at 70 kg, 100 minutes of walking at 3.5 MET is 3.5 × 70 × 100/60 ≈ **408 kcal**.

## FAQs

**Why does my watch give a different distance?** Watches use their own stride rules, GPS or both. A measured stride brings this tool closer to the truth.

**Are the calories exact?** No. MET values are averages for groups of people, and the figure includes the energy you would use at rest anyway.

**Does it save my height or weight?** No. Nothing is stored.
