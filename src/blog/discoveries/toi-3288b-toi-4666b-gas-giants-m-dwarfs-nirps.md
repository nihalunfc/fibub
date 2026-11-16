---
title: "TOI-3288 b and TOI-4666 b: giant planets round small red dwarfs, weighed with NIRPS"
summary: "Two gas giants transit cool M dwarfs, and the infrared spectrograph NIRPS weighs them. We check their masses, densities and temperatures with fibub's exoplanet mass and habitable zone tools."
tools: [exoplanet-mass-calculator, habitable-zone-calculator]
updated: 2026-11-16
sources:
  - "Frensch, Y. G. C., Bouchy, F., Lo Curto, G., L'Heureux, A., de Lima Gomes, R. et al. (2026), TOI-3288 b and TOI-4666 b: Two gas giants transiting low-mass stars characterised by NIRPS, Astronomy & Astrophysics 707, A73, doi:10.1051/0004-6361/202557656. Licence CC BY 4.0, checked on the journal page, 2026-11-16. Values used here: periods 1.43 and 2.91 days; joint semi-amplitudes 511 and 144 m/s; planet radii 1.00 and 1.11 Jupiter radii; masses 2.11 and 0.70 Jupiter masses; equilibrium temperatures 1059 and 713 K; insolation of TOI-4666 b 54 times Earth's; star temperatures 3933 and 3512 K; star masses 0.64 and 0.58 Suns (from the Mann et al. 2019 relation); star radii 0.67 and 0.59 Suns (Mann et al. 2015); SED luminosities 0.110 and 0.060 Suns; distances 201.3 and 154.1 pc."
  - "Equilibrium temperature and Kepler's third law: the formulas used by the Habitable zone calculator (src/lib/sci/habitable.ts)."
  - "Radial velocity mass function: standard two-body result, as used by the Exoplanet mass calculator (src/lib/sci/rvmass.ts); test value for 51 Pegasi b from Mayor and Queloz (1995), Nature 378, 355."
paper:
  title: "TOI-3288 b and TOI-4666 b: Two gas giants transiting low-mass stars characterised by NIRPS"
  authors: "Frensch, Y. G. C.; Bouchy, F.; Lo Curto, G.; L'Heureux, A.; de Lima Gomes, R. et al."
  journal: "Astronomy & Astrophysics"
  year: 2026
  doi: "10.1051/0004-6361/202557656"
  url: "https://www.aanda.org/articles/aa/full_html/2026/03/aa57656-25/aa57656-25.html"
  licence: "CC BY 4.0"
  reviewed: true
---

Giant planets are rare round **M dwarfs**, the small, cool red stars that make up most of the Milky Way. Planet-forming discs round small stars hold less material, so building a Jupiter there is hard, and every new one is a test for formation theories. A new study confirms two such giants, TOI-3288 b and TOI-4666 b, found by the TESS satellite as dips in starlight and weighed with **NIRPS**, an infrared spectrograph in Chile built for red stars. This article shows how the [[exoplanet-mass-calculator]] and the [[habitable-zone-calculator]] let anyone rebuild the masses, densities and temperatures from the numbers the paper gives.

## The paper in brief

Both planets **transit**: they pass in front of their star, so we know their size from the depth of the dip and that we see the orbit nearly edge-on. Their pull makes the star wobble towards and away from us, and NIRPS and its visible-light partner HARPS measured that wobble.

- **TOI-3288 b** orbits a K9 dwarf (3933 K, 0.64 Suns) every **1.43 days**. It is a **hot Jupiter** of about 2.1 Jupiter masses and Jupiter's size, at about 1,060 K.
- **TOI-4666 b** orbits a cooler M2.5 dwarf (3512 K, 0.58 Suns) every **2.91 days**. It is a **warm Jupiter** of about 0.7 Jupiter masses, slightly larger than Jupiter, at about 710 K.

The paper also shows that the infrared NIRPS velocities and the visible HARPS velocities agree, which matters for red stars that are faint in visible light.

