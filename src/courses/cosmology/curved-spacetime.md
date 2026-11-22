---
title: 'Curved spacetime: gravity as geometry'
seoTitle: 'Curved spacetime: how Einstein explained gravity'
summary: 'In general relativity mass curves space and time, and objects simply follow the straightest paths they can. What that means without the maths, why clocks run slower downstairs, and what Einstein''s equation says in words.'
minutes: 14
updated: 2026-11-22
quiz:
  - q: In general relativity, why does the Earth orbit the Sun?
    choices: ["An invisible rope-like force pulls it","The Earth is pushed by sunlight","The Sun's mass curves spacetime and the Earth follows the straightest path through it"]
    ans: 2
    why: Nothing pulls. The Earth moves as freely as it can, and in curved spacetime the straightest path is an orbit.
  - q: Which clock runs faster, one on the ground floor or one on the top floor?
    choices: ["The one on the ground floor","The one on the top floor","Both run exactly the same"]
    ans: 1
    why: Time runs slower deeper in gravity. The difference is tiny, but atomic clocks see it for a lift of just 33 cm.
  - q: What is the main weakness of the stretched rubber-sheet picture?
    choices: ["It is too accurate","It only works for light","It uses gravity pulling down to explain gravity, and it leaves out the curving of time"]
    ans: 2
    why: It is a helpful cartoon of curved space, but in real general relativity much of everyday gravity comes from time running at different rates.
sources:
  - 'A. Einstein (1916), Die Grundlage der allgemeinen Relativitätstheorie (The foundation of the general theory of relativity), Annalen der Physik 49, 769 https://doi.org/10.1002/andp.19163540702'
  - 'R. V. Pound and G. A. Rebka (1960), Apparent weight of photons, Physical Review Letters 4, 337 https://doi.org/10.1103/PhysRevLett.4.337'
  - 'C. W. Chou et al. (2010), Optical clocks and relativity, Science 329, 1630 https://doi.org/10.1126/science.1192720'
---

**Module 3 · about 14 minutes.** Read first: [3.4 The equivalence principle](/learn/courses/cosmology/equivalence-principle/). By the end you will be able to explain, without equations, what "gravity is curved spacetime" means, and why clocks run at different rates at different heights.

<div class="bigidea">Mass bends space and time. Things then move as straight as they can, and on a bent stage the straightest path can be an orbit.</div>

## 1. Straight lines on a curved surface

Two people stand on the equator, 100 km apart, and both walk due north, perfectly straight. Their paths start parallel, yet they get closer and meet at the North Pole. Nothing pulled them together. **The surface they walk on is curved.**

Einstein's idea, published in 1915, works the same way. Space and time together form one four-dimensional "fabric", **spacetime**. Mass and energy curve it. A planet, a ball or a beam of light moves along the straightest path it can through that curved spacetime. Seen from outside, the path bends, and we call that gravity.

<figure class="fig" data-fig="spacetime-grid"><figcaption>The familiar cartoon: a mass dents a stretched sheet and a marble circles in the dent. Slide the mass to zero and the marble goes straight; add mass and its straightest path becomes an orbit. Use it for the idea only: real spacetime curves time as well as space.</figcaption></figure>

## 2. Curved time: clocks run slower downstairs

The most important curving for everyday gravity is not of space but of **time**. Deeper in gravity, time passes more slowly. An apple falls because its path through spacetime bends towards where time runs slower.

Near the Earth's surface the rate difference between two heights is tiny:

```math
\frac{\Delta t}{t} \approx \frac{g\, h}{c^{2}}
```

<div class="meaning">

<dl>
<dt>Δt / t</dt><dd>the fraction by which the higher clock runs faster</dd>
<dt>g</dt><dd>gravity's acceleration, 9.81 m/s²</dd>
<dt>h</dt><dd>how much higher the second clock is, in metres</dd>
<dt>Physical meaning</dt><dd>Each metre of height speeds a clock up by about one part in 10¹⁶. Over a whole life on a top floor, you age a few millionths of a second faster than someone on the ground.</dd>
</dl>

</div>

<div class="problem" data-problem="tower-clock"></div>

In 1959 Robert Pound and Glen Rebka sent gamma rays up and down a 22.5 m tower at Harvard and measured exactly this shift. In 2010 optical atomic clocks at NIST in the USA saw the difference when one clock was raised by only 33 centimetres.

## 3. Einstein's equation, in words

General relativity fits in one line, though solving it is hard:

```math
G_{\mu\nu} = \frac{8\pi G}{c^{4}}\, T_{\mu\nu}
```

<div class="meaning">

<dl>
<dt>G<sub>μν</sub></dt><dd>"how spacetime is curved here" (the Einstein tensor)</dd>
<dt>T<sub>μν</sub></dt><dd>"what is here": the density and flow of mass, energy, pressure and momentum</dd>
<dt>8πG / c⁴</dt><dd>a tiny number: it takes enormous mass to curve spacetime noticeably, which is why gravity is the weakest force</dd>
<dt>Physical meaning</dt><dd>As the physicist John Wheeler put it: spacetime tells matter how to move; matter tells spacetime how to curve.</dd>
</dl>

</div>

You do not need to solve it in this course. In Module 5 we use what it says for a universe evenly filled with matter: the **Friedmann equation**, which describes how the whole of space expands. Pressure also appears in T<sub>μν</sub>, and in Module 9 that turns out to matter a great deal, because a strange negative pressure can make the expansion speed up.

## 4. Gravity for the whole universe

In 1917, two years after finishing the theory, Einstein applied it to the universe as a whole. It is the first modern cosmological model. His equations refused to allow a universe that stays still: like Newton's static universe in Lesson 1.5, it had to expand or collapse. Einstein added an extra term, the **cosmological constant**, to hold it still. Module 4 tells how the observations proved him wrong, and Module 9 how the cosmological constant came back.

<div class="myth">

**"The rubber sheet shows how gravity really works."** The sheet needs Earth's gravity pulling the marble down into the dent, so it uses gravity to explain gravity. It also shows only curved space, while for slow things like apples and planets the curving of time does most of the work. Treat it as a cartoon of the idea, not a model.

</div>

<div class="keypoints">

- In general relativity (1915), mass and energy curve spacetime, and objects follow the straightest possible paths through it.
- Time runs slower deeper in gravity: about one part in 10¹⁶ per metre near Earth, measured with towers and atomic clocks.
- Einstein's equation links curvature (left side) to mass, energy and pressure (right side).
- Applied to the whole universe (1917), it would not allow a static cosmos, the start of modern cosmology.

</div>
