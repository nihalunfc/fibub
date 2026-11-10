---
title: "Tephra fall volume of the Sii Aks (Tseax) eruption, Canada, from 96 pits"
summary: "A 2026 Bulletin of Volcanology study dug 96 pits to measure the tephra of a young basaltic eruption in Canada. See what it found, and how to test isopach volume fits yourself."
tools: [tephra-volume, grain-size-stats]
updated: 2026-11-10
sources:
  - "Osman S, Jones TJ, McCartney KN, Le Moigne Y, Russell JK, Williams-Jones G (2026), Bulletin of Volcanology 88: 18, CC BY 4.0, the paper described here."
  - "Volume methods named in the tool: Pyle (1989); Fierstein and Nathenson (1992); Bonadonna and Houghton (2005); Bonadonna and Costa (2012). VEI classes: Newhall and Self (1982)."
  - "The eight isopachs in the worked example are made up by fibub."
paper:
  title: "The volume of explosive products erupted during the ~ 1700 CE eruption of Sii Aks (Tseax), Canada"
  authors: "Osman S, Jones TJ, McCartney KN, Le Moigne Y, Russell JK, Williams-Jones G"
  journal: "Bulletin of Volcanology"
  year: 2026
  doi: "10.1007/s00445-026-01941-5"
  url: "https://doi.org/10.1007/s00445-026-01941-5"
  licence: "CC BY 4.0"
  reviewed: true
---

Around 1700 CE a small basaltic volcano in northwest British Columbia, now called Sii Aks (Tseax), built a scoria cone and sent a long lava flow down the valley. The lava has been studied for decades, but the blanket of ash and cinders that fell around the cone had never been measured on the ground. A team of volcanologists has now done it, digging 96 pits through forest soil, and reports a tephra fall volume of 2.5 to 3.4 million cubic metres. This page explains the study in plain words and shows how to run the same kind of isopach volume fit on your own numbers with the [[tephra-volume|tephra volume tool]], and how to describe the grains you dig up with [[grain-size-stats]].

## What they found

- The tephra fall deposit holds about **2.5 to 3.4 × 10⁶ m³** of material. Three different curve fits gave answers inside that range, so the result does not hang on one method.
- Adding the cone, the spatter ramparts and a small satellite cone (measured in earlier work) brings all the explosive products to about **5.7 to 8.0 × 10⁶ m³**, which places the eruption at **VEI 2** on the Volcanic Explosivity Index.
- That is only about **1 %** of the lava's volume, which earlier work put near half a cubic kilometre. Sii Aks was mostly an effusive eruption with a modest explosive side.
- The authors call this the first field-based, ground-checked tephra fall volume for a Canadian mafic (basaltic) eruption.

## Why it matters

Hazard plans for a volcano start from what it has done before. Canada has many young volcanoes, mostly in remote, forested country, and few have measured deposits. A real number for a small basaltic eruption gives planners a starting point for "what if it happened again", and it gives modellers a case to test ash dispersal codes against.

## How they did it

The team dug pits at 96 sites, measured the tephra thickness in each, and noted where pits did not reach the base. Near the cone the deposit was more than 1.5 m thick; it thinned to nothing about 3 km to the northeast. They drew lines of equal thickness (**isopachs**) by kriging, a statistical way of filling in a map between points, from 100 cm down to 5 cm. Kriging could not close the thinner lines, so a 1 cm line and the outer edge were drawn by hand. With the area inside each isopach, they fitted exponential (one to three straight segments), power-law and Weibull curves in the AshCalc software, and chose fits by their error. They turned volume into mass with a range of deposit densities borrowed from the 2021 La Palma eruption.

## Check it yourself with fibub

The tephra volume tool takes the same kind of input the paper used: one line per isopach, thickness then the area inside it. The numbers below are **made up by fibub** for an imaginary small cinder cone. They are not the paper's data.

| Thickness (cm) | Area inside (km²) |
|---|---|
| 150 | 0.1 |
| 80 | 0.45 |
| 40 | 1.2 |
| 20 | 2.4 |
| 10 | 4.0 |
| 5 | 6.0 |
| 2 | 8.6 |
| 1 | 12.5 |

1. **Type the isopachs.** Paste the two columns into the box, leave thickness in cm and area in km².
2. **Compare the exponential fits.** With **Exponential segments** set to 1 the bulk volume is about **1.87 × 10⁶ m³**. Two segments give about **1.92 × 10⁶ m³** (the page splits after the 5 cm line, where the distal thinning slows down) and three about 1.91 × 10⁶ m³. All are VEI 2, since that class starts at 10⁶ m³.
3. **Read the Weibull row.** It gives about **1.91 × 10⁶ m³**, right on top of the exponential answers. When independent fits agree like this, as they did in the paper, the result is robust.
4. **Push the power law.** Set B to 0.1 km and C to 5 km: about 2.24 × 10⁶ m³. Change C to 10 km and it climbs to about 2.59 × 10⁶ m³; move B out to 0.3 km and it drops to about 1.56 × 10⁶ m³. The power law needs limits, and for a small deposit with few thin isopachs it is the least stable of the three.
5. **Test a minimum thickness.** The paper notes that some pits near the vent did not reach the base. Change the 150 cm line to 200 cm: the two-segment volume rises by about 5 %, to about 2.01 × 10⁶ m³.
6. **Turn volume into mass.** The tool takes one deposit density at a time. At 800 kg/m³ the two-segment volume weighs about 1.5 × 10⁹ kg; at 1450 kg/m³ about 2.8 × 10⁹ kg. With a magma density of 2800 kg/m³ for basalt and 1000 kg/m³ for the deposit, the dense-rock equivalent is about 0.68 × 10⁶ m³.

If you also sieved samples from the pits, the grain size tool gives the mean size and sorting of each one.

## The fine print

- The authors call their volumes **minimums**: several pits stopped above the base, and thicker tephra near the cone could add something like 15 to 20 %.
- The thinnest isopach and the outer edge were hand-drawn, and some lines were stretched beyond the pits. Hand-drawn lines vary between people.
- Dense forest and tree roots limited where pits could go, and some tephra may have been moved by slopes since 1700.
- The density range comes from a different basaltic eruption, so the mass is approximate.
