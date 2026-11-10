---
title: "NiOx thin films: RF sputtering power raises AFM surface roughness"
summary: "A 2026 study sputtered 110 nm nickel oxide films at 75 to 150 W and found the rms roughness rising from under 1 nm to 4.5 nm. Here is how to check Sa, Sq, Ssk and Sku yourself."
tools: [afm-roughness, tauc-plot, xrd-peak-calculator]
updated: 2026-11-10
sources:
  - "Areal roughness parameters Sa, Sq, Ssk and Sku as defined in ISO 25178-2; the ratio Sq/Sa = √(π/2) ≈ 1.25 for a Gaussian height distribution is standard statistics."
  - "The height map in the worked example is the tool's own built-in made-up example (5 × 5 µm, 128 × 128 points, a tilt and a 20 nm step); it is not data from the paper."
paper:
  title: "RF Sputtering Power-Driven Growth and Structure–Property Relationships in NiOx Thin Films Deposited at Room Temperature"
  authors: "Vázquez-y-Parraguirre S, Álvarez Samario I, Mansurova S, Kudriavtsev Y, Cosme I"
  journal: "Coatings"
  year: 2026
  doi: "10.3390/coatings16101129"
  url: "https://doi.org/10.3390/coatings16101129"
  licence: "CC BY"
  reviewed: true
---

Nickel oxide (NiOx) is a wide-gap oxide used as the hole-collecting layer in perovskite solar cells, in gas sensors and in windows that darken on demand. A September 2026 paper in Coatings sputtered NiOx films at room temperature and showed that the radio-frequency power alone changes their crystal orientation, their electrical resistance and how rough their surface is. Surface roughness came from atomic force microscopy (AFM) height maps, and the [[afm-roughness]] tool turns any exported height map into the same numbers in your browser, so you can see how levelling and stray specks change them.

## What they found

Films about 110 nm thick were grown at five powers from 75 to 150 W. The root-mean-square roughness Sq stayed below 1 nm at 75 and 85 W, rose to about 1.5 nm at 100 and 125 W, and jumped to 4.53 nm at 150 W. All films were polycrystalline nickel oxide with a cubic rock-salt structure; the favoured crystal direction switched from (111) at low power to (200) at higher power, while the crystallite size stayed between about 13 and 15 nm. The direct optical gap fell gently from 4.01 to 3.86 eV as the power went up, and the films let through about three-quarters of visible light. Resistivity did not follow a simple trend, ranging from about 25 to 310 kΩ·cm.

## Why it matters

A hole-transport layer has to be smooth: spikes and pits can short a thin solar cell or leave gaps in the layer above. Sputtering is a cheap, scalable method that needs no heating, so knowing that power above about 125 W roughens the film quickly is useful for anyone trying to scale it up.

## How they did it

A ceramic NiOx target was sputtered in pure argon at 6 mTorr onto glass and silicon held near 27 °C, with the deposition time adjusted so every film reached about 110 nm. Structure came from X-ray diffraction, optical gaps from Tauc plots of transmittance, and resistivity from current-voltage curves between gold pads. AFM scans covered about 2 × 2 µm at 256 × 256 points, levelled with a plane and simple flattening, one map per film.

## Check it yourself with fibub

The tool has a built-in **made-up** height map, so you can repeat every number below. It is 5 × 5 µm at 128 × 128 points, a gently tilted surface with fine random texture and a 20 nm step at the right-hand side. It is not the paper's data, and its scale is not the paper's (2 × 2 µm).

1. Press **Use the example**. The text box fills with the height matrix and the heights are in nm.
2. Under *Levelling*, set *Take off a surface* to none. The whole image gives **Sa 11.18 nm and Sq 12.37 nm**: almost all of that is tilt and the step, not texture.
3. Set it to *plane (tilt)* and *Fitted to* the whole image. Sa falls to **4.77 nm and Sq to 5.56 nm**, but the step still counts as roughness.
4. Now fit the plane to *region A only* (the default, a clean patch on the left) and read the *Regions* results for region A. Its own roughness is **Sa 0.17 nm, Sq 0.20 nm, Ssk 0.20, Sku 2.01**. The same surface has given Sq values from 0.2 nm to 12 nm, depending only on levelling and on which pixels you count.
5. Read Ssk and Sku. A positive skew means peaks stand out more than valleys, as grains on a film do; Sku near 3 means the heights are close to a bell curve, and below 3 means flatter than that.

Here is a quick check you can run on any table of results: for heights that follow a bell curve, Sq/Sa is √(π/2), about 1.25. Region A gives 1.17, a little under, in line with its flatter-than-bell Sku of 2.0. A sudden rise in Sku with only a small rise in Sa usually means a few particles on a clean film, not a rougher film. To find out, drag *Region A* over a clean patch to get the film's own roughness, or drag a *Profile line* across a speck to measure its height.

For the rest of the paper's analysis, the [[tauc-plot]] tool reads the optical gap from a transmittance spectrum, and the [[xrd-peak-calculator]] gives crystallite sizes from peak widths.

## The fine print

- Each roughness value comes from a single 2 × 2 µm map per film. Roughness depends on the scan size and pixel size, so compare only scans taken the same way.
- Deposition time changed with power to keep the thickness fixed, so power and time are tied together and their effects cannot be separated.
- Line-by-line flattening, used in the paper, can remove real height differences along the scan rows.
- Resistivity was measured between two contacts, so contact resistance is included, and the authors note that the films' p-type behaviour was not confirmed by Hall or Seebeck measurements.
- The thinner film series (17 to 74 nm) was grown at fixed power, so it is a separate question from the power series.
