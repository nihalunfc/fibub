---
title: "Light pollution and the Bortle scale"
summary: "Artificial light brightens the night sky and hides faint stars. Sky brightness is measured in magnitudes per square arcsecond; the Bortle scale turns that into nine classes, from a pristine site to an inner city."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A sky quality meter reads 21.8 at site A and 18.0 at site B. Which is darker?"
    choices: ["A", "B", "They are the same"]
    ans: 0
    why: "The unit is magnitudes per square arcsecond, so bigger numbers mean a fainter (darker) sky."
  - q: "By Walker's law, how much less sky glow does a town give if you double your distance from it?"
    choices: ["2 times less", "4 times less", "about 5.7 times less"]
    ans: 2
    why: "Sky glow falls as distance to the power −2.5, and 2^2.5 ≈ 5.7."
  - q: "Which objects suffer most from light pollution?"
    choices: ["The Moon and planets", "Faint, spread-out objects like galaxies and nebulae", "Bright double stars"]
    ans: 1
    why: "Extended faint objects have low surface brightness and disappear against a bright background. Points like stars and planets cope better."
sources:
  - "Bortle, J. E. (2001), Introducing the Bortle Dark-Sky Scale, Sky & Telescope"
  - "Schaefer, B. E. (1990), Telescopic limiting magnitudes, Publications of the Astronomical Society of the Pacific 102, 212"
  - "Walker, M. F. (1977), The effects of urban lighting on the brightness of the night sky, PASP 89, 405"
---

**Module 3 · about 25 minutes · read first: [1.7 How bright is it? The magnitude scale](/learn/courses/sky-watching/magnitudes/), [3.1 Dark adaptation and averted vision](/learn/courses/sky-watching/dark-adaptation/) · maths: logarithms.** You'll be able to read a sky quality measurement, estimate your naked-eye limiting magnitude and Bortle class, and judge how far you need to drive for a darker sky.

<div class="bigidea">Artificial light brightens the night sky and hides faint stars; sky brightness is measured in magnitudes per square arcsecond, and the Bortle scale turns that into nine classes from pristine to inner city.</div>

## 1. Why this matters

For most people the biggest single upgrade in astronomy is not a bigger telescope but a darker sky. A 100 mm telescope under a dark sky shows more of a galaxy than a 300 mm telescope in a city. Knowing how to measure and compare skies helps you choose sites, and the same surface-brightness idea comes back in astrophotography (Lesson 6.2).

## 2. Measuring sky brightness

Sky brightness is spread out, so it is given per unit area of sky: **magnitudes per square arcsecond** (mag/arcsec²). A reading of 21 means each square arcsecond of sky glows like a 21st-magnitude star. Like all magnitudes, **bigger numbers are darker**.

- About 22.0: the natural sky at the darkest sites on Earth (air itself glows faintly: airglow).
- 21.5 to 21.9: rural, the Milky Way casts detail.
- 19 to 20: suburbs; the Milky Way faint or gone.
- 17 to 18: city centres.

A hand-held **sky quality meter (SQM)** or a calibrated camera gives these numbers. Each step of 1 mag/arcsec² is a factor of 2.5 in sky glow.

Choose a star and slide its distance. Watch where the black curve crosses the naked-eye, binocular and telescope lines.

<figure class="fig" data-fig="@astro-magnitude-reach"><figcaption>Every 5 magnitudes is a factor 100 in brightness and the apparent magnitude gets 5 larger for every ten times the distance. A star's absolute magnitude (its brightness at 10 pc) tells you how far away it can still be seen.</figcaption></figure>

## 3. The Bortle scale

In 2001 John Bortle described nine classes of sky by what an observer can see: Class 1 (excellent dark site: zodiacal light, airglow, the Milky Way casts shadows) to Class 9 (inner city: only the Moon, planets and a few bright stars). The classes are descriptions, so conversions to SQM are approximate.

<!--fig:bortle-sky-->

Things to notice:

- From SQM 22 to 20 the sky brightens 6 times, but the faintest visible star only goes from about 6.6 to 5.5: the eye copes surprisingly well with points.
- The number of visible stars falls much faster: from thousands to hundreds.

Drive from a city centre to a dark site:

