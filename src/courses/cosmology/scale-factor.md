---
title: "The scale factor: one number for the size of the universe"
seoTitle: "The scale factor a(t) in cosmology, explained simply"
summary: "Because the universe stretches evenly, one number, the scale factor a, tracks the size of everything at once. Comoving 'map' distances, real distances, how a links to redshift and temperature, and what the Hubble rate H = ȧ/a means."
minutes: 13
updated: 2026-11-22
quiz:
  - q: "If the scale factor was a = 0.25 when some light set out, what is its redshift?"
    choices: ["z = 0.25","z = 3","z = 4"]
    ans: 1
    why: "1 + z = 1 / a = 4, so z = 3. Every distance was a quarter of today's."
  - q: "What is a comoving distance?"
    choices: ["A distance on a map that stretches with the universe, equal to today's distance","The distance light has travelled","The size of a galaxy"]
    ans: 0
    why: "Galaxies keep the same map (comoving) positions; the real distance at any time is a × the map distance."
  - q: "What does the Hubble rate H = ȧ/a measure?"
    choices: ["The size of the universe","The fraction by which distances grow per unit time","The speed of the Milky Way"]
    ans: 1
    why: "ȧ is how fast a grows, and dividing by a turns it into a percentage-style rate, the same for every distance."
sources:
  - "D. W. Hogg (1999), Distance measures in cosmology https://arxiv.org/abs/astro-ph/9905116"
  - "B. Ryden (2017), Introduction to Cosmology, 2nd edition, Cambridge University Press https://doi.org/10.1017/9781316651087"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
---

**Module 5 · about 13 minutes.** Read first: [4.3 What expansion means](/learn/courses/cosmology/expanding-universe/) and [4.8 The cosmological principle](/learn/courses/cosmology/cosmological-principle/). This module builds the equations of cosmology from everyday ideas, one step at a time. It starts with a single number. By the end you will be able to move between scale factor, redshift, distance and temperature.

<div class="bigidea">If space stretches the same everywhere, then one number, the scale factor a, tells you how big everything was at any time. Cosmology is mostly the story of that number.</div>

## 1. A map that stretches

Think of a map of a city printed on a rubber sheet. Stretch the sheet and every street gets longer by the same factor, but the map itself, which building is where, does not change. Cosmologists describe the universe in the same way:

- Each galaxy has a fixed position on the map: its **comoving** position.
- The real distance between two galaxies at time t is the map distance times the stretch of the sheet at that time, **a(t)**.

```math
d_{\text{real}}(t) = a(t) \times d_{\text{map}}, \qquad a(\text{today}) = 1
```

<div class="meaning">

<dl>
<dt>a(t)</dt><dd>the scale factor: the size of the universe at time t compared with today</dd>
<dt>d<sub>map</sub></dt><dd>the comoving distance: the distance between two galaxies on the stretching map, chosen to equal today's distance</dd>
<dt>Physical meaning</dt><dd>a = 0.5 means every distance between far-apart galaxies was half of today's. The cosmological principle is what lets one number do this job for the whole universe.</dd>
</dl>

</div>

<figure class="fig" data-fig="scale-ruler"><figcaption>Slide the scale factor. The galaxies keep their places on the map (the grid), but every real distance grows or shrinks with a. The readout gives the redshift of light sent at that moment and the temperature of space.</figcaption></figure>

## 2. Everything follows from a

Three things you already met come straight out of the scale factor:

<ul class="timeline">
<li><b>Redshift:</b> light stretches with space, so 1 + z = 1 / a (Lesson 4.5).</li>
<li><b>Temperature:</b> the leftover light of the Big Bang cools as it stretches: T = 2.7255 K / a.</li>
<li><b>Density of matter:</b> the same matter in a bigger volume: density ∝ 1 / a³.</li>
</ul>

**Worked example.** A quasar's light left when a = 0.2. Then z = 1/0.2 − 1 = 4; space then was at 2.7255 / 0.2 ≈ 13.6 K; and matter was 1 / 0.2³ = 125 times denser than today.

<div class="problem" data-problem="scale-from-z"></div>

## 3. The rate of stretching

How fast a grows is written ȧ ("a-dot"). On its own ȧ is not very useful, because a bigger universe grows more in absolute terms. Divide by a and you get a **rate**, the same for every distance:

```math
H(t) = \frac{\dot a}{a}, \qquad H(\text{today}) = H_0
```

This H is exactly the Hubble constant of [Lesson 4.2](/learn/courses/cosmology/hubble-law/), but now we see it is only "constant" across space. Through time it changes: H was far larger in the past. "Hubble parameter" is the better name.

<div class="history">

**Why a, and not a radius?** Friedmann and Lemaître wrote their equations with a "radius of the universe" R(t). That only makes sense for a closed universe, which has a finite size. Modern cosmology uses the scale factor, normalised to 1 today, which works whether the universe is finite or infinite.

</div>

<div class="myth">

**"The scale factor is the size of the universe."** It is the size *compared with today*. The whole universe may be infinite at every moment; a only says how much bigger or smaller every distance was.

</div>

<div class="keypoints">

- Galaxies keep fixed comoving (map) positions; real distances are a(t) × map distance, with a = 1 today.
- Redshift 1 + z = 1/a; temperature T = 2.7255 K / a; matter density ∝ 1/a³.
- The Hubble parameter H = ȧ/a is the stretching rate; H<sub>0</sub> is today's value, and H changes over time.
- The rest of this module asks one question: how does a change with time?

</div>
