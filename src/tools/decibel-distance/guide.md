---
name: Decibel distance calculator
num: 939
shelf: science
code: T674
section: acoustics-and-wave-physics
title: "Decibel distance calculator: sound level at a distance (inverse square law) with air absorption, and adding decibels"
summary: "Find how loud a sound is further away: spreading from a point, line or flat source, plus the sound absorbed by the air for the temperature and humidity (ISO 9613-1 formula), for one frequency or a whole octave band spectrum in dB(A). It also finds the distance where the sound falls to a target level, and adds, averages or subtracts decibel levels."
status: live
ads: true
order: 2
icon: ruler
works: offline
updated: 2026-11-09
related: [room-acoustics, noise-barrier, gaussian-plume-calculator, noise-dose, audio-spectrum-analyser, audiogram]
sources:
  - "Geometric spreading from point (20 lg r) and line (10 lg r) sources and energy addition of levels: standard acoustics."
  - "Atmospheric absorption: the pure-tone formula of ISO 9613-1:1993 (relaxation of oxygen and nitrogen), used as a formula only; no tables copied."
  - "A-weighting: the analytic expression of the A-weighting curve given in IEC 61672-1, used as a formula."
  - "Checked against an independent NumPy and SciPy implementation (including a SciPy root search for the distance). The example levels are made up."
flow:
  - { icon: sliders, label: "Sound" }
  - { icon: ruler, label: "Distance" }
  - { icon: chart, label: "Level" }
  - { icon: calculator, label: "Add dB" }
---

## What it does

Sound gets quieter with distance for two reasons. It **spreads out**: from a small source (a point) the same energy covers a sphere that grows with the square of the distance, so the level falls by 6 dB every time the distance doubles. A long, busy road or a pipe is a **line source** and falls by only 3 dB per doubling, and very close to a big flat source it hardly falls at all. And the **air absorbs** sound, very little at low frequencies but a lot at high ones, depending on temperature and humidity.

This calculator does both, for one frequency or for a whole **octave band spectrum** with the A-weighted total in dB(A), and draws the level against distance. It also finds the **distance where the level falls to a target**, and has a small **decibel adder** for adding levels, averaging them and taking off the background.

Turn the levels into a day's exposure with the [[noise-dose|noise dose calculator]], and plan a wall to cut road noise with the [[noise-barrier|noise barrier calculator]].

## How to use it

1. Choose whether you have **one level at one frequency** or **octave band levels** (63 Hz to 8 kHz, unweighted).
2. Type the level and the **distance r₁** where it was measured, and the **distance r₂** where you want to know it.
3. Choose the **source type**. Add any **other losses** in dB (a wall, a barrier, ground effect) if you know them.
4. Optionally type a **level to reach**: the page finds the distance where the sound has fallen to it.
5. Set the air **temperature, humidity and pressure**, or switch air absorption off.
6. In the **Add, average or subtract** box, type a list of levels and, if you have it, the background level on its own.

## Worked example

The made-up example is a machine giving **90 dB at 1 m** at **1 kHz**, on a 20 °C day at 50 % humidity. At **100 m** the page shows **49.5 dB**: spreading from a point takes off 40.0 dB (twenty times the log of 100), and the air takes another 0.46 dB (4.66 dB per km at 1 kHz). The level falls to **45 dB at 163 m**, against 178 m if the air absorbed nothing.

For a spectrum, choose octave band levels: the example bands of 80, 84, 86, 88, 87, 84, 80 and 74 dB from 63 Hz to 8 kHz make **91.3 dB(A)**. Measured at 10 m and carried to 500 m at 15 °C and 70 % humidity, they become **54.6 dB(A)**; the 8 kHz band loses over 40 dB to the air alone, which is why distant noise sounds dull.

In the adder, **85, 82 and 79 dB** together make **87.4 dB**, with an energy average of 82.7 dB. With a background of 70 dB, the sources on their own are 87.4 dB: the background makes almost no difference when it is more than 10 dB below.

## Tips

- Measure r₁ far enough away that the source looks small (at least two or three times its size), or the 6 dB rule over-predicts the fall.
- Outdoors over hard ground, reflections add up to 3 dB; wind blowing towards you and temperature inversions at night can carry sound much further than this calculator says.
- Two equal sources are 3 dB louder than one; ten equal sources are 10 dB louder.

## FAQ

**Why is the A-weighted result different from the unweighted one?** A-weighting follows how the ear hears quiet sounds and turns the low bands down a lot, so a rumble counts for less in dB(A).

**Can I use this for planning permission or a legal limit?** It is a free-field estimate for study and planning, not a substitute for professional judgement or a proper noise survey made to the method your local rules require.
