---
title: "Open archives: free data from the world's telescopes"
seoTitle: "Free astronomy data: open archives and queries | Astronomy"
summary: "Most telescope data become public after a year or less. Archives like Gaia, MAST, ESO, SIMBAD and NASA's exoplanet archive let anyone search by position and filter by brightness with a simple query language, ADQL."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "A cone search returns:"
    choices: ["Every source within a chosen radius of a sky position", "Only the brightest star", "A picture of a cone"]
    ans: 0
    why: "You give a centre (RA, Dec) and a radius; the archive lists everything inside."
  - q: "ADQL is:"
    choices: ["A telescope", "An SQL-like query language for astronomy archives", "A file format"]
    ans: 1
    why: "The Astronomical Data Query Language adds sky geometry (points, circles) to SQL."
  - q: "Why does the number of results rise so fast when you raise the magnitude limit?"
    choices: ["Faint stars vastly outnumber bright ones", "Archives add fake stars", "The search radius grows"]
    ans: 0
    why: "Each magnitude fainter reaches a larger volume of space, so star counts climb steeply."
sources:
  - "IVOA ADQL Recommendation 2.1 (2023); archive names and access policies as published by ESA, NASA/STScI and ESO"
---

**Module 5 · about 20 minutes · SQL and sky geometry.** You'll be able to name the main open archives, write a cone search in ADQL, and plan an archive-only project.

## 1. Why this matters

You don't need a telescope to do research. Space missions and big observatories publish their data, usually after a short private period, and more papers now use archive data than new observations. With a laptop you can study a billion Gaia stars, years of TESS light curves or thousands of spectra.

## 2. Where the data live

- **Gaia** (ESA): positions, parallaxes, motions, brightnesses and colours for over a billion stars.
- **MAST** (NASA/STScI): Hubble, TESS, Kepler, JWST and more.
- **ESO Science Archive**: the Very Large Telescope and other ESO instruments.
- **SIMBAD and VizieR** (CDS, Strasbourg): what is known about named objects, and thousands of published catalogues.
- **NASA Exoplanet Archive**: every confirmed planet, with links to the papers.
- **Radio archives**, sunspot records (SILSO), and the AAVSO variable star database.

Most offer a web form and a **TAP** service you can query with ADQL from Python (`astroquery`) or a tool like TOPCAT.

<!--fig:cone-search-->

Things to notice:

- Doubling the radius gives four times the area, so about four times as many rows.
- One magnitude fainter roughly doubles to triples the count: plan limits before downloading.

<details class="maths" open>
<summary>Maths and principle</summary>

**Angular separation** between two sky positions (used by every cone search):

```math
\cos\theta = \sin\delta_1\sin\delta_2 + \cos\delta_1\cos\delta_2\cos(\alpha_1 - \alpha_2)
```

**Cone area** for a small radius `$r$`: `$\pi r^2$` square degrees. The whole sky is 41,253 square degrees.

**ADQL cone search** (radius in degrees):

```sql
SELECT source_id, ra, dec, phot_g_mean_mag
FROM gaiadr3.gaia_source
WHERE 1 = CONTAINS(POINT(ra, dec), CIRCLE(83.82, -5.39, 0.05))
  AND phot_g_mean_mag < 15
```
</details>

## 3. What it means physically

An archive is the shared memory of astronomy. Every photon a big telescope catches is stored with its calibration, so a question nobody asked in 2015 can be answered from 2015 data today. Because the data are public, anyone can check a published result, which is how science stays honest.

## 4. Worked example

*A catalogue has on average 50,000 stars brighter than G = 15 per square degree near the Milky Way's plane. How many will a 3 arcminute cone return?*

```math
r = \frac{3}{60} = 0.05°, \qquad \text{area} = \pi\times0.05^2 = 0.00785\ \text{deg}^2, \qquad N = 50{,}000\times0.00785 \approx 390
```

## 5. Practice

1. Two stars are at the same Dec of 0° and RA 10.00° and 10.05°. How far apart are they?
2. A query returns 2 million rows. Name two ways to cut it down.
3. Which archive would you use for TESS light curves?

<details>
<summary>Answers</summary>

1. 0.05° = 3 arcminutes (on the equator RA degrees equal sky degrees).
2. A smaller radius, a brighter magnitude limit, or only the columns you need.
3. MAST.
</details>

**Try it with real numbers:** check a catalogue star's altitude tonight with the [[object-altitude]] tool, convert coordinates with [[sky-coordinates]], and fetch planet data in the [[planet-data-explorer]].

**New words:** *archive*, *proprietary period*, *cone search*, *ADQL*, *TAP*, *catalogue*.
