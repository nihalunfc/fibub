---
name: Drone flight time calculator
num: 671
shelf: science
section: aerospace-engineering
title: "Drone flight time calculator: hover and cruise time, range, power and thrust-to-weight for multirotors"
summary: "From the all-up weight, propeller size and battery, estimate a multirotor's hover power and flight time with momentum theory (or from your measured hover current), the time and range at a cruise speed, the speeds for the longest flight and the longest range, current draw, C-rate and thrust-to-weight."
status: live
ads: true
order: 671
icon: clock
works: offline
updated: 2026-11-09
related: [propeller-thrust, battery-cycling-analyser, standard-atmosphere]
sources:
  - "Hover power from actuator-disc momentum theory with a figure of merit, and forward-flight induced velocity from Glauert's formula: Leishman, J. G., Principles of Helicopter Aerodynamics (2006) (equations only)."
  - "Air density from the 1976 US Standard Atmosphere (US government, public domain), shifted to the temperature you give."
  - "Checked against an independent SciPy calculation (brentq for the induced velocity, minimize_scalar for the best speeds). The example drone and the typical ranges in the help text are rounded, made-up figures."
flow:
  - { icon: sliders, label: "Drone" }
  - { icon: wallet, label: "Battery" }
  - { icon: calculator, label: "Power" }
  - { icon: clock, label: "Minutes" }
---

## What it does

A multirotor spends most of its battery holding itself up. This calculator estimates how long it can do that:

- **Hover power** from momentum theory: the rotors must push air down fast enough to carry the weight. The ideal power is W^1.5 / √(2ρA) for the total disc area A; the **figure of merit** turns that into real shaft power, and the **motor and ESC efficiency** into battery power. The electronics are added on top.
- Or, better, type your **measured hover current**: the tool works out the hover time directly and the figure of merit it implies, and uses that for forward flight.
- **Forward flight**: the drone tilts so its thrust also overcomes body drag; Glauert's formula gives the lower induced velocity as air streams through the rotors, so a little forward speed takes *less* power than hovering.
- **Flight time** = usable battery energy ÷ power, plus **range**, current, C-rate, thrust-to-weight and the speeds for the longest flight and the longest range.

## How to use it

1. Give the **all-up weight** (everything that flies, battery included), the number of **rotors** and the **propeller diameter**.
2. Keep the made-up typical figure of merit and efficiency, or type your own.
3. Give the battery: **cells in series**, **capacity** and the nominal cell voltage (3.7 V for LiPo, about 3.6 V for Li-ion, 3.85 V for LiHV), and the **usable share**.
4. Set the altitude, temperature and a **cruise speed**.
5. If you have a flight log, choose **measured hover current** and type it.

## Worked example

The made-up example is a 1,200 g quadcopter with 9 inch propellers, FM 0.6, 75 % motor efficiency, 5 W of electronics and a 4S 5,000 mAh battery (74 Wh, 80 % usable). The page shows **hover 24.3 min** at 146.5 W (9.9 A, 2 C) and a power loading of 8.19 g/W. Cruising at **10 m/s** the drone tilts 8.9°, draws 102.3 W and flies **34.7 min, covering 20.8 km**. The longest flight is about 34.9 min near 9.3 m/s and the longest range about 23.4 km near 13 m/s. With 1,000 g of thrust per motor the thrust-to-weight is 3.33 : 1, so it hovers at about 30 % of full thrust.

## Tips

- **Bigger, slower propellers** lift more per watt: hover power falls as the disc area grows.
- **Every gram costs time**: power grows as weight^1.5, so 10 % more weight costs about 15 % more power.
- **Cold batteries** give less energy; keep them warm before flying in winter.

## FAQ

**Why is cruise time longer than hover time?** Moving through clean air, the rotors meet more air each second and need to push it down less hard (translational lift). At high speeds body drag takes over and the power climbs again.

**How good is the estimate?** Momentum theory with a sensible figure of merit is usually within 10 to 20 % for hover. A measured hover current is far better: use it when you can.
