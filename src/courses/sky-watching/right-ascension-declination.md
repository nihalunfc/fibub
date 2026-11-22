---
title: "Right ascension and declination: the sky's latitude and longitude"
seoTitle: "Right ascension and declination explained | Sky watching"
summary: "Declination is latitude on the sky and right ascension is longitude, measured in hours. They stay fixed to the stars, so every catalogue uses them. The ecliptic, the Sun's yearly path, is tilted 23.4° to them."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "What units is right ascension usually given in?"
    choices: ["Degrees from 0 to 360", "Hours, minutes and seconds from 0 to 24", "Light-years"]
    ans: 1
    why: "Right ascension is measured in hours because the sky turns through 24 hours of it each sidereal day; 1 h = 15°."
  - q: "Where is right ascension 0 h?"
    choices: ["At the Sun's position on the March equinox (the vernal equinox point)", "At Polaris", "Directly above Greenwich"]
    ans: 0
    why: "RA counts east from the point where the Sun crosses the celestial equator going north in March."
  - q: "A star has declination −30°. Where is it?"
    choices: ["30° north of the celestial equator", "30° south of the celestial equator", "30° from the zenith"]
    ans: 1
    why: "Declination is measured north (+) or south (−) of the celestial equator."
sources:
  - "ICRS reference frame and J2000.0 epoch: International Astronomical Union resolutions, iau.org"
---

**Module 2 · about 25 minutes · read first: [2.1 Altitude and azimuth: pointing from where you stand](/learn/courses/sky-watching/altitude-azimuth/), [1.1 The celestial sphere: a map painted on a dome](/learn/courses/sky-watching/celestial-sphere/) · maths: angles and hours.** You'll be able to read RA and Dec from a catalogue, convert hours to degrees, and find the ecliptic and the Sun on a sky map.

<div class="bigidea">Declination is latitude on the sky and right ascension is longitude, measured in hours; they stay fixed to the stars, so every catalogue and telescope uses them.</div>

## 1. Why this matters

Every object in every professional catalogue (Gaia, SDSS, the Messier and NGC lists) has its place given as right ascension and declination. Equatorial telescope mounts move along these two axes. Research papers, telescope proposals and data archives ([Astronomy 5.6](/learn/courses/astronomy/open-archives/)) all speak RA/Dec.

## 2. Latitude and longitude on the sky

- **Declination (Dec, `$\delta$`)** is like latitude: the angle north (+) or south (−) of the celestial equator. The north celestial pole is +90°.
- **Right ascension (RA, `$\alpha$`)** is like longitude: the angle east along the celestial equator from a zero point. It is measured in **hours, minutes and seconds**, from 0 h to 24 h. One hour of RA is 15°.

The zero of RA is the **vernal equinox point** (also called the First Point of Aries), where the Sun crosses the celestial equator heading north each March.

Because both coordinates are fixed to the stars, a star's RA and Dec stay the same night after night (apart from slow precession, Lesson 2.5, and the star's own motion). Catalogues therefore say which **epoch** their coordinates are for; most today use **J2000.0** (noon UT on 1 January 2000) in the International Celestial Reference System.

<!--fig:radec-map-->

Things to notice:

- On a sky map RA increases to the *left*: you are looking at the sky from inside.
- The ecliptic (dashed) crosses the equator at RA 0 h (March equinox) and 12 h (September equinox), and reaches +23.4° at 6 h (June) and −23.4° at 18 h (December).
- Stars near the Sun's RA are up in daylight. That is why Orion (RA about 5.5 h) is a winter evening sight: in June the Sun is at RA about 6 h, right next to it.

## 3. Writing coordinates

A typical catalogue line: Betelgeuse, RA 05h 55m 10.3s, Dec +07° 24′ 25″.

- 1 h = 60 min of RA = 3,600 s of RA = 15°, so 1 min of RA = 15′ (arcminutes) and 1 s of RA = 15″ (arcseconds).
- 1° = 60′ = 3,600″ of declination.

Careful: a minute of RA is *not* the same angle as a minute of arc, and on the sky a minute of RA gets narrower towards the poles (just as degrees of longitude do on Earth), by a factor `$\cos\delta$`.

