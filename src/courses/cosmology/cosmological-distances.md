---
title: "Distances in an expanding universe"
seoTitle: "Distances in cosmology: comoving, luminosity, angular"
summary: "When the universe stretches while light travels, 'how far away is it?' has several honest answers: light-travel distance, comoving distance, luminosity distance and angular-diameter distance. What each one means, when to use it, and why very distant galaxies look bigger again."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "A galaxy at z = 1 sent its light about 8 billion years ago. How far away is it now?"
    choices: ["Exactly 8 billion light-years","About 11 billion light-years: space kept stretching after the light left","About 4 billion light-years"]
    ans: 1
    why: "The comoving (present) distance is larger than the light-travel distance, because the space behind the light kept growing."
  - q: "Which distance should you use with the inverse square law for brightness?"
    choices: ["The luminosity distance","The angular-diameter distance","The light-travel distance"]
    ans: 0
    why: "It is built to make flux = L / (4π d²) work, including the stretching of the photons and of the time between them: (1 + z) × comoving."
  - q: "Why do galaxies beyond redshift about 1.6 look bigger the farther away they are?"
    choices: ["They really are bigger","We see them as they were when the universe was small and they were closer to us","Dust magnifies them"]
    ans: 1
    why: "The angular-diameter distance (comoving ÷ (1 + z)) reaches a maximum near z ≈ 1.6 and then shrinks."
sources:
  - "D. W. Hogg (1999), Distance measures in cosmology https://arxiv.org/abs/astro-ph/9905116"
  - "I. M. H. Etherington (1933), On the definition of distance in general relativity, Philosophical Magazine 15, 761 https://doi.org/10.1080/14786443309462220"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
---

**Module 5 · about 15 minutes.** Read first: [5.1 The scale factor](/learn/courses/cosmology/scale-factor/) and [2.1 Looking far is looking back](/learn/courses/cosmology/lookback-time/). On Earth, "how far?" has one answer. Across an expanding universe it has several, and each is useful for a different job. By the end you will be able to choose the right distance for a brightness, a size or a "how far now".

<div class="bigidea">While light crosses the universe, the universe grows. So "how far?" depends on when you ask and what you measure: the light's journey, the distance now, the faintness or the size.</div>

## 1. Four honest answers

Take a galaxy at redshift z = 1, in today's standard model:

<ul class="timeline">
<li><b>Light-travel distance, 7.9 billion light-years:</b> how long the light was on its way, times c. Simple to say, but not a distance you could lay a ruler along at any one time.</li>
<li><b>Comoving distance, 11 billion light-years:</b> how far it is <i>now</i>, on today's stretched map. The best answer to "how far away is it?"</li>
<li><b>Luminosity distance, 22 billion light-years:</b> the distance its faintness suggests if you use the inverse square law.</li>
<li><b>Angular-diameter distance, 5.5 billion light-years:</b> the distance its apparent size suggests, from size = distance × angle.</li>
</ul>

```math
d_L = (1+z)\, d_C, \qquad d_A = \frac{d_C}{1+z}, \qquad d_C = \frac{c}{H_0}\int_0^z \frac{dz'}{E(z')}
```

<div class="meaning">

<dl>
<dt>d<sub>C</sub></dt><dd>comoving distance: add up the small bits of light's path, each stretched to today's size. E(z) = H(z)/H<sub>0</sub> comes from the Friedmann equation</dd>
<dt>d<sub>L</sub></dt><dd>luminosity distance: one factor (1 + z) because each photon arrives stretched with less energy, another because they arrive more slowly; flux = L/(4πd<sub>L</sub>²)</dd>
<dt>d<sub>A</sub></dt><dd>angular-diameter distance: the galaxy's size is fixed, but the light left when everything was 1 + z times closer</dd>
<dt>Physical meaning</dt><dd>They agree for nearby galaxies (z much less than 1) and part company as z grows. Using the wrong one is a classic mistake.</dd>
</dl>

</div>

<figure class="fig" data-fig="distance-types"><figcaption>Four distances against redshift in today's standard model. Slide z: all four start together, then split. The angular-diameter distance turns over near z ≈ 1.6, so very distant galaxies look bigger again.</figcaption></figure>

<div class="problem" data-problem="luminosity-distance"></div>

## 2. Bigger far away

Look at the angular-diameter curve. It rises, peaks near **z ≈ 1.6** and then falls. A galaxy at z = 10 looks *larger* on the sky than the same galaxy at z = 2. The light left it when the universe was 11 times smaller and the galaxy was much closer to us; the light then took a long time to reach us through growing space. The farthest galaxies James Webb sees are tiny, but mainly because young galaxies were small.

## 3. Which distance when

- Brightness of a supernova or a quasar: **luminosity distance** (this is how dark energy was found).
- Sizes of galaxies or of spots in the microwave background: **angular-diameter distance**.
- "How far away is it now?" or maps of galaxies: **comoving distance**.
- "How long ago?": **lookback time**, not a distance at all.

<div class="history">

**One rule ties them together.** In 1933 the mathematician Ivor Etherington showed that in any expanding universe the luminosity and angular-diameter distances are linked by d<sub>L</sub> = (1 + z)² d<sub>A</sub>. Testing this "distance duality" with real data is a check that photons are not lost or created on the way.

</div>

<div class="myth">

**"A galaxy 13 billion light-years away."** News reports usually mean the light-travel distance: the light took 13 billion years. The galaxy itself is now around 30 billion light-years away. Both are true answers to different questions.

</div>

<div class="keypoints">

- Light-travel distance = c × lookback time; comoving distance = distance now on the stretched map.
- Luminosity distance d<sub>L</sub> = (1 + z) d<sub>C</sub> for brightness; angular-diameter distance d<sub>A</sub> = d<sub>C</sub> / (1 + z) for sizes.
- They agree nearby and split far away; d<sub>A</sub> peaks near z ≈ 1.6, so very distant galaxies look bigger again.
- d<sub>L</sub> = (1 + z)² d<sub>A</sub> in any expanding universe (Etherington, 1933).

</div>

Convert any redshift into all these distances with the [[cosmology-calculator]].
