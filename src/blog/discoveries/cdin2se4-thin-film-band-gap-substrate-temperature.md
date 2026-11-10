---
title: "CdIn2Se4 thin film band gap widens with substrate temperature (PLD, Tauc plot)"
summary: "A 2025 study grew 100 nm CdIn₂Se₄ films by pulsed laser deposition and found the optical gap rising from about 1.53 to 1.79 eV. Here is how to run the same Tauc analysis."
tools: [tauc-plot, thin-film-thickness, solar-cell-iv]
updated: 2026-11-10
sources:
  - "The Tauc relation (αhν)^n ∝ (hν − Eg), the Urbach rule and α = −ln T / d: standard optical spectroscopy."
  - "The transmittance spectrum in the worked example is made up by fibub (direct gap 1.60 eV, 60 meV Urbach tail, 100 nm film, small noise); it is not data from the paper."
paper:
  title: "Substrate temperature modulated optical characterizations of α-CdIn2Se4 thin films grown by pulsed laser deposition technique"
  authors: "Dhruva SD, Dudharejiya T, Sharko SA, Serokurova AI, Novitskii NN, Goroshko DL et al."
  journal: "RSC Advances"
  year: 2025
  doi: "10.1039/d5ra03888j"
  url: "https://doi.org/10.1039/d5ra03888j"
  licence: "CC BY 3.0"
  reviewed: true
---

Cadmium indium selenide, CdIn₂Se₄, is a semiconductor that absorbs strongly in the visible and near-infrared, which makes it a candidate for light sensors and solar absorbers. A July 2025 paper in RSC Advances grew thin films of it by pulsed laser deposition and showed that the temperature of the glass they were grown on changes the optical band gap by about a quarter of an electronvolt. The band gaps came from Tauc plots of transmission spectra, and the [[tauc-plot]] tool does that analysis in your browser, so you can repeat it on your own films and see how much the answer depends on the choices you make.

## What they found

All films were about 100 nm thick. Grown at 300 K, the film had a direct optical gap of about 1.53 eV. At 425 K it was about 1.59 eV, at 550 K about 1.72 eV (close to the reported bulk value), and at the highest temperature, 675 K, about 1.79 eV. The authors describe the low-temperature films as essentially amorphous, the hotter ones as polycrystalline, and the 675 K film as containing an extra indium selenide phase. They also report a refractive index of about 3.27 and absorption coefficients near 10⁷ m⁻¹ (10⁵ cm⁻¹).

## Why it matters

A tunable gap is useful: a sensor or solar layer works best when its gap matches the light it must catch. If one growth setting can move the gap by 0.26 eV, makers can tune films without changing the recipe. It also warns anyone comparing results: two "CdIn₂Se₄" gaps from different labs may differ simply because the substrates were held at different temperatures.

## How they did it

A pulsed laser blasted a solid target of the compound in a vacuum, and the plume of material settled on quartz glass held at a set temperature. Every film was made about 100 nm thick, so thickness could not explain the differences. Transmittance was measured across the visible and near-infrared. From that, the authors worked out the absorption coefficient α, plotted (αhν)² against photon energy hν (the Tauc plot for a direct allowed transition) and extended the straight part of the edge down to zero to read the gap.

## Check it yourself with fibub

The worked example below uses **a made-up spectrum**: a 100 nm film we drew with a direct gap of 1.60 eV and a 60 meV absorption tail, with transmittance from 500 to 1000 nm every 2 nm and a little noise. Some of its values: 48.7 % at 550 nm, 62.6 % at 700 nm, 75.7 % at 750 nm and 94.6 % at 800 nm.

1. Paste the two columns, wavelength then reading, or open your spectrometer's CSV.
2. Set *First column* to Wavelength (nm) and *Second column* to Transmittance (%).
3. Type 100 in *Film thickness (nm)*. The page then gives α in cm⁻¹ (at 700 nm our film has α ≈ 4.7 × 10⁴ cm⁻¹). The gap itself does not change without the thickness.
4. Choose *Direct allowed, n = 2*.
5. Look at the highlighted points on the Tauc plot.

On our spectrum the automatic choice settled on a short stretch near the top, 2.21 to 2.30 eV, and gave 1.623 eV. Our made-up edge is straight over a long range, so the page picked a stretch where the noise happened to be steepest. Switching *Choose the region* to *Between two energies* and typing 1.70 to 2.20 eV gives **Eg = 1.6002 ± 0.0002 eV**, with a window spread of 1.600 to 1.600 eV: the value we built in. The lesson carries over to real data: always look at which points made the line.

Try the other transition too. With *Indirect allowed, n = ½* over the same 1.70 to 2.20 eV, the line meets the axis at 0.71 eV, and narrowing or widening the window moves it anywhere from about 0.4 to 1.1 eV. The direct choice gave a steady answer and the indirect one did not, a useful hint (though not proof) of which transition fits.

With *Work out the Urbach energy* ticked, the tail below the edge gives **60.0 ± 0.2 meV**, matching the 60 meV we used.

If your thickness is uncertain and your film is thick enough to show interference fringes, the [[thin-film-thickness]] tool can find it from those fringes in the same spectrum. If the film ends up in a device, read its I-V curve with the [[solar-cell-iv]] tool.

## The fine print

- The method assumes reflection does not change much across the edge. Using only transmittance, with no reflection correction, can shift α and slightly bend the Tauc line.
- Whether the transition is direct is an assumption taken from the literature; published gaps for this compound vary, so check which transition type a comparison assumes.
- The paper reports Urbach energies of 1.38 to 1.97 eV. Urbach tails in semiconductors are usually tens to a few hundred meV, so check how that quantity was defined before comparing it with a tail width from the tool.
- Read the paper itself for how the structure (amorphous at low temperature, an extra indium selenide phase at 675 K) was established.
- A 100 nm film absorbs only part of the light near the gap, so noise in the weak-absorption region matters more than in thicker films.
