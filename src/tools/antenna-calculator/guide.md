---
name: Antenna calculator
num: 632
shelf: science
section: rf-and-communications
title: "Antenna length calculator: dipole, quarter-wave monopole, microstrip patch and Yagi"
summary: "Work out antenna sizes from the frequency: half-wave dipole and quarter-wave monopole lengths, a rectangular microstrip patch (width, effective permittivity, fringing length, edge resistance and inset feed) and a starting Yagi-Uda layout, with every formula shown."
status: live
ads: true
order: 632
icon: ruler
works: offline
updated: 2026-11-09
related: [link-budget-calculator, radio-telescope-calculator, wave-calculator, smith-chart, constellation-ber, waveguide-modes, skin-depth-calculator, pcb-trace-calculator]
sources:
  - "Dipole and monopole: standard antenna theory (resonant half-wave dipole, image theory), for example Balanis, Antenna Theory: Analysis and Design, chapter 4."
  - "Microstrip patch: transmission-line model with Hammerstad's fringing extension, radiating-slot and mutual conductances and inset feed, as described in Balanis, Antenna Theory, chapter 14; checked against Balanis's worked examples and an independent scipy implementation."
  - "Yagi-Uda element lengths and spacings: widely quoted rules of thumb (in wavelengths), stated as approximate starting values, not taken from any one design table."
  - "Speed of light: exact SI value. Example values are made up by fibub."
flow:
  - { icon: sliders, label: "Frequency" }
  - { icon: ruler, label: "Lengths" }
  - { icon: download, label: "Download" }
---

## What it does

Most antennas are sized from the wavelength, λ = c / f. This calculator turns a frequency into the lengths you cut or etch for four common antennas, shows each formula, and draws the result:

- **Half-wave dipole**: two equal wires fed in the centre, the reference antenna of radio.
- **Quarter-wave monopole**: a whip or ground-plane antenna, half a dipole above a conducting surface.
- **Rectangular microstrip patch**: a copper rectangle on a circuit board, used in Wi-Fi, GPS and 5G devices. It uses the transmission-line model to give the width, effective permittivity, fringing extension and length, then the edge resistance and the inset depth for a 50 Ω (or other) feed.
- **Yagi-Uda beam**: a driven element with a reflector and directors, laid out from common rules of thumb as a starting point.

All the arithmetic happens in your browser.

Match the antenna to its feed line with the [[smith-chart]], and check the whole radio path with the [[link-budget-calculator]].

## How to use it

1. Choose the antenna with the buttons at the top.
2. Type the **frequency** and choose kHz, MHz or GHz. Choose metric or imperial lengths.
3. **Dipole and monopole:** the **shortening factor** allows for the end effect: a real resonant wire is a little shorter than the free-space half wavelength. About 0.95 to 0.98 for thin wire is the usual starting point; thick tubes need less.
4. **Patch:** type the board's **relative permittivity** εr and **thickness** h, and the **impedance** of the feed line you want to match (50 Ω is usual). Use the εr your laminate's maker gives at your frequency.
5. **Yagi:** pick the number of directors. Every ratio (element lengths and spacings in wavelengths) can be changed.

## Worked example

The page opens with a dipole for 145 MHz (the 2 m amateur band). The wavelength is 2.0675 m, so the free-space half wavelength is 1.0338 m. With a shortening factor of 0.95 the dipole is **98.21 cm** long, each side 49.1 cm.

Switch to **Patch**: the frequency changes to 2.45 GHz. On a 1.6 mm board with εr = 4.4, the patch is **3.723 cm wide and 2.881 cm long**, εeff = 4.081 and ΔL = 0.7386 mm. The edge resistance is 321.4 Ω, so a 50 Ω line is fed through notches 1.069 cm deep. The ground plane should be at least 4.683 × 3.841 cm.

## Formulas

- Wavelength: λ = c / f, with c = 299,792,458 m/s.
- Dipole: L = k·λ/2. Monopole: L = k·λ/4.
- Patch width: W = c/(2f) · √(2/(εr + 1)).
- Effective permittivity: εeff = (εr + 1)/2 + (εr − 1)/2 · (1 + 12h/W)^(−1/2).
- Fringing: ΔL = 0.412h (εeff + 0.3)(W/h + 0.264) / ((εeff − 0.258)(W/h + 0.8)).
- Patch length: L = c / (2f√εeff) − 2ΔL.
- Edge resistance: Rin = 1 / (2(G1 + G12)), with the slot conductance G1 and mutual conductance G12 found by numerical integration; inset depth y0 = (L/π)·acos(√(Z0/Rin)).

## FAQ

**How accurate is the patch?** The transmission-line model is usually within a few percent for thin boards (h well below λ/10). The εr of FR-4 varies from batch to batch, so expect to trim or tune. A full-wave simulator gives the final answer.

**Are the Yagi numbers a design?** No. They are the commonly quoted rule-of-thumb proportions, good for a first build or for understanding the layout. Gain and front-to-back ratio depend strongly on the exact lengths and spacings; optimise them in a modelling program.

**Why is the dipole feed about 73 Ω, not 50 Ω?** That is the radiation resistance of a thin, resonant half-wave dipole in free space. Near the ground or with bent (inverted-V) legs it drops, often close to 50 Ω.

**Was it checked?** The patch formulas reproduce Balanis's worked examples (10 GHz on εr 2.2: W 1.186 cm, L 0.906 cm, Rin about 228 Ω, inset about 0.31 cm) and match an independent scipy calculation of the integrals.

For study and planning, not a substitute for professional judgement. Check local rules for transmitting antennas.