## Checked with the tools

This is a **recomputation**: we put the paper's periods, wobble sizes (semi-amplitudes, K), radii and star properties into the same functions the fibub tools run, and compared the answers with the paper's own results. Because the planets transit, we took the orbit's tilt as edge-on (sin i = 1) and the orbits as circular.

**Masses.** From K = 511 m/s, P = 1.43 days and a star of 0.64 Suns, the mass maths gives **2.108 Jupiter masses** for TOI-3288 b (paper 2.11). From K = 144 m/s, 2.91 days and 0.58 Suns it gives **0.704** for TOI-4666 b (paper 0.70). Figure 1 shows the size of the two wobbles: TOI-3288 b swings its star by half a kilometre per second, about 3.5 times more than TOI-4666 b.

<!-- fig:rv -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Circular-orbit wobble curves: TOI-3288 b swings its star by 511 m/s, TOI-4666 b by 144 m/s." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How hard each planet pulls its star (simulated)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How hard each planet pulls its star (simulated)</text><line x1="58" x2="546" y1="216.8" y2="216.8" style="stroke:var(--line)"/><text x="52" y="220.8" text-anchor="end" style="fill:var(--muted)">-500</text><line x1="58" x2="546" y1="178.9" y2="178.9" style="stroke:var(--line)"/><text x="52" y="182.9" text-anchor="end" style="fill:var(--muted)">-250</text><line x1="58" x2="546" y1="141" y2="141" style="stroke:var(--line)"/><text x="52" y="145" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="103.1" y2="103.1" style="stroke:var(--line)"/><text x="52" y="107.1" text-anchor="end" style="fill:var(--muted)">250</text><line x1="58" x2="546" y1="65.2" y2="65.2" style="stroke:var(--line)"/><text x="52" y="69.2" text-anchor="end" style="fill:var(--muted)">500</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="232" y2="236" style="stroke:var(--muted)"/><text x="155.6" y="249" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="253.2" x2="253.2" y1="232" y2="236" style="stroke:var(--muted)"/><text x="253.2" y="249" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="350.8" x2="350.8" y1="232" y2="236" style="stroke:var(--muted)"/><text x="350.8" y="249" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="448.4" x2="448.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="448.4" y="249" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Orbital phase</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Star speed (m/s)</text><line x1="58" x2="546" y1="141" y2="141" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M58 141L62.9 145.9L67.8 150.7L72.6 155.6L77.5 160.3L82.4 165L87.3 169.5L92.2 174.1L97 178.3L101.9 182.6L106.8 186.5L111.7 190.4L116.6 194.1L121.4 197.6L126.3 200.8L131.2 203.6L136.1 206.4L141 208.9L145.8 211.1L150.7 213L155.6 214.7L160.5 216.1L165.4 217.1L170.2 217.9L175.1 218.4L180 218.5L184.9 218.4L189.8 217.9L194.6 217.1L199.5 216.1L204.4 214.7L209.3 213L214.2 211.1L219 208.9L223.9 206.4L228.8 203.6L233.7 200.8L238.6 197.6L243.4 194.1L248.3 190.4L253.2 186.5L258.1 182.6L263 178.3L267.8 174.1L272.7 169.5L277.6 165L282.5 160.3L287.4 155.6L292.2 150.7L297.1 145.9L302 141L306.9 136.1L311.8 131.3L316.6 126.4L321.5 121.7L326.4 117L331.3 112.5L336.2 107.9L341 103.7L345.9 99.4L350.8 95.5L355.7 91.6L360.6 87.9L365.4 84.4L370.3 81.2L375.2 78.4L380.1 75.6L385 73.1L389.8 70.9L394.7 69L399.6 67.3L404.5 65.9L409.4 64.9L414.2 64.1L419.1 63.7L424 63.5L428.9 63.7L433.8 64.1L438.6 64.9L443.5 65.9L448.4 67.3L453.3 69L458.2 70.9L463 73.1L467.9 75.6L472.8 78.4L477.7 81.2L482.6 84.4L487.4 87.9L492.3 91.6L497.2 95.5L502.1 99.4L507 103.7L511.8 107.9L516.7 112.5L521.6 117L526.5 121.7L531.4 126.4L536.2 131.3L541.1 136.1L546 141" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 141L62.9 142.4L67.8 143.7L72.6 145.1L77.5 146.5L82.4 147.7L87.3 149L92.2 150.3L97 151.5L101.9 152.7L106.8 153.9L111.7 155L116.6 156L121.4 156.9L126.3 157.8L131.2 158.6L136.1 159.5L141 160.1L145.8 160.7L150.7 161.3L155.6 161.8L160.5 162.1L165.4 162.4L170.2 162.7L175.1 162.8L180 162.8L184.9 162.8L189.8 162.7L194.6 162.4L199.5 162.1L204.4 161.8L209.3 161.3L214.2 160.7L219 160.1L223.9 159.5L228.8 158.6L233.7 157.8L238.6 156.9L243.4 156L248.3 155L253.2 153.9L258.1 152.7L263 151.5L267.8 150.3L272.7 149L277.6 147.7L282.5 146.5L287.4 145.1L292.2 143.7L297.1 142.4L302 141L306.9 139.6L311.8 138.3L316.6 136.9L321.5 135.5L326.4 134.3L331.3 133L336.2 131.7L341 130.5L345.9 129.3L350.8 128.1L355.7 127L360.6 126L365.4 125.1L370.3 124.2L375.2 123.4L380.1 122.5L385 121.9L389.8 121.3L394.7 120.7L399.6 120.2L404.5 119.9L409.4 119.6L414.2 119.3L419.1 119.2L424 119.2L428.9 119.2L433.8 119.3L438.6 119.6L443.5 119.9L448.4 120.2L453.3 120.7L458.2 121.3L463 121.9L467.9 122.5L472.8 123.4L477.7 124.2L482.6 125.1L487.4 126L492.3 127L497.2 128.1L502.1 129.3L507 130.5L511.8 131.7L516.7 133L521.6 134.3L526.5 135.5L531.4 136.9L536.2 138.3L541.1 139.6L546 141" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">TOI-3288 b, K = 511 m/s</text><line x1="249.6" x2="261.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="265.6" y="40" style="fill:var(--muted)">TOI-4666 b, K = 144 m/s</text></svg><figcaption>Figure 1. The star's line-of-sight speed over one orbit for each planet, simulated as circular orbits from the paper's semi-amplitudes with the Exoplanet mass calculator's maths. An illustration, not the HARPS or NIRPS measurements.</figcaption></figure>
<!-- /fig:rv -->

