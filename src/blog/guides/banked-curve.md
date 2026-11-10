---
title: "Banked curves: why roads tilt and how fast a car can safely turn"
summary: "How the normal force and friction keep a car on a banked curve, the ideal no-friction speed, the safe speed range, and a full worked example."
tools: [banked-curve, friction-ramp, newtons-laws, kepler-orbits]
updated: 2026-11-10
sources:
  - "Uniform circular motion (centripetal acceleration v²/r) and banking of roads with limiting friction μN: standard school mechanics. g = 9.8 m/s² (rounded)."
  - "The friction values for dry, wet and icy roads are the tool's own made-up, rounded teaching numbers, not measurements."
---

The banked curve tool puts a car on a curved road and lets you change its speed, the radius of the curve, the tilt of the road and how slippery the surface is. It then tells you whether the car holds the road, skids outwards or slides down the slope, and shows every force acting on it. It is written for Class 11 students learning circular motion and friction. To build up to it, try friction on a straight slope in the [[friction-ramp]] and the basic rules of force in [[newtons-laws]]; for a case where gravity alone supplies the turning force, see [[kepler-orbits]].

## What it is

Anything moving in a circle is always changing direction, so it is accelerating towards the centre, even at a steady speed. This **centripetal acceleration** is

a = v² / r

where v is the speed (m/s) and r the radius of the curve (m). Something must push the car towards the centre with a force m a, where m is its mass.

On a flat road the push towards the centre can only come from **friction**, the sideways grip between tyres and road. Friction has a limit, μ N, where μ (the friction coefficient) describes the surface and N is the **normal force**, the road's push straight out of its surface.

Tilt the road by an angle θ, outside edge higher, and the normal force leans inwards. Part of it now points towards the centre. At one particular speed, the **ideal speed**, that part is exactly enough and no friction is needed:

v_ideal = √(r g tan θ)

with g = 9.8 m/s², the pull of gravity per kilogram. Faster than this, the car tends to slide up and out, and friction must act down the slope. Slower, it tends to slide down and in, and friction must act up the slope. The tool finds the slowest and fastest speeds at which friction can still cope: that is the **safe speed range**.

The mass cancels out of every one of these results, so a lorry and a bicycle have the same safe range, if their grip is the same.

## How to use it

1. Drag the **Speed** slider (10 to 200 km/h) to set how fast the car goes.
2. Set the **Radius of the curve** (20 to 400 m). A small radius is a tight bend.
3. Set the **Bank angle θ** (0 to 40°), or drag sideways on the road picture to tilt it.
4. Choose a **Road surface**: dry, wet, icy or no friction at all.
5. Read the verdict under the picture and the numbers beside it: the ideal speed, the safe range, the grip the car needs and which way friction acts.
6. Try the **Check yourself** questions to test your working.

## A worked example

A slip road bends with a radius of **60 m** and is banked at **10°**. It is raining (wet road, μ = 0.4) and a car takes it at **54 km/h**.

**Speed in m/s:** 54 ÷ 3.6 = **15 m/s**.

**Acceleration needed:** a = 15² ÷ 60 = **3.75 m/s²** towards the centre.

**Forces per kilogram.** Split everything along the slope and across it:

- normal force N = g cos θ + a sin θ = 9.651 + 0.651 = **10.302 N**,
- friction needed f = a cos θ − g sin θ = 3.693 − 1.702 = **1.991 N**, acting down the slope.

**Grip needed:** f ÷ N = 1.991 ÷ 10.302 = **0.193**. The wet road offers 0.4, so the car is **safe**.

**Ideal speed:** √(60 × 9.8 × tan 10°) = **10.18 m/s**, about **36.7 km/h**.

**Safe range on the wet road:** **0 to 68.7 km/h**. The lower limit is zero because a 10° tilt is too gentle for a stopped car to slide down when μ is 0.4.

Now make it **icy** (μ = 0.1). The range shrinks to **23.9 to 46.3 km/h**, and at 54 km/h the car skids outwards. Without the bank, the flat icy limit would be √(0.1 × 60 × 9.8) = 7.67 m/s, about **27.6 km/h**. The tilt raises the top safe speed on ice by more than two thirds.

## Where it is used

- **Road design.** Engineers bank bends (they call it superelevation) so that typical traffic needs little friction, leaving grip spare for rain and braking. Check the official design standard for real limits in your country.
- **Railways.** Track is tilted on curves (cant) so trains can run faster with less sideways push on the rails and passengers.
- **Racing and cycling.** Velodromes and oval tracks are banked steeply so riders can lean in and keep speed through the turns.

## Common mistakes

- **Forgetting to convert km/h to m/s.** Divide by 3.6 before using v² / r, or every answer is wrong by a factor of about 13.
- **Treating centripetal force as an extra force.** It is not a new arrow on the diagram; it is the total of the real forces towards the centre. Draw only weight, normal force and friction.
- **Always pointing friction up the slope.** Its direction depends on the speed. Above the ideal speed it points down the slope; below, up.
- **Setting N = m g on a banked road.** The normal force changes with speed. At speed it is larger than m g cos θ.
- **Thinking a heavier car is safer.** Mass cancels. Only the speed, radius, angle and grip decide.

## Questions people ask

**What happens with no friction at all?** Only the ideal speed is safe. Any other speed and the car slides, out if too fast and in if too slow.

**Why not bank every road steeply?** Slow or stopped traffic on a steep, icy bank would slide down into the inside of the curve. Designers balance the two risks.
