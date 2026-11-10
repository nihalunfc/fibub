---
name: Rocket equation
num: 46
shelf: science
code: T46
section: spaceflight-and-astrodynamics
title: "Rocket equation"
summary: "Enter each stage's dry mass, propellant and Isp and get the delta-v of every stage and the whole rocket, the payload fraction, and how it compares with the delta-v needed for orbit, the Moon or Mars."
status: live
ads: true
order: 10
icon: flag
works: offline
updated: 2026-11-08
related: [orbit-transfer-calculator, cosmology-calculator, uncertainty-calculator]
sources:
  - "Gravitational parameters and radii: JPL and IAU values."
  - "Standard gravity: 9.80665 m/s² (CGPM)."
flow:
  - { icon: table, label: "Stages" }
  - { icon: calculator, label: "Delta-v" }
  - { icon: target, label: "Budget" }
---

## What it does

Every rocket, from a model to an orbital launcher, obeys the same rule: the change in speed it can make, its delta-v, depends only on how fast its exhaust leaves and how much of its mass is propellant. This calculator applies the Tsiolkovsky rocket equation stage by stage, carrying the upper stages and payload as dead weight for the stages below, and tells you the total delta-v. It compares the result with a typical delta-v budget for reaching orbit, the Moon or Mars, and draws how delta-v falls as the payload grows.

For the delta-v a mission needs, use the [[orbit-transfer-calculator]]; for launch windows between planets, the [[porkchop-plot]].

## How to use it

1. Type one stage per line, **the stage that fires first at the top**: a name, the **dry mass** (empty stage with engines and tanks) in kg, the **propellant** mass in kg, and the engine's **specific impulse (Isp)** in seconds. Pasting from a spreadsheet works.
2. Type the **payload** mass.
3. Choose a **delta-v budget** to compare with, or type your own.
4. The table shows each stage's mass at ignition and burnout, mass ratio, exhaust speed and delta-v. Download the result as PNG, PDF or Word.

## How it works

For each stage, Δv = Isp × g₀ × ln(m₀ / m_f), where g₀ = 9.80665 m/s², m₀ is the mass when the stage ignites (the stage, everything above it and the payload) and m_f is that mass once its propellant is gone. The total is the sum over stages. If the rocket falls short of the budget, the calculator estimates the extra propellant the top stage would need from m_prop = m_f (e^(Δv/vₑ) − 1), ignoring the heavier tanks that propellant would need.

The budget figures are rounded textbook values. The 9.4 km/s to low Earth orbit includes about 1.5 km/s lost to gravity and air drag. Transfers from low Earth orbit assume burns in the same plane; changing inclination costs more.

## Worked example

The sample is a made-up two-stage rocket with 10,000 kg of payload. The first stage weighs 22,000 kg dry with 400,000 kg of propellant at Isp 300 s; the second weighs 4,000 kg dry with 100,000 kg at Isp 340 s. At liftoff the rocket weighs 536,000 kg. The first stage burns it down to 136,000 kg, a mass ratio of 3.94 and 4,035 m/s. The second stage starts at 114,000 kg and ends at 14,000 kg, a ratio of 8.14 and 6,992 m/s. Together that is 11.03 km/s, 1,627 m/s more than the 9.4 km/s needed to reach low Earth orbit. The payload is 1.87 % of the liftoff mass.

## Frequently asked questions

**Why stage at all?** Once a stage's propellant is gone, its empty tanks are dead weight. Dropping them lets the next stage start with a much better mass ratio, so a staged rocket reaches far higher delta-v than one big stage with the same propellant.

**Sea-level or vacuum Isp?** Engines are less efficient in air. For a first stage use a value between the two; for upper stages use vacuum Isp.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
