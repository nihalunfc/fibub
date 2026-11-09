---
name: Banked road and friction
num: 1028
shelf: learn
section: school-physics
title: "Banked road calculator: safe speed range on a curve from speed, radius, bank angle and friction, with the forces drawn"
summary: "Take a car round a curve at any speed, radius and bank angle on a dry, wet or icy road; see the weight, normal force and friction on it, the friction it needs, the ideal no-friction speed and the safe speed range."
status: live
ads: false
order: 1028
icon: compass
works: offline
updated: 2026-11-09
related: [friction-ramp, newtons-laws, kepler-orbits]
sources:
  - "Circular motion (centripetal acceleration v²/r) on a banked road with friction up to μN: the ideal speed √(r g tan θ) and the speed limits √(r g (sin θ ± μ cos θ)/(cos θ ∓ μ sin θ)) are standard school physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "Checked against an independent x-y vector sum of the forces on 500 random cases (they must give m v²/r towards the centre and balance the weight) and against hand-worked examples. The road friction values are made-up, rounded teaching numbers."
flow:
  - { icon: sliders, label: "Speed, θ" }
  - { icon: compass, label: "Curve" }
  - { icon: pointer, label: "Forces" }
  - { icon: check, label: "Safe?" }
---

## What it does

A car taking a curve needs a force towards the centre of the curve, m v²/r. On a flat road only the sideways grip of the tyres (friction) can give it. On a **banked** road, tilted so the outside edge is higher, the road's own push (the normal force) leans towards the centre and helps. This tool shows both pictures: the curve **from above**, with the car's path (green if it holds the road, red if it skids), and the road **from behind**, with the weight, the normal force, the friction and the force needed towards the centre drawn as arrows.

It works out the **ideal speed** at which no friction is needed at all, the **safe speed range** for the road surface, how much grip the car needs at your speed, and which way friction has to act. If the car is too fast it skids up and outwards; on a steep, slippery bank it can be too slow and slide down and inwards.

It follows the school topics on circular motion, friction and the banking of roads, with free-body diagrams (Class 11 Physics, laws of motion). For friction on a straight slope see [[friction-ramp]], for the laws of motion themselves [[newtons-laws]], and for gravity providing the force towards the centre [[kepler-orbits]].

## How to use it

1. Set the **speed** in km/h, the **radius** of the curve in metres and the **bank angle**. You can also drag sideways on the road picture to tilt it.
2. Pick the **road surface**: dry, wet, icy, or no friction at all. Each has a made-up, rounded friction value μ.
3. Read the pill under the picture: safe, too fast, or too slow. The numbers below give the safe range and the grip needed.

## Worked example

Open the page: **72 km/h** (20 m/s) on a curve of radius **100 m** banked at **15°**, dry road (μ 0.7). The car needs 20² ÷ 100 = **4 m/s²** towards the centre (0.41 g). Per kilogram the normal force is 9.8 cos 15° + 4 sin 15° = 10.501 N and the friction needed is 4 cos 15° − 9.8 sin 15° = 1.327 N down the slope, so it needs a grip of only **μ = 0.126**: safe. The ideal speed is √(100 × 9.8 × tan 15°) = **58 km/h** and the safe range on the dry road is **0 to 123 km/h**.

Switch to the **icy road** (μ 0.1): now the safe range shrinks to **46 to 69 km/h**, and 72 km/h skids outwards. On a flat icy road the limit would be √(0.1 × 100 × 9.8) ≈ 36 km/h.

## Tips

- On a flat road the top speed is √(μ r g): it does not depend on the car's mass.
- Banking helps most when the road is slippery: on ice, a well-banked curve is far safer than a flat one.
- A bigger radius (a gentler curve) needs less force towards the centre at the same speed.

## FAQ

**Why can a car be too slow on a banked curve?** If the bank is steep and the road slippery, a slow car does not need much force towards the centre, and gravity pulls it down the slope more than friction can hold.

**Why doesn't the mass matter?** Every force here (weight, normal force, friction, and the force needed) is proportional to the mass, so it cancels.

**Are the μ values real?** They are rounded numbers chosen to behave like the named roads. Real grip depends on the tyres, the road and the weather.

**Is anything stored?** No. It all runs in your browser.
