---
name: Road curve
num: 654
shelf: science
section: civil-and-structural-engineering
title: "Road curve"
summary: "Work out the smallest safe radius for a speed from your superelevation and side friction, the elements and chainages of a circular curve with a setting-out table, the stopping sight distance, and the length of a crest or sag vertical curve from sight distance or K, with its levels, high or low point and a profile plot."
status: live
ads: true
order: 654
icon: curve
works: offline
updated: 2026-11-09
related: [level-book-reducer, traverse-calculator, retaining-wall-check, gps-track-analyser, utm-converter, dem-terrain, traffic-flow, signal-timing]
sources:
  - "Circular curve geometry (tangent length, curve length, external distance, middle ordinate, long chord, deflection-angle setting out), the radius from v²/(g(e + f)), stopping sight distance as reaction plus braking distance, and parabolic vertical curves with sight-distance lengths for crests (eye and object heights) and sags (headlight height and beam angle): standard highway and surveying textbooks, for example Garber and Hoel, Traffic and Highway Engineering, and Uren and Price, Surveying for Engineers (formulas only)."
  - "No values are taken from any road design code or guide (AASHTO, IRC, DMRB, TAC or others). Superelevation, side friction, reaction time, braking friction, eye, object and headlight heights and K are user inputs; the starting values and the example road are made up or rounded."
  - "Checked against an independent Python calculation written for the tests: points on the arc from coordinates, and a numerical sight-line search (NumPy, scipy brentq) confirming that each crest and sag length gives the sight distance asked for."
flow:
  - { icon: curve, label: "Radius" }
  - { icon: compass, label: "Curve" }
  - { icon: eye, label: "Sight" }
  - { icon: chart, label: "Profile" }
---

## What it does

Roads are straights joined by curves, both in plan (horizontal curves) and in level (vertical curves over hills and through dips). This helper does the standard geometry for a first layout or for study:

- **Minimum radius** for a speed: R = v² / (g (e + f)), from the **superelevation** e (banking) and the **side friction** f you allow. It also shows the friction a chosen radius actually needs.
- **Circular curve elements** from the radius and the **deflection angle** Δ between the straights: tangent length T, curve length L, external distance E, middle ordinate M, long chord, degree of curve, and the **chainages** of the PC (start) and PT (end) from the PI chainage.
- A **setting-out table** of deflection angles and chords from the PC at round chainages, as used with a total station or theodolite, downloadable as CSV.
- **Stopping sight distance**: the distance covered while the driver reacts, plus the braking distance on the grade.
- **Vertical curves**: the length of a **crest** curve so a driver can see an object over the top, or a **sag** curve so headlights light the road far enough ahead, from the stopping sight distance, your own sight distance, a **K value**, or a length you type. It gives the BVC and EVC, the **high or low point**, a levels table and a profile plot.
- The **gradient** between two points as a percentage, an angle and "1 in N".

For study and planning, not a substitute for professional judgement. Check your local code and a qualified engineer.

Set out the curve on site with the [[traverse-calculator|traverse calculator]], and check the levels along it with the [[level-book-reducer|level book reducer]].

## How to use it

1. Type the design speed, superelevation and side friction from your road design guide, then the radius, deflection angle, PI chainage and stake interval.
2. Type the reaction time, braking friction and grade for the stopping sight distance.
3. Type the two grades (uphill positive), the VPI chainage and level, and choose how to set the curve length. For sight-distance lengths, give the eye and object heights (crest) or headlight height and beam angle (sag).
4. Download the setting-out and levels as CSV, or everything as an image, PDF or Word report.

## Worked example

The page opens with made-up values: 80 km/h, e = 0.06, f = 0.14.

- Minimum radius = (80 / 3.6)² / (9.81 × 0.20) = **251.7 m**, so a 300 m radius is enough; it uses a side friction of 0.108.
- With Δ = 40° and the PI at 1+250: T = 300 tan 20° = **109.191 m**, L = **209.440 m**, E = 19.25 m, M = 18.09 m. PC at **1+140.809**, PT at **1+350.248**.
- Stopping sight distance with 2.5 s reaction, braking friction 0.35 on a 3 % downgrade: 55.56 + 78.65 = **134.2 m**. To see that far round the curve, the inside needs about 7.47 m of clear sightline.
- A crest from +3 % to −2 % (A = 5) with eye height 1.1 m and object height 0.6 m: L = A S² / (200(√1.1 + √0.6)²) = **135.4 m**, K = 27.09. With the VPI at 1+500, level 100 m, the BVC is at 1+432.280 (97.968 m), the EVC at 1+567.720 (98.646 m), and the **high point** at 1+513.544, 99.187 m.

## FAQ

**Why does my design guide give a different minimum radius?** Guides set limits on e and f for each speed, and some round the result or use the exact form (e + f)/(1 − e f). Enter their values; the tool shows the physics.

**Does it handle transition (spiral) curves?** Not yet. It works with simple circular curves.

**Which way is the high point found?** On a crest the curve turns where its slope is zero, at −g1 L / (g2 − g1) from the BVC. If both grades have the same sign there is no high or low point within the curve.
