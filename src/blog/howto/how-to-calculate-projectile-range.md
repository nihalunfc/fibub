---
title: "How to calculate the range of a projectile (with a worked example)"
summary: "Split the launch speed into sideways and upward parts, find the time in the air, then multiply by the sideways speed. Formula, worked example and quick checks."
tools: [projectile-launcher, equations-of-motion, vector-adder, projectile-drag]
updated: 2026-11-10
sources:
  - "Projectile motion with constant gravity and no air: R = v² sin 2θ / g, T = 2v sin θ / g, H = v² sin²θ / 2g, and the launch-from-height case; standard school physics. g = 9.8 m/s²."
---

For a ball launched from flat ground with no air, the range is R = v² sin 2θ ÷ g, where v is the launch speed, θ the angle above the horizontal and g = 9.8 m/s². The [[projectile-launcher]] works this out as you move its sliders, draws the path to scale and shows each step, including launches from a height where the short formula no longer applies.

## What you need

- **The launch speed v**, in metres per second (m/s).
- **The launch angle θ**, measured up from the horizontal, in degrees.
- **The launch height h**, in metres, if the ball leaves from above the landing level (a cliff, a table, a tall thrower). Use 0 for flat ground.
- A calculator in degree mode, or just the tool.

## Step by step

The key idea is that the sideways motion and the up-and-down motion happen at the same time but do not affect each other. Gravity only pulls down, so the sideways speed stays the same for the whole flight.

1. **Split the speed.** Sideways: ux = v cos θ. Upward: uy = v sin θ. (Splitting a vector into parts is shown step by step in the [[vector-adder]].)
2. **Find the time in the air.** From the ground, the ball rises and falls back to zero height, so T = 2 uy ÷ g. From a height h, solve h + uy t − ½ g t² = 0 for the positive t, which gives t = (uy + √(uy² + 2gh)) ÷ g.
3. **Multiply.** Range R = ux × T. From the ground this tidies up to R = v² sin 2θ ÷ g, because 2 sin θ cos θ = sin 2θ.

With the tool:

1. Leave the level on **Class 11: no air**.
2. Set **Launch speed v** (5 to 40 m/s), **Launch angle θ** (0° to 90°) and **Launch height h** (0 to 30 m) with the sliders.
3. Read **Range**, **Highest point**, **Time of flight**, **Time to the top**, **Landing speed** and **Best angle for distance** under The flight. The lines below them repeat your numbers inside each formula.
4. Press **Launch** if you want to watch the ball fly along the drawn path.

## A worked example

A footballer kicks a ball off flat ground at 25 m/s, 40° above the horizontal. Ignore air. How far does it go?

- ux = 25 × cos 40° = **19.15 m/s**; uy = 25 × sin 40° = **16.07 m/s**.
- Time of flight: T = 2 × 16.07 ÷ 9.8 = **3.28 s**.
- Range: R = 19.15 × 3.28 ≈ **62.8 m**. The one-line formula agrees: 25² × sin 80° ÷ 9.8 = 625 × 0.9848 ÷ 9.8 = 62.81 m.
- Highest point: H = uy² ÷ 2g = 16.07² ÷ 19.6 = **13.18 m**.

On the page, a dashed curve also appears: the 50° kick at the same speed. It lands at the same 62.81 m, since sin 100° equals sin 80°, but it climbs to 18.71 m and stays up for 3.91 s. The best angle from the ground is 45°, which would reach 63.78 m.

Now the same kick from the top of a 5 m bank. Raise the height slider to 5 m. The time in the air grows to 3.57 s, so the range becomes 19.15 × 3.566 ≈ **68.29 m**, and the best angle shown drops to 43°. A raised launch rewards a slightly flatter throw, because the ball gets extra falling time to keep travelling forward.

## Check your answer

- **Pairs of angles.** From flat ground, θ and 90° − θ give the same range. If your answers for 30° and 60° differ, look for a slip.
- **Ceiling.** No range from flat ground can be more than v² ÷ g (the 45° result). For 25 m/s that is 625 ÷ 9.8 = 63.8 m, so 62.8 m at 40° is just under it, as it should be.
- **Half time at the top.** From the ground, the time to the highest point is exactly half the time of flight (1.64 s of 3.28 s here).
- **Landing speed.** With no air and the same launch and landing level, the ball lands at the speed it was launched (25 m/s here). Higher launches land faster.
- **Air makes it shorter.** Real balls fall short of these numbers. Switch the tool to **With air** and pick a ball to see by how much; [[projectile-drag]] goes further with wind.

## Questions people ask

**Why does 45° give the greatest range?**
The range follows sin 2θ, and a sine is largest (1) at 90°, so 2θ = 90° and θ = 45°. This holds only for flat ground with no air.

**Do I use 9.8 or 10 for g?**
Use what your teacher or exam asks for. The tool uses 9.8 m/s². With 10 the answers come out about 2% smaller.

**Can I use the equations of motion instead?**
Yes. The vertical part is a straight-line motion with acceleration −g, so s = ut + ½at² gives the time and the sideways part gives the distance. The [[equations-of-motion]] tool solves those one-line problems.
