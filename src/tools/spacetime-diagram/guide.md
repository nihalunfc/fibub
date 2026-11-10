---
name: Spacetime diagram
num: 967
shelf: science
code: T702
section: relativity-and-gravitation
title: "Spacetime diagram: Lorentz transformation, relativity of simultaneity, intervals and the twin paradox on a Minkowski diagram"
summary: "Type events and a frame speed to see them on a Minkowski diagram in two frames, with the moving frame's tilted axes and lines of simultaneity, the transformed coordinates, and every pair's interval, type (timelike, spacelike or lightlike), proper time and whether its order changes. A twin paradox mode shows both twins' ages, the jump in simultaneity at the turnaround and the signals each receives."
status: live
ads: true
order: 1
icon: clock
works: offline
updated: 2026-11-09
related: [cosmology-calculator, redshift-calculator, uncertainty-calculator, schwarzschild-orbits, gps-relativity, relativistic-kinematics, gw-chirp]
sources:
  - "Lorentz transformation, spacetime interval, relativity of simultaneity, relativistic Doppler effect and the twin paradox: standard results of special relativity, for example Taylor, E. F. and Wheeler, J. A., Spacetime Physics (2nd edition, 1992)."
  - "Checked by fibub against SymPy (interval invariance and composition of boosts) and NumPy (example events, and a numerical integral of the traveller's proper time)."
  - "Example events and trip are made up."
flow:
  - { icon: pencil, label: "Events" }
  - { icon: sliders, label: "Speed" }
  - { icon: chart, label: "Diagram" }
  - { icon: clock, label: "Time" }
---

## What it does

A **spacetime (Minkowski) diagram** draws events with position x across and time t up. With c = 1, light rays run at 45°. Someone moving at speed β has their own time axis (their worldline, tilted towards the light ray) and their own space axis (the line of events they call simultaneous, tilted the other way). This makes the strange parts of special relativity visible:

- **Relativity of simultaneity:** events on one horizontal line in one frame are not simultaneous in another.
- **Time dilation and length contraction:** the factor γ = 1/√(1 − β²).
- **The interval** s² = Δt² − Δx² is the same in every frame. Timelike pairs (s² > 0) can be cause and effect and always keep their order. Spacelike pairs (s² < 0) cannot, and observers can disagree on which came first.

In **Events** mode you type events in frame S; the tool gives their coordinates in frame S′, draws both diagrams, and for every pair gives the interval, its type, the proper time (or proper length), whether the order is kept or reversed in S′, and the speed of the frame in which the two events are simultaneous or at the same place.

In **Twin paradox** mode one twin stays home while the other travels at β to a distance D and back. The tool gives both ages, the jump in "now on Earth" when the traveller turns round, and how many of Earth's yearly signals arrive on each leg (the relativistic Doppler effect), which settles the "paradox" without any acceleration argument.

See time dilation at work in satellite clocks with the [[gps-relativity|GPS relativity explainer]], and work out fast collisions with [[relativistic-kinematics]].

## How to use it

1. Choose **Events** or **Twin paradox**, and the units (c = 1, so years go with light-years, seconds with light-seconds).
2. Set the speed **β** with the box or the slider (negative means moving towards −x).
3. Type events as **name, t, x**, one per line, or the twin's turning-point distance **D**.
4. Read the tables and diagrams; download the table as CSV or a report.

## Worked example

The made-up events are O (0, 0), A (t = 2, x = 1), B (1, 3) and C (3, 3), seen from a frame moving at **β = 0.5** (γ = 1.155). In S′, A is at t′ = 1.732, x′ = 0 and B is at t′ = −0.5774: **B now happens before O**, because O–B is spacelike (s² = −8). A and C, which are at different times in S, are **simultaneous** in S′. O–A is timelike with a proper time of **1.732 years**, and O–C lies on a light ray.

For the twin paradox, set β = 0.8 and D = 4 light-years: the page shows **Traveller ages 6 y, Earth twin 10 y**. At the turnaround, "now on Earth" jumps from 1.8 to 8.2 years (6.4 years). The traveller receives 1 of Earth's yearly signals on the way out and 9 on the way back.

## Tips

- Slide β and watch the tilted S′ axes close in on the light ray: that is why nothing reaches c.
- To find a frame where two events are simultaneous, read the "special frame" column and type that β.
- Negative β tilts the axes the other way.

## FAQ

**Who is right about the order of spacelike events?** Both observers. Neither event can influence the other, so their order has no physical meaning.

**Why does the traveller age less if motion is relative?** The traveller changes frames at the turnaround; the stay-at-home twin does not. The diagram shows the traveller's line of simultaneity swinging across Earth's worldline at that moment.

**Is gravity included?** No, this is special relativity in flat spacetime. For curved spacetime, see the Schwarzschild orbit tools.
