---
title: "54 M dwarf binary orbits from speckle interferometry, and their masses"
summary: "A 2026 open-access paper gives 54 orbits of nearby red dwarf pairs from speckle imaging, 28 of them new, with masses good to a few per cent. Check the maths with fibub."
tools: [double-star-calculator, telescope-calculator]
updated: 2026-11-10
sources:
  - "Vrijmoet, E. H., Tokovinin, A., Henry, T. J., Winters, J. G., Jao, W.-C. and Horch, E. (2026), The Solar Neighborhood LIV: 54 Orbits of M Dwarf Multiples within 30 pc with Speckle Interferometry at SOAR, The Astronomical Journal 171, 186, published 24 February 2026. Open access under the Creative Commons Attribution 4.0 licence, checked on the published version, 2026-11-10."
  - "Dawes limit (116 ÷ aperture in mm, in arcseconds) as used in the telescope calculator; Kepler's third law in solar units."
paper:
  title: "The Solar Neighborhood LIV: 54 Orbits of M Dwarf Multiples within 30 pc with Speckle Interferometry at SOAR"
  authors: "Vrijmoet EH, Tokovinin A, Henry TJ, Winters JG, Jao W-C, Horch E"
  journal: "The Astronomical Journal"
  year: 2026
  doi: "10.3847/1538-3881/ae3b40"
  url: "https://doi.org/10.3847/1538-3881/ae3b40"
  licence: "CC BY 4.0"
  reviewed: true
---

Most stars near the Sun are M dwarfs, small cool red stars too faint to see without a telescope, and many of them come in pairs. Weighing a star is only possible when it has a partner: the orbit tells you the total mass. A February 2026 paper in *The Astronomical Journal*, open access under CC BY 4.0, adds 54 such orbits for red dwarf pairs within 30 parsecs (about 100 light years), 28 of them for the first time. The [[double-star-calculator]] uses the same seven orbital elements, so you can predict where a companion will be and turn an orbit into a mass, and the [[telescope-calculator]] tells you whether a telescope can split the pair at all.

## What they found

The team, from the RECONS group and the SOAR telescope in Chile, fitted orbits with periods from about 8 months to 30 years. Most (40 of the 54) go round in under 10 years. The new orbits raise the count of known M dwarf orbits within 25 parsecs in the standard catalogue by about 11%, and they revise about a tenth of the orbits that were already listed.

Using distances from the Gaia spacecraft, they turned each orbit into a total mass for the pair. Nearly all of the masses are precise to between 0.7% and 7%. About 70% have an eccentricity of 0.5 or more.

A few systems did not fit neatly. For one pair, the mass from the orbit disagrees with the mass expected from how bright the two stars are. The authors suggest the Gaia distance may be off, or the stars may be young and still settling.

## Why it matters

Masses are the most basic property of a star, yet they can only be measured directly in binaries. Red dwarfs are the commonest stars in the Galaxy and common hosts of small planets. Measured masses test the models used to estimate the mass of every lone red dwarf, including planet hosts.

## How they did it

The air blurs ordinary star photos to about 1 arcsecond, often ten times the gap between these pairs. Speckle interferometry gets round this by taking many very short exposures, each freezing the twinkling, and combining them by computer to recover detail close to the telescope's own limit. The team observed the stars over years with the 4.1-metre SOAR telescope, measuring the separation and direction of each companion again and again.

An orbit was published only when two independent fitting programs agreed, and when the period was known to better than 20% and the eccentricity to better than 8%.

## Check it yourself with fibub

A visual orbit is described by seven numbers: the period P, the time of closest approach T, the eccentricity e, the semi-major axis a (as an angle on the sky, in arcseconds), the inclination i, the node Ω and the periastron argument ω. The total mass then comes from Kepler's third law: M = (a/ϖ)³ ÷ P², with the parallax ϖ in arcseconds, P in years and M in solar masses.

**Step 1.** Open the [[double-star-calculator]], keep **Predict from an orbit**, and set **Star** to "My own orbit".

**Step 2.** Type a **made-up** red dwarf pair with rounded numbers: P = 5 years, T = 2024.0, e = 0.5, a = 0.25″, i = 60°, Ω = 100°, ω = 45°.

**Step 3.** Add a parallax of 100 mas (milliarcseconds), which puts the pair 10 parsecs away. The page gives a real semi-major axis of **2.5 AU** and a total mass of 2.5³ ÷ 5² = **0.625 solar masses**, a sensible total for two red dwarfs.

**Step 4.** Pick a date. On 1 January 2027 the companion is 0.244″ from the main star at a position angle of about 320°. By 1 January 2029 it has swung in to 0.099″ at about 127°, close to periastron.

**Step 5.** See why distance matters. Change the parallax to 102 mas, just 2% more. The mass falls to 0.589 solar masses, about 6% less. A 2% change in a moves the mass up by about 6% too. Because both are cubed, small errors in distance or orbit size grow threefold in the mass. One odd mass in the paper may simply be a bad distance.

**Step 6.** Now check the telescope. In the [[telescope-calculator]], an aperture of 200 mm gives a Dawes limit of 0.58″, far too coarse for our 0.1″ pair. Type 4100 mm, SOAR's size, and the limit falls to about 0.03″. The air still blurs it to about 1″, which speckle imaging gets round.

You can test a real case from the paper too. It gives the pair GJ 381 AB a period of 7.578 years, a semi-major axis of 0.2898″ and a total mass of 0.651 solar masses. Working backwards, the parallax that fits is about 87 mas. Type those into the calculator and the mass should come back close to the paper's.

## The fine print

- The masses are **totals for each pair**. Splitting them into the two stars needs extra data, such as velocities or how the pair moves against the background.
- Every mass leans on a **Gaia parallax**, and Gaia distances can be less reliable for close binaries, whose wobble confuses the measurement.
- Some orbits, especially the long ones, **still need more years of data**.
- For two pairs, the orbit disagreed with Gaia's own orbit solution, in one case with very different periods. These remain open questions.
- The sample favours pairs that are easy to resolve, so the authors do not yet compare periods and eccentricities. Our worked example uses made-up, rounded numbers; read the paper for the measured orbits and their uncertainties.
