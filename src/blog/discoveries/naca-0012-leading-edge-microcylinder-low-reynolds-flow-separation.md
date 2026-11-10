---
title: "Leading-edge microcylinders on a NACA 0012 airfoil at low Reynolds number"
summary: "A 2025 wind tunnel and PIV study found that a thin rod just ahead of a NACA 0012 airfoil reduces flow separation at 17°. Here is how to compare it with inviscid theory yourself."
tools: [airfoil-calculator, piv-lite, dimensionless-numbers]
updated: 2026-11-10
sources:
  - "Gnatowska, R. and Gajewska, K. (2025), The Effect of Microcylinder Shape on Enhancing the Aerodynamics of Airfoils at a Low Reynolds Number, Energies 18(1), 66, published 27 December 2024. Open access (CC BY). Details checked on the publisher's page, 2026-11-10."
  - "Thin airfoil theory (lift slope 2π per radian) and the vortex panel method: standard aerodynamics, for example Anderson, Fundamentals of Aerodynamics, chapters 4 and 4.10."
paper:
  title: "The Effect of Microcylinder Shape on Enhancing the Aerodynamics of Airfoils at a Low Reynolds Number"
  authors: "Gnatowska R, Gajewska K"
  journal: "Energies"
  year: 2025
  doi: "10.3390/en18010066"
  url: "https://www.mdpi.com/1996-1073/18/1/66"
  licence: "CC BY"
  reviewed: true
---

Small wind turbines, drones and fans work at low Reynolds numbers, where the air flowing over a blade is slow and the blade is small. There the flow peels off the surface early, the wing stalls, and lift collapses. A 2025 open-access study in *Energies* placed a tiny rod, a microcylinder only 1 % of the chord across, just ahead of the leading edge of a NACA 0012 airfoil in a wind tunnel, and found that at 17° it reduced the separated region the bare airfoil had. The [[airfoil-calculator]] gives the "perfect" inviscid lift for the same section, which makes it easy to see how much a real low-speed airfoil loses and what the rod is trying to win back.

## What they found

The test airfoil had a chord of 200 mm and ran at a Reynolds number of about 66,400. The authors compared microcylinders of three shapes: triangular, square and circular. At an angle of attack of 17°, where the plain airfoil had a large region of separated, swirling flow over its upper surface, the microcylinder cases showed less separation in the velocity maps. The circular rod gave the largest gain in streamwise velocity and the biggest drop in turbulent kinetic energy, although the authors note the triangle may be better at holding the flow attached in some setups.

The paper's text describes the lift coefficient as close to zero at 0° and about 1 at 20° (it is not fully clear whether that curve is for the plain airfoil or with a rod), and the lift-to-drag ratio peaked at about 6 to 8°. They report the improvement in pictures of the flow, not as a percentage gain in lift.

## Why it matters

At low Reynolds numbers the thin layer of air next to the surface, the boundary layer, is often laminar and easily pushed off the surface by rising pressure. A small object in front of the leading edge sheds a wake that stirs this layer, adding energy so it stays attached longer. That is cheap, passive flow control: no pumps, no moving parts. If it holds up across sizes and speeds, it could widen the useful angle range of small turbine blades and slow-flying aircraft.

## How they did it

The airfoil sat in a closed-circuit wind tunnel with a 0.3 × 0.3 m test section and an inlet turbulence of 0.5 % or less. A two-component balance measured lift and drag, repeated three times. Particle image velocimetry (PIV) mapped the flow: fine smoke or droplets are lit by a laser sheet, photographed twice in quick succession, and the shift of the particle pattern between the two frames gives the speed at each point. The team also ran the XFOIL panel code to compare.

## Check it yourself with fibub

The numbers below are **our own inputs**, chosen to match the paper's chord and roughly its Reynolds number. They are not the paper's measurements.

1. Open the [[airfoil-calculator]] and type the code **0012** (symmetric, 12 % thick).
2. Set the chord to **0.2** m and the air speed to **4.9** m/s. Keep the default sea-level air (1.225 kg/m³ and 1.81 × 10⁻⁵ Pa·s). Clear the aspect ratio box so you get a 2D section only.
3. Check the Reynolds number in the results: about **66,300**, close to the paper's value. You can cross-check ρVc/μ in the [[dimensionless-numbers]] tool.
4. Type an angle of **8°**. The panel method gives Cl of about **0.963** and thin airfoil theory about **0.877**. Lift per metre of span is about **2.83 N**, because the dynamic pressure is only about 14.7 Pa at this speed.
5. Now type **17°**. The panel method gives about **2.02**, thin airfoil theory about **1.86**. The paper's text puts the measured lift near 1 at 20°, so a real section at 17° makes roughly half of the inviscid lift.
6. Look at the drag line: about **0.0130**, a laminar skin-friction estimate at zero lift. It cannot show the steep rise in drag after separation.

That gap between step 5's inviscid value and the measured value is the stall. The calculator's methods have no viscosity, so they never stall: they show the lift the flow would give if it stayed attached. Read the pressure plot at 17° and you will see a very tall suction peak near the leading edge followed by a steep climb back towards the trailing edge. That climb is exactly what a slow laminar boundary layer cannot survive, and what the microcylinder's wake helps it get through.

If you have your own PIV image pairs, [[piv-lite]] turns two frames into a vector map, so you can look for the backflow region behind a leading edge yourself.

## The fine print

- **Blockage.** The model blocked up to 20 % of the tunnel, and no blockage correction was applied; the authors cite work saying the effect is small.
- **One size, one speed.** The main results use a single microcylinder size and one Reynolds number, so the best size is still open.
- **Pictures, not percentages.** The gain is shown mostly in flow maps; the force data are in figures, so read the paper for the measured curves.
- The calculator is inviscid and 2D. Use it to understand the attached-flow ideal, never as a prediction of stall or of low-Reynolds drag.
