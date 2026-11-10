---
name: Ferris wheel height
num: 1279
shelf: learn
section: school-maths
title: "Ferris wheel height: watch a seat's height as the wheel turns draw a wave"
summary: "Set the radius, the hub height and the time for one turn, then drag a seat round the wheel or press Play. Its height is worked out with h = H − R cos θ and drawn against time, which gives a wave: the bridge from turning to the sine graph. Shade how long the seat stays above any height, and practise with fresh questions."
status: live
ads: false
order: 1279
icon: orbit
works: offline
updated: 2026-11-09
related: [unit-circle, trig-ratios, heights-distances, shm-circle]
sources:
  - "Height of a point on a turning circle, h = H − R cos θ, with θ = 360° × t / T: standard trigonometry, written for fibub. Wheel sizes are made-up round numbers, not any real ride."
  - "Checked against Python (math.cos, math.acos) for a 20 m wheel with its hub 22 m up and an 8-minute turn: heights every 30°, the times the seat is 32 m up, and the share of each turn above 35 m."
flow:
  - { icon: sliders, label: "Set wheel" }
  - { icon: orbit, label: "Turn seat" }
  - { icon: curve, label: "Height wave" }
  - { icon: check, label: "Practise" }
---

## What it does

Sit on a Ferris wheel and your height goes up, then down, then up again, in exactly the same way every turn. Anything that repeats like this is called **periodic**. This page draws the wheel and, next to it, a graph of the seat's height against time. The graph is a smooth wave, and that wave is the first look at the sine and cosine graphs you meet in later classes.

The height comes from a right triangle inside the wheel. If the hub (centre) is H metres up, the radius is R, and the seat has turned θ degrees past the bottom, then the seat is R cos θ below the hub, so

**h = H − R cos θ**, with **θ = 360° × t ÷ T**,

where T is the time for one full turn and t is the time since the seat left the bottom.

The page fits the Class 9 maths chapter on rotations and things that go up and down and round and round, and it is a bridge to Class 10 and 11 trigonometry. The angles themselves are in [[trig-ratios]], the full sine and cosine waves are in [[unit-circle]], and the same picture in physics is [[shm-circle]].

## How to use it

1. Choose a **Level**. *Class 9* shows angles in degrees and a table of heights every 30°. *Class 10 to 11* shows radians, the angular speed ω = 2π ÷ T and the formula h(t) = H − R cos(ωt).
2. Set **R** (radius), **H** (height of the hub) and **T** (minutes for one turn) with the sliders or boxes. H must be at least R, or the seats would scrape the ground.
3. **Drag the orange seat** round the wheel, move the **t** slider, or press **Play**. The dashed right triangle shows the part R cos θ.
4. Under the steps, the graph shows two full turns. The dot on the curve is the seat.
5. Move the **h** line. The shaded parts show when the seat is higher than that, and the page says for how many minutes of each turn.

## A worked example

The page starts with R = 20 m, H = 22 m and T = 8 min.

- The bottom is 22 − 20 = 2 m up and the top 22 + 20 = 42 m.
- After 2 min (a quarter turn, 90°): h = 22 − 20 cos 90° = 22 m, level with the hub.
- After 8/3 ≈ 2.67 min (120°): h = 22 − 20 × (−0.5) = 32 m.
- The seat is above 32 m from 2.67 min to 5.33 min, which is 2.67 min or 33.3% of each turn.

## Tips

- R stretches the wave up and down (its amplitude), H lifts the whole wave, and T stretches it sideways (its period).
- The height changes fastest when the seat is level with the hub and slowest at the very top and bottom. Watch the dot on the graph while you press Play.
- You are above the hub for exactly half of every turn, whatever the size of the wheel.

## Check yourself

Four fresh questions each time: the height of the top, the height after a number of quarter turns, the height after a time that makes 60°, 120°, 240° or 300°, and the time spent above the hub. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why cos and not sin?** Because the seat starts at the bottom. Measured from the bottom, the drop below the hub is R cos θ. Start the seat level with the hub and you would get a sine instead; the wave is the same, just shifted.

**Are these real wheels?** No. The sizes are round made-up numbers so the arithmetic stays easy.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
