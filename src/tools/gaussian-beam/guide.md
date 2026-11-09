---
name: Gaussian beam calculator
num: 930
shelf: science
section: optics-and-photonics
title: "Gaussian beam calculator: laser waist, Rayleigh range and divergence through lenses and mirrors (ABCD)"
summary: "Put lenses and curved mirrors on an optical rail and follow a laser beam through them with the complex beam parameter q and ABCD matrices: the size and position of every new waist, Rayleigh range, divergence, beam radius and wavefront curvature anywhere, with M² for real lasers."
status: live
ads: true
order: 1
icon: target
works: offline
updated: 2026-11-09
related: [telescope-calculator, uncertainty-calculator, plot-maker]
sources:
  - "Gaussian beam optics, the complex beam parameter q and ABCD ray-transfer matrices: standard results, for example Siegman, A. E. (1986), Lasers, chapters 17 and 20, and Saleh, B. E. A. and Teich, M. C., Fundamentals of Photonics, chapter 3."
  - "Thin-lens imaging of a Gaussian waist: Self, S. A. (1983), Applied Optics 22, 658 to 661. Embedded-Gaussian treatment of M²: Siegman (1990)."
  - "Checked against an independent NumPy ABCD calculation and Self's lens formula written for the tests; no data tables are used. The example rail is made up."
flow:
  - { icon: sliders, label: "Beam" }
  - { icon: ruler, label: "Rail" }
  - { icon: curve, label: "Propagate" }
  - { icon: target, label: "Waists" }
---

## What it does

A laser beam is not a bundle of straight rays: it has a narrowest point, the **waist**, and spreads on either side of it in a smooth, predictable way. Near the waist the beam stays nearly parallel for a distance called the **Rayleigh range** z_R = π w₀² / (M² λ); far away it spreads at a fixed **divergence** angle θ = M² λ / (π w₀). A lens or curved mirror does not make a point focus but a new waist somewhere else, with a new size.

This calculator follows the beam along a straight optical rail using the **complex beam parameter** q = (z − z_waist) + i z_R. Free space adds the distance to q, and a thin lens of focal length f changes 1/q by −1/f (the ABCD law). After every element you get the new waist radius and position, its Rayleigh range and divergence, and a plot of the beam radius along the whole rail.

## How to use it

1. Type the **wavelength** in nanometres (633 for a red helium-neon laser, 1064 for Nd:YAG, 532 for a green pointer).
2. Give the **beam quality M²**: 1 for an ideal TEM₀₀ beam, a little more for real lasers. Every formula then uses M²·λ in place of λ (the "embedded Gaussian"), so a poorer beam spreads faster and focuses to a larger spot.
3. Give the **waist radius** w₀ (the 1/e² intensity radius, half the data-sheet diameter) and **where the waist is** on the rail. A negative position means the waist is before the start, for example inside the laser.
4. Set the **rail length** and list the elements, one per line: `lens 200 50` is a lens at 200 mm with f = 50 mm (negative for a diverging lens); `mirror 400 500` is a concave mirror of radius 500 mm, used as a lens of f = R/2. Add a name at the end if you like.
5. **Look at position** gives the beam radius, diameter, wavefront radius and Gouy phase at any point.

## What the results mean

- **Waist at** a position before the stretch it belongs to is a **virtual** waist: the beam after that lens is diverging as if it came from there.
- **Beam parameter product** w₀ × θ never changes through ideal lenses: you can trade a small spot for a large divergence, never beat it.
- The **ABCD matrix** of the whole rail lets you check your own hand calculation; its determinant is always 1.
- The table lists each stretch: the waist that describes the beam there, and the beam radius at each end of it.

## Worked example

The made-up example is a helium-neon laser (633 nm, M² = 1) with a 0.5 mm waist at the start of the rail. Its Rayleigh range is 1,241 mm and its divergence 0.403 mrad. Lenses of 50 mm at 200 mm and 150 mm at 400 mm form a **3× beam expander** (their spacing equals f₁ + f₂): the first makes a tiny 20.0 µm waist at 250.2 mm, and after the second the waist is exactly **1.5 mm** (virtual, at −800 mm) with the divergence cut to 0.134 mrad. A 250 mm lens at 600 mm then focuses it to a **33.4 µm** waist at **850.6 mm**, with a Rayleigh range of only 5.54 mm. At the rail end (1,000 mm) the beam is 0.902 mm in radius again. With M² = 1.3 instead, the focus grows to 43.3 µm and moves to 851.0 mm.

## Tips

- To focus tightly, expand the beam first: the focused waist is about M² λ f / (π w) for a beam of radius w on the lens.
- A lens placed one focal length after a waist puts the new waist one focal length after the lens, whatever the beam size.
- For a folded set-up with mirrors, measure positions along the beam path, not across the table.

## FAQ

**Why is the focus not where the lens focal length says?** A Gaussian beam's waist is at the focal point only when the incoming beam is collimated far beyond its Rayleigh range. Otherwise the waist shifts towards the lens (Self's formula, which this tool reproduces).

**Does it include lens thickness or aberrations?** No: thin, ideal lenses and mirrors, and paraxial beams. For aberrations use a ray tracer. This is for study and planning, not a substitute for measuring the real beam.

**Diameter or radius?** Everything is the 1/e² radius unless it says diameter.
