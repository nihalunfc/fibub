---
name: Lattice Boltzmann wind tunnel
num: 957
shelf: science
section: fluid-dynamics
title: "Lattice Boltzmann wind tunnel: 2D flow past a cylinder, airfoil or your own drawing, with vortex shedding live"
summary: "A live 2D wind tunnel in the browser: pick a cylinder, square, plate or airfoil, or draw your own shape, set the Reynolds number and watch the wake form and shed a Kármán vortex street, with drag, lift and Strouhal number measured as it runs."
status: live
ads: true
order: 2
icon: curve
works: offline
updated: 2026-11-09
related: [dimensionless-numbers, wave-calculator, plot-maker]
sources:
  - "Lattice Boltzmann method (D2Q9, BGK collision, halfway bounce-back, Guo forcing): Krüger, T. et al. (2017), The Lattice Boltzmann Method: Principles and Practice (Springer). Momentum-exchange force: Ladd, A. J. C. (1994), Journal of Fluid Mechanics 271, 285 to 309."
  - "NACA 4-digit thickness formula: Jacobs, Ward and Pinkerton (1933), NACA Report 460 (public domain)."
  - "Checked against the exact Poiseuille profile in a forced channel and against an independent NumPy D2Q9 code written for the tests (forces equal step by step)."
flow:
  - { icon: pencil, label: "Shape" }
  - { icon: sliders, label: "Reynolds" }
  - { icon: curve, label: "Wake" }
  - { icon: chart, label: "Forces" }
---

## What it does

This is a small computational wind tunnel. Instead of solving the Navier-Stokes equations directly, the **lattice Boltzmann method** moves packets of "fluid particles" between the cells of a grid along nine directions and lets them collide. Averaged over a cell, the result behaves like a real viscous fluid, and the method is simple enough to run live in a browser.

Fluid enters from the left. Put a body in the stream and watch: at low Reynolds numbers the flow wraps smoothly round it; above about 47 for a cylinder the wake starts to swing and sheds a **Kármán vortex street**, alternating swirls that make flags flutter and power lines hum. The page measures the **drag** and **lift** forces on the body and, once it sheds, the **Strouhal number**, the shedding frequency in dimensionless form.

## How to use it

1. Choose a **body**: cylinder, square, flat plate, NACA 0012 airfoil, or nothing.
2. Set its **size** in grid cells and, for the plate and airfoil, the **angle of attack**.
3. Set the **Reynolds number**. The page picks the viscosity to match it. Very high values need a finer grid or a bigger body, or the simulation becomes unstable (the page says so).
4. **Draw** on the tunnel with a finger or mouse to add walls, **Erase** to remove them, or **Off** to scroll the page past it on a phone.
5. **Show** vorticity (how the fluid spins: blue one way, red the other), speed, or pressure.
6. Leave it running until at least 50 body heights of flow have passed, then read the averages, download the drag and lift history, or save a report.

## Worked example

The page opens on a cylinder 20 cells across at **Re = 100** in a 300 × 120 grid. The wake starts to wobble after a few thousand steps and settles into a regular vortex street. By step 10000 to 12000 the page shows a drag coefficient of about **1.78** and a Strouhal number of about **0.196** (the exact values drift a little as the averages settle). Free-stream measurements give Cd ≈ 1.35 and St ≈ 0.165 at this Reynolds number; this tunnel is narrow (the cylinder fills a sixth of its height) and its edges hold the inflow speed, which raises both, as in a real blocked wind tunnel. Run offline in a taller 640 × 200 tunnel (8 % blockage), the same code gives St 0.172 and Cd 1.52, closer to the free-stream values.

## Tips

- Try Re = 20 to see the two steady eddies behind the cylinder, then Re = 200 for a livelier street.
- Tilt the airfoil to 8° and watch the lift coefficient turn positive; push it to 20° and the flow separates.
- Draw a second cylinder downstream of the first to see wake interference.

## FAQ

**Is this real CFD?** It is a genuine, if basic, solver. It checks out against the exact solution for flow in a channel, but it is two-dimensional, laminar and coarse: a teaching model, not a substitute for professional judgement or a validated CFD code.

**Why does it slow down on my phone?** Every cell is updated nine times per step. Use the 200 × 80 grid on slower devices.

**Does anything get uploaded?** No. Everything runs in your browser.
