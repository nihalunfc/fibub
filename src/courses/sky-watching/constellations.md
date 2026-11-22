---
title: "Constellations and star charts"
summary: "The International Astronomical Union divides the sky into 88 constellations with exact borders. Learn a few bright patterns, how a planisphere-style chart works, and how to star-hop from one star to the next."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "How many official constellations are there?"
    choices: ["12", "48", "88"]
    ans: 2
    why: "The IAU fixed 88 constellations, with exact borders, in 1922 and 1930."
  - q: "On an all-sky chart held overhead with north at the top, east is"
    choices: ["on the right", "on the left", "at the bottom"]
    ans: 1
    why: "Held over your head you look up from inside the dome, so east and west swap compared with a map of the ground."
  - q: "What is an asterism?"
    choices: ["A recognisable star pattern that is not one of the 88 constellations, such as the Big Dipper", "A small asteroid", "A star chart"]
    ans: 0
    why: "The Big Dipper is an asterism inside the constellation Ursa Major."
sources:
  - "The 88 constellations and their boundaries: International Astronomical Union, iau.org/public/themes/constellations"
  - "Star positions: Yale Bright Star Catalogue, 5th revised edition (Hoffleit and Warren 1991), via NASA HEASARC"
---

**Module 1 · about 25 minutes · no maths needed.** You'll be able to name a few key constellations, read an all-sky chart, and use star-hopping to find fainter objects.

## 1. Why this matters

A constellation is the sky's equivalent of a country on a map: a way to say roughly where something is. "A comet in Cassiopeia" or "a nova in Cygnus" tells any observer in the world where to look. And star-hopping, using bright patterns to step towards fainter targets, is still how most amateur astronomers find objects without a computerised mount.

## 2. 88 areas, not just pictures

Many cultures drew their own figures in the stars. In 1922 the **International Astronomical Union (IAU)** adopted a standard list of **88 constellations**, and in 1930 fixed their borders along lines of right ascension and declination. Today a constellation is an *area* of sky, like a country, and every point belongs to exactly one.

The patterns most people recognise are often not official constellations but **asterisms**: the Big Dipper (or Plough) is part of Ursa Major; the Summer Triangle is made of the brightest stars of three constellations (Vega in Lyra, Deneb in Cygnus, Altair in Aquila).

Stars in a constellation are usually not near each other in space. They only lie in the same direction. Orion's Belt stars, for example, are roughly 700 to 2,000 light-years from us.

## 3. Reading an all-sky chart

A planisphere or a printed monthly chart shows the whole visible sky as a circle:

- The **edge** is your horizon; the **centre** is the zenith.
- Hold it **over your head**, with the compass direction you face at the bottom. Because you look *up* at it, **east is on the left** when north is at the top, the opposite of a map of the ground.
- Brighter stars are drawn bigger.

Turn the sky below. Sidereal time (Lesson 2.3) sets which part of the sky is up; latitude sets how the dome is tilted.

<!--fig:sky-dome-->

Things to notice:

- At 43° N the Big Dipper and Cassiopeia are always somewhere on the chart (circumpolar, Lesson 1.2), on opposite sides of Polaris.
- Orion is a winter evening constellation (sidereal time around 5 to 6 h); the Summer Triangle owns summer evenings (around 19 to 20 h).
- Slide to 30° S to see the Southern Cross, which never rises from most of Europe, Canada and the northern United States.

## 4. Star-hopping

Use bright patterns as signposts:

- **The Pointers:** the two stars at the end of the Big Dipper's bowl (Merak and Dubhe) point at Polaris, about five times their separation away.
- **Arc to Arcturus, speed on to Spica:** follow the curve of the Dipper's handle to orange Arcturus, then continue to Spica.
- **Orion's Belt** points down-left to Sirius, the brightest star in the night sky, and up-right to Aldebaran.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** star-hopping works with angular distances. Your hand at arm's length is a ready-made protractor that works for adults and children alike, because arm length and hand size grow together.

**Rough measures at arm's length:**

- little finger width: about 1°
- three middle fingers: about 5°
- closed fist: about 10°
- spread hand, thumb to little finger: about 20°

**Angular separation** of two stars at right ascensions `$\alpha_1, \alpha_2$` and declinations `$\delta_1, \delta_2$` (Lesson 2.2):

```math
\cos\theta = \sin\delta_1 \sin\delta_2 + \cos\delta_1 \cos\delta_2 \cos(\alpha_1 - \alpha_2)
```

**Try it:** Dubhe (`$\delta = 61.75^\circ$`) and Merak (`$\delta = 56.38^\circ$`) have almost the same right ascension, so their separation is about `$61.75 - 56.38 = 5.4^\circ$`: three fingers.
</details>

## 5. Worked example

*Finding Polaris from Merak and Dubhe.* The Pointers are 5.4° apart. Dubhe is at right ascension 11.06 h, declination +61.75°; Polaris at 2.53 h, +89.26°. The separation formula gives

```math
\cos\theta = \sin 61.75^\circ \sin 89.26^\circ + \cos 61.75^\circ \cos 89.26^\circ \cos(128^\circ) = 0.8808 - 0.0038 = 0.8771
```

so `$\theta = 28.7^\circ$`: about five Pointer-lengths, or three fists. (The right ascensions differ by 8.53 h, which is 128°.) Polaris is not especially bright (magnitude 2, Lesson 1.7), but it is the only star of that brightness in that area.

## 6. Practice

1. Which is bigger in the sky: the Big Dipper's bowl (Pointers 5.4° apart) or your fist at arm's length?
2. You face south and hold a chart overhead. Which edge of the chart should be at the bottom?
3. Why can't the IAU borders be drawn as constellation stick figures?

<details>
<summary>Answers</summary>

1. Your fist (about 10°) is bigger than the gap between the Pointers.
2. The S edge.
3. Because borders must cover every point of the sky with no gaps, while stick figures only join a few bright stars.
</details>

**Try it on the real sky:** see the constellations above your town tonight with [[sky-tonight]], and plan a full night's target list with the [[observing-session]] planner.

**New words:** *constellation*, *asterism*, *planisphere*, *star-hopping*, *angular separation*.
