---
title: "Sextans B: a small galaxy's hydrogen pushed around by the gas it moves through"
summary: "Deep MeerKAT radio maps of the dwarf galaxy Sextans B show hydrogen with holes, filaments and a shifted centre, signs of ram pressure. We use fibub's Hydrogen line analyser and Rotation curve fitter to check its gas mass and how much dark matter it needs."
tools: [hydrogen-line-analyser, rotation-curve-fitter]
updated: 2026-11-16
sources:
  - "Namumba, B., Kolhe, N., Hammer, F., Yang, Y., Carignan, C., Ianjamasimanana, R., Józsa, G. I. G., Verdes-Montenegro, L., Wang, H., Chen, H., Huang, X., Ndalama, F., Sorgho, A., Korsaga, M. and Phiri, S. P. (2026), Ram-pressure signatures in the dwarf irregular galaxy Sextans B revealed by deep MeerKAT H I observations, Astronomy & Astrophysics 712, A27, published online 31 July 2026, doi:10.1051/0004-6361/202660238. Licence CC BY 4.0 (checked on the A&A page, 2026-11-16). Values used here, from the full text: distance 1.36 ± 0.07 Mpc, systemic velocity 302.671 km/s, integrated flux 104.5 ± 1.5 Jy km/s, H I mass (4.6 ± 0.07) × 10⁷ solar masses with M = 2.36 × 10⁵ D² S, line widths W20 59.5 ± 1.4 and W50 38.8 ± 2.1 km/s, inclination close to 30°, rotation reaching about 50 to 55 km/s at the outermost radii, H I radius about 1.5 kpc, centre offset about 17 arcseconds, cavities 0.7 to 0.75 kpc across, sensitivity 3.3 × 10¹⁸ cm⁻² over 20 km/s, 1.4 km/s resolution; simulation: gas density around the galaxy 4 × 10⁻⁶ atoms per cm³, speed 300 km/s, ram pressure about 10⁻¹⁵ dyn/cm²."
  - "Rest frequency of the hydrogen line 1420.405752 MHz and the column-density factor 1.823 × 10¹⁸ cm⁻² per K km/s: standard values, used by the Hydrogen line analyser."
  - "Helium correction of 1.33 for total gas mass: a common convention, our choice."
paper:
  title: "Ram-pressure signatures in the dwarf irregular galaxy Sextans B revealed by deep MeerKAT H I observations"
  authors: "Namumba, B.; Kolhe, N.; Hammer, F.; Yang, Y.; Carignan, C.; et al."
  journal: "Astronomy & Astrophysics"
  year: 2026
  doi: "10.1051/0004-6361/202660238"
  url: "https://doi.org/10.1051/0004-6361/202660238"
  licence: "CC BY 4.0"
  reviewed: true
---

Sextans B is a small, gas-rich galaxy just beyond the Local Group, about 1.36 million parsecs (4.4 million light years) away. Its hydrogen glows faintly at radio wavelengths, in the famous 21 cm line. A team used the MeerKAT radio telescope in South Africa to map that hydrogen more deeply than before. They found holes, filaments and a centre that does not sit where the stars do, which they explain by the galaxy ploughing through thin gas around it. This article shows how the [[hydrogen-line-analyser]] and the [[rotation-curve-fitter]] let a researcher or student check the galaxy's gas mass and how much unseen mass it must have.

## The paper in brief

Neutral hydrogen atoms emit a weak radio line at 1420.4 MHz. Its frequency, shifted by the Doppler effect, tells how fast the gas moves towards or away from us; its strength tells how much gas there is.

The team observed Sextans B for about 3 hours with MeerKAT, at a velocity resolution of 1.4 km/s, and reached gas as thin as 3.3 × 10¹⁸ atoms per cm². They measure a total flux of **104.5 Jy km/s**, a hydrogen mass of **4.6 × 10⁷ Suns**, and a systemic velocity of **302.7 km/s**. The gas disc reaches about **1.5 kpc** from the centre, twice the size of the starlight, and turns at about **50 to 55 km/s** at its edge. Its kinematic centre sits about 17 arcseconds from the optical one, and it has holes 0.7 kpc across.

With computer simulations, the authors show that a galaxy moving at 300 km/s through gas of only 4 × 10⁻⁶ atoms per cm³ feels a **ram pressure** (the push of a headwind) of about 10⁻¹⁵ dyn/cm², similar to the gravity holding its gas. Over billions of years this can strip, shift and shape the gas, as they see.

## Checked with the tools

We used the paper's distance, flux, line widths, inclination and rotation speeds.

