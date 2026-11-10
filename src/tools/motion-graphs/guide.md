---
name: Motion graphs live
num: 1021
shelf: learn
code: L8
section: school-physics
title: "Motion graphs: distance-time, velocity-time and acceleration-time graphs drawn live as a car moves"
summary: "Drive a car along a road with a slider or pick a ready-made motion, and watch its x-t, v-t and a-t graphs draw themselves; read the slope (velocity, acceleration) and the shaded area (displacement), then try to match a target graph."
status: live
ads: false
order: 1021
icon: chart
works: offline
updated: 2026-11-09
related: [video-motion-tracker, projectile-drag]
sources:
  - "Kinematics of straight-line motion with constant acceleration in each part (x = x₀ + ut + ½at², v = u + at) and the meaning of slope and area on motion graphs: standard school physics found in any textbook."
  - "Displacement and distance checked against an independent NumPy trapezium integration of v(t) on 2,000,001 points. The ready-made motions and questions use made-up, round numbers."
flow:
  - { icon: sliders, label: "Move car" }
  - { icon: chart, label: "Graphs" }
  - { icon: ruler, label: "Slope, area" }
  - { icon: target, label: "Match it" }
---

## What it does

A car moves along a straight road and its graphs draw themselves underneath: **position against time (x-t)**, **velocity against time (v-t)** and, at the Class 11 level, **acceleration against time (a-t)**. Drag along the graphs (or the time slider) and the car moves to that moment, with its position, velocity and acceleration read out. The area under the v-t graph up to that moment is shaded and shown as the **displacement**, next to the **distance travelled**, the **average velocity** and the **average speed**.

It follows the school topics on motion in a straight line: distance and displacement, speed and velocity, uniform and non-uniform motion, acceleration and motion graphs (Class 9 Science, describing motion), and instantaneous velocity as a slope and displacement as an area (Class 11 Physics, motion in a straight line). Next, see how the three equations of motion come out of the v-t graph, or measure a real motion from a video with [[video-motion-tracker]] and throw a ball through the air with [[projectile-drag]].

## How to use it

1. Pick a **Level**. Class 9 shows the x-t and v-t graphs. Class 11 adds the a-t graph, a dashed **tangent** on the x-t graph (its slope is the velocity at that instant) and the calculus forms v = dx/dt, a = dv/dt and x − x₀ = ∫v dt.
2. **Stories** gives five ready-made motions: a steady walk, speeding up, braking to a stop, stop-and-go, and out-and-back (a ball rolling up a slope and back). **Make your own** gives you a starting velocity and three 4-second parts with their own acceleration.
3. **Drive it**: press Start and move the slider for 12 seconds. The slider is the velocity you ask for; the car speeds up or slows down at up to 2 m/s² to reach it, so you see a real acceleration on the graphs.
4. **Match the graph**: a dashed target appears on the x-t graph. Press Start and steer so your line lies on it. You get a score out of 100 from the average gap. **Show me** drives it for you so you can see which velocities make which slopes. **New target** gives another one.
5. **Play** runs the clock through a story so you can watch the car and the dots on the graphs move together.

## Worked example

Choose **Stop and go** and set the time to **4 s**. The car sped up at 1.5 m/s² for 2 s (to 3 m/s), then cruised. The page shows position **9 m**, velocity **3 m/s** and acceleration **0 m/s²**. The shaded area under the v-t graph is a triangle (½ × 2 × 3 = 3 m) plus a rectangle (2 × 3 = 6 m), so the displacement is **9 m** and the average velocity is 9 ÷ 4 = **2.25 m/s**.

Now choose **Out and back** and move to **10 s**. The car went 18 m out, stopped at 6 s and rolled back. The page shows position **10 m**, velocity **−4 m/s**, displacement **10 m** but distance travelled **26 m** (18 out plus 8 back). The area below the time axis counts as negative.

## Tips

- A straight x-t line means steady velocity; a curve means the velocity is changing. Steeper means faster.
- On a v-t graph, the **slope** is the acceleration and the **area** is the displacement.
- When the v-t line crosses zero, the car turns round: the x-t graph has a peak or a valley there.

## FAQ

**Why are distance and displacement different?** Displacement is how far you end up from the start, with a direction; distance is the whole length of the path. They are the same only if the car never turns back.

**What does a negative velocity mean?** The car is moving backwards (to the left on the road). Speed is the size of the velocity, so it is never negative.

**Is anything saved?** No. The questions in Check yourself are made fresh each time and checked in your browser; nothing is stored or sent.
