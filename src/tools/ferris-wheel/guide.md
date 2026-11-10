---
name: Ferris wheel height
num: 1279
shelf: learn
section: school-maths
title: "Ferris wheel height: turns, angles past 360° and the height wave that leads to sine"
summary: "Drag a seat round a Ferris wheel or press Play and watch its height above the ground drawn as a wave against the angle turned. Count full turns past 360°, find when the seat is above a height, and see the wave become h = H − r cos θ."
status: live
ads: false
order: 1279
icon: curve
works: offline
updated: 2026-11-09
related: [unit-circle, shm-circle, trig-ratios, clock-angles]
sources:
  - "Circle geometry and the height of a point on a turning circle, h = H − r cos θ, are standard school maths. Written for fibub; the wheel sizes in the quick buttons are round made-up numbers."
  - "Checked against Python's math.cos (hub 12 m, radius 10 m: 2, 7, 12, 22, 7 m at 0°, 60°, 90°, 180°, 300°) and by turning 300 random seats to a height and back."
flow:
  - { icon: pointer, label: "Turn seat" }
  - { icon: ruler, label: "Height" }
  - { icon: curve, label: "Wave" }
  - { icon: check, label: "Practise" }
---

## What it does

A seat on a Ferris wheel goes up, over the top, down and round again. This page lets you turn the wheel yourself and draws the seat's **height above the ground** against the **angle turned** since it was at the bottom. The picture that comes out is a wave that repeats every full turn of 360°.

It follows the Class 9 maths chapter on **rotations and repeating patterns** ("up and down, and round and round"): angles, full turns, angles bigger than 360°, and things that repeat. A **Level** switch adds the Class 10–11 view: the height formula h = H − r cos θ, the link to the sine graph, and radians.

Once you have the wave, see where it comes from on the [[unit-circle]], watch a seat's shadow move in [[shm-circle|simple harmonic motion]], or turn the hands of a clock in the [[clock-angles]] tool.

## How to use it

1. **Drag the coloured seat** round the wheel with a finger or mouse, or press **Play**. The angle keeps adding up as you go round: two full turns is 720°, not 0°.
2. The buttons **− 30°, + 30°, + 90°** move the seat in steps; **Back to the bottom** starts again at 0°.
3. Set the wheel with the sliders or boxes:
   - **r**, the radius of the wheel in metres,
   - **c**, the gap between the lowest seat and the ground (so the hub is r + c above the ground),
   - **T**, the time in seconds for one full turn, so the page can tell you how long the ride has taken.
4. The graph shows two full turns. The dot is the seat now; the dashed line is the hub height.
5. Under **When is the seat high up?** type a height: the page gives the angles (and times) in each turn when the seat is exactly that high, and how long in each turn it spends above it.

## A worked example

The page starts with the **fair wheel**: radius 10 m, lowest seat 2 m above the ground, one turn a minute. The hub is 10 + 2 = 12 m up, the top 22 m.

- After **60°** the seat is 7 m up. In the Class 10–11 view: h = 12 − 10 × cos 60° = 12 − 5 = 7 m.
- After **90°** the seat is level with the hub, 12 m; after **180°** it is at the top, 22 m.
- After **450°** it has made 1 full turn and 90° more, so it is back at 12 m, 75 s into the ride.
- Type **17 m**: the seat is that high at 120° and 240° (20 s and 40 s into each turn), and above 17 m for a third of every turn, 20 s of every minute.

## Tips

- Every full turn brings the seat back to the same place, so to find where a seat is after a big angle, take away 360° as many times as you can.
- A bigger wheel makes a taller wave; a higher hub lifts the whole wave; a slower wheel stretches it in time but not in angle.
- In the Class 10–11 view, h = H − r cos θ uses cos because the seat starts at the bottom. Starting at hub height going up would give H + r sin θ instead.

## Check yourself

Four fresh questions each time: the top of a wheel, angles past a full turn, the time for part of a turn, and the height formula. Type a number and press **Check**. Nothing is saved.

## FAQ

**Why does the angle go past 360°?** Because the wheel keeps turning. 400° and 40° put the seat in the same place, but 400° means one more trip round.

**Which way does the wheel turn?** Anticlockwise as you look at the picture, the way angles are measured in maths. A real wheel may turn either way; the heights are the same.

**Is this from the NCERT book?** It covers the same topic with fibub's own wheel and numbers. fibub is not part of NCERT.
