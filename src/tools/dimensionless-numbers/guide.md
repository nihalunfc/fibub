---
name: Dimensionless numbers calculator
num: 956
shelf: science
code: T691
section: fluid-dynamics
title: "Dimensionless numbers calculator: Reynolds, Mach, Froude, Weber, Prandtl, Rayleigh, Strouhal and Knudsen with regime notes"
summary: "Give a fluid, a speed and a length and get the Reynolds, Mach, Froude, Weber, capillary, Bond, Ohnesorge, Prandtl, Péclet, Grashof, Rayleigh, Richardson, Strouhal and Knudsen numbers, each with a plain note on what regime the flow is in."
status: live
ads: true
order: 1
icon: sigma
works: offline
updated: 2026-11-09
related: [manning-weir-calculator, darcy-flow-calculator, wave-calculator, uncertainty-calculator, lattice-boltzmann, boundary-layer, airfoil-calculator, buckingham-pi, pipe-network-solver]
sources:
  - "Definitions of the dimensionless groups: standard results, for example White, F. M., Fluid Mechanics, and Incropera et al., Fundamentals of Heat and Mass Transfer. Mean free path from viscosity: first-order kinetic theory, λ = (μ/p)√(πkT/2m)."
  - "Regime limits (pipe Re 2300 and 4000, plate 5 × 10⁵, cylinder shedding near 47, Rayleigh-Bénard 1708, Knudsen 0.01, 0.1 and 10, Mach 0.3, 0.8 and 1.2) are the usual rough textbook guides."
  - "Fluid properties are rounded, general values near 20 °C (water, air, sea water, glycerol; the light oil is a made-up typical value), editable on the page."
  - "Checked against an independent NumPy script using scipy.constants."
flow:
  - { icon: flask, label: "Fluid" }
  - { icon: ruler, label: "Size" }
  - { icon: sigma, label: "Numbers" }
  - { icon: check, label: "Regime" }
---

## What it does

Flows that look nothing alike behave the same when their **dimensionless numbers** match: that is why wind tunnels work with models and why honey and air can be compared. Each number is a ratio of two effects, and its size tells you which one wins. This page works out the common ones from one set of inputs and says in a line what each means here.

Find which groups matter for a new problem with the [[buckingham-pi]], and use the Reynolds number for a flat plate in the [[boundary-layer|boundary layer calculator]].

## How to use it

1. Pick a **fluid**. Its rounded properties near 20 °C fill in under **Fluid properties**; open that box to change them, or to describe your own fluid.
2. Pick the **shape**: the Reynolds number's regime limits depend on it (a pipe turns turbulent near 2300, a flat plate's boundary layer near 5 × 10⁵).
3. Give the **speed** and the **length** that sets the flow: the pipe diameter, the distance along the plate, the body's diameter or the water depth.
4. Optionally add a **temperature difference** (for natural convection: Grashof, Rayleigh and Richardson) and a **frequency** (for the Strouhal number).
5. For a gas, the molar mass, pressure and temperature give the **Knudsen** number, which says when the gas stops behaving like a continuum.

## The numbers

- **Reynolds** (inertia ÷ viscosity): laminar or turbulent.
- **Mach** (speed ÷ speed of sound): below 0.3 the flow can be treated as incompressible.
- **Froude** (speed ÷ surface wave speed): sub- or supercritical channel flow, ship waves.
- **Weber, capillary, Bond, Ohnesorge**: surface tension against inertia, viscosity and gravity: drops, bubbles, jets and inkjets.
- **Prandtl and Péclet**: how heat spreads compared with momentum, and whether the flow or conduction carries it.
- **Grashof, Rayleigh, Richardson**: buoyancy-driven flow and whether it beats the forced flow.
- **Strouhal**: unsteadiness; vortex shedding from a cylinder sits near 0.2.
- **Knudsen**: mean free path ÷ size; continuum, slip or free-molecular flow.

## Worked example

The page opens on water at 20 °C flowing at 1 m/s through a 5 cm pipe, with a 10 K temperature difference and a 4 Hz oscillation. **Re = 49900: turbulent pipe flow (above about 4000)**. The Mach number is 0.000676 (incompressible), Froude 1.428, Weber 685, Prandtl 6.990 and Péclet 348799. With ΔT = 10 K, Grashof is 2.56 × 10⁶ and Rayleigh 1.79 × 10⁷ (laminar natural convection), but Richardson is only 0.001030, so the forced flow wins. The 4 Hz oscillation gives Strouhal 0.2, typical of vortex shedding. Switch to air and a 1 µm gap and Knudsen is 0.0649: slip flow.

## Tips

- Use the same L the regime limits were written for: diameter for pipes, distance from the leading edge for plates.
- Viscosity changes a lot with temperature (water's halves between 20 °C and 50 °C); edit μ when you are far from 20 °C.
- For non-circular ducts, use the hydraulic diameter, 4 × area ÷ wetted perimeter.

## FAQ

**Why is my "laminar" flow turbulent?** The limits are typical values; quiet lab pipes stay laminar far above 2300, rough or disturbed flows go turbulent earlier.

**Where do the property values come from?** They are rounded, well-known values near 20 °C, given so the page works straight away. Use measured values for real work.

**Can I use it for design?** It is for study and planning, not a substitute for professional judgement.
