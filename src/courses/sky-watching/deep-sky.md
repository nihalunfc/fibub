---
title: "Deep-sky objects: Messier and NGC"
summary: "Star clusters, nebulae and galaxies are the deep sky. Charles Messier listed 110 of the brightest in the 1700s; the New General Catalogue lists thousands more. Surface brightness, not total magnitude, decides how easy each one is."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Why did Charles Messier make his catalogue?"
    choices: ["To list beautiful galaxies", "To list fuzzy objects that could be mistaken for comets", "To name constellations"]
    ans: 1
    why: "Messier was a comet hunter; he catalogued fuzzy objects that were not comets so he wouldn't be fooled again."
  - q: "Two galaxies both have total magnitude 9. One is 3′ across, the other 30′. Which is easier to see?"
    choices: ["The 3′ one", "The 30′ one", "They are equally easy"]
    ans: 0
    why: "The small one packs the same light into 100 times less area, so its surface brightness is 5 magnitudes higher."
  - q: "Which is a globular cluster?"
    choices: ["M45, the Pleiades", "M13 in Hercules", "M42, the Orion Nebula"]
    ans: 1
    why: "M13 is a ball of hundreds of thousands of old stars; the Pleiades is an open cluster; M42 is a nebula."
sources:
  - "Messier objects: Messier, C. (1781), Connaissance des Temps; modern data via SEDS Messier database and NASA"
  - "NGC/IC data: OpenNGC (CC-BY-SA 4.0), github.com/mattiaverga/OpenNGC"
---

**Module 5 · about 25 minutes · read first: [4.2 Aperture: the bucket that catches light](/learn/courses/sky-watching/aperture/), [3.2 Light pollution and the Bortle scale](/learn/courses/sky-watching/light-pollution/), [1.7 How bright is it? The magnitude scale](/learn/courses/sky-watching/magnitudes/) · maths: logarithms.** You'll be able to name the kinds of deep-sky object, read their catalogue numbers, and predict which ones you can see by surface brightness.

<div class="bigidea">Star clusters, nebulae and galaxies are the deep sky; surface brightness, not total magnitude, decides how easy each is to see, so a bright but large galaxy can be harder than a faint small one.</div>

## 1. Why this matters

The deep sky is where most amateur observing time goes: hundreds of targets, each a different kind of astrophysics. Understanding why some 9th-magnitude objects are easy and others invisible saves frustration, and the same surface-brightness idea drives professional detection limits.

## 2. Kinds of object

- **Open clusters:** young stars born together, loose, in the Milky Way's disc (the Pleiades, M45).
- **Globular clusters:** dense balls of 100,000+ ancient stars in the galaxy's halo (M13).
- **Emission nebulae:** gas glowing red from hydrogen, lit by hot young stars (the Orion Nebula, M42).
- **Reflection nebulae:** dust reflecting starlight, often blue.
- **Planetary nebulae:** shells thrown off by dying Sun-like stars (the Ring Nebula, M57). Nothing to do with planets: they looked like discs in early telescopes.
- **Supernova remnants:** debris of exploded stars (the Crab Nebula, M1).
- **Galaxies:** other star systems millions of light-years away (Andromeda, M31; the Whirlpool, M51).

## 3. Catalogues

- **Messier (M):** 110 bright objects, mostly visible from mid-northern latitudes, listed by Charles Messier in the 1700s.
- **NGC and IC:** the New General Catalogue (1888) and its Index Catalogues list about 13,000 objects. The open **OpenNGC** database keeps modern positions, sizes and magnitudes.
- **Caldwell (C):** 109 popular objects Messier missed, including southern ones.


<div class="meaning">

<dl>
<dt>μ = m + 2.5 log₁₀ A</dt><dd>Average surface brightness: magnitude spread over area A (arcsec²).</dd>
<dt>A = π(30a)(30b)</dt><dd>Area of an ellipse a′ × b′ in square arcseconds.</dd>
<dt>Messier / NGC</dt><dd>Catalogues: 110 bright objects / about 7,800 objects.</dd>
<dt>Physical meaning</dt><dd>Imagine two lamps with the same bulb, one behind a small frosted window and one behind a whole frosted wall. The small window glows bright; the wall is a faint glow you might miss. Galaxies are the same: total light matters less than how concentrated it is.</dd>
</dl>

</div>

<div class="myth">

