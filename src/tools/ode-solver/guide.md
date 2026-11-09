---
name: ODE solver with phase portraits
num: 548
shelf: science
section: applied-mathematics
title: "ODE solver online: phase portrait, direction field, nullclines, equilibria, bifurcation diagram (RK4, RK45)"
summary: "Type a system of differential equations and solve it in your browser with RK4 or adaptive RK45 (as SciPy). Time plots, phase portrait with direction field and nullclines, equilibria with eigenvalues, a bifurcation diagram, and a heat and wave equation playground."
status: live
ads: true
order: 548
icon: curve
works: offline
updated: 2026-11-09
related: [plot-maker, period-finder, trend-analyser]
sources:
  - "Methods: Dormand and Prince (1980) RK5(4) pair with Shampine's (1986) dense output, step control as SciPy's solve_ivp RK45; classic RK4; explicit finite differences (FTCS, leapfrog). Example systems are textbook models with round, made-up parameter values."
flow:
  - { icon: pencil, label: "Equations" }
  - { icon: sliders, label: "Start values" }
  - { icon: curve, label: "Solve" }
  - { icon: target, label: "Equilibria" }
---

## What it does

Type a system of ordinary differential equations (ODEs), one per line, and this tool solves it in your browser. You get:

- **A time plot** of every variable, and the solution as a CSV file.
- **A phase portrait**: one variable against another, with a **direction field** (little arrows showing where the system is heading from each point) and the **nullclines** (curves where one variable stops changing). Tap the picture to start another path from any point.
- **Equilibria** (points where nothing changes), found by Newton's method, with the **eigenvalues of the Jacobian** and what they mean: stable or unstable node, spiral, saddle or centre.
- **A bifurcation diagram**: sweep a parameter and see where the behaviour changes, for example where a resting state starts to oscillate.
- **A heat and wave equation playground**: the 1D diffusion and wave equations solved by explicit finite differences, with the stability limit shown, so you can watch a too-large time step blow up.

## How to use it

1. Pick an example, or type your own. Write equations as `x' = y` or `dx/dt = y`, and parameters as `mu = 1`. You may use `t`, `pi`, brackets and functions such as `sin`, `exp`, `ln` and `sqrt`.
2. Set the start value of each variable, and the start and end time.
3. Choose the method. **Adaptive RK45** (Dormand-Prince) picks its own step size to keep each step's estimated error below the tolerance; it takes exactly the same steps as SciPy's `solve_ivp` with `method="RK45"`. **RK4** uses equal steps you choose.
4. Below the time plot, choose which variables go across and up in the phase portrait. Leave the window on "auto" or type the range.
5. To draw a bifurcation diagram, pick a parameter and its range and press **Draw the diagram**.

## Worked example

The default is the Van der Pol oscillator, x' = y, y' = μ(1 − x²)y − x with μ = 1, starting at x = 2, y = 0. With tolerance 10⁻⁶ the solver takes 262 steps (and rejects 92 that were too large) to reach t = 30, where x = −2.00791 and y = 0.0519762. The path settles on a closed loop, a **limit cycle**, whose largest x is about 2.01. The only equilibrium is the origin. Its Jacobian has eigenvalues 0.5 ± 0.866i, so it is an **unstable spiral**: paths spiral out of it onto the loop. Sweep μ from −1 to 3 and the diagram shows the origin is stable for μ < 0 and that a swing of size about 2 appears for μ > 0, a **Hopf bifurcation** at μ = 0.

In the heat equation playground, with D = 0.1, 51 grid points (Δx = 0.02) and Δt = 0.001, the number r = DΔt/Δx² is 0.25, below the limit of ½, so the scheme is stable. The middle of the bar falls from 1 to 0.61045 at t = 0.5; the exact answer is e^(−0.05π²) = 0.61050. Change Δt to 0.0025 (r = 0.625) and the numbers blow up.

## How the maths was checked

RK45 was compared with SciPy 1.18.1: for the Van der Pol example at SciPy's default tolerance, both take 52 steps and 434 evaluations and agree to 10⁻¹¹; dense output at chosen times agrees to 10⁻¹³. The Lorenz system agrees with SciPy's DOP853 at tight tolerance. Eigenvalues were compared with NumPy, and the heat and wave schemes with the same schemes written in NumPy and with exact solutions.

## Good to know

- **Stiff equations** (very fast and very slow parts together, as in some chemistry) need tiny steps with these explicit methods. The tool stops after 200,000 steps and says so. It has no implicit (stiff) solver.
- A **centre** found by the linear test may really be a slow spiral: the nonlinear terms decide.
- The bifurcation diagram follows one path: it can miss branches you never visit. It does not do numerical continuation of unstable cycles.
- For the heat equation the explicit scheme needs r = DΔt/Δx² ≤ ½; for the wave equation the Courant number cΔt/Δx must be ≤ 1. Halving Δx means a four times smaller step for heat.

## Frequently asked questions

**Is anything uploaded?** No. All the solving happens in your browser, and nothing is stored.

**How do I solve a second-order equation?** Write it as two first-order ones: for x'' = −x, use x' = v and v' = −x.

**Why does the direction field ignore t?** If your equations depend on time, the arrows show the directions at the start time only.

**What is the CSV?** 1001 evenly spaced times (RK45, from its dense output) or every step (RK4), one column per variable.
