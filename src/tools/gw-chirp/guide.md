---
name: Gravitational wave chirp
num: 969
shelf: science
code: T704
section: relativity-and-gravitation
title: "Gravitational wave chirp"
summary: "Type two masses and a distance to see how a binary's gravitational waves chirp: the chirp mass, the time and number of cycles from any start frequency to the innermost stable orbit, the chirp rate, the orbit size, the face-on strain and characteristic strain, the frequency sweep and a sample waveform, with redshift and CSV downloads."
status: live
ads: true
order: 3
icon: curve
works: offline
updated: 2026-11-09
related: [schwarzschild-orbits, spacetime-diagram, cosmology-calculator, redshift-calculator, two-body-orbit, wavelet-viewer]
sources:
  - "Leading-order (quadrupole) inspiral: chirp mass, frequency evolution, time to coalescence, number of cycles, phase and strain amplitude (Peters and Mathews, 1963); standard results as in Maggiore, M., Gravitational Waves, Volume 1 (2008), chapter 4."
  - "ISCO frequency of a Schwarzschild black hole of the total mass, and the characteristic strain h√(2f²/ḟ): standard approximations."
  - "Checked by fibub against SciPy (solve_ivp of df/dt and quad for the cycle count) and NumPy; GM☉/c³ and GM☉/c² are the IAU nominal values, rounded, and agree with CODATA G."
  - "Example masses and distance are made up. No detector sensitivity curves are included."
flow:
  - { icon: sliders, label: "Masses" }
  - { icon: clock, label: "Time" }
  - { icon: curve, label: "Chirp" }
  - { icon: chart, label: "Strain" }
---

## What it does

Two black holes or neutron stars orbiting each other lose energy to **gravitational waves**, spiral closer and orbit faster. The waves' frequency and strength rise together into a **chirp** that ends when the bodies merge. At leading order, the whole chirp depends on one combination of the masses, the **chirp mass** 𝓜 = (m₁m₂)^(3/5)/(m₁ + m₂)^(1/5).

This calculator gives, for your binary:

- the **chirp mass**, total mass and symmetric mass ratio;
- the **frequency at the innermost stable circular orbit** (ISCO), where the inspiral ends and the merger begins;
- the **time** and **number of cycles** from your start frequency (for example a detector's lower limit) to the ISCO;
- the **chirp rate** df/dt, the **orbit size** and orbital period at the start;
- the **strain** h for a face-on binary, and the **characteristic strain**, which is what is compared with detector noise;
- charts of the frequency sweep, a sample of the waveform over the final cycles, and strain against frequency.

See orbits close to a black hole with the [[schwarzschild-orbits|Schwarzschild orbit plotter]], and turn a redshift into a distance with the [[cosmology-calculator]].

## How to use it

1. Type the two **masses** in solar masses.
2. Type the **luminosity distance** in megaparsecs, and the **redshift** for distant sources (masses then look (1 + z) times heavier to the detector).
3. Type the **start frequency** in hertz: 10 to 20 Hz suits ground-based detectors; space detectors work at millihertz.
4. Read the results and charts, and download the sweep as CSV or a report.

## Worked example

A made-up pair of black holes of 30 and 25 solar masses at 400 Mpc has a chirp mass of **23.82 M☉** and a total of 55 M☉, so its inspiral ends at the ISCO near **79.95 Hz**. From 20 Hz the page shows **1.09 s and 32.1 cycles from 20 Hz to 79.9 Hz**. At 20 Hz the frequency rises at 6.74 Hz per second, the two bodies are about 1,227 km apart, and the face-on strain is 4.32 × 10⁻²², rising to 1.09 × 10⁻²¹ at the ISCO.

Change the masses to two 1.4 M☉ neutron stars at 40 Mpc: the inspiral from 20 Hz now lasts about **2.6 minutes** and over 5,000 cycles, ending near 1.57 kHz (in reality the stars touch and merge a little before that).

## Tips

- Equal-mass and unequal binaries with the same chirp mass chirp the same way at this order: the mass ratio shows up only at higher order.
- Doubling the distance halves the strain but leaves the timing unchanged.
- For millihertz sources (white dwarf pairs, massive black holes), lower the start frequency to 0.001 Hz or below.

## FAQ

**How accurate is this?** It is the leading-order formula. Post-Newtonian terms, spin and the merger itself change times and cycle counts by roughly 10 to 20 % near the end. It is for study and planning, not for analysing detector data.

**Why is the strain so small?** A strain of 10⁻²¹ stretches a 4 km arm by about 4 × 10⁻¹⁸ m, a thousandth of a proton's width.

**Is the source frequency the same as the detected one?** No: with redshift z, frequencies are lower and durations longer by (1 + z) at the detector. The tool works in the detector frame.
