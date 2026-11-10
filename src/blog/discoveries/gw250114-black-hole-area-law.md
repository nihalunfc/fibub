---
title: "GW250114: Hawking's black hole area law tested with a loud merger"
summary: "LIGO caught two black holes merging so clearly that the team could test whether the horizon area grew, as Hawking predicted. Here is the result and how to check the chirp maths in your browser."
tools: [gw-chirp, schwarzschild-orbits, cosmology-calculator]
updated: 2026-11-10
sources:
  - "LIGO Scientific Collaboration, Virgo Collaboration and KAGRA Collaboration (Abac, A. G. et al.) (2025), GW250114: Testing Hawking's area law and the Kerr nature of black holes, Physical Review Letters 135, 111403, published 10 September 2025. Open access under CC BY 4.0. Details checked on institutional repository records of the published article, 2026-11-10."
  - "Kerr horizon area A = 8π(GM/c²)²(1 + √(1 − χ²)): standard general relativity result. GM☉/c² = 1.4766 km (IAU nominal value, rounded)."
paper:
  title: "GW250114: Testing Hawking's area law and the Kerr nature of black holes"
  authors: "Abac A G, Abouelfettouh I, Acernese F et al. (LIGO Scientific, Virgo and KAGRA Collaborations)"
  journal: "Physical Review Letters"
  year: 2025
  doi: "10.1103/kw5g-d732"
  url: "https://doi.org/10.1103/kw5g-d732"
  licence: "CC BY"
  reviewed: true
---

In 1971 Stephen Hawking argued that the surface area of a black hole's horizon can never shrink, so when two black holes merge, the new one must have more area than the two old ones put together. On 14 January 2025 the two LIGO detectors picked up a merger so clean that this could be tested directly. The result, GW250114, was published in *Physical Review Letters* in September 2025 under a CC BY licence. You can follow the first half of the story, the rising "chirp" of the inspiral, with the [[gw-chirp]] calculator, and size up the horizons with the [[schwarzschild-orbits|Schwarzschild orbit plotter]].

## What they found

The collaboration reports two black holes of about 33.6 and 32.2 solar masses, spinning slowly, on an orbit with almost no stretch (eccentricity). They merged into one black hole of about 62.7 solar masses spinning at about 0.68 of the fastest possible rate. The signal reached a combined signal-to-noise ratio of about 80, which is what made the tests possible.

Two findings stand out. First, the final horizon area is larger than the sum of the two starting areas, at a confidence the team puts at 4.4 sigma in its main analysis. Second, the ringing of the new black hole after the merger matches what a spinning (Kerr) black hole in general relativity should do: the main tone and its first overtone both fit, with their frequencies pinned to within about 30 % of the predicted values.

## Why it matters

Hawking's area law is tied to the idea that black holes have entropy, and that entropy never falls. A first test with an earlier event, GW150914, was suggestive but not decisive, because that signal was much quieter. A loud event lets the team measure the "before" and "after" separately, and that is what turns the law from a theorem on paper into something checked against nature. The ringdown is a separate test of the Kerr picture.

## How they did it

The key trick is to split the signal in time. Before the merger, the waves carry the masses and spins of the two black holes, which give their areas. After the merger, the dying ring carries the mass and spin of the remnant, which gives its area. The merger itself is left out of both halves.

The team tried a range of cut times and reports that the area increase stays clear across them. They compared the inspiral data with a waveform model built from numerical relativity, and fitted the ringdown with damped sine waves at the frequencies a Kerr black hole allows.

## Check it yourself with fibub

The [[gw-chirp]] tool uses the simplest, leading-order description of an inspiral. It will not reproduce the collaboration's results, but it shows why such a pair is heard for under a second and how the numbers scale. The masses below are **our own made-up, rounded values**, not the paper's.

1. Open the tool and type **35** and **30** solar masses, a distance of **450** Mpc, a redshift of **0**, and a start frequency of **20** Hz.
2. Read the headline: about **808 ms and 23.4 cycles** from 20 Hz to the end of the inspiral at **67.65 Hz**. The chirp mass is **28.19 solar masses**.
3. Look at the start of the sweep: the frequency climbs at **8.92 Hz per second**, the two bodies are about **1,298 km** apart, and the face-on strain is about **5.08 × 10⁻²²**, rising to about **1.15 × 10⁻²¹** at the end.
4. Now type a redshift of **0.1**. The detector now sees a pair that looks 10 % heavier, so its inspiral ends lower, at about 61.5 Hz, and the time spent above 20 Hz drops to about **681 ms**. The [[cosmology-calculator]] turns a redshift like this into a distance.

Now the area law, by hand. A black hole's horizon area depends on its mass M and spin χ: A = 8π(GM/c²)²(1 + √(1 − χ²)), where GM/c² is about 1.4766 km for each solar mass. For a non-spinning hole this is just 4π times the square of the Schwarzschild radius, which the Schwarzschild orbit plotter shows for any mass.

- Made-up starting holes of 35 and 30 solar masses, not spinning: radii of 103.4 km and 88.6 km, total area about **232,900 km²**.
- A made-up remnant of 62 solar masses with spin 0.7: without spin its radius would be 183.1 km and its area 421,300 km²; spin multiplies that by (1 + √0.51)/2 = 0.857, giving about **361,100 km²**.

The area has grown by a factor of about 1.55, even though 3 solar masses of energy left as waves. For the area to stay the same with spin 0.7, the remnant would have had to weigh only about 49.8 solar masses. You can repeat the sum with the paper's headline masses and spins to see how comfortably the law is met.

## The fine print

- This is **one event**. It tests the law very cleanly once, rather than across many mergers.
- The tool is **leading-order only**. Real waveforms include spin, higher-order terms, the merger and the ringdown, so times and cycle counts differ by roughly 10 to 20 % near the end.
- Our area sum uses the **best values only**. The paper's 4.4 sigma comes from full probability distributions for masses and spins, which our sum ignores.
- **Where to cut** the data is a choice. The team shows the result holds across many cuts, but the significance changes with the choice.
- Our numbers are made up for practice. For the measured values and their uncertainties, read the paper itself.
