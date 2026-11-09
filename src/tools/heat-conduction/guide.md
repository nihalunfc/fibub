---
name: Heat conduction solver
num: 920
shelf: science
section: thermodynamics-and-statistical-physics
title: "Heat conduction calculator: wall U-value, transient slab, 2D plate, fin efficiency and pipe insulation thickness"
summary: "Five conduction problems in one place: steady heat flow and U-value through a layered wall, a slab heating or cooling over time (with the exact series to compare), heat spreading across a 2D plate, fin heat and efficiency, and heat loss and insulation thickness for a pipe."
status: live
ads: true
order: 5
icon: ruler
works: offline
updated: 2026-11-09
related: [heat-engine-cycles, psychrometric-calculator, heat-exchanger-sizing, diffusion-calculator, random-walk-diffusion, thermal-mismatch-stress, hvac-room-load, numerical-methods]
sources:
  - "Conduction, fin and thermal-resistance formulas, the plane-wall series solution and the critical radius of insulation: standard results, for example Incropera, F. P. et al., Fundamentals of Heat and Mass Transfer; Carslaw, H. S. and Jaeger, J. C., Conduction of Heat in Solids."
  - "Numerical methods: Crank-Nicolson (1947) with two backward-Euler start-up steps; Peaceman-Rachford ADI (1955) for the 2D plate."
  - "Material conductivities, densities and specific heats: rounded general values, editable on the page. Film coefficients 7.7 and 25 W/m²·K are common round figures."
  - "Checked against independent SciPy and mpmath work: walls and pipes by hand, fins by solve_bvp, the slab by a fine method-of-lines BDF solution and the series, the 2D plate by the Fourier series and a fine sparse finite-difference solve."
  - "The example wall, slab, plate, fin and pipe are made up."
flow:
  - { icon: sliders, label: "Problem" }
  - { icon: ruler, label: "Sizes" }
  - { icon: calculator, label: "Solve" }
  - { icon: chart, label: "Profile" }
---

## What it does

Heat flows from hot to cold through solids at a rate set by their **thermal conductivity** k. This solver handles five everyday conduction problems:

- **Wall**: steady heat flow through a flat wall of layers, with an air film on each face. Gives the **U-value**, the heat loss, each layer's share of the resistance and the temperature at every interface.
- **Slab in time**: a slab that starts at one temperature and is suddenly heated or cooled on its faces (by air or liquid with a film coefficient h, held at a temperature, or insulated). Solved with **Crank-Nicolson finite differences** and, where the problem allows, compared with the **exact series solution**.
- **2D plate**: a rectangle with its four edges held at set temperatures; heat spreads in over time (**ADI** method) or to the steady state, shown as a colour map. With one edge different, the steady centre is checked against the exact Fourier series.
- **Fin**: a pin or flat fin on a hot surface. Gives the heat shed, the **fin efficiency**, the **effectiveness** and the temperature along it.
- **Pipe**: heat lost from an insulated pipe, the surface temperature, the **critical radius** k/h, and the insulation thickness needed to keep the surface below a temperature.

Size a whole exchanger with the [[heat-exchanger-sizing|heat exchanger calculator]], and see the same maths for atoms in the [[diffusion-calculator]].

## How to use it

Choose the problem with the buttons. Pick materials from the lists (rounded values) or type your own k, density and specific heat. Lengths are in mm (cm for the plate), temperatures in °C. Every result can be downloaded as CSV, image, PDF or Word.

## Worked example

**Wall**: 12.5 mm plasterboard, 100 mm mineral wool and 100 mm brick, 20 °C inside and −5 °C outside, films 7.7 and 25 W/m²·K. The U-value is **0.3493 W/m²·K**, so 10 m² loses **87.33 W**. The wool supplies 87 % of the resistance; the temperature drops from 18.43 °C to −3.403 °C across it.

**Slab**: a 200 mm concrete slab at 80 °C cooled on both faces by 20 °C air (h = 10). After 120 minutes the middle is at **69.30 °C** and the faces at 55.89 °C. The exact series gives 69.30 °C for the middle too (a difference of 0.0005 °C).

**2D plate**: a 20 × 20 cm aluminium plate at 20 °C, its top edge suddenly at 100 °C. After 30 seconds the centre has reached 30.75 °C; at steady state it is exactly **40 °C**, as the Fourier series says.

**Fin**: an aluminium pin 5 mm across and 50 mm long on a 100 °C surface in 20 °C air (h = 25) sheds **1.485 W**, with an efficiency of 92.3 % and a tip at 90.75 °C.

**Pipe**: a 50/60 mm steel pipe carrying 150 °C fluid with 40 mm of mineral wool loses **35.99 W per metre** (0.8998 kW over 25 m), 85 % less than bare, and its surface is at 28.18 °C. To keep the surface below 40 °C you need at least 17.5 mm.

## Tips

- The **Biot number** h·L/k says whether the inside of a body keeps up with its surface: below 0.1 it heats almost uniformly.
- The **Fourier number** α·t/L² tells you how far into the slab heat has reached: around 0.2 the middle starts to respond.
- On small pipes and wires (outer radius below k/h) a thin layer of insulation can increase heat loss; the tool warns you.

## FAQ

**Are these good enough to design with?** They are textbook models for study and planning, not a substitute for professional judgement or building-code calculations, which include thermal bridges, moisture and standard film values.

**Why does the slab use 101 nodes and 2000 steps?** That keeps the error well under 0.01 °C for typical problems; the exact series (when shown) lets you check.
