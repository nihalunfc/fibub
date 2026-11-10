---
title: "Fir and black pine bending tests: three-point vs four-point MOE, MOR and shear effect"
summary: "A 2025 Forests study bent 5,656 small clear fir and black pine specimens from Türkiye. Rebuild both test set-ups and the shear correction in your browser."
tools: [beam-calculator, hypothesis-tests]
updated: 2026-11-10
sources:
  - "Kurul F, Görgün HV, Şeker S, Yılmaz T, Dündar T, Ayrilmis N (2025), Forests 16(5): 844, the paper described here."
  - "Shear deflection of a rectangular beam with a shear form factor of 1.2: Timoshenko beam theory, standard strength of materials textbooks."
  - "The loads, modulus and shear modulus in the worked example are rounded example values chosen by fibub, not results from the paper."
paper:
  title: "Experimental and Numerical Modeling of Bending Characteristics of Fir and Black Pine Wood from Different Forest Regions in Türkiye"
  authors: "Kurul F, Görgün HV, Şeker S, Yılmaz T, Dündar T, Ayrilmis N"
  journal: "Forests"
  year: 2025
  doi: "10.3390/f16050844"
  url: "https://www.mdpi.com/1999-4907/16/5/844"
  licence: "CC BY"
  reviewed: true
---

How stiff is a piece of wood? It depends partly on how you bend it. A 2025 study in Forests tested more than 5,600 small, defect-free sticks of fir and black pine from 13 forest regions of Türkiye, some in three-point bending and some in four-point bending, and compared the stiffness and strength each method gives. A key finding is that shear, the sliding of wood fibres past each other, hides part of the true stiffness, more so in three-point tests. This page explains the study and rebuilds both set-ups with the [[beam-calculator|beam calculator]], with the [[hypothesis-tests|hypothesis test picker]] for comparing two groups of results.

## What they found

The strength in bending (modulus of rupture, MOR) barely depended on the method: four-point values were 2.5 % higher for fir, and three-point values 1.5 % higher for black pine. Stiffness (modulus of elasticity, MOE) did depend on it. The apparent MOE, worked out from the total deflection, came out about 8.5 % below the true three-point MOE and about 7.2 % below the true four-point MOE. The authors put the share of deflection caused by shear at 8.4 % (fir) and 10.2 % (black pine) in three-point tests, and 7.4 % and 8.1 % in four-point tests. The limit of proportionality, where the load-deflection line starts to curve, fell between 40 and 60 % of the maximum load, above the 40 % the standards assume. A finite element model matched the tests to within a few per cent.

## Why it matters

Timber design values come from bending tests, and labs in different countries use different methods. If one method reads several per cent stiffer than another, results cannot be pooled without a correction. Data from thousands of specimens across many regions give a solid base for such a correction for two important softwoods.

## How they did it

Every specimen was 20 × 20 × 320 mm, conditioned to air-dry moisture and loaded in the tangential direction on a 100 kN universal testing machine. Three-point tests followed ISO 13061 on a 280 mm span with one central load. Four-point tests followed EN 408 on a 300 mm span with two loads at the third points. Deflection was read from the movement of the loading head, and failure had to come between half a minute and five minutes. A shear modulus of 650 MPa was assumed for the correction.

## Check it yourself with fibub

We use **rounded example values**: E = 11 GPa (the calculator's softwood example), a 20 × 20 mm solid rectangle, and a total load of 0.5 kN in both tests, well inside the straight part of the curve.

1. **Three-point set-up.** In the beam calculator choose **Simply supported**, length 0.28 m, and add one point load of 0.5 kN at 0.14 m. Pick **Solid rectangle**, width 20 mm, depth 20 mm, and E 11 GPa. The calculator gives I = 13,333 mm⁴, a largest moment of 0.035 kN·m, a bending stress of **26.25 MPa** and a mid-span deflection of **1.56 mm**.
2. **Four-point set-up.** Change the length to 0.30 m and replace the load with two point loads of 0.25 kN at 0.10 m and 0.20 m. The moment is a flat 0.025 kN·m between the loads, the stress **18.75 MPa** and the deflection **1.63 mm**. The same total load stresses the wood less, but the longer span bends it a little more.
3. **Add the shear part by hand.** The calculator uses Euler-Bernoulli theory, which ignores shear. For a rectangle the extra mid-span deflection is 1.2 × V × a ÷ (G × A), where V is the shear force, a the length it acts over and A = 400 mm². With G = 650 MPa: three-point, 1.2 × 250 N × 140 mm ÷ (650 × 400) = 0.16 mm; four-point, 1.2 × 250 N × 100 mm ÷ (650 × 400) = 0.12 mm.
4. **See the apparent MOE.** Shear is 0.16 ÷ (1.56 + 0.16) = **9.4 %** of the total in three-point and **6.6 %** in four-point. If you back out E from the total deflection, you get about 9.97 GPa and 10.27 GPa instead of 11, the same kind of gap the paper reports.
5. **Strength from load.** Bending stress grows in step with load, so a stick reaching an MOR of 80 MPa would carry about 1.52 kN in the three-point test and 2.13 kN in the four-point test. Check it by raising the loads in the calculator.
6. **Compare methods.** Paste your own MOR values from the two methods into the hypothesis test picker as two separate groups to see whether a 2 % gap is beyond the scatter.

## The fine print

- Only small clear specimens were tested; knots, cracks and sloping grain in structural timber were not.
- The finite element model treated wood as isotropic with frictionless supports, although wood is strongly anisotropic.
- The shear modulus was assumed, not measured, so the shear shares depend on that value.
- Deflection came from the loading head, which includes some machine and support settlement.
- The paper's specimen counts and model accuracy figures differ slightly between sections.
- Regional differences in MOR were suggested but not tested in detail.
