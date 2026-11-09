---
name: Propeller and rotor thrust
num: 669
shelf: science
section: aerospace-engineering
title: "Propeller thrust calculator: static thrust from power, hover power, figure of merit and blade element momentum"
summary: "Work out a rotor's static thrust from its shaft power (or the power for a thrust) with actuator-disc momentum theory and a figure of merit, the induced velocity, disc and power loading, a figure of merit from a test, and a blade element momentum model of your own propeller with thrust, torque, efficiency and CT and CP against advance ratio."
status: live
ads: true
order: 669
icon: orbit
works: offline
updated: 2026-11-09
related: [aircraft-performance, standard-atmosphere, uncertainty-calculator, drone-flight-time, airfoil-calculator, density-altitude, dimensionless-numbers]
sources:
  - "Actuator-disc momentum theory, figure of merit and ideal propulsive efficiency: Rankine and Froude, as given in Leishman, J. G., Principles of Helicopter Aerodynamics (2006), and McCormick, B. W., Aerodynamics, Aeronautics and Flight Mechanics (equations only)."
  - "Blade element momentum theory with Prandtl's tip-loss factor, solved for the inflow angle by the one-variable residual method of Ning, S. A. (2014), 'A simple solution method for the blade element momentum equations with guaranteed convergence', Wind Energy 17 (equations only)."
  - "The aerofoil model (straight-line lift to CLmax, drag cd0 + kd cl²) and the example 10 × 5 inch propeller are made up for illustration."
  - "Checked against an independent SciPy calculation that solves the axial and swirl momentum balances for each blade station with fsolve, and against momentum-theory identities. Air density from the 1976 US Standard Atmosphere."
flow:
  - { icon: sliders, label: "Rotor" }
  - { icon: calculator, label: "Momentum" }
  - { icon: curve, label: "Blades" }
  - { icon: chart, label: "CT, CP, η" }
---

## What it does

A propeller or rotor makes thrust by pushing air backwards. **Momentum theory** treats it as a thin "actuator disc" that speeds up the air passing through it. It gives the least power any rotor of that size can need for a thrust; real rotors need more, and the ratio is the **figure of merit (FM)**:

- static thrust from shaft power: T = (FM × P)^⅔ × (2ρA)^⅓;
- power for a thrust (hover): P = T^1.5 / (FM × √(2ρA));
- induced velocity at the disc v = √(T / 2ρA), twice that in the wake.

The second card is a **blade element momentum (BEM)** model of a propeller you describe: blade count, diameter, chord, pitch, rpm and airspeed, with a simple aerofoil. It splits the blade into 40 rings, balances the lift and drag of each blade section with the momentum the ring gives the air (including Prandtl's tip loss), and adds up thrust, torque and power. It also sweeps the airspeed to draw the thrust and power coefficients and the efficiency against the advance ratio J.

Turn the thrust into hover time with the [[drone-flight-time|drone flight time calculator]], and check how thin air cuts it with the [[standard-atmosphere|standard atmosphere calculator]].

## How to use it

1. Choose **metres or inches** for lengths. Model propellers are named in inches: diameter × pitch, so a 10 × 5 has a 10 inch diameter and 5 inch pitch.
2. For momentum theory give the **diameter**, the **number of rotors** (4 for a quadcopter), the **altitude** for the air density and a **figure of merit**. Then find the thrust from the power, the power from the thrust, or the FM from a test where you measured both.
3. For the blade model, give the blade geometry, **rpm** and **airspeed**, and adjust the aerofoil if you know better values. Tick tip loss off to see how much it matters.
4. Download the blade stations or the speed sweep as CSV, or the whole report.

## Worked example

A made-up 10 inch (0.254 m) rotor with **100 W** of shaft power and FM 0.7 at sea level: momentum theory gives **8.473 N of static thrust (864 g)**, an induced velocity of 8.261 m/s and 8.64 g/W. The ideal power for that thrust is 70 W, which is what FM 0.7 means.

The blade model's made-up 10 × 5 two-blade propeller (chord 25 mm at the root to 15 mm at the tip) at **8,000 rpm**, static: **8.52 N (868.7 g) for 96.04 W**, a figure of merit of 0.735, CT 0.094 and CP 0.0313. Fourteen of the 40 rings are stalled near the hub, normal for a propeller with no forward speed. At **10 m/s** (J = 0.295) it gives 5.28 N for 87.14 W, an efficiency of 60.6 %.

## Tips

- A larger, slower rotor needs less power for the same thrust: power goes as T^1.5 / D. That is why helicopters have big rotors and why larger drone propellers fly longer.
- Thin air at altitude raises the power for the same thrust by 1/√σ.
- If a measured FM comes out above 1, check the diameter, the thrust reading and whether the power you used is shaft power (electrical power times motor efficiency).

## FAQ

**How accurate is the blade model?** It is a teaching and first-estimate model. Real propellers have curved aerofoils, varying pitch, 3D flow near the hub and tip and Reynolds-number effects; measured data or a full design code will differ, often by 10 to 20 %.

**Does it handle helicopters?** Momentum theory covers hover. For forward flight a rotor needs more than this axial model.
