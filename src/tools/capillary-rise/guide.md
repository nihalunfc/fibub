---
name: Capillary rise
num: 1344
shelf: learn
section: school-physics
title: "Capillary rise calculator: how high water climbs in a thin tube, surface tension, contact angle and Jurin's law, with mercury falling"
summary: "Dip a glass tube in water, soapy water, alcohol or mercury and see the liquid climb (or sink) by h = 2T cos θ/(rρg). Change the tube's radius and watch h follow Jurin's law, see the meniscus curve, the pressure step under it, and what happens in a tube that is too short."
status: live
ads: false
order: 1344
icon: ruler
works: offline
updated: 2026-11-09
related: [stokes-terminal-velocity, buoyancy-lab, transpiration-lab, bernoulli-flow]
sources:
  - "Surface tension, the contact angle, the pressure step 2T/R across a curved surface and the capillary rise h = 2T cos θ/(rρg) (Jurin's law): standard school physics found in any textbook. g = 9.8 m/s²."
  - "Surface tensions, contact angles and densities are rounded, typical values near 20 °C (water 0.073 N/m, 0°; mercury 0.48 N/m, 140°), not data for any particular sample."
  - "Checked by hand (water in a 0.5 mm tube: 2.98 cm) and by the force balance: the column's weight equals the surface's upward pull 2πrT cos θ."
flow:
  - { icon: pointer, label: "Pick liquid" }
  - { icon: sliders, label: "Tube size" }
  - { icon: ruler, label: "Height" }
  - { icon: check, label: "Check" }
---

## What it does

Stand a thin glass tube in water and the water climbs up inside it, above the level outside. The thinner the tube, the higher it goes. This is **capillary rise**: the water clings to the glass, its surface curls up the wall, and **surface tension**, the pull along the skin of the liquid, lifts the column until its weight balances that pull. Mercury does the opposite: it does not wet glass, so its surface bulges upwards and it is pushed down.

This tool draws the beaker and the tube, the curved surface (the **meniscus**), and a graph of the rise against the tube's radius. It works out the height, the radius of the meniscus, the pressure step under it and the forces. Make the tube shorter than the rise and see why the water never spills over the top.

It follows the school topics on surface tension, the angle of contact and capillary rise (Class 11 Physics, mechanical properties of fluids), and links to water rising in plants (Class 11 Biology, transport in plants). To see how plants pull water up their stems see [[transpiration-lab]]; for the stickiness of liquids [[stokes-terminal-velocity]], and for the push of a liquid on things in it [[buoyancy-lab]].

## How to use it

1. Pick the **liquid**: water, soapy water, alcohol or mercury.
2. Drag the **tube radius**. The column and the dot on the graph move.
3. Set how far the **tube sticks out** above the liquid. If it is shorter than the rise, the liquid stops at the top.
4. Read the height, the meniscus radius, the pressure step and the forces under the picture.

## Worked example

Open the page: **water** (T = 0.073 N/m, contact angle 0°) in a tube of radius **0.5 mm**. The rise is h = 2 × 0.073 × cos 0° ÷ (0.0005 × 1000 × 9.8) = **2.98 cm**. The surface is half a sphere of radius **0.5 mm**, so the pressure just under it is 2 × 0.073 ÷ 0.0005 = **292 Pa** below the air, exactly ρ g h. The surface pulls up with 2π × 0.0005 × 0.073 = **0.229 mN**, the weight of the column.

Halve the radius to **0.25 mm** and the water climbs **5.96 cm**. Switch to soapy water and the rise in a 0.5 mm tube drops to **1.22 cm**. Make the tube stick out only 2 cm: the water stops at the top, and its surface flattens to a radius of 0.745 mm.

## Tips

- h × r is the same for one liquid: halve the radius, double the height.
- A greasy tube changes the contact angle and spoils the rise.
- Blotting paper, a towel and a candle wick all use capillary rise in their tiny gaps.

## FAQ

**Can I get a fountain from a short tube?** No. In a short tube the meniscus just becomes flatter, so its upward pull matches the shorter column. Nothing pushes the water out of the top.

**Why does mercury go down?** Its atoms pull on each other much more than on glass, so the contact angle is about 140° and cos θ is negative.

**Is anything stored?** No. It all runs in your browser.
