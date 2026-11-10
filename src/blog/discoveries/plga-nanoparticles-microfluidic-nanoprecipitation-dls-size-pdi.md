---
title: "PLGA nanoparticle size and PDI: microfluidic vs batch nanoprecipitation (DLS)"
summary: "A 2025 study tuned PLGA nanoparticles to about 150 to 200 nm by batch and microfluidic nanoprecipitation, judged by DLS size and PDI. Here is how to read those two numbers yourself."
tools: [dls-analyser, nanoparticle-calculator, particle-size-image]
updated: 2026-11-10
sources:
  - "Cumulant analysis of DLS (Koppel 1972; ISO 22412) and the Stokes–Einstein relation are standard physics."
  - "The two correlation functions in the worked example are made up by fibub (lognormal size populations in water at 25 °C, 633 nm, 173°, small noise); they are not data from the paper."
paper:
  title: "Optimization of PLGA Nanoparticle Formulation via Microfluidic and Batch Nanoprecipitation Techniques"
  authors: "Kozalak G, Heyat Davoudian S, Natsaridis E, Gogniat N, Koşar A, Tagit O"
  journal: "Micromachines"
  year: 2025
  doi: "10.3390/mi16090972"
  url: "https://doi.org/10.3390/mi16090972"
  licence: "CC BY"
  reviewed: true
---

PLGA, a biodegradable polyester, is one of the most used materials for drug-carrying nanoparticles, and their size decides where they go in the body and how fast they release a drug. An August 2025 paper in Micromachines compared two ways of making them, dropwise batch mixing and mixing in a microfluidic chip, and judged every recipe by two numbers from dynamic light scattering (DLS): the z-average diameter and the polydispersity index (PDI). The [[dls-analyser]] works out both from the raw correlation data in your browser, so you can see where they come from and when they mislead.

## What they found

The team aimed for particles near 200 nm with a PDI of 0.1 or less. In the batch method, the ratio of polymer to solvent was the main thing that set the size. Most batch recipes gave particles between roughly 130 and 280 nm, but runs with too little acetonitrile made micrometre-sized clumps with a PDI near 0.9. Three repeats of one good recipe gave 144 ± 11 nm.

In the chips, the ratio of water flow to solvent flow mattered most. A ratio of 6 to 1 gave particles over 500 nm with a PDI near 0.8, while ratios of 2 to 1 up to 4 to 1 stayed under 250 nm. The best setting was a ratio of 3 to 1 at the lowest total flow they tried, 2.5 mL/min. A three-inlet herringbone mixer kept the PDI low after freeze-drying; a simple Y-shaped junction gave a PDI of 0.24, which the authors call borderline.

## Why it matters

Particles that are too large or too mixed in size behave unpredictably in cells and in the blood. A chip that gives the same size every time, at a flow setting you can write down, is easier to scale up than a person adding drops by hand.

## How they did it

PLGA dissolved in acetonitrile was mixed with water containing polyvinyl alcohol, a stabiliser. For the batch route, a design-of-experiments program picked eight recipes per round over three rounds, and regression models related size and PDI to the recipe. For the chips, the team varied the flow ratio and the total flow rate on two mixer designs. Every sample was diluted to 0.01 mg/mL and measured three times on a commercial back-scatter DLS instrument.

## Check it yourself with fibub

DLS does not measure size directly. It records how fast scattered laser light flickers, as an autocorrelation curve g2(τ), and the size comes from a model fitted to that curve. Most instruments can export the curve. The example below uses **two made-up curves**, not data from the paper: sample A is a single population near 150 nm; sample B is the same particles with 30 % of the scattered light coming from clumps near 1.2 µm. The curves are generated, not typed, and are not listed here, so read the numbers below as a guide to what to look for in your own data.

1. Paste delay time and g2 in two columns. Set *Delay time τ in* to µs, *Second column is* to g2(τ) and *Baseline* to 1.
2. Type the instrument settings. We used 25 °C, 633 nm and 173°, with water (refractive index 1.330). The page reports q = 0.02635 nm⁻¹ and a water viscosity of 0.8901 mPa·s. The paper does not list its own.
3. Keep *Fit order* at 2nd order and *Fit down to* at 10 %.

For sample A the page gives **z-average 149.0 nm, PDI 0.017**, from a diffusion coefficient of 3.294 µm²/s. You can check this by hand: d = kT / (3πηD) = 1.381 × 10⁻²³ × 298.15 / (3π × 0.8901 × 10⁻³ × 3.294 × 10⁻¹²) ≈ 149 nm.

For sample B the page gives **z-average 201.6 nm, PDI 0.341**. On its own, 202 nm looks close to the study's 200 nm target. The PDI says otherwise, so look at the *Size distribution* card. We set *Smallest size* to 20 nm and *Largest size* to 5000 nm, since nothing in these samples is smaller; with the default 1 nm floor, a tiny artefact at the smallest size takes over the volume and number views. With smoothing 0.01, the intensity distribution shows two peaks: about **152 nm (69.8 %)** and **1165 nm (30.2 %)**. Its harmonic mean, 201.7 nm, matches the z-average, as it should.

Now press *Volume*. The large peak all but vanishes, because the light a small particle scatters grows with the sixth power of its diameter. Working back from the intensity shares, the clumps in sample B number only about 2 per million particles. So a high PDI can come from a very small number of clumps, and that is why filtering and repeat readings matter. Remember that the volume and number views here assume particles much smaller than the light's wavelength; at these sizes they are only a rough guide.

Turn a z-average into surface area or particle counts per millilitre with the [[nanoparticle-calculator]], and compare it with sizes measured from electron micrographs in the [[particle-size-image]] tool.

## The fine print

- DLS gives a hydrodynamic size, which includes the stabiliser shell and the water dragged along, so it reads larger than electron microscopy.
- The z-average is weighted heavily towards large particles, as the authors point out. A PDI above about 0.4 means the z-average says little on its own.
- The paper does not give the wavelength, angle or temperature of the measurements, so its exact numbers cannot be refitted without the raw curves.
- The two mixers differ in channel length as well as in the number of inlets, so the effect of the inlet design cannot be isolated.
- No drug was loaded; drug-filled particles may come out at a different size.
