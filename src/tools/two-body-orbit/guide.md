---
name: Two-body orbit sandbox
num: 903
shelf: science
section: classical-mechanics
title: "Two-body orbit simulator: masses and velocities to an animated orbit, period, eccentricity, energy and angular momentum"
summary: "Give two bodies a mass, a starting position and a velocity and watch them orbit their centre of mass. Get the shape, eccentricity, semi-major axis, closest and farthest approach and period, with an independent numerical check that energy and angular momentum are conserved."
status: live
ads: true
order: 3
icon: orbit
works: offline
updated: 2026-11-09
related: [projectile-drag, orbit-transfer-calculator, rocket-equation, exoplanet-mass-calculator, radial-velocity-fitter]
sources:
  - "Two-body problem, reduced mass, orbital energy, angular momentum, eccentricity vector and Kepler's third law: standard classical mechanics."
  - "Universal-variable Kepler solution with Stumpff functions: as set out in Curtis, H. D., Orbital Mechanics for Engineering Students, chapter 3 (method only, own code)."
  - "GM of the Sun 1.32712440018 × 10²⁰ m³/s² and of the Earth 3.986004418 × 10¹⁴ m³/s² (IAU and IERS standard values); 1 AU = 149,597,870,700 m (IAU 2012)."
  - "Checked against an independent SciPy DOP853 integration (relative tolerance 10⁻¹³) of both bodies for an almost circular, an eccentric and a hyperbolic case, and against closed-form circle, parabola and period results. The presets are rounded or made up."
flow:
  - { icon: sliders, label: "Bodies" }
  - { icon: orbit, label: "Orbit" }
  - { icon: calculator, label: "Elements" }
  - { icon: check, label: "Checks" }
---

## What it does

Two bodies pulling on each other by gravity, and nothing else, is the one orbit problem with an exact answer. Both bodies circle their shared **centre of mass**, each tracing the same shape (a circle, an ellipse, a parabola or a hyperbola) scaled by the other body's share of the mass. This sandbox lets you set up any two bodies in a plane and see what they do.

You give each body a **mass**, a **starting position** and a **velocity**. The page shows the orbit **animated** around the centre of mass and works out the **shape** and **eccentricity**, the **semi-major axis**, the **closest and farthest separation**, the **period** (Kepler's third law), the escape speed, and the orbital **energy** and **angular momentum**.

## How it checks itself

The motion on screen comes from the exact Kepler solution, written with "universal variables" so the same formula works for bound and unbound orbits. As an independent check, the page also integrates both bodies step by step with Newton's law of gravity and fourth-order Runge-Kutta, using smaller steps near close approach. The **Checks** box reports how well that integration keeps the total **energy** and **angular momentum** constant, and how far its final positions are from the exact solution. When both are tiny, you can trust the numbers; very close fly-bys show larger drift, which is a property of the integration, not of the exact answer.

## How to use it

1. Pick a **preset** or type your own numbers (the list switches to Custom).
2. Pick the **units**: star scale (Sun masses, AU, km/s, days) or planet scale (Earth masses, km, km/s, hours).
3. For each body, type its **mass**, starting **x and y**, and velocity **vx and vy**.
4. **Pause**, **Play** and the **speed** slider control the animation; one orbit (or the fly-by) takes about eight seconds at speed 1.

## Worked example

Choose the made-up **eccentric binary star**: a 1 M☉ star at rest at the origin and a 0.5 M☉ companion 1 AU away moving sideways at 20 km/s. The escape speed there is 51.59 km/s, so they stay bound. The page shows an **ellipse with e = 0.699**, semi-major axis **0.5884 AU**, closest approach **0.1769 AU**, farthest 1 AU, and a period of **134.6 days**. The heavier star swings around 0.333 of the separation from the centre of mass, the lighter one 0.667. The integration check keeps energy to about 10⁻¹² and the two methods agree. Switch to the **Sun and an Earth-like planet** and the period becomes **365.1 days** with e = 0.000318: almost a circle.

## Tips

- Give a body exactly the escape speed √(2G(m₁+m₂)/r), sideways, to get a parabola; any faster is a hyperbola.
- The sideways (tangential) part of the relative velocity sets the angular momentum; with none, the bodies would fall straight together, which the page refuses.
- Moving both bodies by the same velocity changes nothing in the picture: it only moves the centre of mass, which is reported.

## FAQ

**Why does the heavier body move too?** Newton's third law: the pull is equal and opposite, so both accelerate. The heavy one moves less, in proportion to the mass ratio.

**Can I add a third body?** Not here. Three bodies have no general exact solution and can be chaotic; this tool keeps to the exactly solvable case.

**Are the presets real?** The Sun and Earth-like and Earth and Moon-like presets use rounded values; the binaries and the fly-by are made up. It is for study and planning, not a substitute for professional judgement.
