---
title: "Buckling of perforated cold-formed steel rack uprights: tests vs FEM and DSM"
summary: "A 2025 Buildings study crushed perforated steel pallet-rack uprights of three lengths and compared FEM, effective width and direct strength methods. See how slenderness changes the story."
tools: [column-buckling, stress-strain-analyser, load-combination-helper]
updated: 2026-11-10
sources:
  - "Taranu G, Iacob S, Taranu N (2025), Buildings 15(9): 1561, the paper described here."
  - "Euler buckling load π²EI/(KL)² and the Johnson parabola: standard mechanics of materials."
  - "The round tube in the worked example is a made-up stand-in chosen by fibub, not the paper's section."
paper:
  title: "Buckling Behavior of Perforated Cold-Formed Steel Uprights: Experimental Evaluation and Comparative Assessment Using FEM, EWM, and DSM"
  authors: "Taranu G, Iacob S, Taranu N"
  journal: "Buildings"
  year: 2025
  doi: "10.3390/buildings15091561"
  url: "https://www.mdpi.com/2075-5309/15/9/1561"
  licence: "CC BY"
  reviewed: true
---

The tall steel racks in every warehouse stand on uprights: thin, folded steel channels punched with rows of holes so beams can be hooked on at any height. Those holes and the thin walls make the uprights hard to design, because they can fail in several different ways. A team in Romania tested such uprights at three lengths and compared the results with computer models and two design methods, in a paper in Buildings in May 2025. This page explains what they found, and shows how slenderness decides the failure mode with the [[column-buckling]] calculator, after reading the steel's stiffness and yield point off a coupon test in the [[stress-strain-analyser]].

## What they found

Short uprights (340 mm) failed by **local buckling**, the thin walls rippling next to the holes, at about 196 kN on average. Medium ones (990 mm) failed in a mix of **distortional** buckling (the lips and flanges folding as a unit) and overall bending, at about 136 to 140 kN. The longest (1990 mm) failed by **global flexural buckling**, the whole member bowing sideways, at about 89 kN. A finite element model came within about 5 % of the tests. The direct strength method (DSM), which works from the member's elastic buckling loads, was within about 2 to 7 % when the net section at the holes was treated as fully effective. The older effective width method (EWM), which cuts thin plates down to a narrower "working" width, could be up to about 15 % on the safe, low side.

## Why it matters

Rack collapses are rare but serious: they bring tonnes of goods down in buildings full of people and forklifts. Perforations make hand calculation awkward, so design codes for racking lean on tests of each new section. Knowing which simple method tracks the tests, and by how much, tells engineers when a calculation is enough and when a test is still needed. It also shows that one member can switch failure mode with length alone.

## How they did it

The uprights were 85 × 52 mm channels folded from 2 mm S355 steel, with web perforations and a stiffening fold down the middle of the web. Coupon tests gave a yield strength of roughly 420 to 440 MPa, above the grade's nominal 355 MPa, and a modulus near 210 GPa. Five short, five medium and three long specimens were loaded through spherical hinges at the section's centroid, so the ends could rotate freely, at about 1 kN per second until the load dropped below 80 % of the peak. The finite element models in ANSYS included the holes, and the EWM and DSM checks followed the codified rules.

## Check it yourself with fibub

The column buckling calculator offers I sections, rectangles, solid circles and round tubes, not a perforated lipped channel, and it covers only overall (global) buckling. So we use a **made-up round tube** as a stand-in, to see the length effect rather than to reproduce the paper's loads.

1. **Section.** Shape **Round tube**, diameter 45 mm, wall 2 mm. The page gives an area of 270.2 mm² and a radius of gyration of 15.22 mm.
2. **Material.** E = 210,000 MPa and fy = 430 MPa, values in the range the paper's coupons gave. The transition slenderness Cc comes out at 98.18.
3. **Ends.** **Pinned – pinned (K = 1)**, like the hinged test rig.
4. **Short column.** Length 340 mm: slenderness 22.34, Johnson parabola, critical load **113.2 kN**, almost the squash load of 116.2 kN. Euler alone would claim 1,122 kN, which is meaningless here.
5. **Medium column.** Length 990 mm: slenderness 65.05, still Johnson, **90.68 kN**.
6. **Long column.** Length 1990 mm: slenderness 130.8, above Cc, so Euler applies: **32.75 kN**, only 28 % of the squash load. With a factor of safety of 2 the allowed load is about 16.4 kN.
7. **Try a fixed base.** Pick **Fixed – pinned (K = 0.7)** for the long column: slenderness drops to 91.53 and the load rises to 65.70 kN. End fixity is worth as much as extra steel.

For the short and medium lengths, a real perforated channel fails **below** these numbers, because its thin walls buckle locally or distort first, which no global-buckling formula sees. That is exactly the gap the paper's FEM and DSM fill. As a crude feel for the holes, change the wall to 1.6 mm (less steel): the short-column load falls to 91.42 kN. To find the load an upright must carry in the first place, use the [[load-combination-helper]].

## The fine print

- Only one section shape and thickness was tested, and only three to five specimens per length.
- The long specimens were tested in a custom rig, unlike the shorter ones, which can add differences of its own.
- Hinged ends at the centroid are a lab idealisation; uprights in real racks are partly restrained by beams, bracing and base plates.
- The paper reports two slightly different averages for the medium length (136 and 140 kN).
- The yield strength measured was well above nominal, so code checks using 355 MPa would give lower capacities.
- Racking design must follow the official code in your country and be checked by a qualified engineer.
