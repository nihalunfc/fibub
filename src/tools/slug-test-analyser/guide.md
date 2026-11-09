---
name: Slug test analyser
num: 127
shelf: science
section: hydrogeology
title: "Slug test analysis: hydraulic conductivity K by Hvorslev and Bouwer-Rice from rising or falling head data"
summary: "Paste or open water level readings from a slug or bail test. Choose the fit window, get the basic time lag T0 and hydraulic conductivity K by Hvorslev, or Bouwer-Rice with your own ln(Re/R), with a filter pack correction, warnings and a semi-log plot."
status: live
ads: true
order: 3
icon: chart
works: offline
updated: 2026-11-08
related: [pump-test-analyser, piper-diagram, mixing-model-calculator, plot-maker]
sources:
  - "Hvorslev (1951) basic time lag method and the Bouwer and Rice (1976) equation: standard hydrogeology methods, written by fibub from the equations."
  - "The Bouwer-Rice shape chart (the A, B and C curves) is not reproduced: users enter ln(Re/R) from their own reference."
  - "Effective casing radius for a draining filter pack: the usual rc² = (1 − n) rc² + n R² correction."
  - "Example data are made up by fibub for illustration."
flow:
  - { icon: table, label: "Readings" }
  - { icon: sliders, label: "Fit window" }
  - { icon: clock, label: "Time lag" }
  - { icon: check, label: "K value" }
---

## What it does

A **slug test** is the quickest way to measure how permeable the ground is around a single well. You change the water level suddenly, by dropping in a solid rod (the slug), pulling it out, or bailing out some water. Then you watch how fast the level returns to where it started. In sand it comes back in seconds. In clay it can take days.

This tool takes those readings and gives the **hydraulic conductivity K**: how easily water moves through the ground, in m/s or m/day.

For a longer test with a pumping well, use the [[pump-test-analyser]]; to use the K you find, the [[darcy-flow-calculator]].

## How to use it

1. Choose the length and time units.
2. Enter the **casing radius rc** (the pipe where the water level moves), the **screen or borehole radius R** and the **screen length Le**.
3. Paste or open two columns: time since the change, and the reading. The reading can be a displacement from the static level, a depth to water or a water level height. For the last two, also enter the static level.
4. Look at the plot. On a log scale the readings should fall on a straight line. Use the **fit window** to leave out an early curved part or a noisy tail.

## The methods

Both methods assume the head returns smoothly, so H/H0 falls exponentially: ln(H/H0) = −t/T0. The tool fits that straight line and reads off the **basic time lag T0**, the time for H/H0 to reach 0.37.

- **Hvorslev** for a screen much longer than it is wide (Le/R above 8): K = rc² ln(Le/R) ÷ (2 Le T0).
- **Bouwer-Rice** has the same form with ln(Re/R) in place of ln(Le/R), where Re is an effective radius that depends on how the well sits in the aquifer. It comes from charts or equations in the original paper and in textbooks, so enter it from the reference you use.

If the water level falls within the screen, water drains from the filter pack as well as the casing. Enter the pack's porosity and the tool uses the effective casing radius.

## Worked example

All numbers are made up. A 50 mm well (rc = 0.025 m) sits in a 100 mm borehole (R = 0.05 m) with a 1.5 m screen. After a slug is dropped in, the head starts 0.5 m up and falls to 0.007 m after 300 seconds. The fit through the readings between H/H0 0.1 and 0.9 gives **T0 = 70.8 s**. Hvorslev then gives **K = 1.0 × 10⁻⁵ m/s**, about 0.86 m/day, which is typical of a fine sand.

## Good to know

- A slug test only samples the ground near the screen and is sensitive to a poorly developed well. Repeat the test, and compare rising and falling head.
- If the level swings above and below the static level, the ground is very permeable and the response oscillates. These methods do not apply then, and the tool warns you.
- If the plot curves downwards at first and then becomes straight, the filter pack is often draining. Fit the straight part.

## FAQ

**Which method should I use?** Hvorslev is simpler and needs no chart. Bouwer-Rice accounts for the well's position in the aquifer. They usually agree within a factor of two.

**Does it work for confined aquifers?** Yes, as long as the response does not depend much on storage. For very compressible aquifers a type-curve method may be better.
