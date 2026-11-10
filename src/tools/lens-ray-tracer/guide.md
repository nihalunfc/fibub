---
name: Lens ray tracer
num: 932
shelf: science
code: T667
section: optics-and-photonics
title: "Lens ray tracer: trace rays through spherical lenses, spot diagram, focal length and aberrations"
summary: "Type a lens system as a list of spherical surfaces and trace exact rays through it: focal length, f-number, image position, a spot diagram against the Airy disc, spherical aberration, ray fans, best focus, distortion and Petzval field curvature, drawn as a lens layout."
status: live
ads: true
order: 3
icon: eye
works: offline
updated: 2026-11-09
related: [gaussian-beam, telescope-calculator, star-fwhm-checker, backfocus-calculator, sellmeier-fitter, diffraction-patterns, thin-film-coating, polarisation-calculator, plot-maker]
sources:
  - "Paraxial y-nu ray trace, real ray tracing through spherical surfaces (the Spencer and Murty / Welford intersection and vector refraction formulas), Petzval sum: standard results, for example Welford, W. T., Aberrations of Optical Systems (1986), and Smith, W. J., Modern Optical Engineering."
  - "Airy disc radius 1.22 λ N: standard diffraction result. The crown-glass index 1.517 is a rounded general value; all example lenses are made up."
  - "Checked against an independent NumPy ray tracer written for the tests (sphere intersection from the centre of curvature, angle-form Snell's law) and against the thick-lens lensmaker's equation; no lens catalogue or glass data is used."
flow:
  - { icon: table, label: "Surfaces" }
  - { icon: pointer, label: "Trace" }
  - { icon: target, label: "Spot" }
  - { icon: chart, label: "Aberrations" }
---

## What it does

A lens bends each ray by Snell's law where it enters and leaves the glass. Rays near the axis (paraxial rays) all meet at the focus that the lens formula predicts, but rays through the edge of a spherical lens, or from a star off to the side, miss it a little. Those misses are the **aberrations**, and they decide how sharp an image the lens can make.

This tool traces **exact rays in three dimensions** through any number of centred spherical or flat surfaces. A paraxial trace gives the first-order numbers (effective and back focal length, image distance, magnification, f-number); then a fan of real rays across the entrance pupil gives a **spot diagram**, the **longitudinal spherical aberration** curve, the **tangential and sagittal ray fans**, the **best focus**, and the **distortion** of the chief ray. A lens layout shows the rays on their way.

Find the glass's index at your wavelength with the [[sellmeier-fitter|Sellmeier fitter]], and check the focused spot of a laser beam with the [[gaussian-beam|Gaussian beam calculator]].

## How to use it

1. Pick an example or type your own surfaces, in the order light meets them. Each line is `radius thickness index semi-diameter` in millimetres:
   - **radius** positive when its centre of curvature is to the right (a convex front face), negative when to the left, `inf` for a flat face;
   - **thickness** to the next surface (the last line's is ignored, the image plane is found for you);
   - **index** of the material after the surface (1 for air);
   - **semi-diameter**, the clear radius, optional; rays outside it are clipped (vignetting).
2. Choose an object **at infinity** (a star, parallel light) or **at a distance** in front of the first surface.
3. Set the **entrance pupil diameter** (the width of the light beam at the first surface, which is the stop) and the **field angle** for the off-axis spot.
4. Choose the **image plane**: the paraxial focus or the best focus (smallest RMS spot), plus any extra shift.

## Worked example

The default is a made-up plano-convex lens, curved side first: radius 51.7 mm, 5 mm thick, index 1.517, then flat. The page gives **f = 100 mm** (51.7 / 0.517) and a back focal length of 96.70 mm; with a 20 mm pupil that is **f/5**. On axis, rays through the rim focus **1.10 mm short** of the paraxial focus (undercorrected spherical aberration) and the RMS spot is 63.8 µm, far larger than the 3.58 µm Airy disc: this lens is aberration-limited at f/5. At **5°** the RMS spot is **141 µm**, the image is 8.748 mm off axis, and distortion is tiny (−0.0071 %).

Turn the same lens round (**flat side to the light**) and the rim rays focus 4.38 mm short: four times the spherical aberration. That is why a plano-convex lens should face its curved side towards the parallel light.

## Tips

- Halving the pupil diameter cuts the spherical aberration blur by about eight times (it grows with the cube of the aperture).
- The spot diagram is geometric. When the RMS spot is well inside the Airy circle, diffraction, not aberration, sets the sharpness.
- Distortion is the difference between where the real chief ray lands and where the paraxial chief ray would; positive is pincushion, negative is barrel.
- The Petzval radius is the curved surface the lens naturally images a flat object onto.

## FAQ

**Does it handle colour?** One wavelength at a time: change the indices to the values for another colour and compare.

**Can I model aspheres, mirrors or tilted elements?** Not here: centred spherical and flat refracting surfaces only.

**Is it good enough to design a lens?** It is for study and planning, not a substitute for professional optical design software and a qualified optical designer.