**"A telescope makes faint nebulae brighter."** No telescope can make an extended object's surface brighter than it looks to the naked eye; it only makes it bigger, so your eye can see detail. That is why dark skies matter as much as aperture.

</div>

## 4. Surface brightness

A galaxy's **total magnitude** is all its light added up as if squeezed into a point. But you see it spread over an area. Its average **surface brightness** compares directly with the sky's (Lesson 3.2): if the galaxy is fainter per square arcsecond than the sky, it is very hard to see.

<!--fig:surface-brightness-->

Things to notice:

- Make the object bigger with the same magnitude: it fades towards the sky.
- Darken the sky: the same object stands out. That is why dark sites matter so much for galaxies.

Compare two galaxies of similar total brightness:

<div class="steps">
<div class="step"><b>M33, the Triangulum Galaxy.</b> Total magnitude 5.7: bright enough for the naked eye in theory.</div>
<div class="step"><b>But spread out.</b> It covers 70′ × 40′, over twice the area of the full Moon. Its surface brightness is about 23 mag/arcsec²: fainter than a dark sky.</div>
<div class="step"><b>M51, the Whirlpool.</b> Total magnitude 8.4, ten times fainter in total.</div>
<div class="step"><b>But compact.</b> Only 11′ × 7′, so its surface brightness is about 21.7 mag/arcsec²: it stands out better in a telescope.</div>
<div class="step"><b>The lesson.</b> Low power and dark skies for big, faint objects; more power for small, bright ones.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Average surface brightness** of an object of total magnitude `$m$` covering an area `$A$` (square arcseconds):

```math
\mu = m + 2.5 \log_{10} A
```

For an ellipse with axes `$a \times b$` arcminutes, `$A = \pi \times (30a) \times (30b)$` arcsec².

**Effect of magnification:** a telescope can't raise surface brightness above the naked-eye value; higher power spreads the light over a bigger apparent area, dimming it but making it larger, which helps the eye up to a point.

**Try it:** M33, the Triangulum Galaxy, total magnitude about 5.7 but about 70′ × 40′: `$\mu = 5.7 + 2.5\log_{10}(\pi \times 2100 \times 1200) = 5.7 + 2.5 \times 6.90 = 23.0$`. That is fainter than even a dark sky (about 21.8), which is why M33 is notoriously hard despite its "naked-eye" magnitude.
</details>

## 5. Worked example

*Which is easier: M57, the Ring Nebula (magnitude about 8.8, about 1.4′ × 1.0′), or M101, the Pinwheel Galaxy (about 7.9, about 29′ × 27′)?*

- M57: `$\mu = 8.8 + 2.5\log_{10}(\pi \times 42 \times 30) = 8.8 + 2.5 \times 3.60 = 17.8$`.
- M101: `$\mu = 7.9 + 2.5\log_{10}(\pi \times 870 \times 810) = 7.9 + 2.5 \times 6.35 = 23.8$`.

M57 is 6 magnitudes brighter per square arcsecond and shows even from a suburb; M101, although brighter in total, needs a dark sky. (Values are approximate catalogue figures, rounded.)

## 6. Practice

<div class="problem" data-problem="surface-brightness"></div>

**More practice** (answers below):

1. What is the average surface brightness of a 10th-magnitude galaxy 4′ × 2′?
2. Why is the Pleiades easy in a city but the Andromeda Galaxy's outer arms are not?
3. What kind of object is M42?

<details>
<summary>Answers</summary>

1. `$10 + 2.5\log_{10}(\pi \times 120 \times 60) = 10 + 2.5 \times 4.35 = 20.9$`.
2. The Pleiades are bright stars (points); Andromeda's arms are faint spread-out light with surface brightness well below a city sky.
3. An emission nebula, a star-forming region.
</details>

<div class="keypoints">

- Deep-sky objects: open and globular clusters, nebulae, galaxies.
- Surface brightness μ = m + 2.5 log₁₀(area) decides visibility.
- Use low power for large faint objects; dark skies help most.
- Messier (110) and NGC (about 7,800) are the classic lists.

</div>

**Try it on the real sky:** get a list of the best deep-sky objects for your sky and telescope tonight with the [[observing-session]] planner, and check when each is highest with [[object-altitude]].

**New words:** *open cluster*, *globular cluster*, *emission, reflection and planetary nebula*, *galaxy*, *Messier catalogue*, *NGC*, *surface brightness*.
