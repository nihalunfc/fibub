---
title: "Altitude and azimuth: pointing from where you stand"
summary: "Altitude is how high something is above your horizon; azimuth is its compass bearing. Together they tell you exactly where to look, but only from your place and only at that moment."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "An object is at azimuth 270°. Which way do you face?"
    choices: ["North", "East", "West"]
    ans: 2
    why: "Azimuth runs from north (0°) through east (90°), south (180°) and west (270°)."
  - q: "What is the altitude of the zenith?"
    choices: ["0°", "90°", "180°"]
    ans: 1
    why: "The zenith is straight overhead, 90° above the horizon."
  - q: "Why can't a star catalogue list stars by altitude and azimuth?"
    choices: ["Because they change with place and time as the sky turns", "Because they are too hard to measure", "Because azimuth has no units"]
    ans: 0
    why: "Alt-az coordinates are tied to the observer's horizon, so they change every minute and from town to town."
sources:
  - "Meeus, J. (1998), Astronomical Algorithms, 2nd ed., Willmann-Bell, Chapter 13 (transformation of coordinates)"
  - "US Naval Observatory, Explanatory Supplement to the Astronomical Almanac (3rd ed., 2013), University Science Books"
---

**Module 2 · about 20 minutes · read first: [1.1 The celestial sphere: a map painted on a dome](/learn/courses/sky-watching/celestial-sphere/), [1.2 Why the sky turns: daily motion and circumpolar stars](/learn/courses/sky-watching/turning-sky/) · maths: angles.** You'll be able to describe any point in your sky by altitude and azimuth, estimate both with your hand, and explain why these coordinates keep changing.

<div class="bigidea">Altitude is how high something is above your horizon and azimuth is its compass bearing; together they say exactly where to look, but only from your place and only at that moment.</div>

## 1. Why this matters

When a friend says "Jupiter is low in the south-east", they are using altitude and azimuth without the numbers. Dobsonian telescopes, most camera tripods and many computerised mounts move in these two directions. Apps that tell you where to point give alt-az values, and the observing tools on this site do too.

## 2. Two angles

- **Altitude** (also *elevation*): the angle up from the horizon. 0° on the horizon, 90° at the zenith. Negative means below the horizon.
- **Azimuth:** the compass direction, measured along the horizon from **north (0°) through east (90°), south (180°) and west (270°)**.

Some older books measure azimuth from south; always check which convention a source uses.

Drag the target and watch the readings. The orange arc along the horizon is the azimuth; the blue line up to the target is the altitude.

<!--fig:altaz-pointer-->

Things to notice:

- Near the zenith, a small move of the target changes the azimuth a lot. At the zenith itself the azimuth means nothing (every direction is "up").
- An object at 10° altitude is one fist above the horizon: often behind trees or buildings, and dimmed by thick air (Lesson 2.6).

## 3. The catch: alt-az belongs to you

The sky turns 15° an hour (Lesson 1.2), so a star's altitude and azimuth change constantly. They also depend on where you are: the same star can be overhead in Quito and on the horizon in Oslo at the same instant. That is why catalogues use **right ascension and declination** instead (Lesson 2.2), which stay fixed to the stars. Converting from one to the other needs your latitude and the time, through the **hour angle**.

Point someone at Jupiter tonight:

<div class="steps">
<div class="step"><b>Face the right way.</b> Azimuth is measured from north round through east: 0° north, 90° east, 180° south, 270° west. Jupiter is at azimuth 135°: south-east.</div>
<div class="step"><b>Look up.</b> Altitude is measured from the horizon (0°) to the zenith (90°). Jupiter is 30° up: three fists.</div>
<div class="step"><b>Found it.</b> Two angles pin down any point in your sky.</div>
<div class="step"><b>Wait an hour.</b> The sky has turned 15°. Jupiter is now higher and further south: its altitude and azimuth have both changed.</div>
<div class="step"><b>Phone a friend in another city.</b> Their numbers for Jupiter differ from yours. Alt-az belongs to one place and one moment.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** alt-az and equatorial coordinates are two grids on the same sphere, tilted against each other by `$90^\circ - \varphi$`. Spherical trigonometry converts between them.

