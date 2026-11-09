---
name: Flat plate boundary layer calculator
num: 960
shelf: science
section: fluid-dynamics
title: "Flat plate boundary layer calculator: thickness, skin friction and drag, laminar and turbulent"
summary: "For flow along a smooth flat plate, get the Reynolds number, where the boundary layer turns turbulent, its thickness, displacement and momentum thickness, the local skin friction and wall shear stress, and the plate's drag, with the exact Blasius profile for laminar flow and the 1/7 power law for turbulent flow."
status: live
ads: true
order: 5
icon: ruler
works: offline
updated: 2026-11-09
related: [dimensionless-numbers, airfoil-calculator, lattice-boltzmann]
sources:
  - "Blasius, H. (1908), the laminar flat-plate solution, integrated on the page by shooting with RK4; turbulent 1/7 power law (0.37 x Re^−0.2, cf = 0.0592 Re^−0.2, CD = 0.074 Re^−0.2), Prandtl-Schlichting CD = 0.455/(log Re)^2.58 and the mixed-plate correction A/Re: Schlichting, H., Boundary-Layer Theory; White, F. M., Viscous Fluid Flow."
  - "Fluid properties are rounded general values near 20 °C (the light oil is a made-up typical value), editable on the page."
  - "Checked against SciPy solve_bvp and quad for the Blasius solution, and a NumPy script for the plate formulas."
flow:
  - { icon: flask, label: "Fluid" }
  - { icon: ruler, label: "Plate" }
  - { icon: curve, label: "Profile" }
  - { icon: chart, label: "Drag" }
---

## What it does

When a fluid flows along a surface, a thin **boundary layer** next to it is slowed by friction, from zero speed at the wall to the full stream speed a little way out. Near the front of a smooth plate the layer is **laminar**, smooth and thin; further back it turns **turbulent**, thicker and with much higher friction. This calculator works out the layer for a flat plate with no pressure gradient: how thick it is anywhere, how hard it rubs on the plate, where it turns turbulent and how much drag the whole plate feels.

The laminar part uses the exact **Blasius solution**, which the page computes itself; the turbulent part uses the classic **1/7 power law**.

## How to use it

1. Choose the **fluid**: rounded properties for air, water, sea water or a light oil fill in. Edit the density and kinematic viscosity for other temperatures.
2. Give the **free-stream speed**, the plate's **length** and **width**, and the **distance x** where you want the local values.
3. Choose whether the layer turns turbulent at the **transition Reynolds number** (5 × 10⁵ is usual), stays laminar, or is turbulent from the leading edge (a tripped, rough leading edge).
4. Pick the **turbulent drag law** and whether to count **both sides** of the plate.

## Worked example

The page opens on air at 20 °C flowing at 10 m/s along a 2 m by 1 m plate. The plate Reynolds number is 1.32 × 10⁶, and the layer turns turbulent **0.758 m** from the leading edge. At x = 1 m it is turbulent and **25.4 mm** thick, with a displacement thickness of 3.17 mm, a local skin friction coefficient of 0.00406 and a wall shear stress of 0.244 Pa. The plate's average drag coefficient is **0.003097** (the 0.074 Re^−0.2 law minus 1742/Re for the laminar start), so one side of the plate feels a drag of **0.373 N**. If the layer stayed laminar all the way, the drag would be 0.139 N, about a third as much.

## Tips

- The laminar layer grows like √x and the turbulent one like x^0.8: watch the thickness jump at transition in the chart.
- Kinematic viscosity is dynamic viscosity divided by density: water's is about 15 times smaller than air's, so water boundary layers are much thinner at the same speed.
- Use the turbulent-from-the-start option for ship hulls and rough surfaces.

## FAQ

**Why does the thickness jump at transition?** The simple model measures the turbulent layer from the leading edge. Real transition happens over a distance, and a better model would start the turbulent layer from a virtual origin.

**What about curved bodies?** Pressure gradients change the layer: falling pressure keeps it thin and laminar, rising pressure thickens it and can make it separate. This page is for flat plates only.

**Can I use it for design?** It gives standard textbook estimates for study and planning, not a substitute for professional judgement.
