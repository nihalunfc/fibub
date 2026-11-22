---
title: "Finding exoplanets: transits and wobbles"
seoTitle: "How exoplanets are found: transits and wobbles | Astronomy"
summary: "Planets around other stars are found mostly by the dip in starlight when they cross their star, and by the star's tiny back-and-forth wobble. Together the two give a planet's size, mass and density."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A planet blocks 1% of its star's light during a transit. Its radius is about:"
    choices: ["1% of the star's", "10% of the star's", "50% of the star's"]
    ans: 1
    why: "Depth = (Rp/Rs)², so Rp/Rs = √0.01 = 0.1."
  - q: "The radial velocity method measures a planet's:"
    choices: ["Radius", "Mass (at least a lower limit)", "Temperature"]
    ans: 1
    why: "The star's wobble depends on the planet's mass; without knowing the tilt it gives a minimum mass."
  - q: "Why do most transiting planets found orbit close to their stars?"
    choices: ["Close orbits are more likely to line up and transit more often", "Far planets don't exist", "Far planets are too bright"]
    ans: 0
    why: "The chance of a transit is about Rs/a, and short periods give many transits to catch."
sources:
  - "NASA Exoplanet Archive (counts described in words), exoplanetarchive.ipac.caltech.edu"
---

**Module 5 · about 25 minutes · read first: [1.4 The Doppler shift](/learn/courses/astronomy/doppler-shift/), [3.4 Binary stars and stellar masses](/learn/courses/astronomy/binary-stars/), [5.1 Aperture photometry](/learn/courses/astronomy/aperture-photometry/) · maths: squares, roots and Kepler's law.** You'll be able to explain the transit and radial-velocity methods, find a planet's size from a transit depth, and combine both methods to get its density.

<div class="bigidea">Planets around other stars are found mostly by the dip in light when they cross their star and by the star's tiny wobble; the dip gives the size, the wobble gives the mass, and together they give the density.</div>

## 1. Why this matters

The first planet around a Sun-like star was found in 1995 (Nobel Prize 2019). Now more than 5,000 are known, most found by the methods in this lesson. Amateurs with small telescopes routinely measure transits of giant planets, helping keep their timings accurate for space telescopes that follow them up.

## 2. Two ways to see the unseen

- **Transit**: when a planet passes in front of its star, the starlight dips a little. The depth gives the planet's size compared with the star; the time between dips gives the period.
- **Radial velocity (wobble)**: star and planet orbit their common centre of mass (Lesson 3.4). The star moves towards and away from us, shifting its spectral lines (Lesson 1.4). The size of the wobble gives the planet's mass.

Other methods include direct imaging, gravitational microlensing and timing changes.

<!--fig:exo-transit-->

Things to notice:

- A Jupiter-sized planet dips a Sun-like star by about 1%, easy for a backyard camera; an Earth needs a space telescope.
- Moving the planet closer shortens the period and transit and raises the wobble.

Follow one planet through both methods:

<div class="steps">
<div class="step"><b>The transit.</b> Every 4 days a planet crosses its star and the light drops by 1%: depth δ = 0.01.</div>
<div class="step"><b>Size.</b> δ = (R<sub>p</sub>/R<sub>★</sub>)², so R<sub>p</sub> = √0.01 = 0.1 of the star's radius. For a Sun-like star that is about 11 Earth radii, Jupiter-sized.</div>
<div class="step"><b>The wobble.</b> The planet tugs the star in a small circle. Doppler shifts show it moving towards and away from us by 100 m/s every 4 days.</div>
<div class="step"><b>Mass.</b> That speed, the period and the star's mass give about 0.7 Jupiter masses.</div>
<div class="step"><b>Density.</b> Mass ÷ volume: a puffy gas giant roasting close to its star, a "hot Jupiter".</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Transit depth**:

```math
\delta = \left(\frac{R_p}{R_\star}\right)^2
```