**Step 1: where the line lands.** At 302.7 km/s the hydrogen line arrives at **1418.972 MHz** instead of 1420.406 MHz (radio convention, the one the Hydrogen line analyser uses). That 1.4 MHz shift is what a receiver tuned to Sextans B must look for.

**Step 2: the gas mass from a spectrum.** We made a **simulated** whole-galaxy spectrum with the paper's flux, velocity and line width, on a curved baseline with noise, and ran the Hydrogen line analyser's steps: fit and remove a baseline, smooth by 3 channels, add up the area under the line. It found the line at **302.6 km/s** and an area of **104.3 Jy km/s** (Figure 1). With the standard formula, M = 2.356 × 10⁵ × D² × area, the paper's 104.5 Jy km/s at 1.36 Mpc gives **4.55 × 10⁷ Suns**, matching the paper's 4.6 × 10⁷.

<!-- fig:spec -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 270" role="img" aria-label="A simulated single-dish style spectrum of Sextans B with the paper's flux and velocity; the Hydrogen line analyser's maths finds an area of 104.3 Jy km/s." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Simulated Sextans B spectrum after the baseline</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Simulated Sextans B spectrum after the baseline</text><line x1="58" x2="546" y1="206.5" y2="206.5" style="stroke:var(--line)"/><text x="52" y="210.5" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="148.4" y2="148.4" style="stroke:var(--line)"/><text x="52" y="152.4" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="90.2" y2="90.2" style="stroke:var(--line)"/><text x="52" y="94.2" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">3</text><line x1="138.7" x2="138.7" y1="224" y2="228" style="stroke:var(--muted)"/><text x="138.7" y="241" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="300.1" x2="300.1" y1="224" y2="228" style="stroke:var(--muted)"/><text x="300.1" y="241" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="461.4" x2="461.4" y1="224" y2="228" style="stroke:var(--muted)"/><text x="461.4" y="241" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="58" x2="546" y1="224" y2="224" style="stroke:var(--muted)"/><text x="302" y="262" text-anchor="middle" style="fill:var(--ink)">Velocity (km/s)</text><text transform="translate(14 128) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Flux density (Jy)</text><line x1="58" x2="546" y1="206.5" y2="206.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="304.4" x2="304.4" y1="32" y2="224" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="300.4" y="44" text-anchor="end" style="fill:var(--muted)">302.7 km/s</text><path d="M58 207.3L62.5 206.2L67 206.7L71.6 206.6L76.1 205.8L80.6 206.6L85.1 205.8L89.6 206.7L94.1 207.6L98.7 206.7L103.2 206.2L107.7 206.2L112.2 206.4L116.7 206.1L121.3 206.6L125.8 207.3L130.3 206.7L134.8 206.1L139.3 205.6L143.9 207.1L148.4 207.8L152.9 206.1L157.4 206.1L161.9 206.9L166.4 206.7L171 206L175.5 206.2L180 206.8L184.5 206.3L189 206.8L193.6 206.3L198.1 207.4L202.6 206.7L207.1 206.6L211.6 206.7L216.1 206.9L220.7 206.1L225.2 205.5L229.7 203.9L234.2 201.5L238.7 199.4L243.3 195.9L247.8 191.9L252.3 184.6L256.8 176.5L261.3 166.4L265.9 155L270.4 142L274.9 126.9L279.4 111.1L283.9 97.4L288.4 84L293 73.6L297.5 64.6L302 60.1L306.5 60.3L311 65.1L315.6 72.2L320.1 83.2L324.6 96.4L329.1 111L333.6 126.4L338.1 140L342.7 153.5L347.2 166.8L351.7 175.5L356.2 183.9L360.7 191.7L365.3 195.6L369.8 199.3L374.3 201.2L378.8 203.5L383.3 205L387.9 205.4L392.4 205.5L396.9 206.1L401.4 206.7L405.9 207L410.4 207.3L415 207.1L419.5 207.7L424 207.6L428.5 207L433 206.3L437.6 206.2L442.1 206.7L446.6 206.9L451.1 206.8L455.6 207L460.1 206.7L464.7 205.6L469.2 205.2L473.7 206.5L478.2 206.4L482.7 206.6L487.3 207L491.8 206.4L496.3 206.1L500.8 206.5L505.3 206.8L509.9 206.4L514.4 206.3L518.9 206.4L523.4 206.7L527.9 206.9L532.4 206.7L537 206.5L541.5 206.7L546 206.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/></svg><figcaption>Figure 1. A simulated whole-galaxy hydrogen spectrum of Sextans B (one Gaussian with the paper's W50, flux and velocity, plus a curved baseline and noise), after the Hydrogen line analyser's baseline and smoothing steps. Simulated, not the MeerKAT data.</figcaption></figure>
<!-- /fig:spec -->