Read the coordinates of Betelgeuse:

<div class="steps">
<div class="step"><b>Declination +7° 24′ 25″.</b> Like latitude: 7.4° north of the celestial equator.</div>
<div class="step"><b>Right ascension 5h 55m 10.3s.</b> Like longitude, but counted eastward in hours from the March equinox point.</div>
<div class="step"><b>Why hours?</b> The sky turns 360° in 24 hours, so 1 hour of RA = 15°. 5.92 h × 15 = 88.8°.</div>
<div class="step"><b>Fixed to the stars.</b> These numbers stay the same all night and from every place (apart from slow precession).</div>
<div class="step"><b>Use them.</b> Type them into a GoTo telescope or a chart and Betelgeuse is found anywhere in the world.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Converting RA to degrees:**

```math
\alpha_\text{deg} = 15 \times \left(h + \frac{m}{60} + \frac{s}{3600}\right)
```

**Converting declination to decimal degrees** (keep the sign for all three parts):

```math
\delta = \pm\left(d + \frac{m}{60} + \frac{s}{3600}\right)
```

**Width on the sky** of a small step `$\Delta\alpha$` in RA at declination `$\delta$`: `$\Delta\theta = \Delta\alpha \cos\delta$`.

**Try it:** Betelgeuse. RA `$= 15 \times (5 + 55/60 + 10.3/3600) = 15 \times 5.9195 = 88.79^\circ$`. Dec `$= 7 + 24/60 + 25/3600 = 7.407^\circ$`.
</details>


<div class="meaning">

<dl>
<dt>δ (declination)</dt><dd>Angle north (+) or south (−) of the celestial equator.</dd>
<dt>α (right ascension)</dt><dd>Angle east from the March equinox, in hours (1 h = 15°).</dd>
<dt>Δθ = Δα cos δ</dt><dd>A step in RA is narrower on the sky near the poles.</dd>
<dt>Physical meaning</dt><dd>RA and Dec are a grid drawn on the celestial sphere itself, turning with the stars, the way latitude and longitude are drawn on Earth and turn with it. Your city's coordinates do not change when the Earth spins; neither do a star's.</dd>
</dl>

</div>

<div class="myth">

**"Right ascension is measured in hours because it is a time."** It is an angle. Hours are used because the sky turns once in 24 hours, so RA tells you when a star crosses your meridian compared with others, which is very handy for observers.

</div>

## 4. Worked example

*How far apart on the sky are two made-up stars at the same declination +60°, one at RA 10h 00m and one at 10h 04m?*

The RA difference is 4 min = `$4 \times 15' = 60' = 1^\circ$`. But at Dec +60°, `$\cos 60^\circ = 0.5$`, so they are only `$1^\circ \times 0.5 = 0.5^\circ$` apart: about the width of the full Moon. On the celestial equator the same RA step would be the full 1°.

## 5. Practice

<div class="problem" data-problem="ra-degrees"></div>

**More practice** (answers below):

1. Convert RA 18h 36m 56s (Vega) to degrees.
2. Convert Dec −16° 42′ 58″ (Sirius) to decimal degrees.
3. Roughly which month is the Sun at RA 12 h?

<details>
<summary>Answers</summary>

1. `$15 \times (18 + 36/60 + 56/3600) = 15 \times 18.6156 = 279.23^\circ$`.
2. `$-(16 + 42/60 + 58/3600) = -16.716^\circ$`.
3. September, at the September equinox.
</details>

<div class="keypoints">

**Key points**

- Dec is sky latitude (−90° to +90°); RA is sky longitude (0 h to 24 h).
- 1 h of RA = 15°; 1 min = 15′; 1 s = 15″.
- RA and Dec stay fixed to the stars, unlike alt-az.
- The ecliptic is tilted 23.4° to the celestial equator.

</div>

**Try it with real numbers:** convert between RA/Dec, alt-az, ecliptic and galactic coordinates with [[sky-coordinates]], or browse objects by their coordinates in the [[observing-session]] planner.

**New words:** *right ascension*, *declination*, *vernal equinox*, *epoch*, *J2000.0*, *ecliptic*, *arcminute*, *arcsecond*.
