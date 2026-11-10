---
name: Liquid pressure with depth
num: 1221
shelf: learn
section: school-physics
title: "Liquid pressure and depth: a bottle with three holes, why the lowest jet squirts hardest, P = ρgh and Torricelli"
summary: "A bottle of water with holes at three heights. See the lowest jet squirt hardest, read the pressure at each hole, let the bottle drain, raise it on a stand, and at Class 11 work out each jet's speed and where it lands."
status: live
ads: false
order: 1221
icon: flask
works: offline
updated: 2026-11-09
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

Poke three holes down the side of a plastic bottle, fill it with water and the jets come out differently: the lowest one squirts hardest. That is because the pressure in a liquid grows with **depth**. The deeper the hole, the more liquid there is above it pressing down, so the harder it pushes water out.

This page shows a 30 cm bottle with holes 5, 15 and 25 cm from its bottom. You can drag the water level, let the bottle drain, stand it on a box, and change the liquid. For each hole it shows the depth, the pressure of the liquid there, and how far from the bottle the jet lands. At **Class 11** it adds each jet's speed from **Torricelli's law**, v = √(2gh), and the time it takes to fall to the floor.

It follows the school topic on pressure: Class 8 Science, pressure, winds, storms and cyclones (liquids press on the walls of their container, and more so the deeper you go), and Class 11 Physics, mechanical properties of fluids (pressure P = ρgh, Bernoulli's principle and the speed of efflux). Before this, [[pressure-explorer]] shows what pressure is; next, [[barometer-altitude]] shows the same idea for the sea of air above us.

## How to use it

1. Choose a **Level**. Class 8 explains the jets in words with the pressures. Class 11 adds the speed column and the full working.
2. Drag the **water surface** in the bottle, or use the **Water level** slider. Holes above the water give no jet.
3. Untick **Keep it topped up** to let the bottle drain and watch the jets shrink. **Fill to the top** refills it.
4. Raise the bottle on a **stand**. The jets now have further to fall, so they travel further before they land.
5. Pick a **liquid**: water, salty sea water, cooking oil or mercury.
6. The tick marks on the floor show where each jet lands; the one that lands furthest is marked in green.

## Worked example

When the page opens, the bottle is full (30 cm) and stands on the floor. The bottom hole is 25 cm deep, so the water's pressure there is P = 1,000 × 9.8 × 0.25 = **2,450 Pa (2.45 kPa)**; the top hole, 5 cm deep, has only 490 Pa.

At Class 11, the bottom jet leaves at v = √(2 × 9.8 × 0.25) = **2.21 m/s**, the fastest of the three. Yet it lands **22.4 cm** away, while the middle jet lands **30 cm** away. The bottom jet starts only 5 cm above the floor, so it has just 0.10 s to travel. Put the bottle on a **60 cm stand** and the order changes: the jets land 80.6, 67.1 and 41.2 cm away, and now the bottom jet wins.

## Tips

- Pressure depends on depth, not on the shape or width of the container.
- A liquid presses in every direction at the same depth: sideways on the walls as well as down on the bottom.
- Dams, water tanks and submarines are made thicker or stronger lower down, where the pressure is biggest.

## FAQ

**Why does the jet speed not change with the liquid?** A denser liquid has more pressure pushing it out, but it is also heavier to speed up. The two cancel: ρgh = ½ρv² gives v = √(2gh) for any liquid. Its pressure does change: mercury's is 13.6 times water's.

**Is the lowest hole always the one that reaches furthest?** No. With the bottle on the floor, the hole halfway between the floor and the water surface reaches furthest. Raise the bottle high and the lowest hole wins, as most school pictures show.

**Is anything stored?** No. Everything runs in your browser and nothing is saved or sent.
