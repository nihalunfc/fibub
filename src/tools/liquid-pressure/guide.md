---
name: Liquid pressure
num: 1221
shelf: learn
code: L107
section: school-physics
title: "Liquid pressure and depth: a bottle with three holes, why the lowest jet squirts hardest, P = ρgh and Torricelli"
summary: "A bottle of water with holes at three heights. See the lowest jet squirt hardest, read the pressure at each hole, let the bottle drain, raise it on a stand, and at Class 11 work out each jet's speed and where it lands."
status: live
ads: false
order: 1221
icon: flask
works: offline
updated: 2026-11-10
related: [pressure-explorer, barometer-altitude, projectile-drag, equations-of-motion]
sources:
  - "Pressure in a liquid P = ρgh, Torricelli's law v = √(2gh) from Bernoulli's equation, horizontal projectile motion (fall time √(2y/g), range 2√(hy)): standard school physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "Densities are rounded general values (water 1,000, sea water 1,030, cooking oil 920, mercury 13,600 kg/m³). The bottle, hole heights and drain rate are made-up teaching values."
  - "Checked by tests against hand-worked examples, the energy balance ρgh = ½ρv², and a step-by-step simulation of each jet's fall that does not use the range formula."
flow:
  - { icon: flask, label: "Fill it" }
  - { icon: sliders, label: "Stand" }
  - { icon: eye, label: "Jets" }
  - { icon: calculator, label: "ρgh" }
---

## What it does

Poke three holes down a plastic bottle, fill it with water, and the lowest jet squirts hardest. Pressure in a liquid grows with **depth**: the more liquid above a hole, the harder it pushes water out.

This page shows a 30 cm bottle with holes 5, 15 and 25 cm from the bottom. Drag the water level, let it drain, stand it on a box, or change the liquid. For each hole it shows the depth, the pressure there and where the jet lands. At **Class 11** it adds each jet's speed from **Torricelli's law**, v = √(2gh).

It follows Class 8 Science, pressure, winds, storms and cyclones (liquids press on their container, more so deeper down), and Class 11 Physics, fluids (P = ρgh, speed of efflux). Before this, [[pressure-explorer]] shows what pressure is; next, [[barometer-altitude]] does the same for the air above us.

## How to use it

1. Choose a **Level**. Class 11 adds speeds and full working.
2. Drag the **water surface** or use the **Water level** slider. Holes above the water give no jet.
3. Untick **Keep it topped up** to let it drain. **Fill to the top** refills.
4. Raise the bottle on a **stand** so jets fall further before landing.
5. Pick a **liquid**: water, sea water, cooking oil or mercury.

## Worked example

Full bottle on the floor. The bottom hole is 25 cm deep, so P = 1,000 × 9.8 × 0.25 = **2,450 Pa**; the top hole has only 490 Pa.

At Class 11 the bottom jet leaves at v = √(2 × 9.8 × 0.25) = **2.21 m/s**, the fastest. Yet it lands **22.4 cm** away, while the middle jet lands **30 cm** away, because the bottom jet is only 5 cm above the floor and falls in 0.10 s. On a **60 cm stand** the jets land 80.6, 67.1 and 41.2 cm away, and the bottom jet wins.

## FAQ

**Does the jet speed change with the liquid?** No. ρgh = ½ρv² gives v = √(2gh) for any liquid. The pressure does change: mercury's is 13.6 times water's.

**Does the container's shape matter?** No. Pressure depends on depth, and acts sideways as well as down.

**Is anything stored?** No. Everything runs in your browser.
