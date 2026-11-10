---
name: Transit fitter
num: 71
shelf: science
section: exoplanets
title: "Transit fitter"
summary: "Paste an exoplanet transit light curve and fit a limb-darkened model: the planet's size relative to its star, depth, duration, impact parameter, inclination and the star's density."
status: live
ads: true
order: 21
icon: chart
works: offline
updated: 2026-11-08
related: [transit-planner, period-finder, exoplanet-mass-calculator, habitable-zone-calculator, radial-velocity-fitter]
sources:
  - "Model: the standard quadratic limb-darkening law."
  - "Example data: simulated by fibub."
flow:
  - { icon: table, label: "Light curve" }
  - { icon: curve, label: "Fit transit" }
  - { icon: target, label: "Planet size" }
---

## What it does

When a planet passes in front of its star, the star dims for a few hours by a fraction about equal to the planet's area over the star's. The shape of that dip tells you much more than its depth. How quickly the light falls at the start and end, and how long the bottom lasts, show how big the planet is, how far from the star's centre it crosses, and how big its orbit is compared to the star.

This tool fits the standard model to your measured light curve: a dark disc crossing a star whose edge is dimmer than its centre (**limb darkening**, with the quadratic law), on a circular orbit. It gives the radius ratio R<sub>p</sub>/R<sub>*</sub>, the depth, the total and flat-bottom durations, the impact parameter, the inclination, the orbit's size in star radii and the mid-transit time, each with an uncertainty. From a/R<sub>*</sub> and the period alone it also gives the **star's mean density**, a neat check from Kepler's third law: a planet round a giant star cannot make the same transit as one round a red dwarf. Type the star's radius and you get the planet's radius in Earth and Jupiter radii.

Predict the next transits with the [[transit-planner]], and get the planet's mass from its star's wobble with the [[exoplanet-mass-calculator]].

## How to use it

1. Paste the light curve: time in days (JD, BJD or any day count), brightness and, if you have them, errors. Several transits are folded on the period automatically. Tick **magnitudes** if the brightness column is in magnitudes, as from most amateur photometry software.
2. Type the **orbital period**. It is held fixed; take it from a catalogue such as the NASA Exoplanet Archive, or find it with the period finder.
3. Leave the mid-transit time blank to let the tool find it, or type a guess.
4. Choose **limb darkening** for the star's type and your filter, or enter your own u₁ and u₂ from published tables.
5. If each exposure was longer than about 5 minutes, give its length, so the model is smeared in time the same way the data are.

## What each result means

- **Radius ratio** k = R<sub>p</sub>/R<sub>*</sub>. The depth is roughly k², a little more in the middle because the planet covers the bright centre of the star.
- **Impact parameter** b: 0 is a central crossing, 1 grazes the edge. A high b gives a V-shaped transit.
- **a/R<sub>*</sub>** and the **inclination** describe the orbit's size and tilt.
- **Star's density** ρ<sub>*</sub> = 3π(a/R<sub>*</sub>)³/(GP²).

## Worked example

The example is a simulated hot Jupiter like HD 209458 b: period 3.5247 days, k = 0.1205, a/R<sub>*</sub> = 8.8, b = 0.50, a Sun-like star with u₁ = 0.40, u₂ = 0.25, and two-minute points with 1 ppt noise. The fit gives k = 0.1199 ± 0.0013, b = 0.51 ± 0.06 and a/R<sub>*</sub> = 8.7 ± 0.3. The transit is 1.63 % deep and lasts 3.10 ± 0.04 hours, and the star's density comes out at 1.00 ± 0.11 g/cm³, against 1.04 used to make the data. With the star's radius set to 1.2 R☉ the planet is about 15.7 Earth radii, or 1.4 Jupiter radii.

## Frequently asked questions

**Why are b and a/R<sub>*</sub> so uncertain?** A crossing nearer the edge of a smaller orbit can look much like a central crossing of a bigger one. Only a precise ingress and egress separate them.

**What about eccentric orbits?** The model assumes a circular orbit. An eccentric orbit changes the speed across the star, so the density then comes out wrong by a factor that depends on e and ω.

**Can I fit my own observation of a known planet?** Yes: that is the main use. Detrend for airmass first if you can, and give the catalogue period.

**Is my data uploaded?** No. The fit runs in your browser and works offline.
