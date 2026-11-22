---
title: "Airmass: why low objects look dim"
summary: "Light from a star low in the sky crosses much more air than light from overhead. Airmass measures that path, and atmospheric extinction makes stars dimmer by a fixed number of magnitudes per airmass."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What is the airmass of a star 30° above the horizon (flat-atmosphere formula)?"
    choices: ["1", "2", "3"]
    ans: 1
    why: "X = 1 / sin(30°) = 2."
  - q: "Extinction is 0.25 mag per airmass. How much dimmer does a star at airmass 3 look than at the zenith?"
    choices: ["0.25 mag", "0.5 mag", "0.75 mag"]
    ans: 1
    why: "At airmass 3 it loses 0.75 mag; at the zenith (airmass 1) 0.25 mag. The difference is 0.5 mag."
  - q: "Why does the setting Sun look red?"
    choices: ["The Sun cools as it sets", "Long paths through air scatter blue light more than red", "Red light is reflected by the ground"]
    ans: 1
    why: "Scattering by air molecules is much stronger for blue light, and at high airmass much of the blue is scattered away."
sources:
  - "Kasten, F. and Young, A. T. (1989), Revised optical air mass tables and approximation formula, Applied Optics 28, 4735"
---

**Module 2 · about 20 minutes · read first: [2.1 Altitude and azimuth: pointing from where you stand](/learn/courses/sky-watching/altitude-azimuth/), [1.7 How bright is it? The magnitude scale](/learn/courses/sky-watching/magnitudes/) · maths: trigonometry and logarithms.** You'll be able to compute airmass from altitude, correct a measured brightness for extinction, and decide how high a target should be before you observe it.

<div class="bigidea">Light from a star low in the sky crosses much more air than light from overhead; airmass measures that path, and the air dims stars by a fixed number of magnitudes for each airmass.</div>

## 1. Why this matters

Planets look sharper, galaxies look brighter and photos come out better when the target is high. Photometry ([Astronomy 5.1](/learn/courses/astronomy/aperture-photometry/)) has to correct every measurement for the air the light came through. Observers plan sessions so each target is observed near its highest point. Airmass is the number behind all of that.

## 2. More air, more loss

Light from a star overhead crosses the least possible air: we call that path **airmass 1**. A star lower down shines through a longer slant path. In a flat atmosphere, the path grows as `$1/\sin h$` where `$h$` is the altitude (or `$\sec z$`, where `$z = 90^\circ - h$` is the zenith distance).

On the way, air molecules, dust and water droplets scatter and absorb some of the light: **atmospheric extinction**. Each airmass removes the same *fraction* of the light, so the loss in magnitudes is simply proportional to airmass.

<!--fig:airmass-curve-->

Things to notice:

- Airmass barely changes between 90° and 60° (1.00 to 1.15), but climbs fast below 30°.
- Near the horizon the flat formula runs off to infinity, while the real airmass (curved Earth) tops out at about 38.
- At 20° altitude the loss with k = 0.2 is about 0.6 mag: almost half the light gone.

Watch a star set through thickening air:

<div class="steps">
<div class="step"><b>Overhead, 90°.</b> The light crosses one thickness of atmosphere: airmass X = 1.</div>
<div class="step"><b>At 30° altitude.</b> The path is twice as long: X = 1/sin 30° = 2.</div>
<div class="step"><b>Dimming.</b> With extinction k = 0.2 mag per airmass, the star is 0.2 mag fainter overhead than in space, and 0.4 mag fainter at 30°.</div>
<div class="step"><b>At 10°.</b> X ≈ 5.6. The star is over 1 magnitude dimmer and reddened, because blue light scatters more.</div>
<div class="step"><b>On the horizon.</b> X ≈ 38. That is why the setting Sun is dim enough to look at and glows red.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Flat-atmosphere airmass:** `$X = \sec z = \dfrac{1}{\sin h}$`, fine above about 20° altitude.

**Kasten and Young (1989)** formula, good down to the horizon (`$h$` in degrees):

```math
X = \frac{1}{\sin h + 0.50572\,(h + 6.07995)^{-1.6364}}
```

**Extinction (Bouguer's law):** a fixed fraction is lost per unit of path, so the flux falls exponentially and the magnitude grows linearly:

```math
m = m_0 + k X
```

where `$m_0$` is the magnitude above the atmosphere and `$k$` is the **extinction coefficient** in magnitudes per airmass. Typical `$k$` in green (V) light at a good site is about 0.15 to 0.2; blue light has larger `$k$` than red, which is why low objects turn reddish.

**Measuring k:** observe one star at several airmasses during the night and plot `$m$` against `$X$`. The slope is `$k$` and the intercept at `$X = 0$` is `$m_0$`. This is the Bouguer (or Langley) plot.
</details>

## 3. Worked example

*Made-up numbers.* You measure a star at magnitude 7.32 at altitude 60° and 7.58 at altitude 25°.

- Airmasses: `$X_1 = 1/\sin 60^\circ = 1.155$`, `$X_2 = 1/\sin 25^\circ = 2.366$`.
- Slope: `$k = (7.58 - 7.32)/(2.366 - 1.155) = 0.26/1.211 = 0.215$` mag per airmass.
- Above the atmosphere: `$m_0 = 7.32 - 0.215 \times 1.155 = 7.07$`.

With only two points this is rough; in practice you use many stars and points through the night ([Astronomy 5.7](/learn/courses/astronomy/fitting-errors/) on fitting).


<div class="meaning">

<dl>
<dt>X ≈ 1 / sin h</dt><dd>Airmass: path length through the air compared with overhead.</dd>
<dt>k</dt><dd>Extinction coefficient: magnitudes lost per airmass.</dd>
<dt>m = m₀ + kX</dt><dd>Bouguer's law: observed magnitude grows linearly with airmass.</dd>
<dt>Physical meaning</dt><dd>It is like looking through a pane of slightly frosted glass: straight on it is thin, but tilt it and your line of sight passes through much more glass. Low stars shine through more air, which absorbs and scatters away some of their light.</dd>
</dl>

</div>

<div class="myth">

**"Stars near the horizon look dim because they are further away."** The stars are no further; their light just crosses up to 38 times more air. That is also why observers try to catch targets when they are highest.

</div>

## 4. Practice

<div class="problem" data-problem="extinction"></div>

**More practice** (answers below):

1. What is the airmass at 45° (flat formula)?
2. A star has `$m_0 = 4.00$` and `$k = 0.3$`. What magnitude does it show at airmass 2.5?
3. Why do photometrists try to observe comparison stars at the same airmass as the target?

<details>
<summary>Answers</summary>

1. `$1/\sin 45^\circ = 1.414$`.
2. `$4.00 + 0.3 \times 2.5 = 4.75$`.
3. Then both lose the same amount to extinction, and the difference between them is unaffected even if `$k$` is not known exactly.
</details>

<div class="keypoints">

- Airmass X ≈ 1/sin h; X = 1 overhead, 2 at 30°, about 38 at the horizon.
- Extinction: m = m₀ + kX, with k about 0.15 to 0.2 in green light at a good site.
- Blue light is lost more than red, so low stars look redder.
- Observe targets near their highest point.

</div>

**Try it with real numbers:** get airmass curves for a whole target list with [[batch-airmass]], or the altitude of one object through the night with [[object-altitude]].

**New words:** *airmass*, *zenith distance*, *atmospheric extinction*, *extinction coefficient*, *Bouguer's law*.
