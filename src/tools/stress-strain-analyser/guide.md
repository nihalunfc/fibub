---
name: Stress-strain curve analyser
num: 846
shelf: science
section: mechanical-behaviour
title: "Stress-strain curve analyser: Young's modulus, 0.2 % yield, UTS, elongation and toughness from a tensile test"
summary: "Paste or open force-extension or stress-strain data from a tensile test. Get Young's modulus from a straight-line fit, the 0.2 % offset yield strength, tensile strength, uniform and fracture elongation, toughness, resilience, true stress-strain to the UTS and the strain-hardening exponent, with a plot and CSV."
status: live
ads: true
order: 846
icon: chart
works: offline
updated: 2026-11-09
related: [reliability-analysis, plot-maker]
sources:
  - "Engineering and true stress and strain, offset yield, toughness, resilience and the Hollomon fit follow the usual textbook definitions (Callister and Rethwisch, Materials Science and Engineering, chapter 6; Dieter, Mechanical Metallurgy, chapter 8), written by fibub and checked in the tests against NumPy."
  - "The example test is made up by the page (E = 200 GPa with Voce hardening, then a drop in stress for necking); it is not data for any real alloy."
  - "Your data is read on the page only. It is never uploaded or stored."
flow:
  - { icon: table, label: "Data" }
  - { icon: ruler, label: "Specimen" }
  - { icon: curve, label: "Fit" }
  - { icon: chart, label: "Properties" }
---

## What it does

A tensile test pulls a specimen until it breaks and records the force and the extension. This page turns that record into the properties that go on a materials data sheet or into a lab report:

- **Young's modulus (E).** A least-squares straight line through the elastic part of the curve, between two stress levels you choose as a percentage of the tensile strength (10 % to 40 % by default). The r² tells you how straight that part really is.
- **Offset yield strength.** For metals without a sharp yield point, the yield strength is where the curve meets a line of slope E moved right by 0.2 % strain (Rp0.2). You can change the offset, for example to 0.1 % or 0.05 %.
- **Tensile strength (UTS).** The highest engineering stress, and the strain where it happens.
- **Uniform elongation.** The strain at the highest force, where necking starts, as total strain and as permanent (plastic) strain once the elastic part σ/E is taken away.
- **Elongation at fracture.** The strain at the last point, total and plastic. The plastic number is close to what you measure by fitting the broken halves back together.
- **Toughness.** The area under the engineering curve up to fracture: the energy absorbed per unit volume. Since 1 MPa equals 1 MJ/m³, stress times strain is energy per volume.
- **Modulus of resilience.** The elastic energy stored up to yield, σy² ÷ 2E.
- **True stress and true strain** up to the UTS: σ(1 + e) and ln(1 + e), and the **strain-hardening exponent n** from a Hollomon fit σ = K εⁿ on the true curve between yield and UTS. Considère's rule says n should be close to the true strain at the UTS, a handy check.

## How to use it

1. **Data.** Paste two columns, or open a CSV or Excel export from the test machine. Choose whether the columns are force and extension or stress and strain, and their units. A header row is fine.
2. **Specimen.** For force and extension, give the starting width and thickness (flat), the diameter (round) or the area, and the gauge length the extension was measured over.
3. **Fit.** Check the modulus range in the close-up plot: the blue points in the range should sit on the straight line. *Correct the toe* moves the zero of strain to where that line crosses zero stress, which removes the slack and seating at the start of a test (toe compensation).
4. **Properties.** Read the results, look at both plots, and download the curves as CSV or the results as an image, PDF or Word file.

## Worked example

The example is a made-up test of a ductile metal on a flat specimen 12.5 mm wide, 2 mm thick, with a 50 mm gauge length. It was drawn with E = 200 GPa and Voce hardening (true stress 300 + 250(1 − e^(−12 εp)) MPa), so the true 0.2 % yield is about 304.8 MPa, plus a little noise.

The page finds **E = 199.75 GPa** from 13 points between 50.2 and 170.2 MPa, a **0.2 % offset yield strength of 304.7 MPa**, and a **tensile strength of 437.0 MPa** at 16.48 % strain. Uniform elongation is 16.26 % plastic; elongation at fracture is 25.68 % plastic (25.88 % total). Toughness is 105.7 MJ/m³ and the modulus of resilience 0.232 MJ/m³. The true stress at the UTS is 509.1 MPa, and the Hollomon fit gives n = 0.157 against a true strain at the UTS of 0.153.

## Tips

- Extension from the crosshead includes the stretch of the machine and grips, so the modulus comes out too low (often by half). Use an extensometer for the modulus, or treat it as an apparent modulus.
- Keep the fit range well below yield. If r² drops below about 0.999, narrow the range.
- Cut off any points after the specimen broke (a long tail at near-zero force), since the last row is taken as fracture.
- For a material with a sharp yield point and a yield drop (mild steel), the offset yield lands on the plateau; report the upper and lower yield from the plot as well.

## FAQ

**Why is the plastic elongation smaller than the total?** At any point the specimen has stretched both elastically and permanently. When it breaks or is unloaded, the elastic part σ/E springs back.

**Is true stress valid after the UTS?** Not with these formulas. After necking the strain is no longer even along the gauge length, so the page stops the true curve at the UTS.

**What units does toughness use?** MJ/m³, the same number as MPa times strain. Multiply by the gauge volume to get joules.

**Does my data leave my computer?** No. The whole calculation runs on this page and nothing is sent or stored.
