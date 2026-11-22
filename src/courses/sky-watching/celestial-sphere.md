---
title: "The celestial sphere: a map painted on a dome"
summary: "Astronomers pretend the stars are painted on a giant sphere around Earth. It is not real, but it makes the sky easy to map: the pole stands at your latitude, and every star moves on a circle."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "You live at 30° N. How high above the northern horizon is the north celestial pole?"
    choices: ["30°", "60°", "90°"]
    ans: 0
    why: "The altitude of the celestial pole equals your latitude."
  - q: "Where is the celestial equator?"
    choices: ["Along your horizon", "Directly above Earth's equator, projected onto the sky", "Along the path of the Moon"]
    ans: 1
    why: "The celestial equator is Earth's equator pushed out onto the sky. It sits halfway between the two celestial poles."
  - q: "Why do astronomers still use the celestial sphere if stars are at very different distances?"
    choices: ["Because the stars really are on a sphere", "Because for pointing, only direction matters, not distance", "Because it was decided by law"]
    ans: 1
    why: "For finding and pointing at objects only the direction counts, and directions fit neatly on a sphere."
sources:
  - "IAU definitions of the celestial poles and equator: International Astronomical Union, iau.org"
---

**Module 1 · about 20 minutes · read first: nothing, start here · maths: no maths needed.** You'll be able to describe the celestial sphere, find the celestial poles and equator, and explain why the pole's height in your sky equals your latitude.

<div class="bigidea">Astronomers pretend the stars are painted on a giant sphere around Earth; it is not real, but it makes the sky easy to map, and from anywhere the celestial pole stands as high above your horizon as your latitude.</div>

## 1. Why this matters

Everything else in this course needs a way to say *where* something is in the sky. The oldest and still the most useful idea is to imagine the stars stuck to the inside of an enormous ball with Earth at the middle. Navigators, planetarium makers, telescope mounts and the coordinates in a research catalogue all use it.

## 2. A sphere that is not really there

Look up on a dark night and the sky does look like a dome. The stars all seem to be at the same distance, even though the nearest is about 4 light-years away and others are thousands. Our eyes cannot judge distances that large, so the sky flattens into a surface.

Astronomers keep that illusion on purpose. They call it the **celestial sphere**. A star's position on it is just a *direction* from Earth. Distance is a separate question that needs other tools ([Astronomy 3.1](/learn/courses/astronomy/parallax/)).

The celestial sphere borrows Earth's own geography:

- Extend Earth's spin axis out into space. Where it meets the sphere are the **north and south celestial poles**.
- Push Earth's equator out onto the sphere. That circle is the **celestial equator**.
- The point straight above your head is the **zenith**. Your **horizon** is the circle 90° away from it, where sky meets ground.

The zenith and horizon belong to *you*: move to another town and they move too. The poles and equator belong to the *sky*: they are the same for everyone.

## 3. The pole stands at your latitude

Here is the single most useful fact in naked-eye astronomy:

> **The altitude of the celestial pole above your horizon equals your latitude.**

At the North Pole (latitude 90°) the north celestial pole is straight overhead. On the equator (0°) it sits on the northern horizon. In Toronto (about 44° N) it is 44° up; in Mumbai (19° N), 19° up. In the Southern Hemisphere the south celestial pole rises instead.

Move the sliders below. The thick horizontal line is your horizon; the dashed line through you points at the pole.

<!--fig:sphere-side-->

Things to notice:

- As your latitude grows, the pole climbs and the celestial equator tilts down towards the south.
- A star's daily path is a circle *parallel to the celestial equator*. The horizon cuts some circles in two (the star rises and sets), misses others entirely (the star never sets, or never rises).


<div class="meaning">

<dl>
<dt>Zenith</dt><dd>The point straight above your head.</dd>
<dt>Celestial pole</dt><dd>Where Earth's axis, extended, meets the sky; the sky turns around it.</dd>
<dt>h<sub>pole</sub> = φ</dt><dd>The pole's altitude equals your latitude.</dd>
<dt>h<sub>max</sub> = 90° − |φ − δ|</dt><dd>How high a star of declination δ climbs.</dd>
<dt>Physical meaning</dt><dd>Earth is a ball, so "up" points in a different direction at every place. Walk north and your "up" tilts towards Earth's axis; the pole, fixed far away in that direction, climbs in your sky by exactly the angle you walked. Sailors used this for centuries to find their latitude.</dd>
</dl>