**Equations:** for a star at declination `$\delta$` and hour angle `$H$` (how far it has turned west of your meridian, in degrees), seen from latitude `$\varphi$`:

```math
\sin h = \sin\delta \sin\varphi + \cos\delta \cos\varphi \cos H
```

```math
\tan A = \frac{-\cos\delta \sin H}{\sin\delta\cos\varphi - \cos\delta\sin\varphi\cos H}
```

where `$h$` is altitude and `$A$` azimuth from north (take the quadrant from the signs of the top and bottom, as the `atan2` function in code does).

**Check:** on the meridian `$H = 0$`: `$\sin h = \cos(\varphi - \delta)$`, so `$h = 90^\circ - |\varphi - \delta|$`, the rule from Lesson 1.1.
</details>


<div class="meaning">

<dl>
<dt>h (altitude)</dt><dd>Angle above the horizon, 0° to 90°.</dd>
<dt>A (azimuth)</dt><dd>Compass bearing, from north through east.</dd>
<dt>sin h = sin δ sin φ + cos δ cos φ cos H</dt><dd>Altitude from the star's declination δ, your latitude φ and the hour angle H.</dd>
<dt>Physical meaning</dt><dd>Alt-az is "how far round, how far up" from where you stand, like telling someone to look "over the oak tree, a bit above it". It is perfect for pointing but useless for a catalogue, because the oak tree and the sky both change as you move and as Earth turns.</dd>
</dl>

</div>

<div class="myth">

**"A star's altitude and azimuth can go in a star catalogue."** They change every minute and from every place. Catalogues use right ascension and declination, which stay fixed to the stars (Lesson 2.2).

</div>

## 4. Worked example

*Made-up star at declination +20°, 3 hours after crossing the meridian (`$H = 45^\circ$`), seen from 43° N.*

```math
\sin h = \sin 20^\circ \sin 43^\circ + \cos 20^\circ \cos 43^\circ \cos 45^\circ = 0.342 \times 0.682 + 0.940 \times 0.731 \times 0.707 = 0.233 + 0.486 = 0.719
```

so `$h = 46.0^\circ$`. For the azimuth, top `$= -0.940 \times 0.707 = -0.665$`, bottom `$= 0.342 \times 0.731 - 0.940 \times 0.682 \times 0.707 = 0.250 - 0.453 = -0.203$`. Both negative, so the angle is in the third quadrant: `$A = 180^\circ + 73.0^\circ = 253^\circ$`, a little south of west, as expected for a star that has passed the meridian and is sinking.

## 5. Practice

<div class="problem" data-problem="altitude-from-ha"></div>

**More practice** (answers below):

1. Give the azimuth of south-east.
2. A star sits 3 fists above the northern horizon. Roughly what are its altitude and azimuth?
3. What is the altitude of a star on the meridian at declination 0° from latitude 52° N?

<details>
<summary>Answers</summary>

1. 135°.
2. About 30° altitude, azimuth 0°.
3. `$90 - |52 - 0| = 38^\circ$`.
</details>

<div class="keypoints">

- Altitude: angle above the horizon. Azimuth: bearing from north through east.
- Alt-az depends on your location and the time.
- sin h = sin δ sin φ + cos δ cos φ cos H converts from sky coordinates.
- Alt-az mounts and phone apps use these two angles.

</div>

**Try it on the real sky:** get the altitude and azimuth of any object through the night with [[object-altitude]], or convert between alt-az and RA/Dec with [[sky-coordinates]].

**New words:** *altitude* (elevation), *azimuth*, *meridian*, *hour angle*, *alt-az mount*.
