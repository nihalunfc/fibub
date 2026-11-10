---
title: "Dimensionless numbers in fluid flow: Reynolds, Mach, Prandtl and more"
summary: "What Reynolds, Mach, Froude, Weber, Prandtl, Rayleigh, Strouhal and Knudsen numbers measure, how to work them out from one set of inputs, and what each says about a flow."
tools: [dimensionless-numbers, buckingham-pi, boundary-layer, manning-weir-calculator]
updated: 2026-11-10
sources:
  - "Definitions of the dimensionless groups of fluid mechanics and heat transfer, and the rough regime limits used as guides (pipe Re near 2300 and 4000, Mach 0.3, Strouhal near 0.2 for vortex shedding, Knudsen 0.01, 0.1 and 10): standard textbook results."
  - "Air properties near 20 °C and 1 atm are rounded general values, as filled in by the tool."
---

A dimensionless number is a ratio of two effects in a flow, such as inertia against stickiness, or speed against the speed of sound. Its size tells you which effect wins, whatever units you started in. The [[dimensionless-numbers]] tool takes a fluid, a speed and a length and works out up to fourteen of these numbers at once, each with a one-line note on the kind of flow it points to. It suits engineering and physics students, lab experimenters sizing a rig, and anyone scaling a model to the real thing. To find which groups a new problem needs, start with [[buckingham-pi]]; for the thin layer along a surface, carry the Reynolds number on to the [[boundary-layer]] tool.

## What it is

Two flows behave alike when their dimensionless numbers match. A model in a wind tunnel tells you about a full-size car only because both share the same key ratios. That is why engineers talk in these numbers rather than in metres and seconds.

The symbols below are: ρ density (kg/m³), μ viscosity (Pa·s), U speed (m/s), L the length that sets the flow (m), c speed of sound (m/s), g gravity (9.81 m/s²), σ surface tension (N/m), cₚ heat capacity (J/kg·K), k thermal conductivity (W/m·K), β expansion coefficient (1/K), ΔT a temperature difference (K) and f a frequency (Hz).

- **Reynolds, Re = ρUL ÷ μ.** Inertia against viscous drag. Low means smooth, layered (laminar) flow; high means churning (turbulent) flow.
- **Mach, Ma = U ÷ c.** Below about 0.3, density barely changes, so the flow counts as incompressible.
- **Froude, Fr = U ÷ √(gL).** Flow speed against the speed of surface waves. It matters for rivers, channels and ships.
- **Weber, capillary, Bond and Ohnesorge.** Surface tension against inertia, viscosity or gravity. They decide whether drops hold together or break up.
- **Prandtl, Pr = cₚμ ÷ k,** and **Péclet, Pe = Re × Pr.** How quickly heat spreads compared with motion, and whether the flow or plain conduction carries the heat.
- **Grashof, Rayleigh and Richardson.** Buoyancy from warm fluid rising. Richardson compares it with the forced flow.
- **Strouhal, St = fL ÷ U.** How fast something repeats compared with the time the flow takes to pass. Shedding vortices behind a cylinder sit near 0.2.
- **Knudsen, Kn = λ ÷ L.** The distance a gas molecule travels between collisions (its **mean free path** λ) against the size of the gap. Above about 0.01, the gas no longer acts as a smooth fluid.

## How to use it

1. Choose a **fluid**: water, air, sea water, a light oil, glycerol or your own. Open **Fluid properties** to see or change the rounded values; editing any of them switches the fluid to "My own fluid".
2. Choose the **shape**: a pipe, a flat plate, a cylinder, a sphere or drop, an open channel or anything else. The label on the length box changes to say which length to give.
3. Type the **speed U** and the **length L**, each with its unit box (m/s, km/h, knots or ft/s; m, cm, mm, µm or ft).
4. Add a **temperature difference ΔT** for the buoyancy numbers and a **frequency f** for the Strouhal number, or leave them blank.
5. For a gas, give the molar mass in the properties box (air already has one). Two more boxes, **gas pressure** and **gas temperature**, then appear and the Knudsen number joins the list.
6. Read each number with its note, and the strip that marks your Reynolds number on that shape's regime scale. Download the table as CSV, or a report as PNG, PDF or Word.

## A worked example

Air at 20 °C blows at **5 m/s** across a wire of **2 cm** diameter. A sensor picks up a flutter at **50 Hz**, and the wire is **20 K** warmer than the air. Choose Air, **Across a cylinder**, U = 5 m/s, L = 2 cm, ΔT = 20, f = 50. The tool's air values are ρ = 1.204 kg/m³, μ = 1.81 × 10⁻⁵ Pa·s, c = 343 m/s, cₚ = 1005 J/kg·K and k = 0.0257 W/m·K.

- **Re** = 1.204 × 5 × 0.02 ÷ 0.0000181 ≈ **6,650**: a Kármán vortex street, where vortices peel off each side in turn.
- **Ma** = 5 ÷ 343 ≈ **0.0146**: incompressible.
- **Pr** = 1005 × 0.0000181 ÷ 0.0257 ≈ **0.708**, typical of gases; **Pe** ≈ 6,650 × 0.708 ≈ **4,710**, so the flow carries the heat.
- **Gr** ≈ **2.37 × 10⁴**, **Ra** ≈ **1.68 × 10⁴**, but **Ri** = Gr ÷ Re² ≈ **0.000535**: buoyancy is negligible next to the wind.
- **St** = 50 × 0.02 ÷ 5 = **0.2**: the flutter is the wire shedding vortices.
- **Kn**: at 101.325 kPa and 20 °C the mean free path is about 65 nm, so Kn ≈ **3.2 × 10⁻⁶**. That is continuum flow. Shrink L to 1 µm (and pick Anything else) and Kn rises to about 0.065, which is slip flow.

Air has no surface tension in the tool, so Weber, capillary, Bond and Ohnesorge are left out here.

## Where it is used

- **Wind tunnel and towing tank tests.** Matching Re or Fr between model and full size makes the test meaningful.
- **Pipe and duct design.** Re says whether the friction formula for laminar or turbulent flow applies.
- **Heat exchangers and electronics cooling.** Pr, Gr and Ri decide whether a fan is needed or natural convection will do.
- **Inkjet printing and sprays.** Weber and Ohnesorge set whether jets form clean drops or a messy spray.
- **Microfluidics and vacuum systems.** Kn tells you when the usual flow equations stop working.

## Common mistakes

- **Using the wrong length.** Pipes use the inside diameter, plates the distance from the front edge. The tool's regime limits assume these.
- **Taking 20 °C properties for hot or cold fluids.** Viscosity changes a lot with temperature. Edit μ to match your conditions.
- **Treating limits as sharp lines.** A pipe can stay laminar well past 2,300 if it is very smooth and quiet. The notes are guides.
- **Mixing up units.** Check the unit boxes; 5 cm typed with "m" selected is a pipe 100 times bigger.

## Questions people ask

**Why are there so many numbers?** Each pair of effects gets its own ratio. Most problems need only two or three; the rest are there so you can see at a glance which ones matter.

**Do the numbers change if I switch to feet?** No. The tool converts first, and a ratio has no units, so the values stay the same.

**What does a negative ΔT do?** The buoyancy numbers use its size, so a colder surface gives the same Grashof number as an equally warmer one.
