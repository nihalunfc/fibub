---
title: "Double stars"
summary: "About half the stars like the Sun have companions. Double stars test your telescope and your seeing, and measuring their separation and position angle over years reveals their orbits and masses."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What does a position angle of 90° mean?"
    choices: ["The companion is due north of the primary", "The companion is due east of the primary", "The companion is 90″ away"]
    ans: 1
    why: "Position angle is measured from north (0°) through east (90°)."
  - q: "What is the difference between an optical double and a binary?"
    choices: ["Binaries orbit each other; optical doubles only line up by chance", "Optical doubles are brighter", "There is no difference"]
    ans: 0
    why: "An optical double's stars are at very different distances; a binary's are bound by gravity."
  - q: "Unequal pairs (one star much brighter) are harder to split than the Dawson limit suggests. Why?"
    choices: ["The faint star can hide in the bright star's Airy rings and glare", "Faint stars are further away", "Dawson only applies to red stars"]
    ans: 0
    why: "Dawson's limit is for equal pairs; a faint companion is lost in the diffraction rings of a bright primary."
sources:
  - "Washington Double Star Catalog, US Naval Observatory: the standard catalogue of double star measurements"
---

**Module 5 · about 20 minutes · read first: [4.4 Resolution, the Dawson limit and the atmosphere](/learn/courses/sky-watching/resolution/), [2.2 Right ascension and declination: the sky's latitude and longitude](/learn/courses/sky-watching/right-ascension-declination/) · maths: angles.** You'll be able to describe a double star by separation and position angle, judge whether your telescope can split it, and explain how measurements lead to stellar masses.

<div class="bigidea">About half of Sun-like stars have companions; double stars test your telescope and your seeing, and measuring their separation and position angle over years reveals their orbits and masses.</div>

## 1. Why this matters

Double stars are perfect city targets: bright, colourful, unaffected by light pollution. They are also real science: visual binaries give the most direct measurements of star masses ([Astronomy 3.4](/learn/courses/astronomy/binary-stars/)), and amateurs still measure them for the Washington Double Star Catalog.

## 2. Two numbers describe a pair

- **Separation** `$\rho$`: the angle between the two stars, in arcseconds.
- **Position angle (PA)** `$\theta$`: the direction of the fainter star from the brighter, measured **from north through east**: 0° north, 90° east, 180° south, 270° west.

To find directions in the eyepiece, turn off the drive: stars drift towards the west, so the side they come in from is east. Nudge the telescope towards the celestial pole and new stars enter from the north side. Star diagonals mirror the view, so always check.

<!--fig:double-star-field-->

Things to notice:

- Shrink the separation below the dashed Dawson circle and the pair merges in this aperture, however much you magnify.
- PA increases anticlockwise on an un-mirrored view with north up and east left.

## 3. Optical doubles and binaries

Some pairs only line up by chance: an **optical double**, two stars at very different distances. Most close pairs, though, are **binaries**: stars orbiting their common centre of mass. Over decades their PA and separation change. A long run of measurements traces the orbit as an ellipse on the sky.


<div class="meaning">

<dl>
<dt>ρ</dt><dd>Separation in arcseconds.</dd>
<dt>θ (PA)</dt><dd>Position angle: direction from north through east.</dd>
<dt>M₁ + M₂ = (a″/p″)³ / P²</dt><dd>Total mass from the orbit size, parallax and period.</dd>
<dt>Physical meaning</dt><dd>A visual binary is a slow clock. Its hands, the two stars, turn over decades or centuries, and the size and speed of their dance reveal how hard they pull on each other, which means how massive they are.</dd>
</dl>

</div>

<div class="myth">

**"All double stars are pairs in orbit."** Some are optical doubles: two unrelated stars that happen to lie in the same direction at very different distances. Only measurements over time, or matching distances and motions, show a true binary.

</div>

## 4. Tips for splitting doubles

- Use high power: at least `$120''/\rho$` (to make the gap about 2′ to your eye), often double that.
- Wait for steady seeing; watch for moments when the air settles.
- Let the telescope cool; a warm mirror blurs everything.
- For unequal pairs, block glare by putting the bright star just outside the field or use a higher power.

Measure and weigh a binary star:

<div class="steps">
<div class="step"><b>Separation, ρ.</b> The angle between the two stars, say 2.5″.</div>
<div class="step"><b>Position angle, θ.</b> The direction of the fainter star from the brighter, measured from north through east: say 150°.</div>
<div class="step"><b>Years later.</b> Repeat the measurement. ρ and θ change as the stars orbit each other. Plot them and an ellipse emerges.</div>
<div class="step"><b>Convert to AU.</b> If the orbit's semi-major axis is 4.0″ and the parallax is 0.2″, the orbit is 4.0/0.2 = 20 AU across in size.</div>
<div class="step"><b>Weigh them.</b> With a period of 60 years: M = 20³/60² = 2.2 Suns in total.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**From separation and PA to sky offsets** (east and north):

```math
\Delta\alpha\cos\delta = \rho \sin\theta, \qquad \Delta\delta = \rho\cos\theta
```

**From the orbit to the masses (Kepler's third law, [Astronomy 2.1](/learn/courses/astronomy/keplers-laws/)):** if the true orbit has an angular semi-major axis `$a''$`, the star's parallax is `$p''$` ([Astronomy 3.1](/learn/courses/astronomy/parallax/)) and the period is `$P$` years, then the total mass in solar masses is

```math
M_1 + M_2 = \frac{(a''/p'')^3}{P^2}
```

because `$a''/p''$` is the semi-major axis in astronomical units.

**Try it:** a made-up binary with `$a'' = 2.0''$`, `$p'' = 0.10''$`, `$P = 40$` years: `$a = 20$` AU, mass `$= 20^3/40^2 = 8000/1600 = 5$` solar masses.
</details>

## 5. Worked example

*A made-up pair at separation 3.0″, PA 60°, declination +40°.*

- North offset: `$3.0 \cos 60^\circ = 1.5''$`; east offset: `$3.0 \sin 60^\circ = 2.6''$`, which in RA is `$2.6''/\cos 40^\circ = 3.4''$` of arc, or 0.23 seconds of RA.
- Smallest aperture by Dawson: `$116/3.0 = 39$` mm. A 70 mm telescope splits it comfortably at about `$120/3 = 40\times$` minimum, better at 80× to 100×.

## 6. Practice

<div class="problem" data-problem="double-mass"></div>

**More practice** (answers below):

1. A companion is due west of the primary. What is the PA?
2. What minimum magnification makes a 1.5″ pair look about 2′ apart?
3. Why does a binary star's PA change over the years while an optical double's hardly does?

<details>
<summary>Answers</summary>

1. 270°.
2. `$120/1.5 = 80\times$`.
3. The binary's stars orbit each other; an optical double's stars are unrelated and change only through their slow, separate motions across the sky.
</details>

<div class="keypoints">

**Key points**

- Doubles are described by separation ρ and position angle θ.
- True binaries orbit; optical doubles only line up.
- Orbit size in AU = a″ / parallax″.
- Kepler's third law gives the total mass: (a″/p″)³ / P².

</div>

**Try it with real numbers:** work out separation, PA, and orbit-based masses with the [[double-star-calculator]].

**New words:** *separation*, *position angle*, *optical double*, *binary star*, *visual binary*, *centre of mass*.
