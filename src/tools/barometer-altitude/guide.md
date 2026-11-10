---
name: Barometer altitude
num: 1224
shelf: learn
section: school-physics
title: "Air pressure and altitude: climb a mountain, watch the barometer fall and water boil below 100 °C, and see why pressure cookers help"
summary: "Drag a climber up a mountain and watch the air thin out, the mercury barometer fall from 760 mm and water's boiling point drop to about 70 °C on Everest. Tick the pressure cooker to bring it back above 100 °C."
status: live
ads: false
order: 1224
icon: mountain
works: offline
updated: 2026-11-10
related: [pressure-explorer, liquid-pressure, standard-atmosphere, heating-curve]
sources:
  - "International Standard Atmosphere, lowest layer (ICAO Doc 7488; the same as the U.S. Standard Atmosphere 1976 below 11 km): sea level 101,325 Pa and 15 °C, lapse rate 6.5 K/km, with g₀ = 9.80665 m/s², M = 0.0289644 kg/mol and R = 8.314462618 J/(mol K) (CODATA)."
  - "Boiling point from the Clausius–Clapeyron equation through 100 °C at 101.325 kPa, using an average latent heat of 41.5 kJ/mol chosen for 65 to 120 °C; mercury density 13,595.1 kg/m³ at 0 °C. Place heights are rounded, and the 100 kPa of the pressure cooker is a typical rounded value."
  - "Checked by tests against a step-by-step integration of the hydrostatic equation, the standard value 22,632 Pa at 11 km, 760 mm of mercury at 1 atm, and the Antoine equation for water (within 0.35 °C from 30 to 201 kPa)."
flow:
  - { icon: mountain, label: "Climb" }
  - { icon: chart, label: "Barometer" }
  - { icon: flask, label: "Boiling" }
  - { icon: check, label: "Cooker" }
---

## What it does

We live at the bottom of an ocean of air. Its weight presses on everything with about 101 kPa at sea level. Climb a mountain and some of that air is below you, so the **air pressure falls with height**.

Drag the climber up the mountain. Dots show the air thinning, a **mercury barometer** falls from 760 mm, and a pot shows the temperature at which **water boils**. Lower pressure means water boils below 100 °C, so food cooks slowly in the hills. Tick the **pressure cooker** to push the boiling point back above 100 °C.

It follows Class 8 Science, pressure, winds, storms and cyclones (air presses on us, pressure falls with height), with Class 11 Physics links (the barometer, P = ρgh). Before this, [[pressure-explorer]] shows what pressure means and [[liquid-pressure]] shows it growing with depth; for the full atmosphere see [[standard-atmosphere]].

## How to use it

1. Choose a **Level**. Class 11 shows the formulas with your numbers.
2. Drag the climber, use the **Height** slider (0 to 9,000 m), or **Go to** a place from a seaside city to Mount Everest.
3. Tick **Cook in a pressure cooker** to add about 100 kPa.
4. Try **Check yourself** at the bottom.

## Worked example

At sea level: **101.3 kPa**, **760 mm** of mercury, water boils at **100 °C**.

At **3,500 m**, P = 101,325 × (1 − 0.0065 × 3,500 / 288.15)^5.256 = **65.8 kPa**, 65% of sea level. Mercury stands at **493 mm** and water boils at about **88.3 °C**. With the cooker the water is at 165.8 kPa and boils at about **114.3 °C**. On Everest (8,849 m) the pressure is **31.4 kPa** and water boils at about **70 °C**.

## FAQ

**Why does lower pressure make water boil sooner?** Steam bubbles can only grow when their pressure matches the pressure outside. Less outside pressure needs less heat.

**Why mercury in barometers?** It is so dense that the tube is under 1 m; water would need over 10 m.

**Is anything stored?** No. Everything runs in your browser.
