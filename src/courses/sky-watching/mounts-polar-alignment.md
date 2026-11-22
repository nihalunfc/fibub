---
title: "Mounts and polar alignment"
summary: "A mount holds the telescope and follows the sky. Alt-az mounts move up-down and left-right; equatorial mounts tilt one axis to point at the celestial pole so a single motor can track. Polar alignment is lining that axis up."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Why does an equatorial mount need only one motor to track a star?"
    choices: ["Its main axis is parallel to Earth's axis, so turning it once a sidereal day matches the sky", "It is lighter", "It points at the zenith"]
    ans: 0
    why: "With the right ascension axis aimed at the celestial pole, a star's daily circle is a turn about that single axis."
  - q: "At what angle above the horizon should the polar axis point from latitude 50° N?"
    choices: ["40°", "50°", "90°"]
    ans: 1
    why: "The celestial pole's altitude equals the latitude (Lesson 1.1)."
  - q: "What does polar misalignment cause in long exposures?"
    choices: ["Colour fringes", "Slow drift in declination and field rotation", "Brighter stars"]
    ans: 1
    why: "If the axis is off the pole, stars slowly drift north or south and the field rotates around the guide star."
sources: []
---

**Module 4 · about 25 minutes · uses Lessons 1.1 and 1.2.** You'll be able to compare alt-az and equatorial mounts, polar-align an equatorial mount, and work out how accurate the alignment must be.

## 1. Why this matters

Astronomers say the mount is more important than the telescope, especially for photography. A wobbly mount ruins every view; a mount that can't track turns every star into a trail. Polar alignment is the first job of every imaging night.

## 2. Two kinds of mount

**Alt-azimuth (alt-az)** mounts move in altitude and azimuth (Lesson 2.1), like a camera tripod head. Simple, intuitive, and used by Dobsonians and most computerised beginner telescopes. To follow a star they must move both axes at changing rates, and in long exposures the field slowly rotates.

**Equatorial (EQ)** mounts tilt one axis, the **polar axis** or RA axis, to point at the celestial pole. A star's daily path is then a circle about that axis (Lesson 1.2), so one motor turning once per sidereal day keeps it centred with no field rotation. The other axis sets declination. The **German equatorial mount (GEM)** with a counterweight is the most common design for imaging.

## 3. Polar alignment

To align an EQ mount:

1. Level the tripod and point the polar axis roughly north (south in the Southern Hemisphere).
2. Set the altitude scale to your **latitude** (the pole is at that altitude).
3. Fine-tune: centre Polaris in the **polar scope** at the position its reticle shows for the current time (Polaris is about 0.65° from the true pole). Or use a camera-based routine that measures the error and tells you which knobs to turn. In the south, with no bright pole star, the camera method or **drift alignment** (watching how a star drifts and correcting) is standard.

<!--fig:polar-drift-->

Things to notice:

- With a 5′ error and 2″ pixels, drift stays under 1 pixel for only about 90 seconds. Many imagers aim for under 1′.
- For visual observing, even 1° of error only means nudging the declination knob now and then.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** if the polar axis is off by a small angle `$\varepsilon$`, the mount turns about the wrong axis. A star near the equator and the meridian then slides in declination at up to

```math
\dot\delta \approx \varepsilon\,\omega_\oplus, \qquad \omega_\oplus = \frac{2\pi}{86164\ \text{s}} = 7.29\times10^{-5}\ \text{rad/s}
```

(so the drift in arcseconds per second is the error in arcseconds times `$7.29 \times 10^{-5}$`).

**Longest exposure** before the drift reaches one pixel of size `$s$` arcseconds:

```math
t_\text{max} = \frac{s}{\varepsilon\,\omega_\oplus}
```

**Try it:** `$\varepsilon = 10' = 600''$`, `$s = 1.5''$`: `$t_\text{max} = 1.5 / (600 \times 7.29\times10^{-5}) = 34$` s.
</details>

## 4. Worked example

*How accurate for 3-minute guided-free exposures at 1.2″ per pixel?* We need

```math
\varepsilon \le \frac{s}{\omega_\oplus\,t} = \frac{1.2}{7.29\times10^{-5} \times 180} = 91'' \approx 1.5'
```

That is achievable with a good polar scope or a camera-based routine, but not by just pointing at Polaris (0.65° = 39′ off the pole). With autoguiding (Lesson 6.5) the guider corrects the drift, but large errors still cause field rotation at the edges.

## 5. Practice

1. Your latitude is 23° N. At what altitude do you set the polar axis?
2. With a 2′ error, how far does a star drift in 5 minutes (worst case)?
3. Why do alt-az mounts cause field rotation but equatorial mounts don't?

<details>
<summary>Answers</summary>

1. 23°.
2. `$120'' \times 7.29\times10^{-5} \times 300 = 2.6''$`.
3. An alt-az mount keeps "up" pointing at the zenith, but a star's orientation relative to the zenith changes as it crosses the sky. An EQ mount turns about the same axis as the sky, so the field turns with it.
</details>

**Try it on the real sky:** find where Polaris sits in your polar scope right now, and how to correct, with the [[polar-alignment]] tool.

**New words:** *alt-azimuth mount*, *equatorial mount*, *polar axis*, *German equatorial mount*, *polar alignment*, *drift alignment*, *field rotation*.