**Step 3: the faintest gas.** The analyser turns an area in K km/s into a column density with 1.823 × 10¹⁸ atoms per cm² per K km/s. The paper's limit of 3.3 × 10¹⁸ cm⁻² is an area of only **1.8 K km/s**: spread over 20 km/s, a brightness of **0.09 K**. That is how faint the wisps of stripped gas are.

**Step 4: the spin from the line width.** A rotating disc seen at an angle *i* gives a line about 2 *v* sin *i* wide. With *i* = 30°, sin *i* = 0.5, so the width in km/s is roughly the rotation speed itself: W50 gives **38.8 km/s** and W20 **59.5 km/s**, bracketing the paper's 50 to 55 km/s from the full map. The line width alone is a rough guide; the map is better because it also sees random gas motions.

**Step 5: the unseen mass.** Gas circling at speed *v* at radius *r* needs a mass of v²r/G inside its orbit, the formula the Rotation curve fitter uses. At 1.5 kpc and 50 to 55 km/s that is **8.7 × 10⁸ to 1.06 × 10⁹ Suns** (Figure 2). The hydrogen, with helium added (× 1.33), is only **6.1 × 10⁷ Suns**: 6 to 7% of what is needed. Even allowing for the stars, Sextans B is mostly dark matter, as dwarf galaxies usually are.

