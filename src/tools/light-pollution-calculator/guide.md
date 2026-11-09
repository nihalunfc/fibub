---
name: Light pollution calculator
num: 51
shelf: science
section: observing
title: "Light pollution calculator: SQM reading to Bortle class, limiting magnitude and mcd/m²"
summary: "Turn a sky quality meter reading, the faintest star you can see, a Bortle class or a luminance into all the others, see how much artificial light adds to your sky, and how much longer your images need than at a dark site."
status: live
ads: true
order: 12
icon: eye
works: offline
updated: 2026-11-08
related: [dark-sky-calendar, sub-exposure-calculator, sky-tonight, meteor-shower-planner, telescope-calculator]
sources:
  - "Natural sky brightness: about 22.0 mag/arcsec², as used by Falchi et al. (2016)."
  - "Bortle classes: descriptions written by fibub after Bortle's 2001 scale."
flow:
  - { icon: eye, label: "Your sky" }
  - { icon: sliders, label: "Convert" }
  - { icon: star, label: "Bortle class" }
---

## What it does

Sky darkness is measured in four common ways, and each source uses a different one. A sky quality meter (SQM) gives magnitudes per square arcsecond. Visual observers count the faintest star they can see, the naked-eye limiting magnitude. Light pollution atlases give luminance in millicandela per square metre, and forums talk in Bortle classes. This calculator takes any one of them and gives you the rest. It also says how many times brighter your sky is than a natural one, and how much longer a deep-sky image must be exposed to match a dark site.

To find the darkest nights of the year, use the [[dark-sky-calendar]]; to set exposures under your sky, the [[sub-exposure-calculator]].

## How to use it

1. Choose what you know: a **meter reading**, the **faintest star** you can see overhead, a **Bortle class**, or a **luminance**.
2. Type the number. For meter readings you can type several, separated by spaces, and the tool uses their average and shows the spread. Take readings straight up, on a clear, moonless night, at least an hour and a half after sunset.
3. Optionally type a second meter reading under **Compare with**, such as a dark site you could drive to. The results then say how much darker it is, how many fainter stars it shows and how much exposure time it saves.

## What each number means

- **Sky brightness** in mag/arcsec²: higher is darker. About 22.0 is a pristine sky; 17 is a city centre.
- **Luminance** in mcd/m²: the same brightness in light units, using L = 108,000 × 10^(−0.4 m) cd/m².
- **Naked-eye limit**: the faintest star a typical observer sees overhead, from the relation used with sky quality meters (after Schaefer 1990). Practised observers often reach 0.5 to 1 magnitude fainter.
- **Brighter than a natural sky**: your sky against the natural 0.174 mcd/m² used by the World Atlas of artificial night sky brightness (Falchi et al. 2016).
- **Exposure**: when the sky glow sets the noise, matching the signal-to-noise of a darker sky takes longer by the ratio of the two sky brightnesses.

## Worked example

A reading of 20.8 mag/arcsec² is 0.517 mcd/m², about 3 times the natural sky, so artificial light adds about 197 %. A typical observer sees stars to magnitude 6.0, and the sky falls in Bortle class 4, the rural to suburban transition. A faint galaxy needs about 3 times the exposure it would need under a 22.0 sky. Compare it with a dark site reading 21.6, and the dark site is 2.09 times darker and shows stars 0.4 magnitude fainter.

## Frequently asked questions

**Why does my Bortle class differ from a map?** Bortle defined his classes by what an experienced observer sees, not by meter readings. The reading ranges here are the ones used by lightpollutionmap.info and many SQM tables; other sources shift them by a few tenths. Meter readings cannot split class 8 from class 9, so they share one band.

**Does the Moon matter?** Yes, a lot. A bright Moon can make a dark site read like a suburb. Measure on moonless nights; the dark-sky calendar shows when those are.

**Why is my limiting magnitude different from the table?** The figure in the results is for a typical observer. The table shows Bortle's own values for experienced observers, which are fainter.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
