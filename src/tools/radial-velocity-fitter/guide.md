---
name: Radial velocity orbit fitter
num: 64
shelf: science
section: stellar-astrophysics
title: "Radial velocity orbit fitter: period, eccentricity and mass function for binary stars and exoplanets"
summary: "Paste a star's radial velocities and fit a Keplerian orbit: period, semi-amplitude, eccentricity, periastron, systemic velocity with uncertainties, the mass function and the companion's minimum mass."
status: live
ads: true
order: 20
icon: curve
works: offline
updated: 2026-11-08
related: [period-finder, exoplanet-mass-calculator, plot-maker, redshift-calculator, transit-planner]
flow:
  - { icon: table, label: "Velocities" }
  - { icon: curve, label: "Fit orbit" }
  - { icon: star, label: "Masses" }
---

## What it does

When two stars orbit each other, or a planet tugs on its star, the star moves towards us and away from us in a regular rhythm. A spectrograph measures that motion as a Doppler shift: the **radial velocity**. This tool takes a list of velocities and finds the orbit that explains them: the period, the size of the velocity swing, how eccentric the orbit is, where the closest approach lies and the velocity of the system as a whole. Each value comes with an uncertainty. From those it works out the **mass function** and the size of the star's own orbit, and, if you give the star's mass, the smallest mass the unseen companion can have.

It plots the velocities folded on the period with the fitted curve, the residuals, and the whole data set over time, and lists the other periods it tried.

## How to use it

1. Paste your measurements: time in days, velocity, and optionally the error of each velocity. Columns can be separated by tabs, commas or spaces, and a header row is fine. **Load the example** fills in a simulated binary star.
2. Choose the **velocity unit**: km/s for binary stars, m/s for exoplanets.
3. Leave the period blank to search for it, or type the period if you already know it, from a light curve for example. You can also limit the search range.
4. Tick **Circular orbit** for short-period planets and close binaries, whose orbits are usually circular. This fits four numbers instead of six.
5. Type the **star mass** to get the companion's minimum mass. Download the velocities with the model and residuals as a CSV, or the page as a PNG, PDF or Word file.

## What each result means

- **Period P**: the time for one orbit.
- **Semi-amplitude K**: half the full velocity swing.
- **Eccentricity e**: 0 is a circle, and values near 1 are long, thin ellipses. An eccentric orbit gives a lopsided, saw-tooth velocity curve.
- **Argument of periastron ω**: the angle, within the orbit, from the point where the star crosses the sky plane moving away from us to the point of closest approach.
- **Time of periastron**: a moment of closest approach. For a circular orbit, the tool gives the time of greatest velocity instead.
- **Systemic velocity γ**: the motion of the whole system towards or away from us.
- **Mass function**: f(m) = P K³ (1 − e²)^1.5 / (2πG) = (m₂ sin i)³ / (m₁ + m₂)². Because sin i ≤ 1, it is a firm lower limit on the companion's mass.
- **a₁ sin i**: the size of the visible star's orbit round the centre of mass, reduced by the unknown tilt.
- **Minimum mass m sin i**: the companion's mass if we saw the orbit edge-on, solved exactly for the star mass you give.

## How it is worked out

A Lomb–Scargle periodogram suggests the strongest periods. For each one, the tool tries a grid of eccentricities and periastron times. For each grid point it solves γ, K and ω exactly by linear least squares. The best is then polished with a simplex search, and uncertainties come from the curvature of χ² (the Jacobian of the residuals). With errors on the data they are used as weights; without them, the uncertainties are scaled by the scatter.

## Worked example

The example is a simulated binary made with P = 12.345 days, K = 23.4 km/s, e = 0.42, ω = 120.3°, γ = −14.2 km/s and 0.6 km/s of noise on 34 velocities. The fit recovers:

- P = 12.3415 ± 0.0056 days, K = 23.56 ± 0.28 km/s, e = 0.423 ± 0.011
- ω = 120.2 ± 1.1°, γ = −14.26 ± 0.12 km/s, scatter 0.57 km/s, reduced χ² = 1.09
- Mass function 0.01244 M☉ and a₁ sin i = 3.62 million km (0.0242 AU)

Every value lies within about one uncertainty of the truth. With a star mass of 1 M☉, the companion has at least 0.27 solar masses: a red dwarf, which would be hard to see beside a Sun-like star.

## Frequently asked questions

**How many velocities do I need?** At least 7 for an eccentric orbit and 5 for a circular one, but 15 or more, spread over the whole orbit, give far more reliable answers.

**Can I fit two planets?** Not yet. Fit the strongest signal, then look at the residuals for a second period.

**Should I correct my velocities to the barycentre?** Yes. Velocities from different nights must be corrected for Earth's motion, or a one-year signal appears. Most reduction pipelines do this.

**Does my data leave my computer?** No. The fit runs in your browser, and nothing is uploaded.
