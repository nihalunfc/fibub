---
name: Lagrangian helper
num: 908
shelf: science
section: classical-mechanics
title: "Euler-Lagrange equation calculator: type T and V, get the equations of motion, momenta and energy"
summary: "Type the kinetic and potential energy of a system in your own coordinates and get the Lagrangian, the generalised momenta, every Euler-Lagrange equation (simplified, with sin² + cos² = 1), the accelerations or the mass-matrix form, the energy function, and a numerical run that checks energy conservation."
status: live
ads: true
order: 8
icon: sigma
works: offline
updated: 2026-11-09
related: [coupled-oscillators, pendulum-analyser, two-body-orbit, moment-of-inertia, uncertainty-calculator, symbolic-algebra, ode-solver, chaos-explorer]
sources:
  - "Lagrangian mechanics: L = T − V, the Euler-Lagrange equations d/dt(∂L/∂q′) − ∂L/∂q = 0, generalised momenta and the energy function h = Σ q′ ∂L/∂q′ − L. Standard results in any classical mechanics text."
  - "The symbolic differentiator, simplifier and Runge-Kutta integrator are written for this site in TypeScript (no outside algebra system)."
  - "Checked against SymPy's euler_equations for six systems (simple, cart, double, spring and shaken-pivot pendulums and a bead on a spinning hoop), evaluated at a test point, and against a SciPy solve_ivp run of the double pendulum."
  - "The preset parameter values are made up."
flow:
  - { icon: pencil, label: "T and V" }
  - { icon: sigma, label: "Derivatives" }
  - { icon: calculator, label: "Equations" }
  - { icon: chart, label: "Run it" }
---

## What it does

Lagrangian mechanics turns a mechanics problem into bookkeeping: write down the **kinetic energy T** and the **potential energy V** in whatever coordinates suit the system (angles, distances along a slope, a radius), form **L = T − V**, and the equations of motion follow from the **Euler-Lagrange equations**, one per coordinate:

d/dt (∂L/∂q′) − ∂L/∂q = 0.

The differentiation is mechanical but error-prone by hand, especially the total time derivative, which needs the chain rule through every coordinate and rate. This helper does it symbolically. It shows the **Lagrangian**, each **generalised momentum** ∂L/∂q′, each **∂L/∂q** and **d/dt(∂L/∂q′)**, and the **equation of motion**. For one coordinate it solves for the **acceleration**; for several it gives the **mass-matrix form** M(q) q″ = F. It also gives the **energy function** h and says whether it is conserved (it is when L has no explicit time in it).

A plain-text copy of everything is ready to paste into SymPy, a notebook or your notes, and a **numerical run** integrates the equations from any start so you can see the motion and check that energy is conserved.

Solve the equations for longer runs with the [[ode-solver|ODE solver]], and watch a double pendulum turn chaotic in the [[chaos-explorer]].

## How to use it

1. Pick a **preset** or choose Custom.
2. List the **coordinates**, separated by commas (theta, or x, theta).
3. Type **T** and **V**. Write a rate with a dash: theta' (or thetadot). Every other name is a constant; t is time. Juxtaposition multiplies ("1/2 m l^2 theta'^2").
4. Read the equations. Greek names show as letters. A rate is shown with a prime (θ′ for dθ/dt, θ″ for d²θ/dt², th₁′ for th1), except x, y and w, which get the usual dots (ẋ, ẍ).
5. Under **Try it with numbers**, give each constant a value, the starting value and rate of each coordinate, and a run time. The chart shows each coordinate against time; download the run as CSV.

## Worked example

For the **simple pendulum**, T = ½ m l² θ′² and V = −m g l cos θ. The page gives the momentum **l²·m·θ′**, the equation **l²·m·θ″ + g·l·m·sin(θ) = 0**, solved as **θ″ = −g·sin(θ)/l**, and the energy function l²·m·θ′²/2 − g·l·m·cos(θ), which is conserved. With m = 1, g = 9.81, l = 1 and a start at θ = 1 rad at rest, after 10 s the pendulum is at θ = −0.46325 with rate 2.6365, and the energy function is kept to about 1.4 × 10⁻¹¹. The **pendulum on a sliding cart** gives the coupled pair (M + m)ẍ + l·m·cos(θ)·θ″ − l·m·sin(θ)·θ′² = 0 and l·m·cos(θ)·ẍ + l²·m·θ″ + g·l·m·sin(θ) = 0 (shown term by term), with mass matrix [M + m, l·m·cos(θ); l·m·cos(θ), l²·m].

## Tips

- Build T from the velocity of each mass: for a mass at (x, y), T = ½ m (ẋ² + ẏ²). For example a pendulum bob at (l sin θ, −l cos θ) gives ½ m l² θ′² after sin² + cos² = 1, which the helper simplifies for you.
- A coordinate that does not appear in L (only its rate does) is **cyclic**: its momentum is conserved.
- If a run's energy drift is large, shorten the run or reduce violent starting values; the RK4 step is the run time ÷ 4,000.

## FAQ

**Can it handle forces that are not from a potential (friction, driving)?** Not directly. Time-dependent potentials and moving constraints are fine (see the shaken pivot), but friction needs generalised forces added by hand.

**Why are some terms not combined?** The simplifier expands products and combines like terms, and knows sin² + cos² = 1, but it is not a full computer algebra system. The equations are correct even when a tidier form exists. It is for study and planning, not a substitute for professional judgement.

**Which functions can I use?** sin, cos, tan, exp, ln, log, sqrt, sinh, cosh, tanh, asin, acos and atan, and whole or fractional number powers.
