---
name: Tolerance stack-up
num: 646
shelf: science
section: mechanical-engineering
title: "Tolerance stack-up calculator: worst case, RSS and Monte Carlo with fallout, Cp and Cpk"
summary: "Add up a chain of dimensions with plus and minus tolerances and directions to find the gap: worst case, root sum of squares (RSS) and a seeded Monte Carlo simulation with normal, uniform or triangular parts. Get the share of variance from each part, the fraction of assemblies outside the gap limits, and Cp and Cpk, with a histogram. Paste the chain or open a CSV or Excel file."
status: live
ads: true
order: 646
icon: ruler
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, shaft-bearing-life, bolt-torque-calculator, gear-train-calculator, spring-designer, gauge-rr, control-charts, thermal-mismatch-stress]
sources:
  - "Worst-case and root-sum-square (RSS) tolerance analysis and Monte Carlo tolerance simulation as described in standard texts on dimensioning and tolerancing (for example Fischer, Mechanical Tolerance Stackup and Analysis), methods only."
  - "Standard deviations of uniform (h/√3) and triangular (h/√6) distributions, the normal tail probability, and the process capability indices Cp and Cpk are standard statistics."
  - "The example assembly is made up. Random numbers come from a small seeded generator (mulberry32) so a run can be repeated."
  - "Checked against an independent NumPy simulation (2 million draws with numpy.random.default_rng) and against scipy.stats.norm for the normal fallout."
flow:
  - { icon: table, label: "Chain" }
  - { icon: calculator, label: "Worst case" }
  - { icon: sigma, label: "RSS" }
  - { icon: chart, label: "Simulate" }
---

## What it does

When parts are put together, their size variations add up. A **tolerance stack-up** follows a chain of dimensions round a loop to find how big a gap (a clearance, an overlap, an end float) can be. This tool works it out three ways:

- **Worst case:** every part at its limit at the same time. Safe, but often very pessimistic.
- **RSS (root sum of squares):** treats the parts as independent random variables, so their standard deviations add as √(Σσ²). Much closer to what a production line actually sees.
- **Monte Carlo:** builds 10,000 to 500,000 virtual assemblies with each part drawn from its distribution, and counts how many fall outside your gap limits.

It also shows each part's **share of the variance** (what to tighten first), the **fraction outside** the limits, simulated and from a normal model, and the capability indices **Cp and Cpk**.

Check that your measuring system can be trusted with the [[gauge-rr]], and watch the parts you make over time with [[control-charts]].

## How to use it

1. Put one dimension per row: name, nominal, plus tolerance, minus tolerance, direction and distribution. Paste from a spreadsheet, type, or use **Open a file** for CSV or Excel.
2. **Direction:** walk round the loop from one face of the gap to the other. A dimension that makes the gap bigger is +; one that makes it smaller is −.
3. **Tolerances:** the plus value is how far above nominal the upper limit is; the minus value is how far below nominal the lower limit is. Leave the minus empty for an equal ± tolerance. Unequal tolerances shift the middle of the band, and the tool uses that middle.
4. **Distribution:** *normal* for parts from a steady process (the limits at ±k σ, usually 3); *uniform* when any size in the band is equally likely (bought-in parts sorted to a tolerance, or a worn tool); *triangular* in between.
5. Give the **gap limits** the design needs, the number of **samples** and a **seed**.

## Worked example

A made-up shaft assembly: the gap is a housing bore depth of 60 ± 0.10 (+) minus a spacer 20 ± 0.05, a bearing 15 +0/−0.12 (uniform), a gear hub 24.5 ± 0.08 (triangular) and a circlip 0.3 ± 0.02, all −. The nominal gap is 0.2, but the bearing's one-sided tolerance moves the middle of the gap to **0.26**.

- Worst case: ±0.31, so the gap could be anywhere from **−0.05** (interference) to 0.57.
- RSS: σ = 0.06083, so ±3σ = ±0.1825, from **0.077517 to 0.44248**.
- Monte Carlo (100,000 assemblies, seed 1): mean 0.26, and about **0.928 %** fall outside the limits of 0.05 to 0.40, almost all of them above 0.40. The normal estimate is 1.1 %, with Cp = 0.959 and Cpk = 0.767.

The bearing (32 %) and housing (30 %) give most of the variance, so tightening either is the best first step.

## Tips

- Check the loop closes: the nominal gap should match the drawing.
- A Cpk below 1 means a noticeable fraction of assemblies will not fit. 1.33 or more is a common aim.
- The simulated and normal-model fallout differ when uniform or triangular parts dominate, because their sum has thinner tails than a normal curve.

## FAQ

**Which result should I design to?** Worst case where any failure is unacceptable or numbers are small; RSS or Monte Carlo for high-volume production where processes are in control.

**Why does the simulation change when I change the seed?** Each seed draws a different random set. Bigger samples change less.

**Does it handle angles or 3D stacks?** No. It is a one-dimensional (linear) stack. Geometric tolerances such as position or flatness need converting to an equivalent ± along the stack direction first.
