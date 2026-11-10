---
name: Mean free path
num: 1350
shelf: learn
code: L212
section: school-physics
title: "Mean free path"
summary: "Watch molecules bounce in a box while one leaves a zig-zag trail, and measure the average flight between collisions as you crowd them or make them bigger. Then get the real mean free path, number of molecules, mean speed and collisions per second for air, helium or CO₂ from sea level to deep vacuum."
status: live
ads: false
order: 1350
icon: target
works: offline
updated: 2026-11-09
related: [kinetic-theory, equipartition, gas-law-calculator]
sources:
  - "Mean free path λ = kT / (√2 π d² p) = 1 / (√2 n π d²), number density n = p/kT, mean speed √(8kT/πm); flat (2-D) hard-disk version λ = 1 / (2√2 n d): standard kinetic theory."
  - "Boltzmann constant k = 1.380649×10⁻²³ J/K (exact, SI 2019); atomic mass unit 1.66053906660×10⁻²⁷ kg (CODATA 2018)."
  - "Molecular diameters (nitrogen 0.37 nm, oxygen 0.36, helium 0.22, argon 0.36, carbon dioxide 0.46 nm) are rounded typical values for teaching."
  - "Checked against an independent Python calculation, and the 2-D formula against a separate hard-disk simulation."
flow:
  - { icon: eye, label: "Watch" }
  - { icon: sliders, label: "Crowd them" }
  - { icon: ruler, label: "Measure λ" }
  - { icon: calculator, label: "Real gas" }
---

## What it does

Gas molecules are fast (hundreds of metres a second at room temperature), yet a smell takes seconds to cross a room. The reason is that each molecule keeps bumping into others and setting off in a new direction. The average distance it flies between two collisions is its **mean free path**, λ.

The top picture is a flat box of molecules bouncing off each other like billiard balls. One is marked and leaves a trail, so you can see its zig-zag. The page counts every collision and divides the total distance flown by the number of flights, so you watch λ being measured, and compares it with the formula. Crowd the box or make the molecules bigger and the flights get shorter.

The second card gives the real numbers for a gas: **λ = kT / (√2 π d² p)** filled in with your pressure, temperature and molecule size, plus the number of molecules in a cubic metre, their mean speed, and how many collisions each makes every second.

It serves Class 11 Physics, Kinetic Theory (mean free path, and the behaviour of gases), with links to Class 9 Science (particles of matter are moving and have spaces between them). Start with [[kinetic-theory]] for molecules hitting the walls to make pressure, and go on to [[equipartition]] for how molecules share their energy.

## How to use it

1. **How crowded** sets the number of molecules in the box (like raising the pressure). **Molecule size** sets their diameter. Changing either starts the box again.
2. **Pause** and **Start again** control the animation. The line under the box shows the collisions so far, the measured average flight and the formula value, in box widths.
3. In **The real numbers**, pick a pressure with the buttons (**Sea level**, **Top of Everest**, **Vacuum pump**, **Very high vacuum**) or the slider, which moves in powers of ten.
4. Set the **temperature** and choose the **gas**.

## Worked example

With the page as it opens: nitrogen (d = 0.37 nm, about 28 g/mol) at 101.325 kPa and 300 K.

λ = 1.381×10⁻²³ × 300 / (1.414 × π × (0.37×10⁻⁹)² × 101 325) = **67.2 nm**, about 180 times the molecule's own size. There are n = p/kT = **2.45×10²⁵ molecules per m³**, about 3.4 nm apart. They move at a mean speed of **476 m/s**, so each has about 476 / 67.2×10⁻⁹ = **7.09×10⁹ collisions per second**.

At a very high vacuum of 10⁻⁶ Pa the same molecules fly about **6.8 km** between collisions, far longer than any container: they hit the walls, not each other.

In the box, 60 molecules each 2 % of the box wide give a formula value of 0.177 box widths; the count settles close to that after a few hundred collisions.

## Check yourself

Five fresh questions: a mean free path, the number of molecules per cubic metre, what happens with more pressure, what happens with bigger molecules, and collisions per second. Answers are checked on the page and the working is shown. Nothing is saved.

## Tips

- λ goes as **1/p** and as **1/d²**: double the pressure, half the path; double the diameter, a quarter of the path.
- At fixed pressure λ grows with T, because the same pressure at a higher temperature means fewer molecules per cubic metre.
- The √2 comes from the other molecules moving too: the average speed of one molecule relative to another is √2 times the mean speed.

## FAQ

**Why is the measured value in the box a bit shorter than the formula when it is crowded?** The formula assumes the molecules take up a tiny share of the space. In a crowded box their own size matters, so flights are shorter. Real air at normal pressure is far emptier than the box.

**Why does the flat box use a different formula?** In a flat world a molecule sweeps out a strip of width 2d, not a tube of cross-section πd², so λ = 1 / (2√2 n d), with n counted per unit area.

**Where does mean free path matter?** Vacuum pumps, light bulbs, particle accelerators and the upper atmosphere: once λ is longer than the container, a gas stops behaving like a fluid.
