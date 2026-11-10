---
name: Decomposer race
num: 1233
shelf: learn
section: school-biology
title: "Decomposer race: how warmth, moisture and earthworms make leaf litter and waste rot faster"
summary: "Three compost heaps race to break down. Choose leaves, peel, straw, paper or a plastic bag, set the temperature and moisture, add earthworms or not, and watch the grams left fall day by day, with the half-life of each heap."
status: live
ads: false
order: 1233
icon: flask
works: offline
updated: 2026-11-09
related: [food-web-builder, enzyme-activity, water-cycle-sim, photosynthesis-lab]
sources:
  - "Decomposition by bacteria, fungi and earthworms, its dependence on temperature (roughly doubling every 10 °C, Q10 ≈ 2), moisture and air, and exponential (first-order) mass loss M = M₀e^(−kt) with half-life ln 2 / k, are standard ecology. Wording, pictures and examples are fibub's own."
  - "The rates for each material, the moisture curve and the earthworm boost are made-up round numbers for a teaching model, not measurements. Tests check the formulas and that the model follows the patterns above."
flow:
  - { icon: sliders, label: "Set heaps" }
  - { icon: clock, label: "Run days" }
  - { icon: chart, label: "Grams left" }
  - { icon: check, label: "Check" }
---

## What it does

When leaves fall, fruit peels are thrown on a heap or an animal dies, **decomposers** go to work. Bacteria and fungi feed on the dead matter and break it into simple substances that go back into the soil for plants to use again; earthworms, woodlice and other small animals shred it first so the microbes have more surface to work on. Without decomposers, nutrients would stay locked in dead material and the cycle of nature would stop.

This page races three **compost heaps**. For each heap you choose what goes in (green leaves, fruit and vegetable peel, dry straw, newspaper or a plastic bag), how **warm** it is, how **damp** it is and whether **earthworms** are in it. Move the **day** slider or press **Play** and watch the heaps shrink, with a graph of the grams left in each. Each heap also shows its **half-life**: the days it takes for half of it to break down.

It follows Class 7 and 8 Science (how nature works in harmony, decomposers and the cycling of nutrients, waste and compost), with a **Class 9 to 12** level that shows the exponential decay formula used in ecology. For where decomposers sit in a food web, try the [[food-web-builder]]; for why warmth speeds up living chemistry until it gets too hot, the [[enzyme-activity]] lab; and for where the water in the heap comes from, the [[water-cycle-sim]].

## How to use it

1. For each **heap** (A, B, C), choose what to **put in**, the **temperature** (0 to 60 °C), the **moisture** (0% bone dry to 100% waterlogged) and tick **Earthworms** if you want them.
2. Move the **day** slider (0 to 180, or type up to 365), press **Play** to run at 20 days a second, or **Day 0** to start again.
3. Read the heap picture, the leader line and the graph. Each heap card gives the grams left and the half-life.
4. Switch the **Level** to **Class 9 to 12** to see the rate k worked out from its parts and the formula M = 100 × e^(−kt).

## Worked example

The page opens on **day 30**. Heap **A** (green leaves, 30 °C, 60% moist, with earthworms) has a rate of 0.03 × 2 × 1 × 1.5 = 0.09 per day, so 100 × e^(−0.09 × 30) = **6.7 g** is left and half was gone after just 7.7 days. Heap **B** (the same leaves at 15 °C and only 20% moist, no worms) has a rate of 0.03 × 0.707 × 0.333 = 0.00707 per day: **80.9 g** is still there and its half-life is 98 days. Heap **C** is a plastic bag: no decomposer can feed on it, so all **100 g** remain, now and after a year.

Change heap B to 20 °C and 60% moisture: its half-life drops to 23.1 days. Tick earthworms and it drops again to 15.4 days.

## Check yourself

Five fresh questions: half-rot time at a warmer temperature, grams left after a few half-lives, how many times slower a colder heap is, percent broken down, and a Class 11 and 12 half-life from k. Nothing is saved.

## Tips

- Turn a compost heap now and then: decomposers need air as well as water.
- Mix "greens" (peel, fresh leaves) with "browns" (straw, paper) for a heap that is neither slimy nor dry.
- Very hot heaps (above about 45 °C) slow down because many decomposers cannot survive the heat. This model drops the rate to zero at 60 °C.

## FAQ

**Are these real rotting times?** No. The rates are round numbers chosen to show the pattern clearly. Real heaps vary a lot with the size of the pieces, air and the mix.

**Does plastic ever break down?** Ordinary plastic only crumbles into smaller pieces over decades to centuries; decomposers cannot digest it. That is why it piles up in the environment.

**Is this from the NCERT book?** It covers the same topics with fibub's own pictures and model. fibub is not part of NCERT.
