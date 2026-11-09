---
name: Beam deflection calculator
num: 641
shelf: science
section: mechanical-engineering
title: "Beam calculator: reactions, shear force and bending moment diagrams, deflection and bending stress"
summary: "Solve a simply supported, cantilever, fixed-fixed, propped, overhanging or continuous beam under any mix of point loads, uniform or sloping distributed loads and applied moments. Get the support reactions, shear force and bending moment diagrams, the deflected shape and largest deflection, and the bending and shear stress for a rectangle, round bar or tube, I-beam built from plates, or your own I and c."
status: live
ads: true
order: 641
icon: ruler
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, plot-maker]
sources:
  - "Euler-Bernoulli beam theory and the finite element method with Hermite cubic beam elements and consistent nodal loads, as in standard texts such as Gere and Goodno, Mechanics of Materials, and Logan, A First Course in the Finite Element Method (methods and formulas only)."
  - "Closed-form beam cases used in the checks (for example 5wL⁴/384EI and PL³/3EI) are the standard textbook formulas."
  - "Section properties (I = bh³/12, πd⁴/64, built-up I-section) and shear stress factors are standard mechanics of materials results."
  - "Typical Young's modulus values are rounded general figures chosen by fibub as examples, not copied from any table. The example beam is made up."
  - "Checked against an independent NumPy/SciPy solution written for the tests (reactions as unknowns, bending moment by statics, double integration of M/EI)."
flow:
  - { icon: ruler, label: "Beam" }
  - { icon: target, label: "Loads" }
  - { icon: calculator, label: "Solve" }
  - { icon: chart, label: "Diagrams" }
---

## What it does

This calculator works out how a straight beam carries its loads. Tell it how the beam is held up, what pushes on it and what its cross-section is, and it gives:

- the **reactions** at each support (and the moment at a fixed end),
- the **shear force diagram** and the **bending moment diagram**,
- the **deflected shape**, with the largest deflection and where it happens,
- the **bending stress** σ = M / Z and the **shear stress** in the section, compared with a yield strength if you give one.

It handles beams that statics alone cannot solve, such as a beam fixed at both ends, a propped cantilever or a beam continuous over three supports. Behind the scenes the beam is split into a few hundred short finite elements (Euler-Bernoulli beam theory), with a node at every support, load and load end, so the deflections at the nodes are exact for the theory. The shear and moment then come from simple statics using the solved reactions.

## How to use it

1. **Supports.** Pick simply supported, cantilever (fixed at the left), fixed at both ends, propped cantilever, overhanging (pin and roller at any two places) or continuous over three supports. Give the length in metres and, where asked, where the supports are.
2. **Loads.** Each row is one load. A *point load* (kN) acts at one place. A *distributed load* (kN/m) runs from "at" to "to"; leave the end value empty for a uniform load, or give a different end value for a load that grows or shrinks in a straight line (soil or water pressure, a pile of material). A *moment* (kN·m) is a twisting load, clockwise positive. Positive loads push down; type a negative value for an upward load. Use **Add a load** and **Remove** to change the list.
3. **Section.** Choose an I-beam built from its plates (depth, flange width and thickness, web thickness), a solid rectangle, a round bar or tube, or type the second moment of area I and the distance c from the centre to the outer edge yourself.
4. **Material.** Young's modulus E sets how much the beam bends. The list holds rounded example values; use the figure for your material. The yield strength is optional and only used for comparison.

## What the results mean

- **Shear force** jumps at every point load and support and slopes under a distributed load.
- **Bending moment** is sagging (positive, smiling) or hogging (negative, frowning, as over a middle support or at a fixed end). The largest bending stress is where the moment is largest.
- **Deflection ratio** is the longest span divided by the largest deflection. Floors are often kept to around span/360 or stiffer, but the right limit depends on the use and your local code.

## Worked example

The example beam is made up: a 6 m simply supported steel beam (E = 200 GPa) carrying 5 kN/m along its whole length plus a 10 kN point load 2 m from the left. The section is an I-beam 300 mm deep with 150 × 10 mm flanges and a 7 mm web, so I = 7.591 × 10⁷ mm⁴ and Z = 5.06 × 10⁵ mm³.

The calculator gives reactions of **21.67 kN** at the left and **18.33 kN** at the right. The shear crosses zero at 2.333 m, where the bending moment peaks at **33.61 kN·m**, so the bending stress is 33.61 × 10⁶ / 5.06 × 10⁵ = **66.42 MPa**, about 27 % of a 250 MPa yield strength. The largest deflection is **8.09 mm** down at about 2.93 m, which is span/742. The web shear stress is 21.67 kN / (300 × 7 mm) = 10.3 MPa.

## Tips

- Use the CSV download to get the shear, moment, deflection and slope at every point for a spreadsheet or report.
- To include the beam's own weight, add a uniform distributed load equal to its weight per metre (mass per metre × 9.81 / 1000 kN/m).
- For a beam with several spans, use the continuous option or check each span with care: moments over a middle support can be larger than in the spans.

## FAQ

**Is this good enough to design a real beam?** It is for study and planning, not a substitute for professional judgement. Real design also needs load factors, lateral-torsional buckling, local buckling of thin plates, bearing, connections and your local code, checked by a qualified engineer.

**Why does a fixed-fixed beam deflect so much less?** Fixing the ends stops them turning, so the beam bends in an S-shape with hogging at the ends. Under a uniform load the middle deflection is a fifth of the simply supported value.

**Does it include shear deformation?** No. It uses Euler-Bernoulli theory, which is accurate for beams that are long compared with their depth (span more than about ten times the depth). Short deep beams deflect a little more.

**What units does it use?** Metres for lengths along the beam, millimetres for the section, kN for forces, GPa for E and MPa for stress.
