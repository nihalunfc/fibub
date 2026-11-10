---
title: "Al-Zn-Mg-Cu alloy by continuous rheo-extrusion: grain refinement and Hall-Petch strength"
summary: "A 2025 Metals study cut the grain size of an Al-Zn-Mg-Cu alloy from 53.5 to 16.1 µm by continuous rheo-extrusion and nearly doubled its yield strength. How much came from the grains?"
tools: [grain-size-intercept, xrd-peak-calculator, stress-strain-analyser]
updated: 2026-11-10
sources:
  - "Wang Z, An J, Xu M, Zhang H, Wei G, Yang C, Wei Z, Shen W, Ding W (2025), The Mechanism of Microstructure Refinement and the Synergistic Strength-Ductility Enhancement in Al-Zn-Mg-Cu Alloys Processed by Continuous Rheo-Extrusion, Metals 15(11): 1167, published 23 October 2025. Open access, CC BY. Details checked on the publisher's page, 2026-11-10."
  - "Hall-Petch relation σy = σ0 + k d^(-1/2): standard physical metallurgy (Hall 1951; Petch 1953)."
  - "ASTM E112 relation G = −6.6457 log10(ℓ) − 3.298, with ℓ the mean lineal intercept in mm: as used by the grain size intercept tool."
  - "Typical Vickers hardness of aluminium alloys (roughly 20 to 200 HV): standard handbook range."
  - "The intercept counts in the worked example are made up by fibub for this page; they are not the paper's data."
paper:
  title: "The Mechanism of Microstructure Refinement and the Synergistic Strength–Ductility Enhancement in Al–Zn–Mg–Cu Alloys Processed by Continuous Rheo-Extrusion"
  authors: "Wang Z, An J, Xu M, Zhang H, Wei G, Yang C, Wei Z, Shen W, Ding W"
  journal: "Metals"
  year: 2025
  doi: "10.3390/met15111167"
  url: "https://www.mdpi.com/2075-4701/15/11/1167"
  licence: "CC BY"
  reviewed: true
---

Making metal grains smaller usually makes the metal stronger, and the usual price is lost ductility. A 2025 open-access study in *Metals* reports an aluminium-zinc-magnesium-copper alloy that got both: pushing semi-solid metal through a die on a turning wheel, a process called continuous rheo-extrusion, cut the average grain size from 53.5 to 16.1 µm and lifted the yield strength from about 98 to 184 MPa while elongation rose slightly. The surprise is how little of that gain the authors put down to the smaller grains. This page explains the result, and shows how the [[grain-size-intercept]] tool measures grain size on your own micrographs so you can test the Hall-Petch share yourself. The [[xrd-peak-calculator]] covers the Williamson-Hall step the paper used for dislocations, and the [[stress-strain-analyser]] reads yield strength off a tensile curve.

## What they found

Compared with the same alloy cast into a steel mould, the extruded alloy had grains about a third the size, a higher share of high-angle grain boundaries (about 89 % against 82 %), and far finer copper-rich Al₂Cu particles, about 12 nm instead of about 106 nm. Coarse iron-rich particles were also broken up. Tensile strength rose from about 205 to 338 MPa and elongation from about 11 % to 14 %.

The authors added up the strengthening terms and got close to the measured rise of about 86 MPa. In their breakdown, extra dislocations gave about 49 MPa, the fine particles about 24 MPa, and the grain boundaries only about 16 MPa. They put the fine grains down to continuous dynamic recrystallisation, where tangled dislocations slowly sort themselves into new boundaries during hot deformation, with particles forming at the same time.

## Why it matters

High-strength aluminium alloys of this family are used in aircraft and vehicle frames, but they are usually made by casting a billet, homogenising it and then extruding it in separate steps. Continuous rheo-extrusion feeds metal in and pushes product out without stopping, which could save energy and handling. The strength breakdown also matters: if grain size is only a small part of the story, then chasing ever finer grains is not the best way to make this alloy stronger.

## How they did it

The alloy was made from a commercial aluminium-magnesium alloy plus pure zinc and an aluminium-copper master alloy. One batch was gravity cast; the other ran through the rheo-extrusion machine into a 9.5 mm rod. Grains and boundary angles came from electron backscatter diffraction (EBSD) maps in a scanning electron microscope, particles from transmission microscopy, dislocation density from the X-ray peak broadening (a Williamson-Hall analysis), and strength from three tensile tests per condition. The Hall-Petch constant, k = 0.14 MPa·m^½, was taken from earlier work.

## Check it yourself with fibub

You can redo the grain boundary term with nothing but a calculator, and measure grain size on your own etched sections with the intercept tool. The counts below are **made up by fibub**; they are not the paper's.

1. **The Hall-Petch term.** The grain boundary share of the strength rise is k × (1/√d₂ − 1/√d₁), with d in metres. Using the paper's numbers: 0.14 × (1/√(16.1 × 10⁻⁶) − 1/√(53.5 × 10⁻⁶)) = 0.14 × (249.2 − 136.7) ≈ 15.8 MPa. That matches the paper's value, which suggests the 16.5 µm figure that appears once in the text is a typo for 16.1.
2. **Open a micrograph.** In the intercept tool, open an etched image (or press "Use the example"), draw along the scale bar and type its length, then set the area to analyse.
3. **Lay the lines.** Choose "Horizontal and vertical" with 5 lines in each direction, and dark boundary lines for an etched section. Tap any boundary the page missed, and tap any false mark to remove it.
4. **Read the result.** Suppose ten lines of 400 µm each cross 26, 24, 27, 23, 25, 22, 26, 24, 28 and 25 boundaries, 250 in all. The mean lineal intercept is 4,000 ÷ 250 = 16 µm, the ASTM grain size number G is about 8.6, and the 95 % interval on ℓ runs from about 15.2 to 16.9 µm.
5. **Compare a coarse sample.** Ten 1,600 µm lines crossing 295 boundaries in all give ℓ ≈ 54 µm and G ≈ 5.1. Put 16 and 54 µm into the Hall-Petch line above and you get about 15.9 MPa, almost the same as the paper's term.

One caution: an EBSD "average grain size" is often an equivalent circle diameter, which is not the same number as a mean lineal intercept. Compare like with like before mixing your values with a paper's.

## The fine print

This is one alloy, one set of extrusion conditions and three tensile bars per condition, with no heat-treatment state stated and no fatigue, corrosion or high-temperature tests. Some numbers in the paper do not hold together. The Vickers hardness is given as about 528 to 551 HV, which is not physically possible for an aluminium alloy of this strength: aluminium alloys sit roughly between 20 and 200 HV, and a tensile strength of 338 MPa points to about 100 HV. A slip in units is the likely cause. The grains are called equiaxed in one section and elongated in another, the sizes quoted for the iron-rich particles disagree, and the 49 MPa dislocation term cannot be checked because the constant behind it is not given.
