---
name: Shaft and bearing life
num: 645
shelf: science
section: mechanical-engineering
title: "Bearing life and shaft diameter calculator: L10 life, equivalent load, DE-Goodman fatigue and static shaft sizing"
summary: "Work out a rolling bearing's L10 life in revolutions and hours from its rating C and the equivalent load P = X Fr + Y Fa (your catalogue values), adjusted for reliability and aISO, or the C you need for a target life. Size a solid round shaft for combined bending and torsion in fatigue (DE-Goodman with your endurance limit) and statically (von Mises and maximum shear), or check the safety factors of a given diameter."
status: live
ads: true
order: 645
icon: clock
works: offline
updated: 2026-11-09
related: [gear-train-calculator, beam-calculator, bolt-torque-calculator, spring-designer, tolerance-stackup, fatigue-sn-calculator]
sources:
  - "Basic rating life L10 = (C/P)^p with p = 3 for ball and 10/3 for roller bearings, the equivalent load P = X Fr + Y Fa, and the adjusted life a1 · aISO · L10, as defined in ISO 281 and machine design texts (equations only; no catalogue or factor tables are reproduced)."
  - "Reliability factor from a two-parameter Weibull distribution of bearing life through the 90 % point, a standard result (e.g. Shigley's Mechanical Engineering Design, chapter on rolling-contact bearings)."
  - "Shaft sizing by the distortion-energy Goodman (DE-Goodman) criterion and the static maximum shear stress and distortion energy criteria: Shigley's Mechanical Engineering Design (Budynas and Nisbett), chapter on shafts (equations only)."
  - "All bearing data (C, e, X, Y), load factors, Weibull slope, strengths and fatigue factors on the page are made-up example values chosen by fibub and labelled as such."
  - "Checked against an independent NumPy/SciPy calculation: the Goodman diameter by root-finding on σ = Mc/I and τ = Tc/J, static diameters by root-finding, and the reliability factor from scipy.stats.weibull_min."
flow:
  - { icon: target, label: "Loads" }
  - { icon: clock, label: "Life" }
  - { icon: ruler, label: "Shaft" }
  - { icon: check, label: "Safety" }
---

## What it does

Two linked checks for a rotating shaft and the bearings that carry it.

**Bearing life.** A rolling bearing eventually fails by fatigue of its races. Its catalogue gives a dynamic load rating C, the load at which 90 % of bearings last a million revolutions. The life at another load P follows L10 = (C/P)^p, with p = 3 for ball bearings and 10/3 for roller bearings. The tool works out:

- the **equivalent load** P from radial and axial loads, with the catalogue's e, X and Y and a load factor for shocks,
- the **L10 life** in millions of revolutions and in hours at your speed,
- the **adjusted life** for a higher reliability (from a Weibull spread of lives) and a life factor aISO for lubrication and cleanliness,
- or, switched round, the **C you need** for a target life in hours.

**Shaft diameter.** A shaft under a steady load turns its bending stress into a fully reversed cycle every revolution, while the torque stays steady. The DE-Goodman criterion combines the alternating and mean von Mises stresses with your endurance limit Se and tensile strength Sut to give the **diameter for a safety factor**, or the **safety factor of a diameter**. It also checks first-cycle yield and gives the plain **static diameters** by the von Mises and maximum shear stress theories.

Get the shaft speed and torque from the [[gear-train-calculator]] first, and set the bearing fits with the [[tolerance-stackup]].

## How to use it

1. **Bearing.** Choose ball or roller, then type C, the loads, and e, X and Y from the maker's catalogue (the page's values are made up). Give the speed, the reliability you want and, if you know it, aISO.
2. **Shaft.** Enter the alternating and mean bending moments and torques at the section you are checking (often a shoulder or keyway near a bearing or gear), the fatigue stress concentration factors Kf and Kfs, and your material's corrected endurance limit Se, tensile strength Sut and yield strength Sy.

## Worked example

All values are made up. A ball bearing with C = 30 kN carries Fr = 3.5 kN and Fa = 1.2 kN at 1200 rpm, with e = 0.3, X = 0.5, Y = 1.6 and a load factor of 1.2. Fa/Fr = 0.343 is above e, so P = 1.2 × (0.5 × 3.5 + 1.6 × 1.2) = **4.404 kN**. The basic life is (30 / 4.404)³ = 316.1 million revolutions, **4390 hours**. At 95 % reliability with a Weibull slope of 1.5, a1 = 0.6189 and the adjusted life is **2717 hours**. For 20 000 hours at 95 % you would need C of at least 58.36 kN.

The shaft carries a fully reversed bending moment of 150 N·m and a steady torque of 120 N·m at a shoulder with Kf = 1.7 and Kfs = 1.5; Se = 210 MPa, Sut = 700 MPa and Sy = 560 MPa. For a safety factor of 1.5 the DE-Goodman diameter is **28 mm**, where σa′ = 118.3 MPa and σm′ = 72.32 MPa. First-cycle yield is no problem (factor 4.04). A 30 mm shaft would have a fatigue safety factor of 1.84.

## Tips

- Bearing life is very sensitive to load: 10 % more load cuts a ball bearing's life by about a quarter.
- The weakest shaft section is usually not where the moment is largest but where a shoulder, groove or keyway raises the stress. Check each one.
- Se must already include the surface, size, loading, temperature and reliability factors for your part; using the plain test-bar value overestimates the life.

## FAQ

**Why are there no bearing tables?** C, e, X and Y belong to each bearing and maker, so you type them from the catalogue. The page never guesses them.

**Is DE-Goodman conservative?** It is a little conservative for most steels, which is why it is a popular design criterion. Gerber or ASME elliptic criteria give somewhat smaller shafts.

**Can I rely on these numbers for a machine?** They are for study and planning, not a substitute for professional judgement. Shaft deflection, critical speeds, fits and the bearing maker's own life method need checking too.