**Transit duration** (central transit, circular orbit, `$R_\star \ll a$`): `$T \approx \dfrac{P R_\star}{\pi a}$`.

**Radial-velocity amplitude** for a circular orbit seen edge-on, planet much lighter than the star:

```math
K = \left(\frac{2\pi G}{P}\right)^{1/3}\frac{M_p}{M_\star^{2/3}}
```

**Density** once both are known: `$\rho = M_p / (\tfrac{4}{3}\pi R_p^3)$` (Lesson 2.5).
</details>

## 3. What it means physically

The transit is a tiny eclipse; the planet is a black dot crossing a bright disc. The wobble is the star being tugged around by its planet like a hammer thrower leaning back against the hammer. A transit alone could be a small star or a brown dwarf; the wobble tells you it has a planet's mass. Size and mass together give density, which says whether the planet is rock, water-rich or gas.


<div class="meaning">

<dl>
<dt>δ = (R<sub>p</sub>/R<sub>★</sub>)²</dt><dd>Transit depth: the fraction of the star's disc the planet covers.</dd>
<dt>K</dt><dd>Radial-velocity amplitude: how fast the star wobbles towards and away from us.</dd>
<dt>ρ = M<sub>p</sub> / (4/3 πR<sub>p</sub>³)</dt><dd>Planet density: rock, water or gas.</dd>
<dt>Physical meaning</dt><dd>The transit is a moth crossing a distant street lamp: you cannot see the moth, only the tiny dimming. The wobble is a dog on a lead pulling its owner: you see the owner jerk, and how hard tells you how big the dog is.</dd>
</dl>

</div>

<div class="myth">

**"Exoplanets are photographed directly."** Almost all of the more than 5,000 known exoplanets were found indirectly, by transits or wobbles. Only a few dozen young, hot, widely separated planets have been imaged directly.

</div>

## 4. Worked example

*A star of 1 R☉ shows a 0.84% dip every 3.5 days. The wobble gives a planet mass of 0.7 Jupiter masses. What is the planet like?*

```math
\frac{R_p}{R_\star} = \sqrt{0.0084} = 0.092, \qquad R_p = 0.092\times696{,}000 = 64{,}000\ \text{km} \approx 0.9\ R_J
```

```math
\rho = \frac{0.7\times1.90\times10^{27}}{\tfrac{4}{3}\pi\times(6.4\times10^{7})^3} = \frac{1.33\times10^{27}}{1.10\times10^{24}} = 1{,}210\ \text{kg/m}^3
```

A gas giant like Jupiter (1.3 g/cm³) orbiting so close that its year lasts 3.5 days: a "hot Jupiter".

## 5. Practice

<div class="problem" data-problem="transit-radius"></div>

**More practice** (answers below):

1. A transit is 0.01% deep (100 ppm) on a Sun-sized star. How big is the planet?
2. Doubling a planet's mass at the same orbit changes K how?
3. Why does a transit need a nearly edge-on orbit?

<details>
<summary>Answers</summary>

1. `$R_p/R_\star = 0.01$`, so `$R_p = 6{,}960$` km, about 1.1 Earth radii.
2. K doubles.
3. Otherwise the planet passes above or below the star's disc as seen from Earth.
</details>

<div class="keypoints">

**Key points**

- Transits give the planet's size: δ = (R<sub>p</sub>/R<sub>★</sub>)².
- Radial velocity gives the planet's mass (times the sine of the orbit tilt).
- Both together give density and so composition.
- Most known exoplanets were found by transits (Kepler, TESS) and radial velocity.

</div>

**Try it with real numbers:** plan a transit with the [[transit-planner]], fit one with the [[transit-light-curve-fitter]], get masses with the [[exoplanet-mass-calculator]], and check for liquid water with the [[habitable-zone-calculator]].

**New words:** *exoplanet*, *transit*, *transit depth*, *radial velocity method*, *hot Jupiter*, *minimum mass*.
