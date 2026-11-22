---
title: "Eclipses, transits and occultations"
summary: "When one body passes in front of another we get an eclipse, a transit or an occultation. Total solar eclipses depend on the Moon's distance; occultation timings measure asteroid shapes to a few kilometres."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "What is an occultation?"
    choices: ["A large body passing in front of a smaller-looking one and hiding it, such as the Moon hiding a star", "A small body crossing a big one's disc", "A shadow on the Moon"]
    ans: 0
    why: "In an occultation the nearer object hides the further one completely. When a small body crosses a large disc, it is a transit."
  - q: "Why are some central solar eclipses annular instead of total?"
    choices: ["The Moon is near its furthest point and looks smaller than the Sun", "The Sun is closer", "Clouds"]
    ans: 0
    why: "Near apogee the Moon's apparent size is smaller than the Sun's, leaving a ring."
  - q: "Never look at the Sun through a telescope without what?"
    choices: ["A proper full-aperture solar filter made for the purpose", "Sunglasses", "A red filter"]
    ans: 0
    why: "Focused sunlight blinds in a fraction of a second. Only certified solar filters over the front of the telescope are safe."
sources:
  - "Moon and Sun sizes and distances: NASA Moon and Sun Fact Sheets"
  - "Eye safety: American Astronomical Society, eclipse.aas.org (ISO 12312-2 solar viewers)"
---

**Module 5 · about 25 minutes · small angles.** You'll be able to tell eclipses, transits and occultations apart, explain total versus annular eclipses, and see how amateur timings measure the shapes of asteroids.

## 1. Why this matters

These alignments are some of the most precisely predictable events in nature and some of the most useful. Transits find exoplanets ([Astronomy 5.3](/learn/courses/astronomy/exoplanet-methods/)); occultations measure asteroid sizes and discover rings and moons; eclipses let us see the Sun's corona. Amateurs with a video camera and an accurate clock contribute directly.

**Safety first:** never look at the Sun, even partly eclipsed, without a certified solar viewer (ISO 12312-2) or, through a telescope, a proper full-aperture solar filter. Focused sunlight causes permanent eye damage instantly.

## 2. Three words

- **Eclipse:** one body enters the shadow of another (lunar eclipse), or blocks a body of similar apparent size (solar eclipse).
- **Transit:** a small body crosses the disc of a big one (Mercury or Venus across the Sun; a planet across its star).
- **Occultation:** a nearer body hides a further one completely (the Moon covering a star or planet; an asteroid covering a star).

## 3. Total or annular?

The Moon's distance varies from about 356,500 to 406,700 km, so its apparent size ranges from about 33.5′ to 29.4′. The Sun's is about 31.6′ to 32.7′. The Moon's dark shadow cone, the **umbra**, is about 374,000 km long: just about Earth's distance.

<!--fig:eclipse-geometry-->

Things to notice:

- Near perigee the umbra reaches past Earth's surface: a narrow path of totality.
- Near apogee the umbra ends in space: the Moon can't cover the Sun and an annular "ring of fire" shows.

<details class="maths" open>
<summary>Maths and principle</summary>

**Apparent sizes** (small-angle formula): `$\theta_\text{Moon} = 2R_\text{M}/d$`, `$\theta_\odot = 2R_\odot/D_\odot$`. Total when `$\theta_\text{Moon} > \theta_\odot$`.

**Umbra length** by similar triangles (Sun radius `$R_\odot$`, Moon radius `$R_\text{M}$`, Sun-Moon distance `$D$`):

```math
L = \frac{R_\text{M}\,D}{R_\odot - R_\text{M}} = \frac{1737 \times 149.6\times10^6}{696\,000 - 1737} \approx 374\,000\ \text{km}
```

**Occultation chord:** a star hidden for time `$t$` by an asteroid moving across the sky at speed `$v$` (km/s, projected at the asteroid's distance) gives a chord across the asteroid of length `$\ell = v\,t$`.
</details>

## 4. Worked example: weighing nothing, measuring an asteroid

*Made-up occultation.* An asteroid's shadow sweeps across Earth at 6.5 km/s (its projected speed). Five observers along a line across the path record the star vanishing for 7.4, 12.1, 13.0, 10.8 and 4.2 seconds.

- Chords: `$6.5 \times 7.4 = 48$`, `$79$`, `$85$`, `$70$` and `$27$` km.
- Placing the chords at the observers' cross-track positions traces the asteroid's outline: here roughly 85 km across, slightly elongated.

Timing accuracy matters: 0.1 s error is 0.65 km of chord, so observers use video and time signals from GPS. Groups such as the International Occultation Timing Association coordinate these campaigns.

## 5. Practice

1. Is a planet crossing its star seen from Earth an eclipse, a transit or an occultation?
2. At the Moon's average distance (384,400 km) can a solar eclipse be total?
3. A star vanishes behind an asteroid for 3.0 s, shadow speed 15 km/s. Chord length?

<details>
<summary>Answers</summary>

1. A transit.
2. Barely not: the umbra (about 374,000 km) is shorter than 384,400 − 6,371 km, so it falls just short: annular at the centre line. Totality needs the Moon a bit closer than average.
3. 45 km.
</details>

**Try it on the real sky:** find eclipses visible from your town with the [[eclipse-finder]], and predict exoplanet transits you could time with the [[transit-planner]].

**New words:** *eclipse*, *transit*, *occultation*, *umbra*, *penumbra*, *annular eclipse*, *chord*.
