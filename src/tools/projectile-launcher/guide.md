---
name: Projectile launcher
num: 1332
shelf: learn
code: L194
section: school-physics
title: "Projectile motion simulator: range, maximum height and time of flight from speed, angle and height, with or without air"
summary: "Launch a ball at any speed, angle and height and watch its path: the range, highest point, time of flight and landing speed worked out with your numbers, the matching angle that lands in the same place, the best angle for distance, and what air drag does to it."
status: live
ads: false
order: 1332
icon: target
works: offline
updated: 2026-11-09
related: [vector-adder, equations-of-motion, projectile-drag, motion-graphs]
sources:
  - "Projectile motion with constant g: R = v² sin 2θ / g, H = v² sin²θ / 2g, T = 2v sin θ / g, and the launch-from-height case: standard school physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "Air drag as F = ½ ρ Cd A v², stepped with fourth-order Runge-Kutta. Checked against the exact vertical-throw results with quadratic drag (top height ln(1 + kv²/g)/2k and time to the top) and against the no-air formulas. Ball masses, sizes and drag coefficients are rounded teaching values."
flow:
  - { icon: sliders, label: "Speed, angle" }
  - { icon: target, label: "Launch" }
  - { icon: ruler, label: "Range" }
  - { icon: check, label: "Check" }
---

## What it does

Throw, kick or fire something at an angle and it follows a curve called a **parabola**. The trick that makes it easy to work out is to split the launch speed into two parts that do not affect each other: a **sideways** part that stays the same all the way, and an **upward** part that gravity slows down, stops and turns round, exactly as it would for a ball thrown straight up.

Set the launch speed, angle and height, and the page draws the path to scale, marks the highest point and the landing spot, and works out the **range**, **highest point**, **time of flight**, **time to the top**, **landing speed and angle**, and the **best angle** for the longest throw. With a launch from the ground it also draws, dashed, the path at the *other* angle (90° − θ), which lands at exactly the same spot.

The **With air** level adds air drag for a cricket ball, a football, a table tennis ball or a shot put, so you can see why real throws fall short and come down more steeply than they went up.

It follows Class 11 Physics, motion in a plane (projectile motion, the equation of the path, time of maximum height, maximum height and horizontal range). The launch speed is split into parts the same way as in [[vector-adder]]; each part on its own is motion in a line, as in [[equations-of-motion]]; and [[projectile-drag]] goes further with wind and drag for real balls.

## How to use it

1. Pick a **Level**. *Class 11: no air* uses only gravity and shows the textbook formulas with your numbers. *With air* adds a drag force and lets you choose the ball.
2. Set the **launch speed**, the **launch angle** above the horizontal and the **launch height** (a cliff, a balcony or a tall thrower).
3. Press **Launch** to watch the ball fly. The numbers update as soon as you move a slider.
4. Read the working under **The flight**: the speed split into parts, then the time, range and height.

## Worked example

Open the page: **20 m/s** at **30°** from the ground. The sideways speed is 20 cos 30° = 17.32 m/s and the upward speed 20 sin 30° = 10 m/s.

- Time of flight T = 2 × 10 ÷ 9.8 = **2.04 s**, half of it (1.02 s) going up.
- Range R = 20² × sin 60° ÷ 9.8 = **35.35 m**.
- Highest point H = 10² ÷ 19.6 = **5.1 m**.

The dashed path at 60° lands at the same 35.35 m, but climbs three times as high and takes longer. The best angle from the ground is **45°**, which throws 40.82 m. Raise the launch height to 10 m and the best angle drops below 45°, because a flatter throw has more time to travel forward while it falls.

## Tips

- At the top, the ball is still moving sideways; only its upward speed is zero.
- Air drag hits light, large balls hardest. A table tennis ball thrown at 40 m/s at 45° goes about 14 m, less than a tenth of its 163 m no-air range, while a shot put hardly notices.
- With drag, the best angle for distance is less than 45°.

## FAQ

**Why do 30° and 60° land at the same place?** The range depends on sin 2θ, and sin 60° = sin 120°. One throw spends less time in the air but moves sideways faster; the other the other way round, and the two exactly balance.

**Is the path really a parabola?** Without air, yes: y = x tan θ − g x² ÷ (2 v² cos² θ). With air it is lopsided, steeper on the way down.

**Is anything stored?** No. The questions are made in your browser and nothing is saved or sent.
