---
name: Magnitude and flux converter
num: 44
shelf: science
section: stellar-astrophysics
title: "Magnitude to flux converter: Vega and AB magnitudes, Jansky, erg/s/cm²/Å"
summary: "Convert between Vega and AB magnitudes, Jansky, f_ν, f_λ and photon flux in UBVRI, 2MASS, WISE and SDSS bands or at any wavelength, with the zero points and their sources shown."
status: live
ads: true
order: 10
icon: star
works: offline
updated: 2026-11-08
related: [cosmology-calculator, telescope-calculator, sub-exposure-calculator, uncertainty-calculator]
sources:
  - "Vega zero points: Bessell, Castelli and Plez (1998), Cohen et al. (2003) for 2MASS and Jarrett et al. (2011) for WISE."
  - "AB magnitudes: 3631 Jy for every band (Oke and Gunn 1983)."
flow:
  - { icon: star, label: "Magnitude" }
  - { icon: convert, label: "Band" }
  - { icon: table, label: "All units" }
---

## What it does

Optical astronomers quote magnitudes, radio and infrared astronomers quote Jansky, and theory papers and spectra use erg s⁻¹ cm⁻² Å⁻¹. Turning one into another needs the band's zero point and its wavelength, which are easy to get wrong. Type a brightness in any of these units, pick the band, and this converter shows it in all the others at once: Vega magnitude, AB magnitude, Jy, mJy, µJy, f_ν in cgs and SI, f_λ in cgs and SI, and photons per second per cm² per Å.

For the star's spectrum at a temperature, use the [[blackbody-calculator]]; for distances at a redshift, the [[cosmology-calculator]].

## How to use it

1. Type the **value** and choose its **unit**.
2. Choose the **band**: Johnson-Cousins U, B, V, R, I; 2MASS J, H, Ks; WISE W1 to W4; SDSS u, g, r, i, z; or **Any wavelength** for a single wavelength you type in micrometres.
3. The table shows the same brightness in every unit. The row you typed is in bold. Tap a value to copy it.

## Where the numbers come from

- **Vega zero points** (the flux of a magnitude 0 star): Johnson-Cousins from Bessell, Castelli and Plez (1998); 2MASS from Cohen, Wheaton and Megeath (2003); WISE from Jarrett et al. (2011).
- **AB magnitudes** use 3631 Jy in every band (Oke and Gunn 1983): m_AB = −2.5 log₁₀(f_ν / 3631 Jy). SDSS magnitudes are close to AB (u is about 0.04 mag brighter in AB terms, z about 0.02 fainter), so SDSS bands offer AB only.
- f_λ = f_ν c / λ², and the photon flux is f_λ / (hc/λ), both at the band's effective wavelength. For broad bands this is a close guide rather than exact, because the true conversion depends on the shape of the spectrum across the band.
- The difference **AB − Vega** for each band is shown under the band: about 0 in V, 0.89 mag in 2MASS J, 1.37 in H and 1.84 in Ks.

## Worked example

A star of V = 12.000 (Vega) has a flux density of 0.05763 Jy (57.63 mJy), which is 5.763 × 10⁻²⁵ erg s⁻¹ cm⁻² Hz⁻¹. At 0.545 µm that is 5.816 × 10⁻¹⁴ erg s⁻¹ cm⁻² Å⁻¹, or 0.0160 photons per second per cm² per Å. Its AB magnitude is 11.999. A star of Ks = 10.000 (Vega) has Ks = 11.840 in AB magnitudes.

## Frequently asked questions

**Why do AB and Vega magnitudes differ?** Vega's spectrum is not flat in f_ν, so a magnitude 0 star on the Vega system has a different flux in each band, while the AB system uses the same flux everywhere. The gap is small in the visible and grows in the infrared.

**Can I use it for radio flux?** Yes. Choose "Any wavelength" and type the wavelength in micrometres (21 cm is 210000 µm); Jy, f_ν and f_λ all convert.

**Does it send anything?** No. It runs in your browser and works offline.