**Why the star's mass matters.** The wobble fixes the planet's mass only once the star's mass is known: for the same K and period, the planet's mass grows as the star's mass to the power two thirds. Figure 2 runs the tool's maths for star masses from 0.4 to 0.8 Suns. A 10 % error in the star mass becomes about a 6.5 % error in the planet mass, which is why the paper's careful star masses (from an empirical relation for M dwarfs) matter as much as the velocities.

<!-- fig:mass -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Planet mass from the same K grows with the star mass adopted; the paper's masses sit on the tool's curves at 0.64 and 0.58 solar masses." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Planet mass depends on the star mass you adopt</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Planet mass depends on the star mass you adopt</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="162" y2="162" style="stroke:var(--line)"/><text x="52" y="166" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="92" y2="92" style="stroke:var(--line)"/><text x="52" y="96" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="180" x2="180" y1="232" y2="236" style="stroke:var(--muted)"/><text x="180" y="249" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="302" x2="302" y1="232" y2="236" style="stroke:var(--muted)"/><text x="302" y="249" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="424" x2="424" y1="232" y2="236" style="stroke:var(--muted)"/><text x="424" y="249" text-anchor="middle" style="fill:var(--muted)">0.7</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Star mass (Suns)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Planet mass (Jupiters)</text><path d="M58 124.1L70.2 122.3L82.4 120.6L94.6 118.7L106.8 117L119 115.3L131.2 113.6L143.4 111.9L155.6 110.1L167.8 108.5L180 106.8L192.2 105.2L204.4 103.5L216.6 101.9L228.8 100.2L241 98.6L253.2 97L265.4 95.4L277.6 93.8L289.8 92.2L302 90.7L314.2 89.1L326.4 87.5L338.6 86L350.8 84.4L363 82.9L375.2 81.4L387.4 79.9L399.6 78.4L411.8 76.9L424 75.3L436.2 73.9L448.4 72.4L460.6 70.9L472.8 69.5L485 68L497.2 66.5L509.4 65.1L521.6 63.7L533.8 62.3L546 60.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 193.5L70.2 192.9L82.4 192.2L94.6 191.6L106.8 191L119 190.4L131.2 189.8L143.4 189.2L155.6 188.5L167.8 188L180 187.3L192.2 186.8L204.4 186.2L216.6 185.6L228.8 185L241 184.4L253.2 183.8L265.4 183.3L277.6 182.7L289.8 182.2L302 181.6L314.2 181L326.4 180.5L338.6 179.9L350.8 179.4L363 178.8L375.2 178.3L387.4 177.8L399.6 177.2L411.8 176.7L424 176.1L436.2 175.6L448.4 175.1L460.6 174.5L472.8 174L485 173.5L497.2 173L509.4 172.5L521.6 171.9L533.8 171.5L546 171" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="350.8" cy="84.3" r="4.5" style="fill:var(--ink);opacity:1"/><circle cx="277.6" cy="183" r="4.5" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">TOI-3288 b</text><line x1="156" x2="168" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="172" y="40" style="fill:var(--muted)">TOI-4666 b</text><circle cx="259" cy="36" r="4" style="fill:var(--ink)"/><text x="270" y="40" style="fill:var(--muted)">Paper</text></svg><figcaption>Figure 2. The planet mass the Exoplanet mass calculator gives from each measured K, for star masses from 0.4 to 0.8 Suns. Dots: the paper's masses at its adopted star masses.</figcaption></figure>
<!-- /fig:mass -->

