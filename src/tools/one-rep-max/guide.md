---
name: One-rep max
num: 2031
shelf: everyday
code: T914
section: running
title: "One-rep max calculator: 1RM from weight and reps (Epley and Brzycki)"
summary: "Estimate your one-rep max from a set of several reps with the Epley and Brzycki formulas, see their average and a 50 to 100% training table, in kg or lb."
status: live
ads: false
order: 2031
icon: chart
works: offline
updated: 2026-11-10
related: [pace-calculator, calorie-calculator, heart-rate-zones]
sources:
  - "Epley B (1985). Poundage chart. Boyd Epley Workout. Lincoln, NE: Body Enterprises (1RM = w × (1 + r/30))."
  - "Brzycki M (1993). Strength testing: predicting a one-rep max from reps-to-fatigue. Journal of Physical Education, Recreation & Dance 64(1): 88–90 (1RM = w × 36 / (37 − r))."
  - "Table, rounding and rep estimates are fibub's own working. 1 lb = 0.45359237 kg."
flow:
  - { icon: pencil, label: "Weight" }
  - { icon: calculator, label: "Reps" }
  - { icon: chart, label: "1RM" }
  - { icon: table, label: "Table" }
---

## What it does

Your one-rep max (1RM) is the heaviest weight you can lift once with good form. Testing it directly is tiring and carries more risk, so most lifters estimate it from a heavier set of a few reps. This tool uses two well-known formulas, Epley and Brzycki, shows their average, and builds a table of 50% to 100% of that number so you can plan your working sets.

Everything runs in your browser and nothing is sent anywhere. To plan the energy side of training, use the [[calorie-calculator]]; for runs, the [[pace-calculator]].

## How to use it

1. Type the weight you lifted and pick kg or lb. Switching the unit converts the weight.
2. Type how many reps you did, taken close to failure.
3. Read the three estimates, then use the table for training weights.

## What each setting does

- **Weight lifted**: the load on the bar or machine for the set.
- **Reps done**: whole reps in that set. One rep gives the weight itself.
- **Round the table to**: rounds table weights to the nearest 1, 2.5 or 5 so they match the plates you have, or leaves them at one decimal.
- **Reset**: brings back the example.

The **About reps** column turns Epley around, reps ≈ 30 × (100 / percent − 1), so it is a rough guide only. With more than 12 reps a warning shows, because both formulas drift apart and lose accuracy on long sets.

## Worked example

You squat 100 kg for 5 reps.

- Epley: 100 × (1 + 5/30) = **116.7 kg**
- Brzycki: 100 × 36 / (37 − 5) = 100 × 36 / 32 = **112.5 kg**
- Average: (116.7 + 112.5) / 2 = **114.6 kg**

The 90% row is 114.6 × 0.9 = 103.1 kg, rounded to the nearest 2.5 gives **102.5 kg**, for about 3 reps.

## FAQs

**Which formula is better?** Neither wins for everyone. They agree closely for sets of 2 to 10 reps; the average is a sensible middle.

**Why does the warning appear above 12 reps?** Long sets test endurance as much as strength, so the estimate gets less reliable.

**Should I test my real max?** Only with a spotter or safety bars and after a good warm-up. This tool is a planning estimate, not advice for your body.

**Does it remember my lifts?** No. Nothing is stored.
