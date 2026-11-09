---
name: Potential flow builder
num: 959
shelf: science
section: fluid-dynamics
title: "Potential flow builder: combine uniform flow, sources, sinks, vortices and doublets and see the streamlines"
summary: "Build an ideal 2D flow from a uniform stream, sources, sinks, vortices and doublets, tap to add them, and see the streamlines, stagnation points, the speed everywhere, the velocity and pressure at any point, and the lift and drag from Blasius's theorem."
status: live
ads: true
order: 4
icon: curve
works: offline
updated: 2026-11-09
related: [airfoil-calculator, lattice-boltzmann, dimensionless-numbers]
sources:
  - "Elementary potential flows, superposition, Rankine bodies, flow past a (spinning) cylinder, Blasius's theorem and the Kutta-Joukowski theorem: standard results, for example Anderson, J. D., Fundamentals of Aerodynamics, chapter 3, and Milne-Thomson, L. M., Theoretical Hydrodynamics."
  - "Checked against SymPy: exact stagnation points (roots of dW/dz) for the presets and the Blasius force from the residue of (dW/dz)²."
  - "Preset strengths and positions are made-up round numbers."
flow:
  - { icon: sliders, label: "Elements" }
  - { icon: pointer, label: "Place" }
  - { icon: curve, label: "Streamlines" }
  - { icon: target, label: "Forces" }
---

## What it does

In an ideal fluid (no viscosity, no compression) flows add up: the flow round a cylinder is just a uniform stream plus a **doublet**, a spinning cylinder adds a **vortex**, and a **source** in a stream makes the nose of a long body. This page lets you build such flows and see them at once. Streamlines are drawn as contours of the stream function ψ, the heavy line is the dividing streamline ψ = 0 (in the presets, the surface of the body), red dots mark **stagnation points** where the fluid stops, and the shading shows the speed.

## How to use it

1. Pick a **preset**: flow past a cylinder, a spinning cylinder with lift, a Rankine half-body, a Rankine oval, a source-sink pair or a vortex pair.
2. Set the **uniform flow** speed and direction (0° is left to right), or 0 for none.
3. Edit each element's **strength** and **position** in the list, remove it, or **add** more. Choose what **tapping the picture** does: add a source, sink, vortex or doublet there, or **measure** the velocity, stream function, potential and pressure coefficient at that point.
4. Read the **force** on the elements, worked out with Blasius's theorem round a circle that encloses them all.

## Worked example

The page opens on a 1 m/s stream past a doublet of strength κ = 2π m³/s, which makes a cylinder of radius 1 m. There are **2 stagnation points: (−1, 0), (1, 0)**, the front and back of the cylinder, and the force is zero in both directions: d'Alembert's paradox, an ideal fluid exerts no drag on a closed body. Tap just above the cylinder, at about (0, 1.2), and the flow there is about 1.69 m/s with a pressure coefficient of about −1.87; on the surface itself, at (0, 1), the speed reaches 2U and Cp = −3. Choose the spinning cylinder: a clockwise vortex of 2π m²/s moves the stagnation points down to (−0.866, −0.5) and (0.866, −0.5), and the lift is ρUΓ = 7.7 N per metre of span for air at 1.225 kg/m³.

## Tips

- For a cylinder of radius a in a stream U, set the doublet strength to 2πUa².
- Increase the vortex strength on the spinning cylinder until Γ = 4πUa: the two stagnation points meet at the bottom, and beyond that one leaves the surface.
- Move the sink of the Rankine oval closer to the source and the body becomes rounder.

## FAQ

**Why is there no drag?** Ideal flow has no viscosity, so there is no boundary layer and no wake. Real bodies have drag; ideal flow is still a good guide to the pressure on the front of a body and to lift.

**What about the lines that end at a source?** The stream function of a source jumps behind it (a branch cut), and the page leaves out those grid cells so no false line is drawn.

**Is it for real design?** It is for study and planning, not a substitute for professional judgement.
