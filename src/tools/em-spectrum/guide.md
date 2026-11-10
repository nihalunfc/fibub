---
name: Electromagnetic spectrum explorer
num: 1419
shelf: learn
code: L273
section: school-physics
title: "Electromagnetic spectrum: wavelength, frequency and photon energy from gamma rays to radio waves, with uses"
summary: "Drag along the electromagnetic spectrum from gamma rays to radio waves and see the band, what it is used for, the frequency f = c/λ and the energy of one photon in joules and electronvolts. Jump to everyday examples such as a TV remote, Wi-Fi, a microwave oven or FM radio."
status: live
ads: false
order: 1419
icon: eye
works: offline
updated: 2026-11-09
related: [em-wave-3d, hydrogen-spectrum, photoelectric-lab, prism-dispersion]
sources:
  - "f = c/λ and E = hf = hc/λ, with c = 299 792 458 m/s, h = 6.62607015 × 10⁻³⁴ J s and e = 1.602176634 × 10⁻¹⁹ C, all exact in the SI (NIST)."
  - "Band edges (gamma below 1 pm, X-rays 1 pm to 1 nm, ultraviolet to 400 nm, visible to 700 nm, infrared to 1 mm, microwaves to 1 m, radio above) are the usual school-book conventions; real bands overlap and other books draw the edges a little differently."
  - "Everyday examples use typical rounded values (2.45 GHz microwave ovens, 5 GHz Wi-Fi, 1.8 GHz mobile phones, 100 MHz FM, 1 MHz AM, 940 nm remote controls, 254 nm germicidal lamps, the 1.17 MeV cobalt-60 gamma line). The on-screen colours of visible light are an approximation."
  - "Checked against an independent Python script."
flow:
  - { icon: sliders, label: "Wavelength" }
  - { icon: eye, label: "Band, uses" }
  - { icon: calculator, label: "f and E" }
  - { icon: check, label: "Check" }
---

## What it does

Radio waves, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays are all the same thing: **electromagnetic waves**, travelling at the same speed c = 3 × 10⁸ m/s in empty space. What makes them different is their **wavelength** λ, and with it their **frequency** f = c/λ and the **energy of each photon**, E = hf = hc/λ. Together they make the electromagnetic spectrum, which spans from gamma rays shorter than an atomic nucleus to radio waves longer than a football field.

This page puts the whole spectrum on one strip, on a log scale so every band gets room. Drag the slider from 0.1 pm to 1 km, or jump to an everyday example, and the page names the band, says what it is used for, and gives the frequency, the photon energy in joules and in electronvolts, and how many waves fit in a metre. For visible light it also shows the colour.

It follows the electromagnetic waves chapter of Class 12 Physics (the electromagnetic spectrum: radio waves, microwaves, infrared, visible rays, ultraviolet, X-rays and gamma rays), and the Class 11 Chemistry chapter on the structure of the atom (the nature of electromagnetic radiation, photon energy). See the wave itself in [[em-wave-3d]], the colours a hydrogen atom gives out in the [[hydrogen-spectrum]], and why only high-energy photons knock out electrons in the [[photoelectric-lab]].

## How to use it

1. Drag the **λ** slider. The red marker moves along the strip.
2. Or pick an **everyday example** from the list: the page jumps to its wavelength.
3. Read the band and its uses, then the frequency, the photon energy and the working.

## Worked example

The page opens at λ = 525 nm, green light.

- f = c / λ = 3 × 10⁸ / 525 × 10⁻⁹ = **5.71 × 10¹⁴ Hz** (571 THz).
- E = h f = 6.63 × 10⁻³⁴ × 5.71 × 10¹⁴ = **3.78 × 10⁻¹⁹ J**.
- Dividing by 1.6 × 10⁻¹⁹ J per eV gives **2.36 eV**. The shortcut 1240 / 525 gives the same.

Jump to **FM radio (100 MHz)**: λ = 3 m, and each photon carries only 4.13 × 10⁻⁷ eV. Jump to the **germ-killing UV lamp** (254 nm): 4.88 eV, enough to damage the DNA of germs.

## Tips

- Going left on the strip (shorter λ) means higher frequency and more energetic photons.
- Whether radiation can harm cells depends on the energy per photon, not just on how bright it is. Photons above a few eV (UV, X-rays, gamma) can break chemical bonds.
- Our eyes see only 400 to 700 nm, roughly a single doubling of wavelength out of the whole spectrum.

## FAQ

**Why do books give different band edges?** The bands are named by how they are made and used, and they overlap. For example, X-rays and gamma rays of the same energy are the same; the name tells you whether it came from electrons or from a nucleus.

**Is the colour exact?** No. Screens cannot show pure spectral colours, so the swatch is a close match.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
