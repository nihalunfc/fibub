---
title: "AlSi10Mg by laser powder bed fusion: layer thickness and very high cycle fatigue"
summary: "A 2025 Crystals study found that printing AlSi10Mg in 80 µm layers instead of 50 µm left bigger pores and cut the fatigue limit from about 70 to 15 MPa."
tools: [fatigue-sn-calculator, fracture-toughness-calculator, stress-strain-analyser]
updated: 2026-11-10
sources:
  - "Liu L, Wang S, Ma Y (2025), Rotating Bending Fatigue Behavior of AlSi10Mg Fabricated by Powder Bed Fusion-Laser Beam: Effect of Layer Thickness, Crystals 15(5): 422, published 30 April 2025. Open access, CC BY. Details checked on the publisher's page, 2026-11-10."
  - "Basquin's law σa = A N^b: standard stress-life fatigue (Dowling, Mechanical Behavior of Materials, chapter 9)."
  - "Murakami's estimate K = 0.5 or 0.65 × σ √(π √area) for a small defect: Murakami Y, Metal Fatigue: Effects of Small Defects and Nonmetallic Inclusions (Elsevier, 2002)."
  - "The S-N points and defect sizes in the worked example are made up by fibub for this page; they are not the paper's data."
paper:
  title: "Rotating Bending Fatigue Behavior of AlSi10Mg Fabricated by Powder Bed Fusion-Laser Beam: Effect of Layer Thickness"
  authors: "Liu L, Wang S, Ma Y"
  journal: "Crystals"
  year: 2025
  doi: "10.3390/cryst15050422"
  url: "https://www.mdpi.com/2073-4352/15/5/422"
  licence: "CC BY"
  reviewed: true
---

Printing metal parts layer by layer is faster when each layer is thicker, so there is steady pressure to raise the layer height. A 2025 open-access study in *Crystals* shows what that can cost. Bars of the aluminium alloy AlSi10Mg printed in 80 µm layers had a fatigue limit of only about 15 MPa under rotating bending, against about 70 MPa for bars printed in 50 µm layers with the same laser settings. This page explains why, and shows how to fit your own stress-life results in the [[fatigue-sn-calculator]] and size up the defect that started a crack with the [[fracture-toughness-calculator]]. If you have the tensile curves too, the [[stress-strain-analyser]] gives the strength values the fatigue page asks for.

## What they found

Both groups showed the classic shape for printed aluminium: a sloping line in the high-cycle range, then a nearly flat plateau stretching out to 10⁸ cycles, the very high cycle fatigue (VHCF) range. The thin-layer bars started at about 150 MPa near 3 × 10⁴ cycles and flattened at roughly 70 to 85 MPa. The thick-layer bars started near 100 MPa and flattened at about 15 to 25 MPa.

X-ray tomography explained the gap. The thick-layer bars held about ten times as many pores, and the pores that mattered were far larger: roughly 170 to 450 µm across, against about 60 to 140 µm in the thin-layer bars. Most were lack-of-fusion holes, irregular gaps where the powder did not fully melt, plus some round gas pores. Cracks almost always started at an unfused defect at or just below the surface. At high stress several cracks started at once; in the VHCF range a single defect did the job.

## Why it matters

Printed aluminium brackets and housings go into cars, drones and aircraft, where vibration adds up to hundreds of millions of cycles. A fatigue limit that drops by a factor of four or five means a part sized for one build setting could fail in service at another. The paper also backs a simple, useful idea: for printed metals, the size of the largest defect, not the average microstructure, sets the fatigue strength.

## How they did it

All bars came from one powder batch and were printed horizontally, 10 mm across and 100 mm long, at 370 W laser power, 1,300 mm/s scan speed and 0.19 mm hatch spacing. Only the layer thickness changed, so the volumetric energy density fell from about 30 to about 19 J/mm³. The fatigue bars were machined and polished, then spun as cantilevers at 52.5 Hz, which loads every surface point fully in tension and then fully in compression (stress ratio R = −1). Synchrotron tomography at 3.25 µm resolution mapped the pores in smaller samples, and the fracture surfaces were studied in the electron microscope. The defects were sized with Murakami's √area, the square root of the defect's area seen along the loading direction.

## Check it yourself with fibub

The numbers below are **made up by fibub** to look like the two groups; they are not the paper's measurements.

1. **Paste a good group.** In the S-N box, one bar per line: stress amplitude in MPa, cycles, and a run-out flag. Our thin-layer set is 150 at 35,000; 130 at 140,000; 115 at 220,000; 100 at 800,000; 90 at 1.2 million; 80 at 4.5 million; and 75 MPa reaching 2 × 10⁸ without breaking, marked 1 as a run-out.
2. **Read the fit.** Keep "log N on log S", the usual choice when the stress is set and the life is measured. Basquin's line comes out as σa ≈ 635 N^−0.137, with r² about 0.985. The strength at 10⁷ cycles reads about 70 MPa.
3. **Swap in a poor group.** Replace the data with 100 at 50,000; 80 at 200,000; 60 at 360,000; 45 at 1.4 million; 35 at 2 million; 25 at 7 million; and a 20 MPa run-out. The exponent steepens to about −0.295 and the strength at 10⁷ cycles falls to about 23 MPa. The steeper slope is the signature of larger defects.
4. **Mind the plateau.** Basquin's law is a single straight line on log-log axes. It cannot bend into a flat VHCF plateau, so fit only the sloping part, and read the plateau from the run-outs rather than from the line.
5. **Size the starter defect.** Open the fracture toughness calculator, choose "Your own Y" and type Y = 0.65, Murakami's factor for a defect at the surface. For the crack size, type the defect's √area in millimetres. A 0.3 mm defect at 50 MPa gives K ≈ 1.0 MPa√m; a 0.1 mm defect at the same stress gives about 0.58 MPa√m. Because K grows with the square root of size, a defect nine times larger in area needs only about 58 % of the stress to reach the same K.

## The fine print

Only one setting was changed and only two groups were tested, so this is a clear contrast, not a full trend with layer height. The paper does not report the number of bars at each stress or any fitted S-N constants, and the tensile results appear only in a figure. Polishing removed the rough as-built surface, which in real parts is often the worst defect of all. The abstract mentions a higher VHCF failure probability for the thin-layer group, which the main text does not discuss and which sits oddly with its better results, so read that line with care. The rough stress-intensity ranges given for the two groups also overlap widely, which weakens the claim that the thick-layer group needs a clearly lower threshold to start a crack.