</div>

<div class="myth">

**"Polaris is the brightest star in the sky."** It is only about the 48th brightest. It is famous because it sits almost exactly at the north celestial pole, so it barely moves all night. The brightest night-time star is Sirius.

</div>

## 4. Why the pole rises with latitude

Your horizon is a flat plane touching Earth where you stand. Walk north and the ground curves away under you, so your horizon tilts. Earth's axis, though, points at the same place among the stars. After you have walked 1° of latitude north, your horizon has tilted by 1°, so the pole appears 1° higher.

Travel north and watch the pole star rise:

<div class="steps">
<div class="step"><b>At the equator, 0°.</b> The celestial pole sits on the northern horizon. Every star rises straight up in the east and sets straight down in the west.</div>
<div class="step"><b>At 20° N (Mumbai).</b> Polaris is 20° up, about two fists above the north horizon.</div>
<div class="step"><b>At 43° N (Toronto).</b> Polaris is 43° up, about halfway to the zenith. Stars circle around it.</div>
<div class="step"><b>At 52° N (London).</b> 52° up; more stars near the pole never set.</div>
<div class="step"><b>At the North Pole, 90°.</b> Polaris is straight overhead. Stars circle parallel to the horizon and never rise or set.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** your zenith points along the line from Earth's centre through you. Your latitude `$\varphi$` is the angle between that line and the equator plane. The celestial pole is 90° from the equator plane.

**Equation:** the angle from your zenith to the pole is `$90^\circ - \varphi$`, so the pole's altitude is

```math
h_\text{pole} = 90^\circ - (90^\circ - \varphi) = \varphi
```

**A star's highest point:** a star at declination `$\delta$` (its "sky latitude", Lesson 2.2) crosses your meridian at altitude

```math
h_\text{max} = 90^\circ - |\varphi - \delta|
```

**Analogy:** a pencil stuck through an orange is Earth's axis. Put an ant anywhere on the orange; the angle between its local "ground" and the pencil equals the ant's latitude.

**Try it:** you are at 52° N. How high does a star at declination +20° get? (`$90 - |52 - 20| = 58^\circ$`.)
</details>

## 5. Worked example

*Made-up trip.* You fly from Nairobi (latitude 1° S) to Oslo (60° N).

- In Nairobi the north celestial pole is 1° *below* the northern horizon. Polaris, which sits less than 1° from the pole, is just out of sight. The south celestial pole is 1° up.
- In Oslo the north celestial pole is 60° up, two-thirds of the way to the zenith.
- A star at declination +20° reaches `$90 - |{-1} - 20| = 69^\circ$` in Nairobi and `$90 - |60 - 20| = 50^\circ$` in Oslo.

So travelling north lifts the northern stars and sinks the southern ones. The ancient Greeks used exactly this, together with the curved shadow of Earth during lunar eclipses, as evidence that Earth is round.

## 6. Practice

<div class="problem" data-problem="max-altitude"></div>

**More practice** (answers below):

1. What is the altitude of the north celestial pole seen from 35° N?
2. From the equator, how high is a star at declination +40° at its highest?
3. At what latitude is the celestial equator directly overhead?

<details>
<summary>Answers</summary>

1. 35°.
2. `$90 - |0 - 40| = 50^\circ$`.
3. On Earth's equator (0°), where the celestial equator passes through the zenith.
</details>

<div class="keypoints">

**Key points**

- The celestial sphere is an imaginary sphere used to map the sky.
- The sky turns around the celestial poles, above Earth's poles.
- The pole's altitude equals your latitude.
- A star's highest altitude is 90° − |φ − δ|.

</div>

**Try it on the real sky:** find what is above your own horizon right now with [[sky-tonight]], or convert any star's position between coordinate systems with [[sky-coordinates]].

**New words:** *celestial sphere*, *celestial poles*, *celestial equator*, *zenith*, *horizon*.
