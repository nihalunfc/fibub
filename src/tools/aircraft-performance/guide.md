---
name: Aircraft performance calculator
num: 668
shelf: science
section: aerospace-engineering
title: "Aircraft performance calculator: drag polar, best L/D, stall speed, Breguet range and endurance, take-off roll"
summary: "From the mass, wing, drag polar (CD0 and Oswald e) and engine, get the best lift-to-drag ratio, stall speed, the speeds for least drag and least power, Breguet range and endurance for jets and propeller aircraft, and a take-off ground roll, with drag and power curves."
status: live
ads: true
order: 668
icon: flag
works: offline
updated: 2026-11-09
related: [standard-atmosphere, rocket-equation, uncertainty-calculator, propeller-thrust, density-altitude, airfoil-calculator, drone-flight-time, boundary-layer]
sources:
  - "Parabolic drag polar, best L/D, least-drag and least-power speeds, Breguet range and endurance for jet and propeller aircraft, and the take-off ground roll from m dV/dt = T − D − μ(W − L): standard flight mechanics as in Anderson, J. D., Aircraft Performance and Design (1999), and Raymer, D. P., Aircraft Design: A Conceptual Approach (equations only)."
  - "Air density from the 1976 US Standard Atmosphere (US government, public domain), calculated by fibub's standard atmosphere tool."
  - "Checked against an independent SciPy calculation: speeds found by numerically minimising drag and power, range and endurance by numerical integration over the fuel burned, and the ground roll by integrating the equation of motion. Both example aircraft are made up."
flow:
  - { icon: sliders, label: "Aircraft" }
  - { icon: curve, label: "Drag polar" }
  - { icon: calculator, label: "Speeds" }
  - { icon: target, label: "Range" }
---

## What it does

Most of an aircraft's cruise performance follows from one curve, the **drag polar**: CD = CD0 + k CL², where CD0 is the drag with no lift and k = 1 / (π e AR) is the extra drag that lift brings (AR is the aspect ratio span² / area, e the Oswald efficiency). From the polar, the mass and the engine, this calculator works out:

- the **best lift-to-drag ratio** (L/D)max = 1 / (2√(CD0 k));
- the **stall speed** and the speeds for **least drag** and **least power** (and, for jets, the **best-range speed**, 1.316 times the least-drag speed);
- **Breguet range and endurance** for a jet (from its TSFC) or a propeller aircraft (from the BSFC and propeller efficiency);
- a **take-off ground roll** to lift-off at 1.2 times the stall speed, with the classic one-line estimate for comparison;
- curves of drag and power needed against speed, a table of the key speeds and a CSV of the drag curve.

Work out the air density at your height with the [[standard-atmosphere|standard atmosphere calculator]], and check the wing section with the [[airfoil-calculator]].

## How to use it

1. Start from one of the **made-up example** aircraft, or type your own numbers.
2. Give the **mass at the start** of the cruise, **wing area**, **span**, **CD0**, **e** and **CLmax**.
3. Choose the **engine**. A jet needs its take-off thrust and TSFC (fuel mass per hour per unit of thrust, the same number in lb/(lbf·h) or kg/(kgf·h)). A propeller aircraft needs its power, the propeller efficiency and the BSFC (kg of fuel per kW·h).
4. Give the **fuel burned** in the cruise and the **cruise altitude**; the air density comes from the standard atmosphere.
5. For the take-off, give the field elevation, the **rolling friction** and the lift coefficient during the roll.

## What it assumes

The range and endurance use **Breguet's equations**: constant propeller efficiency or TSFC, the best lift coefficient held all the way, no climb, descent, wind or reserves. For jets the classic range is a **cruise climb** (constant speed and CL, the aircraft drifting higher as it gets lighter); the tool also gives the range holding height. Propeller endurance is at constant height. The ground roll ignores ground effect and takes the propeller's thrust as η P / (0.7 V_LO). These are study and planning numbers, not flight manual figures.

## Worked example

The made-up propeller aircraft: 1,100 kg, 16 m² wing, 11 m span (AR 7.56), CD0 0.028, e 0.78, CLmax 1.6, 120 kW, η 0.8, BSFC 0.3 kg/kWh, 120 kg of fuel at 2,500 m. The page gives **(L/D)max 12.9**, a stall speed of 57.7 kt, a least-drag speed of 86 kt and a least-power speed of 65.3 kt. The Breguet **range is 1,455 km** and the **endurance 10 h 43 min**. From a field at 300 m it lifts off at 62.1 kt after a **149 m** ground roll.

Choose the **made-up business jet** (8,000 kg, 28 m², 15 m span, 30 kN, TSFC 0.7 per hour, 2,000 kg of fuel at 11,000 m): (L/D)max 15.1, best-range speed 388 kt, range 3,878 km in a cruise climb or 3,612 km holding height.

## FAQ

**Why does the best range speed differ for jets and propellers?** A propeller engine's fuel flow follows power, so range is best where drag is least. A jet's fuel flow follows thrust, so it pays to fly faster, at the speed where drag divided by speed is least.

**What is a good CD0?** Clean modern jets are around 0.015 to 0.025, light aircraft 0.025 to 0.04, with fixed gear and struts at the top.

**Why is the stall speed at altitude higher?** It is a true airspeed. The indicated airspeed at stall stays about the same; the thinner air needs more true speed.
