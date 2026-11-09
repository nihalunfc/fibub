---
name: Blackbody calculator
num: 56
shelf: science
section: stellar-astrophysics
title: "Blackbody calculator: Planck spectrum, Wien peak, luminosity and star magnitudes from temperature"
summary: "Type a temperature, a B − V colour or a peak wavelength to get the Planck spectrum, Wien peak, power per square metre and how it splits into UV, visible and infrared; add a radius and distance for a star's luminosity, bolometric correction and magnitudes."
status: live
ads: true
order: 12
icon: star
works: offline
updated: 2026-11-08
related: [magnitude-flux-converter, habitable-zone-calculator, redshift-calculator, period-finder]
sources:
  - "Physical constants: CODATA recommended values (NIST)."
  - "Bolometric correction: the published fit of Flower (1996) as corrected by Torres (2010)."
  - "Colour temperature: the formula of Ballesteros (2012)."
flow:
  - { icon: sliders, label: "Temperature" }
  - { icon: curve, label: "Spectrum" }
  - { icon: star, label: "Star" }
---

## What it does

Anything warm glows, and a perfect absorber, a black body, glows with a spectrum set only by its temperature. Stars, light bulb filaments, your skin and the afterglow of the Big Bang all come close. This calculator draws that spectrum (Planck's law) for any temperature. It gives the peak wavelength and peak frequency, the power from each square metre, and how the light splits into ultraviolet, visible and infrared. For a star, add its radius and it gives the luminosity, the bolometric and visual absolute magnitudes, and the bolometric correction. Add a distance and it gives how bright the star looks from Earth.

To turn the spectrum into magnitudes, use the [[magnitude-flux-converter]]; to see where a planet around the same star would stay temperate, the [[habitable-zone-calculator]].

## How to use it

1. Pick an **example**, or choose what you know: a **temperature** in kelvin, a star's **B − V colour**, or the **peak wavelength**.
2. Optionally type a second temperature under **Compare with** to draw both spectra on one chart.
3. For a star, type its **radius** in solar radii and, if you like, its **distance** in parsecs.

## What each result means

- **Peak per wavelength**: Wien's law, λ = 2.898 mm K ÷ T. The Sun peaks at 502 nm.
- **Peak per frequency**: the spectrum per unit frequency peaks at a different place (for the Sun about 880 nm). Neither is "the" colour; both are correct for their own units.
- **Power per square metre**: σT⁴, the Stefan-Boltzmann law.
- **Where the power goes**: the share between 400 and 700 nm is visible light, shorter is ultraviolet and longer is infrared.
- **Luminosity**: 4πR²σT⁴, in Suns and watts.
- **Bolometric correction**: the difference between a star's visual and total (bolometric) magnitude. It comes from real stellar spectra, using the Flower (1996) fits as corrected by Torres (2010). It is close to zero for stars like the Sun and large for very hot or very cool stars, which shine mostly outside the visible.
- **B − V to temperature**: Ballesteros (2012), good for stars near the main sequence.

## Worked example

The Sun at 5772 K peaks at 502 nm and gives off 62.9 MW from every square metre, 37 % of it as visible light. With a radius of 1 it has one solar luminosity, a bolometric magnitude of 4.74, a bolometric correction of −0.081 and a visual absolute magnitude of 4.82. Sirius A, at 9940 K and 1.711 solar radii, is 25.7 times as luminous as the Sun. At 2.64 parsecs it shines at V = −1.44, close to the measured −1.46. An incandescent filament at 2700 K peaks at 1.07 µm in the infrared and sends only 5 % of its power out as visible light, which is why such bulbs were so inefficient.

## Frequently asked questions

**Are stars really black bodies?** Roughly. Absorption lines and the changing depth we see into the atmosphere bend their spectra, so the effective temperature is defined as the black body temperature that gives the same total power.

**Why does the chart show radiance relative to the peak?** Hot bodies are so much brighter per square metre that absolute numbers would hide the shape. When you compare two very different temperatures, the chart switches to a log scale.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
