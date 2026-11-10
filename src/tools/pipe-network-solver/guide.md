---
name: Pipe network
num: 660
shelf: science
section: thermal-and-fluid-engineering
title: "Pipe network"
summary: "Work out the head loss and pressure drop in a pipe with the Darcy-Weisbach equation, the Colebrook-White or Swamee-Jain friction factor and minor losses (K), or the flow a given head will push. Then solve a looped pipe network with reservoirs, tanks and demands by Newton's method or Hardy Cross, with flows, velocities, head losses and pressures at every node."
status: live
ads: true
order: 660
icon: calculator
works: offline
updated: 2026-11-09
related: [manning-weir-calculator, darcy-flow-calculator, uncertainty-calculator, pump-system-curve, steam-tables, hvac-room-load, dimensionless-numbers, unit-converter]
sources:
  - "Darcy-Weisbach equation, Colebrook-White (1939) friction factor and the Swamee and Jain (1976) explicit approximation: standard fluid mechanics, for example White, F. M., Fluid Mechanics, and Streeter and Wylie, Fluid Mechanics (equations only)."
  - "Hardy Cross (1936) method of balancing loop heads, and the global gradient (Newton) method of Todini and Pilati (1988), as described in hydraulics textbooks (methods only)."
  - "Water density and viscosity at a temperature: smooth general-purpose formulas (a Thiesen-type density fit and a Vogel-type viscosity fit), checked against the IAPWS-95 formulation in the Python iapws package."
  - "Roughness and K values in the hints are rounded, general figures chosen by fibub for a first estimate, not copied from any table. The example pipe and network are made up."
  - "Checked against an independent SciPy solver (fsolve on all the network equations at once) written for the tests."
flow:
  - { icon: ruler, label: "Pipes" }
  - { icon: sigma, label: "Friction" }
  - { icon: calculator, label: "Solve" }
  - { icon: table, label: "Pressures" }
---

## What it does

Water (or any liquid) loses energy as it rubs along a pipe wall and squeezes through bends, valves and fittings. This tool works that loss out two ways.

**Single pipe.** The Darcy-Weisbach equation gives the head loss

h = (f L / D + ΣK) × V² / 2g

where f is the friction factor, L the length, D the inside diameter, V the mean velocity and ΣK the sum of the minor-loss coefficients of the fittings. The friction factor comes from the **Colebrook-White** equation (solved exactly by iteration) or the **Swamee-Jain** formula, an explicit approximation within about 1 % of Colebrook. Laminar flow (Reynolds number below 2,000) uses f = 64/Re; between 2,000 and 4,000 the tool blends the two, because real flow there is unpredictable. You get the velocity, Reynolds number, friction factor, the friction and fitting losses, the pressure drop including any rise, the hydraulic power, and a system curve of head against flow. Or give the head you have and it finds the flow.

**Pipe network.** List the nodes (junctions, reservoirs and tanks) and the pipes joining them. The tool finds the flow in every pipe and the head and pressure at every junction, so that flow balances at each junction and head losses balance around each loop. Two solvers are offered: **Newton's method** on the node heads (the global gradient method used in modern network software, usually 5 to 10 iterations) and the classic **Hardy Cross** method, which corrects one loop at a time. They give the same answer.

Pick a pump that meets the network's flow and head with the [[pump-system-curve|pump and system curve tool]], and check the flow regime with the [[dimensionless-numbers|dimensionless numbers calculator]].

## How to use it

1. Choose the liquid: water at a temperature, or type the density and viscosity of another liquid (1 mPa·s = 1 cP).
2. For one pipe, give the flow in L/s, the length, the inside diameter in mm, the roughness ε in mm and ΣK. The "rise" is how much higher the outlet is than the inlet; it adds to the pressure drop but not to the friction loss.
3. For a network, type or paste the node and pipe lists (or open a CSV or Excel file). A node with a number in the head column is a reservoir or tank: its water level stays fixed. Every other node is a junction, with a demand that leaves the network there. Add x and y columns to get a sketch.
4. Read the tables. A pipe's direction shows which way the water really flows. Pressure head is head minus ground level; a negative value means the water cannot reach that node under pressure.

## Worked example

**One pipe:** 25 L/s of water at 20 °C through 250 m of 150 mm steel pipe (ε = 0.05 mm) with ΣK = 3.5, rising 5 m. The velocity is 1.41 m/s and the Reynolds number 211,500, so the flow is turbulent; Colebrook gives f = 0.01781. Friction loses 3.028 m and the fittings 0.357 m, a total head loss of **3.385 m**. With the 5 m rise the **pressure drop is 82.09 kPa**.

**Network (made up):** a reservoir R at 60 m feeds five junctions through two loops, and a tank T held at 52 m hangs off junction J5. The demands add up to 60 L/s. Newton's method settles in 8 iterations: **R supplies 66.27 L/s, and 6.265 L/s flows on into tank T**. Junction J1 sits at a head of 58.71 m, 38.71 m of pressure above the ground. Switch to Hardy Cross and the same flows come out after a few dozen loop corrections.

## Tips

- Keep velocities in water mains to roughly 0.5 to 2 m/s; faster wastes energy and risks water hammer.
- Roughness grows as pipes age and scale up. Try a larger ε to see the effect of old pipes.
- For a pump in the network, model its outlet as a reservoir at the pump's delivery head, or use the pump and system curve tool.

## FAQ

**Why Darcy-Weisbach and not Hazen-Williams?** Darcy-Weisbach works for any liquid, temperature and pipe size, and is the physically based formula. Hazen-Williams only suits water at ordinary temperatures.

**Can I trust the result for design?** It is for study and planning. The answer is only as good as the roughness, K values and demands you type; check important designs with a qualified engineer.

**What does "loops" count?** The independent loops plus one path between each extra reservoir: pipes minus junctions.