**Size and density.** A planet of 1.00 Jupiter radii in front of a star of 0.67 Suns blocks **2.35 %** of the light; TOI-4666 b, 1.11 Jupiter radii in front of 0.59 Suns, blocks **3.74 %**, a very deep dip because the star is small. Typing those depths back in returns the radii exactly. The densities come out at **2.61 g/cm³** for TOI-3288 b (twice Jupiter's 1.33) and **0.64 g/cm³** for TOI-4666 b (close to Saturn's 0.69).

**Orbits and starlight.** Kepler's third law puts the planets at **0.0214 au** and **0.0333 au**, only 6.9 and 12.1 star radii from their stars. With the paper's luminosity of 0.060 Suns, TOI-4666 b gets **54.2 times** Earth's sunlight (paper 54).

**Temperatures, and a lesson.** With no reflected light (albedo 0) and heat spread round the planet, the paper's SED luminosities give 1,095 K and 755 K, about 40 K warmer than the paper's 1,059 K and 713 K. If instead the luminosity is worked out from the star's radius and temperature (0.0968 and 0.0477 Suns), the same maths gives **1,060 K and 713 K**, matching the paper. So the paper's temperatures follow from the star's radius and temperature, and the small gap is the difference between two honest ways of measuring a star's brightness. This is exactly the kind of check a referee or a student can run in a minute.

