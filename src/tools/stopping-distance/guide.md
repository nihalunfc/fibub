---
name: Stopping distance
num: 1808
shelf: vehicles
code: T897
section: driving
title: "Stopping distance: how far a car, bike or truck needs to stop"
summary: "Find reaction distance, braking distance and total stopping distance for a car, two-wheeler or loaded truck on dry, wet, snowy or icy roads, with a bar diagram in car lengths."
status: live
ads: false
order: 1808
icon: sliders
works: offline
updated: 2026-11-10
related: [fuel-cost, unit-converter, tyre-pressure]
sources:
  - "Reaction distance = speed x reaction time; braking distance = v squared / (2 x (grip + slope/100) x g) with g = 9.80665 m/s2. Grip values (dry 0.7, wet 0.4, snow 0.2, ice 0.1) are typical textbook figures, not official limits; check your own road authority's driving manual. Reaction time of 1.5 s is a common planning figure. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Speed" }
  - { icon: curve, label: "Road" }
  - { icon: check, label: "Distance" }
---

## What it does

Enter your speed, how quickly you react and what the road is like, and you see how far the vehicle travels before it stops. The distance has two parts: the **reaction distance**, covered while you notice and press the brake, and the **braking distance**, covered while the brakes slow you down.

Braking distance grows with the square of speed, so doubling your speed makes it four times longer. The bar diagram shows both parts in car lengths so the numbers feel real. Compare the cost of the trip with [[fuel-cost]], check your tyres with [[tyre-pressure]], or switch units with [[unit-converter]].

## How to use it

1. Type your speed and pick km/h or mph.
2. Choose the vehicle and the road. Edit the grip if you know it.
3. Add a slope if the road is uphill (positive) or downhill (negative).
4. Read the three distances and the bar diagram.

## What each setting does

- **Reaction time**: seconds before the brakes go on. Tiredness, phones and alcohol make it longer.
- **Road and grip (μ)**: dry 0.7, wet 0.4, snow 0.2, ice 0.1. Lower grip means a longer stop. You can type your own.
- **Slope %**: uphill helps the brakes, downhill works against them.
- **Loaded truck**: adds 0.5 s for the air-brake lag before the brakes bite. A two-wheeler uses the same grip, but in real life it has less margin when braking hard.

## Worked example

At 100 km/h (27.8 m/s) with 1.5 s reaction on a dry road: reaction distance 41.7 m, braking distance 27.8 x 27.8 / (2 x 0.7 x 9.807) = 56.2 m, total 97.9 m, about 22 car lengths. On ice (0.1) the braking distance alone is about 393 m.

## FAQs

**Why does speed matter so much?** Braking distance goes with speed squared. At 50 km/h it is about 14 m, at 100 km/h about 56 m.

**Are these legal figures?** No. They are physics estimates on a flat, clean road. Official driving manuals give their own tables.

**Does ABS change this?** ABS helps you steer while braking; the grip value already stands for good braking.

Not safety advice: always leave more room than the numbers show.
