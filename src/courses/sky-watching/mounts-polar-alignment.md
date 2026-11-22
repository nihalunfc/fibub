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
sources:
  - "Meeus, J. (1998), Astronomical Algorithms, 2nd ed., Willmann-Bell (sidereal rate)"
  - "Polaris offset from the pole (rounded): SIMBAD, simbad.cds.unistra.fr"
---

**Module 4 · about 25 minutes · read first: [1.1 The celestial sphere: a map painted on a dome](/learn/courses/sky-watching/celestial-sphere/), [1.2 Why the sky turns: daily motion and circumpolar stars](/learn/courses/sky-watching/turning-sky/), [4.5 Refractors, reflectors and catadioptrics](/learn/courses/sky-watching/telescope-types/) · maths: uses Lessons 1.1 and 1.2.** You'll be able to compare alt-az and equatorial mounts, polar-align an equatorial mount, and work out how accurate the alignment must be.

<div class="bigidea">A mount holds the telescope and follows the sky; an equatorial mount tilts one axis to point at the celestial pole so one motor can track, and polar alignment is lining that axis up.</div>

## 1. Why this matters

Astronomers say the mount is more important than the telescope, especially for photography. A wobbly mount ruins every view; a mount that can't track turns every star into a trail. Polar alignment is the first job of every imaging night.

## 2. Two kinds of mount

**Alt-azimuth (alt-az)** mounts move in altitude and azimuth (Lesson 2.1), like a camera tripod head. Simple, intuitive, and used by Dobsonians and most computerised beginner telescopes. To follow a star they must move both axes at changing rates, and in long exposures the field slowly rotates.

**Equatorial (EQ)** mounts tilt one axis, the **polar axis** or RA axis, to point at the celestial pole. A star's daily path is then a circle about that axis (Lesson 1.2), so one motor turning once per sidereal day keeps it centred with no field rotation. The other axis sets declination. The **German equatorial mount (GEM)** with a counterweight is the most common design for imaging.

This is the sky as a real 3D sphere around you. Drag to turn the view, slide your latitude, and press Play to let the sky turn.

<figure class="fig" data-fig="@astro-celestial-sphere"><figcaption>The north (or south) celestial pole stands as many degrees above the horizon as your latitude. Green stars are circumpolar and never set, orange ones never rise, and the rest rise and set. Switch the grid to see altitude and azimuth lines instead of RA and Dec.</figcaption></figure>

## 3. Polar alignment

To align an EQ mount:

1. Level the tripod and point the polar axis roughly north (south in the Southern Hemisphere).
2. Set the altitude scale to your **latitude** (the pole is at that altitude).
3. Fine-tune: centre Polaris in the **polar scope** at the position its reticle shows for the current time (Polaris is about 0.65° from the true pole). Or use a camera-based routine that measures the error and tells you which knobs to turn. In the south, with no bright pole star, the camera method or **drift alignment** (watching how a star drifts and correcting) is standard.

<!--fig:polar-drift-->

Things to notice:

- With a 5′ error and 2″ pixels, drift stays under 1 pixel for only about 90 seconds. Many imagers aim for under 1′.
- For visual observing, even 1° of error only means nudging the declination knob now and then.

Polar-align an equatorial mount at 45° N:

<div class="steps">
<div class="step"><b>Level the tripod</b> and point the mount's polar axis roughly north.</div>
<div class="step"><b>Set the latitude.</b> Tilt the polar axis to 45°, your latitude, so it is parallel to Earth's axis.</div>
<div class="step"><b>Find the pole.</b> Through the polar scope, put Polaris on its small circle at the position for tonight (Polaris is 0.6° from the true pole).</div>
<div class="step"><b>Track.</b> Now turning only the RA axis at one turn per sidereal day keeps a star centred.</div>
<div class="step"><b>Check.</b> If the axis is 5′ off, a star drifts about 0.02″ per second in declination: over 10 minutes, about 13″, enough to trail at long focal lengths.</div>
</div>

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


<div class="meaning">

<dl>
<dt>Alt-az mount</dt><dd>Up-down and left-right axes; needs two motors and field rotation to track.</dd>
<dt>Equatorial mount</dt><dd>One axis parallel to Earth's axis; one motor tracks.</dd>
<dt>t<sub>max</sub> = s / (ε ω)</dt><dd>Longest exposure before a polar error ε drifts one pixel s.</dd>
<dt>Physical meaning</dt><dd>Earth spins around its axis. Tilt the mount's main axis so it is parallel to Earth's and you have built a little Earth axis in reverse: turning it backwards at Earth's rate exactly cancels the spin, and stars stay put.</dd>
</dl>

</div>

<div class="myth">

**"Polar alignment means pointing the telescope at Polaris."** It means pointing the mount's polar axis at the celestial pole, which is 0.6° from Polaris. The telescope itself can point anywhere.

</div>

## 4. Worked example

*How accurate for 3-minute guided-free exposures at 1.2″ per pixel?* We need

```math
\varepsilon \le \frac{s}{\omega_\oplus\,t} = \frac{1.2}{7.29\times10^{-5} \times 180} = 91'' \approx 1.5'
```

That is achievable with a good polar scope or a camera-based routine, but not by just pointing at Polaris (0.65° = 39′ off the pole). With autoguiding (Lesson 6.5) the guider corrects the drift, but large errors still cause field rotation at the edges.

## 5. Practice

<div class="problem" data-problem="polar-drift"></div>

**More practice** (answers below):

1. Your latitude is 23° N. At what altitude do you set the polar axis?
2. With a 2′ error, how far does a star drift in 5 minutes (worst case)?
3. Why do alt-az mounts cause field rotation but equatorial mounts don't?

<details>
<summary>Answers</summary>

1. 23°.
2. `$120'' \times 7.29\times10^{-5} \times 300 = 2.6''$`.
3. An alt-az mount keeps "up" pointing at the zenith, but a star's orientation relative to the zenith changes as it crosses the sky. An EQ mount turns about the same axis as the sky, so the field turns with it.
</details>

<div class="keypoints">

- Alt-az mounts are simple; equatorial mounts track with one motor.
- Polar axis tilt = your latitude, pointed at the celestial pole.
- Polaris is about 0.6° from the true pole.
- Polar error causes declination drift: ε × 7.29 × 10⁻⁵ per second.

</div>

**Try it on the real sky:** find where Polaris sits in your polar scope right now, and how to correct, with the [[polar-alignment]] tool.

**New words:** *alt-azimuth mount*, *equatorial mount*, *polar axis*, *German equatorial mount*, *polar alignment*, *drift alignment*, *field rotation*.
