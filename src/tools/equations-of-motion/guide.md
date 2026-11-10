---
name: Equations of motion
num: 1022
shelf: learn
code: L9
section: school-physics
title: "Equations of motion"
summary: "Drag a velocity-time graph and watch the rectangle and triangle under it add up to the displacement; see v = u + at, s = ut + ½at² and v² = u² + 2as with your numbers; solve any problem from three known values; and find a car's stopping distance."
status: live
ads: false
order: 1022
icon: curve
works: offline
updated: 2026-11-09
related: [motion-graphs, projectile-drag, video-motion-tracker]
sources:
  - "The equations of motion for uniform acceleration in a straight line and their derivation from the area and slope of the velocity-time graph: standard school physics found in any textbook."
  - "The solver was checked by solving all ten choices of three known values for 400 random motions and getting back the motion they came from, and against hand-worked examples. Road deceleration values are made-up, rounded teaching numbers."
flow:
  - { icon: pointer, label: "Drag graph" }
  - { icon: ruler, label: "Area = s" }
  - { icon: sigma, label: "Equations" }
  - { icon: calculator, label: "Solve" }
---

## What it does

The three equations of motion for steady acceleration are all hidden in one picture: the **velocity-time graph**. This tool lets you drag that graph and see it. The area under the line is split into a **rectangle** (u × t, what you would cover at the starting speed) and a **triangle** (½ × t × (v − u), the extra from speeding up). Their sum is the displacement s. Underneath, **v = u + at**, **s = ut + ½at²** and **v² = u² + 2as** are written out with your numbers, and a little car shows how far it goes.

There are three modes. **Explore the graph** has two round handles (start velocity, and the end of the line) and three sliders. **Solve a problem** takes any three of u, v, a, s and t and finds the other two, including the cases with two answers. **Stopping distance** turns the graph into a car braking: a flat part while the driver reacts, then a slope down to zero.

It follows the school topics on motion: equations of motion by the graphical method (Class 9 Science, describing motion), and the kinematic equations for uniformly accelerated motion with calculus (Class 11 Physics, motion in a straight line). Start with the graphs themselves in [[motion-graphs]], then take the same equations into two dimensions with [[projectile-drag]], or measure a real motion with [[video-motion-tracker]].

## How to use it

1. Choose a **Level**. Class 9 explains where the equations come from using the slope and the area of the graph. Class 11 derives them by integrating, including the a = v dv/dx step for the third equation, and reads the velocity at the playing time.
2. In **Explore the graph**, drag the left handle up or down to change the starting velocity u, and drag the right handle to change the time t and the final velocity (which sets the acceleration a). The sliders do the same with finer steps.
3. Press **Play** to watch the car move along the road while a dashed line moves along the graph.
4. In **Solve a problem**, type three values and leave two boxes empty. The page says which equations it used. If the object passes the same point twice (a ball thrown up), you get both answers.
5. In **Stopping distance**, set the speed, the reaction time and the road. The rectangle is the **thinking distance** and the triangle is the **braking distance**.

## Worked example

Open the page: u = 2 m/s, a = 1.5 m/s², t = 4 s. The page shows **v = 8 m/s** (2 + 1.5 × 4). The rectangle is 2 × 4 = 8 m and the triangle ½ × 1.5 × 4² = 12 m, so **s = 20 m**. The third equation checks: 8² = 64 and 2² + 2 × 1.5 × 20 = 64.

In Solve, the starting values are u = 0, v = 20 m/s and s = 100 m. The page finds **a = 2 m/s²** and **t = 10 s**.

In Stopping distance at **54 km/h** (15 m/s) with a 1 s reaction on the dry road (7 m/s²), the thinking distance is **15 m**, the braking distance 15² ÷ 14 = **16.1 m**, and the stopping distance **31.1 m**. At 108 km/h it is **94.3 m**: thinking doubles to 30 m, braking goes up four times to 64.3 m.

## Tips

- Pick the equation that leaves out the value you neither know nor need: no t → v² = u² + 2as; no v → s = ut + ½at²; no s → v = u + at.
- Keep signs consistent. If "forwards" is positive, slowing down means a negative a.
- s is the displacement, not the distance. If the velocity changes sign, the page also shows the distance travelled.

## FAQ

**Why can there be two answers?** A ball thrown upwards passes a given height twice, once going up and once coming down, so the time (and the velocity) has two values.

**Do these work if the acceleration changes?** No. They are only for steady (uniform) acceleration. For changing acceleration use the area under the graph directly, as in the motion graphs tool.

**Are the road numbers real?** No. They are rounded teaching values to show the idea. Follow your local highway code for real stopping distances.
