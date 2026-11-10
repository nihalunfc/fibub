---
name: HR diagram
num: 830
shelf: science
section: stellar-astrophysics
title: "HR diagram"
summary: "Paste or open a star list (colour, apparent magnitude, parallax or distance, optional extinction) and get absolute magnitudes and a colour-magnitude diagram, or an HR diagram of luminosity against temperature from a black-body colour relation. Works with Gaia BP − RP and G, B − V and V, g − r, or bands of your own."
status: live
ads: true
order: 830
icon: star
works: offline
updated: 2026-11-09
related: [magnitude-flux-converter, blackbody-calculator, double-star-calculator, period-finder, spectral-line-identifier, variable-star-log, plot-maker]
sources:
  - "Distance modulus, parallax distance, extinction and reddening, Planck's law and the Stefan-Boltzmann law are standard; the colour-temperature relation is a black body tied to anchor points, derived by fibub (no calibration tables). Checked against astropy's BlackBody model with SciPy brentq and NumPy."
  - "The Sun's temperature is the IAU 2015 nominal value (5772 K). The band wavelengths and the Sun's colours and absolute magnitudes are rounded values for convenience; type your own."
  - "The example cluster is made up by the page (rough power laws, random scatter); it is not real data."
flow:
  - { icon: table, label: "Star list" }
  - { icon: ruler, label: "Distances" }
  - { icon: sigma, label: "Abs. mag" }
  - { icon: star, label: "HR diagram" }
---
## What it does

A Hertzsprung-Russell diagram plots stars by temperature (or colour) against luminosity (or absolute magnitude). Main-sequence stars fall on a diagonal band, giants sit above it and white dwarfs below. For a cluster, all stars are at about the same distance and age, so its colour-magnitude diagram (CMD) shows the main sequence, its turn-off and the giant branch clearly. This page:

- **Reads a star list** you paste or open (CSV, TSV, text or Excel). It finds the columns by name, including Gaia's `phot_g_mean_mag`, `phot_bp_mean_mag`, `phot_rp_mean_mag` and `parallax`.
- **Works out absolute magnitudes**: M = m − 5 log₁₀(d / 10 pc) − A, with d = 1000 / ϖ for a parallax ϖ in milliarcseconds, or a distance you give, or one distance for a whole cluster. Parallax errors give an error on M, σM = (5 / ln 10) · σϖ / ϖ, and stars with poor parallaxes are flagged.
- **Dereddens** the colour, (colour)₀ = colour − E, and uses A = R × E unless a star has its own A.
- **Estimates Teff, luminosity and radius** from the colour with a black body, and plots an HR diagram on log axes.
- Lists every star in a table, and downloads a CSV and a PNG, PDF or Word report.

Convert magnitudes to fluxes with the [[magnitude-flux-converter]], and turn a colour into a temperature with the [[blackbody-calculator]].

## How the temperatures are found

A black body at temperature T has a colour −2.5 log₁₀[B(λ₁, T) / B(λ₂, T)] between bands at effective wavelengths λ₁ and λ₂. Real stars are not black bodies, and their colours are compressed compared with one, so the page ties the relation to known points: it passes through the Sun's colour at 5772 K and, with **two anchors** (the default), through colour 0 at a temperature you choose (9600 K, near an A0 star such as Vega). The second anchor stretches the black-body colour scale; with one anchor it is a pure black body. The temperature for each colour is then found by bisection.

The bolometric correction comes from the same black body at the magnitude band's wavelength, relative to the Sun's: BC(T) − BC(T☉) = 2.5 log₁₀[(B(λm, T) / T⁴) / (B(λm, T☉) / T☉⁴)]. Then log L/L☉ = −0.4 [(M − M☉) + BC(T) − BC(T☉)], and R/R☉ = √(L/L☉) · (T☉/T)². These are estimates for plotting and teaching; for papers, use a published colour-temperature calibration or model atmospheres.

## How to use it

1. Paste a star list or open a file. Without a header row, the columns are taken as colour, magnitude, parallax (mas).
2. Pick the photometric system. The wavelengths and Sun values are rounded and editable.
3. Choose per-star parallaxes or one distance for every star, and set any reddening.
4. Switch the plot between the colour-magnitude diagram, the HR diagram and the observed CMD.

## Worked example

The page opens with a made-up open cluster of 172 stars at 250 pc (parallax about 4 mas) with E(B − V) = 0.05: 160 main-sequence stars (a quarter of them unresolved binaries, up to 0.75 mag brighter), 8 red giants and 4 white dwarfs. With R = 3.1 the page reports "172 stars placed, median distance 250 pc (modulus 6.99)". The first star, MS-1, has B − V = 1.641 and V = 16.096 at ϖ = 3.9099 ± 0.0802 mas, so d = 255.8 pc, M(V) = 8.90 ± 0.04, (B − V)₀ = 1.591 and Teff ≈ 3727 K, L ≈ 0.049 L☉ and R ≈ 0.53 R☉.

## Tips

- Set the reddening to your cluster's value; a wrong E shifts the whole sequence sideways and, through A, up or down.
- Gaia DR3 parallaxes have a small zero-point offset; type the correction you use as the parallax offset.
- Stars with σϖ/ϖ above about 20 % have biased 1/ϖ distances. Use one cluster distance instead.

## FAQ

**Why do my temperatures differ from a catalogue's?** The page uses a black body with two anchor points, not a stellar calibration. Expect agreement within about 10 % for FGK stars and larger differences for hot and very cool stars.

**Can I fit the cluster's distance?** Not here; choose one distance and adjust it until the main sequence lines up with one you trust.

**Is my data sent anywhere?** No. Everything is worked out in your browser.
