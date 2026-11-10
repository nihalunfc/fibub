---
title: "Sintering 4Y zirconia: grain size by linear intercept and translucency"
summary: "A 2026 study sintered 4 mol% yttria dental zirconia 12 ways and measured grain size by the linear-intercept method. Here is how to repeat that count on your own micrographs."
tools: [grain-size-intercept, uncertainty-calculator, particle-size-image]
updated: 2026-11-10
sources:
  - "Chung, T.-J., Kim, M.-J., Kwon, H.-B., Kim, B. and Lim, Y.-J. (2026), Effects of Sintering Parameters on the Microstructure and Optical Transmittance of Monolithic 4 mol% Yttria-Partially Stabilized Zirconia, Bioengineering 13(6), 702, published 19 June 2026. Open access (CC BY). Details checked on the publisher's page, 2026-11-10."
  - "ASTM E112 relation G = −6.6457 log10(ℓ in mm) − 3.298, and the Mendelson factor d = 1.56 ℓ for the mean grain size from the mean intercept: published relations, used here for illustration only."
paper:
  title: "Effects of Sintering Parameters on the Microstructure and Optical Transmittance of Monolithic 4 mol% Yttria-Partially Stabilized Zirconia"
  authors: "Chung TJ, Kim MJ, Kwon HB, Kim B, Lim YJ"
  journal: "Bioengineering"
  year: 2026
  doi: "10.3390/bioengineering13060702"
  url: "https://www.mdpi.com/2306-5354/13/6/702"
  licence: "CC BY"
  reviewed: true
---

Dental labs fire zirconia crowns on schedules the maker recommends, but furnaces, workloads and impatience tempt people to change them. A 2026 open-access study in *Bioengineering* took one commercial 4 mol% yttria zirconia and fired it twelve different ways, changing the top temperature, the hold time and the heating rate, then measured the grains, the internal defects and how much light passed through. Grain size was counted with the classic linear-intercept method, which is exactly what the [[grain-size-intercept]] tool does on a micrograph in your browser, and the [[uncertainty-calculator]] helps you carry the error bars through.

## What they found

Hotter and longer firing grew the grains. Across peak temperatures of 1470 to 1560 °C (two-hour hold), the mean grain size reported in the paper rose from about 0.48 µm to about 0.79 µm. Holding at 1530 °C for 30 minutes instead of three hours gave about 0.50 µm against 0.73 µm. The heating rate, from 3 to 10 °C per minute, made no significant difference to grain size.

The light result was subtler. Total light transmittance through 0.5 mm discs stayed in a narrow band of roughly 40 to 43 %. The longest hold gave slightly more light than the shortest, and the hottest firing gave slightly less than the coolest. Pore-like defects of 0.5 µm and larger became rarer with hotter firing and with the longest hold.

## Why it matters

Light scatters at grain boundaries, at pores and where crystals of different types meet. In 4 mol% yttria zirconia some of the grains are cubic rather than tetragonal, and that mix changes with firing, so bigger grains do not simply mean a clearer crown. The paper gives labs evidence that small changes to a schedule shift the microstructure without a large change in appearance, while heating rate can be relaxed within the tested range. For anyone making ceramics, it is also a tidy example of reporting grain size with the method, the correction factor and the number of grains stated.

## How they did it

Pre-sintered blocks were cut into discs, fired, and ground to 0.5 mm. Sections for microscopy were polished and thermally etched at 1400 °C for an hour, which makes the boundaries show up as grooves. Images were taken with a field-emission scanning electron microscope at 10,000 times. The authors measured the mean linear intercept following ASTM E112 and multiplied it by 1.56 (the Mendelson factor) to turn it into a mean grain size. They used about ten fields per group and more than 100 grains. Transmittance was measured with a spectrophotometer under a standard daylight illuminant, and defects were counted in lower-magnification images.

## Check it yourself with fibub

The [[grain-size-intercept]] tool lays test lines over a micrograph, counts where they cross grain boundaries and gives the mean lineal intercept ℓ and the ASTM grain size number G. The counts below are **our own made-up numbers** for an imagined SEM image, not data from the paper.

1. Open your thermally etched SEM image, or press *Use the example* to try the steps first.
2. Tap *Draw on the scale bar*, tap both ends and type its length (for instance 1 µm). Then *Set the area to analyse* so the data strip is left out.
3. Choose *Horizontal and vertical* with 5 lines in each direction, and *Dark lines (etched)*. Thermal grooves usually read as dark lines in SEM images.
4. Check the orange marks. Tap to add a missed boundary or remove a mark on dirt or a polishing scratch.
5. Suppose the 10 lines are each 12 µm long and together cross **255** boundaries. The page gives ℓ = 120 ÷ 255, about **0.471 µm**, and G = **18.81**. With our per-line counts (26, 24, 27, 25, 28, 23, 26, 25, 24 and 27) the 95 % interval on ℓ is about **0.451 to 0.492 µm**, a relative accuracy of about **4.4 %**.
6. To compare with a paper that uses the Mendelson factor, multiply: 1.56 × 0.4706 µm = **0.734 µm**. Do it the other way too: the paper's 0.785 µm size corresponds to an intercept of about 0.503 µm and G of about 18.6 by our conversion.

Two cautions. First, G numbers this high lie beyond the charts in the standard, so for submicron ceramics report ℓ in micrometres rather than G alone. Second, the 1.56 factor assumes a particular grain shape; other groups report the intercept itself, with no factor, which makes the same microstructure look about a third finer, so always state which one you used. The [[uncertainty-calculator]] lets you combine the counting interval with an error on the scale bar. To compare with an area-based measurement, outline separated grains in [[particle-size-image]].

## The fine print

- **One product.** Only one commercial zirconia was tested, so other brands and yttria contents may behave differently.
- **Small groups.** Three specimens per outcome per group; the transmittance comparisons rest on n = 3.
- **Separate furnace runs.** The reference schedule was fired in different runs for each series, which limits comparisons between series.
- **No strength or ageing tests.** Mechanical properties, low-temperature degradation and colour were not measured, so the study says nothing about how long crowns made this way would last.
- **2D sections.** Defects were counted on polished planes, not as a 3D pore volume.
- Our numbers are invented to show the method. For the measured values, read the paper itself.