<div class="steps">
<div class="step"><b>City centre, Bortle 9.</b> Sky brightness about 17 mag/arcsec². Only the Moon, planets and a dozen stars.</div>
<div class="step"><b>Suburbs, Bortle 6.</b> About 19 mag/arcsec². The Big Dipper and summer triangle are clear; no Milky Way.</div>
<div class="step"><b>Rural, Bortle 4.</b> About 21 mag/arcsec². The Milky Way is visible overhead; light domes glow on the horizon.</div>
<div class="step"><b>Dark site, Bortle 1 to 2.</b> About 21.9 mag/arcsec². The Milky Way casts shadows; stars to magnitude 7 or more.</div>
<div class="step"><b>The lesson.</b> Every step down the scale doubles to triples the number of stars you can see.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Naked-eye limiting magnitude (NELM)** from sky brightness `$S$` (mag/arcsec²), a widely used fit after Schaefer (1990):

```math
\text{NELM} \approx 7.93 - 5 \log_{10}\!\left(10^{\,4.316 - S/5} + 1\right)
```

**Walker's law:** the sky glow from a town of population `$P$` seen from distance `$d$` (km) is roughly

```math
I \propto P\, d^{-2.5}
```

**Try it:** a city of 1 million at 50 km versus a town of 50,000 at 10 km: `$10^6 \times 50^{-2.5} = 56.6$` and `$5\times 10^4 \times 10^{-2.5} = 158$`. The small nearby town is about 3 times worse.
</details>


<div class="meaning">

<dl>
<dt>S (mag/arcsec²)</dt><dd>Sky brightness: higher numbers mean a darker sky.</dd>
<dt>NELM</dt><dd>Naked-eye limiting magnitude: faintest star you can see.</dd>
<dt>I ∝ P d<sup>−2.5</sup></dt><dd>Walker's law: glow from a town of population P at distance d.</dd>
<dt>Physical meaning</dt><dd>Light pollution is a fog of scattered light. Street and building lights shine up and sideways, the air scatters that light back down, and the faint stars drown in the glow, just as stars vanish in daylight even though they are still there.</dd>
</dl>

</div>

<div class="myth">

**"Light pollution only matters to astronomers."** Excess night light wastes energy, disturbs sleep, and confuses birds, insects and sea turtles. Shielded, warm, dimmer lights help everyone and still light the ground.

</div>

## 4. Worked example

*Is the drive worth it?* Your back garden reads SQM 19.0; a site 40 minutes away reads 21.5.

- NELM at home: `$7.93 - 5\log_{10}(10^{0.516} + 1) = 7.93 - 5 \log_{10}(4.28) = 7.93 - 3.16 = 4.8$`.
- NELM at the site: `$7.93 - 5\log_{10}(10^{0.016} + 1) = 7.93 - 5 \log_{10}(2.04) = 7.93 - 1.55 = 6.4$`.
- The sky itself is `$10^{0.4 \times 2.5} = 10$` times darker.

For a galaxy whose surface brightness is close to the sky's, a 10 times darker background turns "invisible" into "obvious". Yes, the drive is worth it.

## 5. Practice

<div class="problem" data-problem="walker-ratio"></div>

**More practice** (answers below):

1. How many times brighter is a sky of SQM 18 than one of SQM 21?
2. Estimate NELM for SQM 20.5 with the formula.
3. Name two things you can do at home to see more from a light-polluted garden.

<details>
<summary>Answers</summary>

1. `$10^{0.4 \times 3} = 15.8$` times.
2. `$7.93 - 5\log_{10}(10^{0.216} + 1) = 7.93 - 5 \log_{10}(2.64) = 7.93 - 2.11 = 5.8$`.
3. Shield your eyes from direct lights (a hood or a wall), observe objects high in the sky away from the town's glow, wait for full dark adaptation, and choose bright targets like the Moon, planets and double stars.
</details>

<div class="keypoints">

- Sky brightness is measured in mag/arcsec² (higher = darker).
- The Bortle scale runs from 1 (pristine) to 9 (inner city).
- Walker's law: glow ∝ P d<sup>−2.5</sup>; nearby small towns can matter more than far big cities.
- Shielded, warm-coloured lighting reduces skyglow.

</div>

**Try it with real numbers:** compare sky brightness, Bortle class and limiting magnitude with the [[light-pollution-calculator]], and pick the darkest nights with the [[dark-sky-calendar]].

**New words:** *sky brightness*, *mag/arcsec²*, *sky quality meter*, *Bortle scale*, *limiting magnitude*, *airglow*, *surface brightness*.
