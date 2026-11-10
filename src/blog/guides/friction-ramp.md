---
title: "Friction on a ramp: when does a block slide, and how hard must you push?"
summary: "How gravity, the normal force and friction decide whether a block on a slope stays put, slides down or moves up, with the angle of repose and a full worked example."
tools: [friction-ramp, newtons-laws, equations-of-motion, banked-curve]
updated: 2026-11-10
sources:
  - "Inclined plane forces (mg sin θ along the slope, mg cos θ into it), static friction up to μs N, kinetic friction μk N and the angle of repose tan θ = μs: standard school mechanics. g = 9.8 m/s² (rounded)."
  - "The μ values for wood, rubber on concrete, ice and sandpaper are the tool's own made-up, rounded teaching numbers, not measurements."
---

The friction ramp puts a block on a slope you can tilt. You choose its mass, the two surfaces rubbing together and a push along the slope, and the page tells you straight away whether the block stays where it is, slides down or is shoved up, with every force drawn as an arrow. It suits Class 8 and Class 11 students. For the rules of force on level ground, start with [[newtons-laws]]; once the block is sliding, [[equations-of-motion]] tells you how far and how fast it goes; and [[banked-curve]] uses the same friction ideas on a tilted, curving road.

## What it is

Gravity pulls the block down with its **weight**, m g (m is the mass in kg, g = 9.8 m/s²). On a slope at angle θ, split that weight into two parts:

- **along the slope**, pulling the block downhill: m g sin θ,
- **into the slope**, pressing the block onto the ramp: m g cos θ.

The ramp pushes back at right angles to its surface with the **normal force** N = m g cos θ.

**Friction** acts along the surface. While the block is still, it is only as large as needed, up to μs N, where μs (the **static coefficient**) says how well the surfaces grip at rest. Once the block slides, friction is μk N, where μk (the **kinetic coefficient**) is usually smaller.

The test: combine your push P with the downhill pull. If the total is no more than μs N, friction cancels it and nothing moves. Otherwise the block moves with acceleration a = F ÷ m, where F is the net force.

With no push, the block slides on its own once tan θ = μs, the **angle of repose**. Mass cancels, so heavy and light blocks of one material slip at the same tilt.

## How to use it

1. Pick a **Level**. Class 8 labels the arrows in words and explains the result in sentences. Class 11 adds numbers, the dashed m g sin θ arrow, the normal force, the net force and the acceleration.
2. Set the **slope angle θ** (0 to 60°) with the slider, or drag up and down on the picture of the ramp.
3. Set the **mass of the block** (1 to 20 kg).
4. Set **your push along the slope** (−100 to 200 N). Positive values push uphill, negative values push downhill.
5. Choose the **surfaces**: wood on wood, rubber on concrete, ice on ice, sandpaper, or your own μs and μk with two extra sliders (μk is never allowed above μs).
6. Press **Let go** to watch the block slide from the middle of the 4 m ramp and see how long it takes to reach the end. **Reset** puts it back.

## A worked example

A **12 kg** crate with a rubber base sits on a concrete ramp (μs = 0.9, μk = 0.7) tilted at **40°**.

- Weight: 12 × 9.8 = **117.6 N**.
- Pull down the slope: 117.6 × sin 40° = **75.6 N**.
- Normal force: 117.6 × cos 40° = **90.1 N**.
- Most friction can hold: 0.9 × 90.1 = **81.1 N**.

The pull (75.6 N) is less than 81.1 N, so the crate **stays still**, held by 75.6 N of friction pointing up the slope. The angle of repose is tan⁻¹ 0.9 = **42.0°**, so there is only 2° to spare.

Now tilt it to **45°**. The pull rises to **83.2 N** while the normal force falls to **83.2 N**, so the grip limit drops to 0.9 × 83.2 = **74.8 N**. The crate **slides down**. Sliding friction is 0.7 × 83.2 = **58.2 N**, so the net force is 83.2 − 58.2 = **24.9 N** downhill and a = 24.9 ÷ 12 = **2.08 m/s²**. From the middle of the ramp it covers 2 m in √(2 × 2 ÷ 2.08) = **1.39 s**.

To stop it at 45°, push up the slope with at least 83.2 − 74.8 = **8.3 N**. To start it moving uphill you need 83.2 + 74.8 = **158.0 N**.

Swap to ice (μs = 0.1, μk = 0.05) at 40°: the grip limit is only **9.0 N**, the crate slides at **5.92 m/s²**, and the angle of repose falls to **5.7°**.

## Where it is used

- **Loading ramps.** The tilt at which boxes start to creep, and the push needed to move them uphill, decide how a ramp is built.
- **Roads.** The same balance decides whether a parked car holds on a hill, and why icy slopes are dangerous.
- **Soil and rock.** Engineers use the angle of repose to judge how steep a gravel pile or cut hillside can stand before it slumps.

## Common mistakes

- **Using m g for the normal force.** On a slope N = m g cos θ, which is smaller. Use the cosine part, not the whole weight.
- **Always taking friction as μs N.** At rest, friction only matches what is needed. μs N is the most it can be, not what it is.
- **Pointing friction downhill by habit.** Friction opposes the motion, or the motion that would happen. With a big uphill push it points down the slope; with no push it points up.
- **Using μs once the block slides.** As soon as it moves, switch to μk. That is why a block that just breaks free speeds up.

## Questions people ask

**Why does the block not slide at exactly the angle of repose?** At that angle the pull and the greatest grip are equal, so the block is on the edge. Any tiny extra tilt or nudge tips it into sliding.

**Can friction ever push a block up a slope?** Yes. When the block would otherwise slide down, friction acts up the slope. It is the reason you can stand on a hillside at all.