| Check | Paper | Tool result |
|---|---|---|
| TOI-3288 b mass | 2.11 Jupiter masses | 2.108 from K = 511 m/s |
| TOI-4666 b mass | 0.70 Jupiter masses | 0.704 from K = 144 m/s |
| TOI-4666 b starlight | 54 times Earth's | 54.2 (L = 0.060 Suns) |
| TOI-3288 b temperature | 1,059 K | 1,060 K (L from radius and temperature) |
| TOI-4666 b temperature | 713 K | 713 K (L from radius and temperature) |
| Densities | (from the paper's mass and radius) | 2.61 and 0.64 g/cm³ |

## How we made the graphs

Both charts and every number above come from `scripts/blog-figures/toi-3288b-toi-4666b-gas-giants-m-dwarfs-nirps.mjs`. It calls:

- `minMass`, `semiMajor`, `radiusFromDepth` and `density` from `src/lib/sci/rvmass.ts`, the maths behind the [[exoplanet-mass-calculator]];
- `tEq`, `insolation` and `lumFrom` from `src/lib/sci/habitable.ts`, the maths behind the [[habitable-zone-calculator]].

All inputs (periods, K, radii, star masses, radii, temperatures and luminosities) are from the paper. Edge-on, circular orbits and albedo 0 are our assumptions. Figure 1 is **simulated** from K alone, not the measured velocities.

## How we test the maths

Every change to fibub runs `tests/sci.mjs`, which pins these functions to known answers:

- Jupiter's pull on the Sun must come out at **12.47 m/s**, and 51 Pegasi b's minimum mass at **0.477 Jupiter masses** from its measured 55.94 m/s wobble (Mayor and Queloz 1995), with its orbit at 0.0530 au.
- A 1.05 % transit depth on a Sun-sized star must give **1.0 Jupiter radii**, and Jupiter's density must be **1,326 kg/m³**.
- Earth's equilibrium temperature with albedo 0.306 must be **254 K**, and a star of the Sun's radius and 5,772 K must have exactly **1 solar luminosity**.

## Check it yourself

**The mass, on the [[exoplanet-mass-calculator]]:**

1. Under **Work out**, keep **Mass from the wobble**.
2. Type **Star mass (Suns)** 0.64, **Orbital period (days)** 1.43, **Eccentricity** 0 and **Velocity semi-amplitude K (m/s)** 511. Leave **Inclination** empty.
3. The answer reads a true mass of at least **2.11 Jupiter masses** (about 670 Earths).
4. Now type **Transit depth (%)** 2.35 and **Star radius (Suns)** 0.67. You should see a **Planet radius** of **1.00 Jupiter radii** and a **Density** of about **2.6 g/cm³**.
5. Change the star mass to 0.58, the period to 2.91, K to 144, the depth to 3.74 and the star radius to 0.59 for TOI-4666 b: **0.704 Jupiter masses** and about **0.64 g/cm³**.

**The temperature, on the [[habitable-zone-calculator]]:**

1. Under **Star**, type **Temperature (K)** 3512, **Luminosity (Suns)** 0.0477 and **Mass (Suns)** 0.58.
2. Under **Planet**, type 2.91 in **or orbital period (days)** and **Albedo (0 to 1)** 0; keep **Heat spread** on **Round the whole planet**.
3. The **Equilibrium temperature** reads **713 K**. Change the luminosity to 0.060 and it reads 755 K, with **Starlight at the planet** about **54.2 times Earth's**.

## What researchers can use it for

- **Sanity-checking a table before submission or review:** the [[exoplanet-mass-calculator]] turns K, period and star mass into a mass in seconds, so a typo in a table shows up at once.
- **Seeing how star parameters carry into planet parameters:** change the star mass or radius and watch the planet's mass, radius and density move, as in Figure 2.
- **Comparing temperature conventions:** the [[habitable-zone-calculator]] shows how much an equilibrium temperature depends on the luminosity, albedo and heat-spread choices behind it.
- **Planning follow-up:** a 3.7 % transit depth and a 144 m/s wobble are easy targets for small telescopes and mid-size spectrographs; the [[transit-planner]] finds when the next transits are visible.
- **Teaching:** two real planets show students why a hot Jupiter round a small star gives a deep transit and a large wobble.
