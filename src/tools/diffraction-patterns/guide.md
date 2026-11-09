---
name: Diffraction pattern generator
num: 933
shelf: science
section: optics-and-photonics
title: "Diffraction pattern generator: single slit, double slit, grating and circular hole, Fraunhofer and Fresnel"
summary: "See and measure the light pattern from a single slit, a double slit, a grating or a round hole on a screen at any distance: the picture, the irradiance profile, fringe spacing, the Airy disc, grating orders and resolving power, in the far field (Fraunhofer) or near field (Fresnel)."
status: live
ads: true
order: 4
icon: sigma
works: offline
updated: 2026-11-09
related: [lens-ray-tracer, gaussian-beam, spectral-line-identifier, uncertainty-calculator]
sources:
  - "Fraunhofer patterns of slits, gratings and circular apertures, Fresnel diffraction with Fresnel integrals and the Fresnel-Kirchhoff integral for a circular aperture: standard textbook results, for example Hecht, E., Optics, chapter 10, and Born, M. and Wolf, E., Principles of Optics, chapter 8."
  - "Fresnel integrals by series and a continued fraction, Bessel functions by series and Hankel's asymptotic expansion: standard numerical methods (Abramowitz and Stegun, chapters 7 and 9)."
  - "Checked against SciPy (scipy.special j0, j1 and fresnel, and scipy.integrate.quad of the Fresnel integrals) and closed forms (on-axis 4 sin² law, 1.22 λ/D, minima at λ/a); no data tables are used. Example values are made up."
flow:
  - { icon: ruler, label: "Aperture" }
  - { icon: sliders, label: "Distance" }
  - { icon: eye, label: "Pattern" }
  - { icon: chart, label: "Profile" }
---

## What it does

Light passing through a small opening spreads out and interferes with itself, painting bright and dark bands on a screen. This generator works out that pattern for the four classic openings:

- a **single slit** (a bright central band with fainter bands on each side),
- a **double slit** (Young's fringes inside the single-slit envelope),
- a **grating** of N slits (sharp bright orders),
- a **circular hole** (the Airy disc and its rings).

It shows the pattern as a picture in the light's own colour and as an irradiance profile, both relative to the light falling on the aperture. You can see the far-field (**Fraunhofer**) pattern, the exact near-field (**Fresnel**) pattern at your screen distance, or both together.

## How to use it

1. Choose the **aperture** and type the **wavelength** (532 nm green laser pointer, 633 nm red helium-neon, 650 nm red pointer).
2. For slits give the **slit width a** and, for two or more slits, the **spacing d** from centre to centre; for a grating, the **number of slits N**. For a hole, the **diameter D** in millimetres.
3. Give the **screen distance** in metres and how much of the screen to show.
4. Choose **linear** brightness to see the pattern as the eye does, or **logarithmic** to bring out the faint outer fringes.

## What the results mean

- **Fresnel number** N_F = (half-width)²/(λz): below about 0.1 the screen is in the far field and the simple Fraunhofer formulas hold; above 1 you are in the near field, where the pattern depends on distance in more complicated ways.
- **Fringe spacing** λz/d: the distance between bright double-slit fringes.
- **Envelope first minimum** at sin θ = λ/a: the edge of the central band of a single slit.
- **Missing orders:** when d/a is a whole number, that fringe falls exactly on a dark point of the slit envelope.
- **Airy disc:** the first dark ring of a round hole at sin θ = 1.22 λ/D, the diffraction limit of telescopes and cameras.
- **Resolving power** of a grating is mN: two lines Δλ apart are just resolved when λ/Δλ = mN.

## Worked example

The made-up example is a double slit with 40 µm slits 200 µm apart, lit by a 532 nm laser, on a screen 1 m away. The Fresnel number is 0.0271, so this is the far field and the dashed and solid curves lie on top of each other. The page shows **fringes every 2.66 mm**, the envelope's first minimum 13.3 mm from the centre (a central band 26.6 mm wide), and **9 bright fringes** inside it: d/a = 5, so the 5th order is missing. The peak irradiance is 0.0120 × the incident light.

Switch to a **circular hole** of 0.2 mm and the Airy disc radius is 3.24 mm. Make the hole 2 mm instead: the Fresnel number becomes 1.88, nearly two Fresnel zones are open, and the centre of the pattern is almost dark (0.141 × incident), something the far-field formula can never show.

## Tips

- Doubling the distance doubles the size of a far-field pattern but makes it four times fainter.
- A narrower slit makes a wider pattern: diffraction is strongest when the opening is close to the wavelength.
- For a grating, many slits make the orders sharp; the slit width sets which orders are bright.

## FAQ

**Why is the Fresnel curve different from the far field?** Close to the aperture, light from different parts of the opening arrives with different curvature of the wavefront. The Fresnel calculation includes that; Fraunhofer assumes the screen is very far away.

**How accurate is it?** It is scalar, paraxial diffraction theory, excellent for small angles. Very fine gratings at large angles, and apertures close to the wavelength, need full electromagnetic models. For study and planning.
