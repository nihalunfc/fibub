---
title: "Tracking, guiding and star trails"
summary: "On a fixed tripod, stars trail within seconds; the NPF rule tells you how long you can expose. A tracking mount follows the sky, and an autoguider watches a star and corrects the mount's small errors."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "How far does a star on the celestial equator move in 1 minute?"
    choices: ["about 15″", "about 15′", "about 1°"]
    ans: 1
    why: "15″ per second × 60 s = 900″ = 15′."
  - q: "Why are star trails shorter near the celestial pole?"
    choices: ["Stars there move on smaller circles, at speed proportional to cos(declination)", "They are fainter", "The air is thinner"]
    ans: 0
    why: "All stars turn 15° per hour, but a circle near the pole is small, so the distance moved is small."
  - q: "What does an autoguider do?"
    choices: ["Points the telescope at targets", "Watches a guide star and sends small corrections to keep it fixed", "Focuses the camera"]
    ans: 1
    why: "It corrects periodic error and drift many times a minute."
sources:
  - "NPF rule: Frédéric Michaud, Société Astronomique de France (2010s), simplified form widely used by night-sky photographers"
---

**Module 6 · about 25 minutes · read first: [4.6 Mounts and polar alignment](/learn/courses/sky-watching/mounts-polar-alignment/), [6.1 Cameras, pixels and image scale](/learn/courses/sky-watching/image-scale/) · maths: uses Lessons 1.2 and 4.6.** You'll be able to work out the longest untrailed exposure on a tripod, explain tracking and periodic error, and describe how autoguiding works.

<div class="bigidea">On a fixed tripod, stars trail within seconds and the NPF rule says how long you can expose; a tracking mount follows the sky, and an autoguider watches a star and corrects the mount's small errors.</div>

## 1. Why this matters

The sky turns 15″ every second. A typical deep-sky image needs minutes per frame with stars held still to about 1″. Everything about imaging mounts, from motors to guide cameras, exists to beat that rotation.

## 2. Fixed tripod

On a fixed tripod, a star moves across the sensor at

```math
v = 15.04'' \times \cos\delta \ \text{per second}
```

so wide-angle Milky Way shots need short exposures. The film-era **500 rule** (500 ÷ focal length seconds) gives visible trails on modern high-resolution sensors. The **NPF rule** adds the lens's f-number and the pixel size.

<!--fig:trail-rules-->

Things to notice:

- At 14 mm, f/2.8 and 4 µm pixels, NPF allows about 16 s; the 500 rule says 36 s, which shows trails.
- Stars near the pole (high declination) allow much longer exposures.

Push your exposure from a tripod to a guided mount:

<div class="steps">
<div class="step"><b>Fixed tripod, 24 mm lens at f/2.8.</b> NPF rule: about 9 s before stars start to stretch.</div>
<div class="step"><b>Point near the pole.</b> Stars there move slower (15″ × cos δ per second), so you can expose longer.</div>
<div class="step"><b>Tracking mount.</b> A polar-aligned mount turning at the sidereal rate allows minutes with a lens.</div>
<div class="step"><b>Periodic error.</b> At 1,000 mm focal length, small gear errors of ±10″ show as egg-shaped stars.</div>
<div class="step"><b>Autoguiding.</b> A small second camera watches a star every couple of seconds and nudges the mount, keeping errors under 1″.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Star speed** at declination `$\delta$`: `$15.041'' \cos\delta$` per second (sidereal rate).

**Trail in pixels** after `$t$` seconds at image scale `$s$` (Lesson 6.1): `$15.041\,t\cos\delta / s$`.

**Simplified NPF rule** (aperture f-number `$N$`, pixel pitch `$p$` µm, focal length `$F$` mm):

```math
t_\text{max} \approx \frac{35N + 30p}{F\cos\delta}\ \text{seconds}
```

**Try it:** `$N = 2.8$`, `$p = 4$`, `$F = 24$`, `$\delta = 0$`: `$t = (98 + 120)/24 = 9.1$` s.
</details>

## 3. Tracking mounts

A motor turns an equatorial mount's RA axis once per sidereal day (Lesson 4.6). No gear is perfect: the worm gear's small imperfections make the star wobble back and forth over a few minutes: **periodic error**, typically 5″ to 30″ peak to peak on amateur mounts. Small "star tracker" mounts carry a camera and lens, which is forgiving at short focal lengths.


<div class="meaning">

<dl>
<dt>15.041″ cos δ per second</dt><dd>How fast stars move across the sky at declination δ.</dd>
<dt>t ≈ (35N + 30p)/(F cos δ)</dt><dd>Simplified NPF rule for untracked exposures.</dd>
<dt>Guiding error</dt><dd>Wobble of the mount, measured in arcseconds.</dd>
<dt>Physical meaning</dt><dd>The sky is a conveyor belt moving at 15″ per second. On a tripod you take a photo of something on the belt and it blurs; a tracking mount rides along with the belt; a guider is a friend watching and correcting whenever you drift off.</dd>
</dl>

</div>

<div class="myth">

**"A tracking mount means you never get trailed stars."** Polar alignment errors, gear errors, wind and flexure all cause drift. Long exposures at long focal lengths usually need autoguiding to keep stars round.

</div>

## 4. Autoguiding

An **autoguider** is a second small camera on a guide scope (or a pick-off prism) watching one star. Every one to few seconds, software measures how far the star has moved and sends a small correction to the mount. Good guiding holds stars to under 1″ RMS on a decent mount, enough for long focal lengths.

## 5. Worked example

*Is unguided 2-minute imaging possible at 2″/px with a mount having 20″ peak-to-peak periodic error over a 10-minute worm period?*

The error swings 20″ in half a period (5 minutes) on a roughly sine-shaped curve, so its steepest slope is about `$\pi \times 20/2 \div 300 \approx 0.105''$` per second. In 120 s the star can move about 12.6″: over 6 pixels. Stars will be streaks. Options: shorter frames (about 20 s keeps under 1 pixel), periodic error correction (training the mount), or autoguiding.

## 6. Practice

<div class="problem" data-problem="npf-rule"></div>

**More practice** (answers below):

1. How far does a star at declination 60° move in 30 s?
2. NPF time for a 50 mm f/1.8 lens with 6 µm pixels, at declination 0°?
3. Why does a longer focal length make guiding harder?

<details>
<summary>Answers</summary>

1. `$15.04 \times 30 \times 0.5 = 226''$`, about 3.8′.
2. `$(63 + 180)/50 = 4.9$` s.
3. The same angular error covers more pixels, so smaller errors become visible.
</details>

<div class="keypoints">

- Stars move 15.041″ cos δ per second.
- NPF rule: t ≈ (35N + 30p)/(F cos δ) on a fixed tripod.
- Tracking mounts follow the sky; gear errors still show at long focal lengths.
- Autoguiders correct the mount every few seconds.

</div>

**Try it with real numbers:** plan untrailed tripod exposures with the [[star-trail-exposure]] tool, and set the polar alignment that guiding needs with [[polar-alignment]].

**New words:** *sidereal rate*, *500 rule*, *NPF rule*, *star tracker*, *periodic error*, *autoguider*, *guide star*.
