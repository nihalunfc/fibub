---
title: "Dark matter disk model fits LITTLE THINGS dwarf galaxy rotation curves"
summary: "A 2025 open-access A&A paper finds that dark matter confined to a disk fits dwarf galaxy rotation curves as well as a halo, with far less mass. Test the idea with fibub."
tools: [rotation-curve-fitter, hydrogen-line-analyser, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Sylos Labini, F.; Capuzzo-Dolcetta, R.; De Marzo, G.; Straccamore, M. (2025), Exploring the dark matter disk model in dwarf galaxies: Insights from the LITTLE THINGS sample, Astronomy & Astrophysics 693, A248, published online 21 January 2025. Open access under CC BY 4.0, as shown on the publisher's page, checked 2026-11-10."
  - "Gravitational constant in galaxy units, 4.30091 × 10⁻⁶ kpc (km/s)² per solar mass."
paper:
  title: "Exploring the dark matter disk model in dwarf galaxies: Insights from the LITTLE THINGS sample"
  authors: "Sylos Labini F, Capuzzo-Dolcetta R, De Marzo G, Straccamore M"
  journal: "Astronomy & Astrophysics"
  year: 2025
  doi: "10.1051/0004-6361/202452556"
  url: "https://www.aanda.org/10.1051/0004-6361/202452556"
  licence: "CC BY 4.0"
  reviewed: true
---

Small galaxies spin too fast for the stars and gas we see in them. The usual answer is a large, round halo of dark matter around each galaxy. A 2025 paper in *Astronomy & Astrophysics* tests a different shape: dark matter that lies in a flat disk, following the galaxy's hydrogen gas. Using dwarf galaxies from the LITTLE THINGS radio survey, the four authors find that this disk model fits the measured rotation as well as a standard halo, while needing roughly 10 to 100 times less total mass. You can explore why such different models can both fit the same data with the [[rotation-curve-fitter]], which fits a disc and a dark halo to any rotation curve you paste in.

## What they found

A **rotation curve** is a graph of how fast material orbits a galaxy at each distance from its centre. In dwarf galaxies these curves usually rise in a straight line near the middle and then level off.

The team reports three main results. First, the dark matter disk fits the curves about as well, in a statistical sense, as the standard halo built on the NFW profile (the shape cold dark matter simulations predict). Second, the disk model gives galaxy masses about one to two powers of ten smaller, because a halo extends far beyond the last measured point while a disk does not. Third, the straight-line rise in the centre follows naturally in the disk picture, since the stars and gas there are spread fairly evenly, giving a flat central density, or "core".

## Why it matters

Dwarf galaxies are a long-running puzzle. Simulations of cold dark matter predict halos whose density climbs steeply towards the centre, a "cusp", but many dwarfs look cored instead. A model in which the unseen mass tracks the gas offers another way to read the same curves. It shows that rotation curves alone leave room for very different pictures and total masses.

## How they did it

LITTLE THINGS mapped the 21 cm radio line of neutral hydrogen in nearby dwarf galaxies. Its Doppler shift gives the gas speed along our line of sight. The authors worked from a sample of 22 well-studied galaxies, set aside four whose motions were too irregular, and rebuilt maps of how the gas moves both around and towards or away from the centre, using a ring model that assumes a flat disk. They also corrected for the gas's random motions (asymmetric drift). Stellar masses came from infrared images, and gas masses from the hydrogen itself, raised by 1.4 to allow for helium. Then they fitted both the halo model and the disk model.

## Check it yourself with fibub

The key idea to test is that a rotation curve pins down the mass **inside** the last point, but not what lies beyond it. Here is a made-up dwarf galaxy, built by us from a small disc plus a cored halo and rounded to whole km/s. It is not data from the paper.

```
radius_kpc  speed_km_s  error_km_s
0.5   25  3
1.0   38  3
1.5   46  3
2.0   51  3
2.5   54  3
3.0   56  3
3.5   57  3
4.0   59  3
4.5   59  3
5.0   60  3
5.5   61  3
6.0   61  3
```

1. Paste the table into the [[rotation-curve-fitter]] and tick **No bulge**, since dwarfs rarely have one.
2. First, a hand check. Mass inside radius r is about v² × r ÷ G. At 6 kpc and 61 km/s that is 61² × 6 ÷ 0.0000043009 ≈ **5.2 × 10⁹ solar masses**.
3. Choose **Pseudo-isothermal (cored)** as the halo. The tool should find a disc of about 6 × 10⁸ solar masses with a scale length near 0.9 kpc and a core about 1.5 kpc wide. The mass inside 6 kpc again comes out near 5.2 × 10⁹, and dark matter is close to 90% of it.
4. Switch to **NFW**. With the scale length typed in as **0.9** kpc, the fit still matches the points, and the mass inside 6 kpc barely moves (about 5.4 × 10⁹). But the tool's halo total, M₂₀₀, comes out near **5.7 × 10¹⁰** solar masses, about 11 times what the data actually measure.
5. Now clear the scale length box and fit NFW again. On our points the halo runs off to a huge, meaningless total. The curve has no information about mass far outside 6 kpc.

That is the paper's point in miniature. Every model agrees on the mass inside the data; the total depends on the shape you assume for what you cannot see. Our reduced χ² values are far below 1 because we added no noise; add a few km/s of scatter and try again. Use the [[uncertainty-calculator]] to carry the speed errors into the v² r ÷ G mass. If you record the 21 cm line yourself with a small dish, the [[hydrogen-line-analyser]] turns its Doppler shift into speeds.

Note that our tool models the gas only as part of the disc and has no disk-shaped dark matter option, so it can show the halo side of the argument, not fit the paper's new model.

## The fine print

- **Statistical ties.** Both models fit; neither is ruled out. A good fit is not the same as the right physics.
- **Assumptions in the curves.** The ring model assumes a flat disk without warps, and the drift correction assumes the gas is in a steady state.
- **Mass-to-light ratios.** Stellar and gas masses carry about 20% uncertainty each, which feeds into every fit.
- **Small sample.** The work uses fewer than two dozen dwarf galaxies; bigger spirals and clusters are not tested here.
- Our curve is invented. For the measured curves and fit results, read the paper.