<!-- fig:mass -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="The mass needed to keep gas moving at 52.5 km/s at 1.5 kpc is about 9.6 × 10⁸ solar masses, far more than the 6.1 × 10⁷ in gas." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Mass needed to hold the gas in orbit at 52.5 km/s</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Mass needed to hold the gas in orbit at 52.5 km/s</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--line)"/><text x="52" y="238" text-anchor="end" style="fill:var(--muted)">10^7</text><line x1="58" x2="546" y1="188.1" y2="188.1" style="stroke:var(--line)"/><text x="52" y="192.1" text-anchor="end" style="fill:var(--muted)">3.2×10^7</text><line x1="58" x2="546" y1="142.2" y2="142.2" style="stroke:var(--line)"/><text x="52" y="146.2" text-anchor="end" style="fill:var(--muted)">10^8</text><line x1="58" x2="546" y1="96.3" y2="96.3" style="stroke:var(--line)"/><text x="52" y="100.3" text-anchor="end" style="fill:var(--muted)">3.2×10^8</text><line x1="58" x2="546" y1="50.4" y2="50.4" style="stroke:var(--line)"/><text x="52" y="54.4" text-anchor="end" style="fill:var(--muted)">10^9</text><line x1="170.6" x2="170.6" y1="234" y2="238" style="stroke:var(--muted)"/><text x="170.6" y="251" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="295.7" x2="295.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="295.7" y="251" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="420.9" x2="420.9" y1="234" y2="238" style="stroke:var(--muted)"/><text x="420.9" y="251" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="546" x2="546" y1="234" y2="238" style="stroke:var(--muted)"/><text x="546" y="251" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Radius (kpc)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Mass inside (solar masses)</text><line x1="58" x2="546" y1="161.7" y2="161.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="156.7" text-anchor="end" style="fill:var(--muted)">Gas seen: 6.1 × 10⁷</text><line x1="420.9" x2="420.9" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="416.9" y="44" text-anchor="end" style="fill:var(--muted)">edge of the HI, 1.5 kpc</text><path d="M58 187.6L70.5 159.9L83 143.8L95.5 132.3L108.1 123.4L120.6 116.1L133.1 110L145.6 104.6L158.1 99.9L170.6 95.7L183.1 91.9L195.6 88.5L208.2 85.3L220.7 82.3L233.2 79.6L245.7 77L258.2 74.6L270.7 72.3L283.2 70.2L295.7 68.1L308.3 66.2L320.8 64.3L333.3 62.5L345.8 60.8L358.3 59.2L370.8 57.6L383.3 56.1L395.8 54.7L408.4 53.3L420.9 51.9L433.4 50.6L445.9 49.4L458.4 48.1L470.9 46.9L483.4 45.8L495.9 44.7L508.5 43.6L521 42.5L533.5 41.5L546 40.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/></svg><figcaption>Figure 2. Mass needed inside each radius to keep gas circling at 52.5 km/s (the middle of the paper's 50 to 55 km/s), from the Rotation curve fitter's enclosed-mass formula, against the hydrogen and helium the paper sees. Logarithmic mass axis.</figcaption></figure>
<!-- /fig:mass -->

| Check | Paper | Our tool result |
|---|---|---|
| Hydrogen mass | 4.6 × 10⁷ Suns | 4.55 × 10⁷ from the flux |
| Area under a simulated spectrum | 104.5 Jy km/s (measured) | 104.3 Jy km/s recovered |
| Rotation at the edge | about 50 to 55 km/s | 38.8 to 59.5 km/s from the line widths |
| Mass inside 1.5 kpc | (not given) | 8.7 × 10⁸ to 1.06 × 10⁹ Suns |
| Gas share of that mass | (not given) | 6 to 7% |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/sextans-b-meerkat-hi-ram-pressure.mjs` in fibub's public code. It calls the tools' own functions:

- `baseline`, `smooth`, `freqRadio` and `columnDensity` from `src/lib/astro/hline.ts`, the maths behind the [[hydrogen-line-analyser]].
- `enclosedMass` from `src/lib/sci/rotcurve.ts`, the maths behind the [[rotation-curve-fitter]].

Where the inputs come from: distance, velocity, flux, line widths, inclination, rotation speeds and the column-density limit are the paper's. The spectrum in Figure 1 is **simulated**: one Gaussian with the paper's W50 (which also gives a W20 of 59.1 km/s, close to the paper's 59.5), a curved baseline and 15 mJy of noise are our choices. The helium factor 1.33 is a common convention.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks these functions against known answers:

- The column-density formula must give **1.823 × 10²⁰ cm⁻²** for 100 K km/s.
- The Hydrogen line analyser's baseline and terminal-velocity steps, run on its built-in simulated spectrum at l = 30°, must find an edge a few km/s above the 110 km/s it was built with, and the tangent point must sit at **4.25 kpc**.
- The Rotation curve fitter's exponential disc must peak at **2.15 disc scale lengths** with v = 0.622 √(GM/R_d) (Freeman 1970), and a fit to a noise-free made-up curve must reach χ² ≈ 0.

## Check it yourself

**The gas mass, on the [[hydrogen-line-analyser]]:** paste this noise-free version of the simulated spectrum (velocity in km/s, flux in Jy, 15 km/s channels):

```
105, 0
120, 0
135, 0
150, 0
165, 0
180, 0
195, 0
210, 0
225, 0
240, 0.002
255, 0.039
270, 0.354
285, 1.424
300, 2.497
315, 1.912
330, 0.639
345, 0.093
360, 0.006
375, 0
390, 0
405, 0
420, 0
435, 0
450, 0
465, 0
480, 0
495, 0
```

1. Set *First column is* to **velocity, already LSR (km/s)** and *Intensity is in* to **any unit (not calibrated)**.
2. Set *Pointing given as* to **RA, Dec (J2000)** and type **10.0003** in *Right ascension (hours)* and **5.334** in *Declination (°)* (the paper's kinematic centre).
3. Leave *Baseline* on **curve (2nd order)** and *Smoothing* on **3 channels**.
4. *Area under the line* reads about **104.5 × km/s**: 104.5 Jy km/s, the paper's flux. Then 2.356 × 10⁵ × 1.36² × 104.5 = 4.55 × 10⁷ Suns of hydrogen. The tool does not do this last step for a distant galaxy, so it is one line on a calculator.

**The mass, on the [[rotation-curve-fitter]]:** the tool fits a full rotation curve (radius, speed and error per line) and reports the dark-matter share inside the last point. We do not have the paper's curve as numbers, so the check of Step 5 is the formula the tool uses: 52.5² × 1.5 ÷ 0.0000043009 ≈ **9.6 × 10⁸ Suns**.

## What researchers can use it for

- **Reduce a single-dish hydrogen spectrum**: baseline, smoothing, line velocity, noise and the area under the line, in the browser.
- **Turn an area into a column density** or, with a distance, a hydrogen mass.
- **Estimate the dark-matter share** of a galaxy from its rotation curve with the Rotation curve fitter.
- **Plan an observation**: work out the frequency the line will arrive at for a galaxy's velocity.
- **Teach** how radio astronomers weigh the gas and the unseen mass of galaxies.

## The fine print

- The spectrum in Figure 1 and in the steps above is **simulated** from the paper's numbers; it is not the MeerKAT data, and the real profile is not an exact Gaussian.
- The line-width estimate of rotation ignores random motions of the gas, which matter in a slowly turning dwarf galaxy.
- The enclosed-mass formula assumes a round mass distribution and circular orbits; a flattened disc changes the answer by a few tens of percent.
- The ram-pressure result comes from the paper's simulations; we did not check it with a tool.
