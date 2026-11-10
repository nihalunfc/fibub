---
name: Barometer and altitude
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
updated: 2026-11-09
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

We live at the bottom of an ocean of air. All the air above you has weight, and it presses on everything with about 101 kPa at sea level. Climb a mountain and part of that air is now below you, so less of it presses down: the **air pressure falls with height**.

Drag the climber up the mountain on this page. Dots show the air thinning out, a **mercury barometer** shows its column falling from 760 mm, and a thermometer in a pot shows the temperature at which **water boils**. Lower pressure makes water boil sooner, below 100 °C, so food cooks more slowly in the hills. Tick the **pressure cooker** to see how trapping the steam pushes the boiling point back above 100 °C.

It follows the school topics on air pressure: Class 8 Science, pressure, winds, storms and cyclones (the air presses on us, pressure falls as you go up), with links to Class 9 and 11 work on boiling points and pressure (Class 11 Physics, mechanical properties of fluids: atmospheric pressure, the barometer, P = ρgh). Before this, [[pressure-explorer]] shows what pressure means and [[liquid-pressure]] shows pressure growing with depth in water; for the full standard atmosphere up to 86 km, see [[standard-atmosphere]].

## How to use it

1. Choose a **Level**. Class 8 explains each change in words. Class 11 shows the formulas with your numbers: the standard-atmosphere pressure, the barometer height h = P ÷ ρg and the Clausius–Clapeyron boiling point, plus the air temperature.
2. Drag the climber up or down, use the **Height** slider (0 to 9,000 m), or **Go to** a place: a seaside city, a plateau city, a hill station, a high Himalayan town, a high mountain pass or the top of Mount Everest.
3. Tick **Cook in a pressure cooker** to add about 100 kPa to the pressure on the water.
4. Try the **Check yourself** questions at the bottom.

## Worked example

At sea level the page shows **101.3 kPa**, a mercury column of **760 mm**, and water boiling at **100 °C**.

Go to the high Himalayan town at **3,500 m**. The pressure is P = 101,325 × (1 − 0.0065 × 3,500 / 288.15)^5.256 = **65,770 Pa (65.8 kPa)**, only 65% of sea level. The mercury stands at **493 mm**, and water boils at about **88.3 °C**, nearly 12 °C cooler than at the coast. Tick the pressure cooker: the water inside is at 65.8 + 100 = 165.8 kPa and boils at about **114.3 °C**.

At the top of Mount Everest (8,849 m) the air pressure is **31.4 kPa** and water boils at about **70 °C**.

## Tips

- Weather changes the air pressure by a few kPa from day to day, which is why barometers are used for weather forecasts. The page uses the agreed average.
- Mercury is used in barometers because it is so dense: water would need a tube more than 10 m tall.
- Pressure falls fastest near the ground, where the air is densest. Half the air is below about 5.5 km.

## FAQ

**Why does lower pressure make water boil sooner?** Water boils when bubbles of steam can form inside it. A bubble can only grow if the steam's pressure matches the pressure pressing in from outside. With less air pressure, the steam needs less push, so the water does not need to be as hot.

**Does food cook faster in a pressure cooker?** Yes, because the water is hotter (about 120 °C at sea level), and hotter water cooks food faster. In the hills it makes the biggest difference, since open water there boils well below 100 °C.

**Is anything stored?** No. Everything runs in your browser and nothing is saved or sent.
