---
name: Load flow for small networks
num: 674
shelf: science
section: energy-and-power-systems
title: "Load flow (power flow) calculator: Newton-Raphson and Gauss-Seidel for small power networks, in your browser"
summary: "Type or open bus and line tables, and solve the AC power flow in per unit by Newton-Raphson or Gauss-Seidel. Get every bus voltage and angle, line flows at both ends, losses and a single-line diagram. Nothing is uploaded."
status: live
ads: true
order: 674
icon: calculator
works: offline
updated: 2026-11-09
related: []
sources:
  - "Own code: bus admittance matrix, polar Newton-Raphson with the full Jacobian, and Gauss-Seidel with acceleration, as set out in standard power system analysis textbooks (general engineering methods)."
  - "Checked against an independent NumPy Newton-Raphson written for this tool (complex admittance matrix, MATPOWER-style dS/dV Jacobian) on the example and on random networks: voltages to 1e-7 pu, angles to 1e-5°, flows to 1e-4 MW."
  - "The 5-bus example network is made up for fibub; it is not an IEEE or textbook test case."
flow:
  - { icon: table, label: "Buses, lines" }
  - { icon: calculator, label: "Solve" }
  - { icon: chart, label: "Voltages" }
  - { icon: link, label: "Line flows" }
---

## What it does

A load flow (or power flow) finds the steady state of an AC power network: the voltage and angle at every bus, and the real and reactive power on every line, for a given pattern of generation and load. It is the first calculation in almost every power system study, from checking that voltages stay within limits to seeing which line is the most heavily loaded and how much power is lost as heat.

This tool solves it in **per unit** for small networks (up to 300 buses), entirely in your browser:

- builds the bus admittance matrix (Ybus) from the lines, with half the line charging at each end;
- solves by **Newton-Raphson** (polar form, full Jacobian, usually 3 to 6 iterations) or **Gauss-Seidel** (simpler, many more iterations, with an acceleration factor);
- shows every bus voltage and angle, the power each generator supplies, each line's flow at both ends, its losses and current, and the total losses;
- draws a **single-line diagram** with power-flow arrows and a convergence chart, and gives CSV, PNG, PDF and Word downloads.

For study and planning, not a substitute for professional judgement.

## How to use it

1. **Buses**, one per line: name, type, load P (MW), load Q (Mvar), generation P (MW), set voltage (pu). Commas, tabs or spaces all work, and a header row is skipped.
   - **slack**: exactly one. It holds its voltage at the set value and angle at 0°, and supplies whatever the rest of the network needs, including the losses.
   - **PV**: a generator bus that sends a set real power and holds a set voltage magnitude; the tool works out the reactive power it must give.
   - **PQ**: a load bus with known P and Q; its voltage is the unknown. The set voltage is ignored (the start is 1.0 pu).
2. **Lines**: from, to, R, X, B in per unit on the base you give. B is the total line charging; leave it out for 0. Parallel lines are fine.
3. Pick the method, tolerance and most iterations. Or press **Use the example**, or open CSV or Excel files.

## Worked example

The made-up example has 5 buses on a 100 MVA base: bus 1 is the slack at 1.03 pu, bus 2 a generator sending 80 MW at 1.01 pu with 30 MW of local load, and buses 3, 4 and 5 are loads of 55, 40 and 65 MW. Newton-Raphson converges in 4 iterations, with total losses of 4.562 MW. The slack bus supplies 114.56 MW and 35.72 Mvar, and bus 2's generator gives 32.76 Mvar to hold 1.01 pu. The lowest voltage is 0.9514 pu at bus 5, at −7.371°. The busiest line is 2–3, carrying 77.99 MW out of bus 2 and losing 1.722 MW. Switching to Gauss-Seidel (acceleration factor 1.6) gives the same answer after 36 iterations, or 47 with no acceleration.

## Tips

- Keep R, X and B on one base. To convert ohms: Z(pu) = Z(Ω) × S_base / V_base².
- If Newton-Raphson does not converge, the loading may be beyond what the network can carry (no solution), or a value may be in the wrong units.
- Generator reactive limits and transformer taps are not modelled; check that each PV bus's Q is something its generator can give.

## FAQ

**Why per unit?** It puts every voltage near 1 and makes transformers disappear from the equations, so mistakes stand out.

**Why does the slack bus supply more than the load minus the other generators?** It also covers the losses in the lines.

**Is my network uploaded?** No. Everything runs in your browser and works offline.
