---
title: "Build your own universe"
seoTitle: "Build your own universe: a cosmology simulator"
summary: "Put together everything in Module 5: choose how much matter and dark energy a universe holds and how fast it expands, and the Friedmann equation gives its whole life story: age, shape, Big Bang or bounce, Big Crunch or endless growth. With a formula for the age of a flat universe."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "In the simulator, what happens if you give a universe lots of matter and no dark energy?"
    choices: ["It expands, stops and collapses in a Big Crunch", "It speeds up forever", "It never had a Big Bang"]
    ans: 0
    why: "With more than the critical amount of matter and nothing to push, gravity wins in the end."
  - q: "What can make a universe have no Big Bang in the simulator?"
    choices: ["A lot of dark energy compared with matter, so that in the past it bounced from a smallest size", "No matter at all and no dark energy", "A small Hubble constant"]
    ans: 0
    why: "If dark energy is strong enough, running time backwards, the expansion turns round before the universe gets small. Our measured mix rules this out."
  - q: "For our measured ingredients, which pair of facts is right?"
    choices: ["Flat, about 13.8 billion years old, and expanding forever faster and faster", "Closed and heading for a Big Crunch", "Open and slowing down"]
    ans: 0
    why: "Ωm ≈ 0.31 and ΩΛ ≈ 0.69 add to 1 (flat), give 13.8 billion years with H0 = 67.7, and q0 ≈ −0.53 (speeding up)."
sources:
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "S. M. Carroll, W. H. Press and E. L. Turner (1992), The cosmological constant, Annual Review of Astronomy and Astrophysics 30, 499 https://doi.org/10.1146/annurev.aa.30.090192.002435"
  - "B. Ryden (2017), Introduction to Cosmology, 2nd edition, Cambridge University Press https://doi.org/10.1017/9781316651087"
---

**Module 5 · about 15 minutes.** Read first: [5.7 The classic universes](/learn/courses/cosmology/classic-models/). This last lesson of the module puts everything together in one simulator. You choose the ingredients; the Friedmann equation tells the story. By the end you will be able to predict the life of a universe from its recipe, and work out the age of a flat one with a single formula.

<div class="bigidea">Three numbers, how much matter, how much dark energy and how fast it expands today, decide a universe's whole life. Ours: flat, 13.8 billion years old, and growing faster forever.</div>

## 1. The simulator

<figure class="fig" data-fig="universe-builder"><figcaption>Choose Ωm, ΩΛ and H₀, or a preset. The curve is the universe's size through time, worked out step by step from the Friedmann equations; the readout gives its beginning, end, shape and whether it is speeding up today.</figcaption></figure>

Things to try:

- **Ours:** Ω<sub>m</sub> = 0.31, Ω<sub>Λ</sub> = 0.69, H<sub>0</sub> = 67.7. A Big Bang 13.8 billion years ago; flat; speeding up.
- **More matter:** push Ω<sub>m</sub> to 2 with no dark energy. A Big Crunch.
- **Negative dark energy:** set Ω<sub>Λ</sub> below 0. Even a flat or open universe now collapses.
- **Lots of dark energy, little matter:** Ω<sub>m</sub> = 0.3, Ω<sub>Λ</sub> = 1.8. No Big Bang: going back in time, it shrinks to a smallest size and bounces. Our measurements rule this out: we see galaxies and light from when the universe was over 1,000 times smaller.
- **Faster expansion:** raise H<sub>0</sub>. The same recipe, a younger universe.

## 2. The four possible lives

<ul class="timeline">
<li><b>Big Bang, then Big Crunch:</b> gravity wins (much matter, little or negative dark energy).</li>
<li><b>Big Bang, then slowing forever:</b> matter only, critical or less.</li>
<li><b>Big Bang, then speeding up forever:</b> enough dark energy; this is us.</li>
<li><b>No Big Bang, a bounce:</b> dark energy far stronger than matter.</li>
</ul>

## 3. The age of a flat universe in one line

For a flat universe of matter and a cosmological constant, the Friedmann equation can be solved exactly:

```math
t_0 = \frac{2}{3\sqrt{\Omega_\Lambda}}\;\text{asinh}\!\left(\sqrt{\frac{\Omega_\Lambda}{\Omega_m}}\right)\frac{1}{H_0}
```

<div class="meaning">

<dl>
<dt>1/H<sub>0</sub></dt><dd>the Hubble time, 977.8 ÷ H<sub>0</sub> billion years</dd>
<dt>asinh</dt><dd>the "inverse hyperbolic sine", a button on scientific calculators: asinh x = ln(x + √(x² + 1))</dd>
<dt>Physical meaning</dt><dd>With no dark energy the formula becomes 2/3 of the Hubble time (Einstein-de Sitter). Adding dark energy makes the age longer: for our mix the factor is 0.95, so the age is 95% of 1/H<sub>0</sub>.</dd>
</dl>

</div>

**Worked example.** Ω<sub>m</sub> = 0.31, Ω<sub>Λ</sub> = 0.69, H<sub>0</sub> = 67.7. √(0.69/0.31) = 1.492; asinh 1.492 = 1.190; 2 ÷ (3 × 0.831) = 0.803; Hubble time 977.8 ÷ 67.7 = 14.44 billion years. Age = 0.803 × 1.190 × 14.44 ≈ **13.8 billion years**, the measured value.

<div class="problem" data-problem="flat-age"></div>

<div class="history">

**From many universes to one.** Through most of the 20th century cosmologists could draw all these histories but did not know which was ours, because Ω<sub>m</sub>, Ω<sub>Λ</sub> and H<sub>0</sub> were each uncertain by factors of two or more. Since about 2003 the cosmic microwave background, supernovae and galaxy maps have pinned them to a few per cent. Modules 6 and 7 show how the hot early universe is used to do this.

</div>

<div class="myth">

**"The Big Crunch is how the universe will end."** Not with the ingredients we measure. Unless dark energy changes its nature in the future (an open question, Module 9), our universe will expand forever, growing colder and emptier.

</div>

<div class="keypoints">

- Ω<sub>m</sub>, Ω<sub>Λ</sub> and H<sub>0</sub> fix a universe's history through the Friedmann equations.
- Possible lives: Big Crunch, slowing forever, speeding up forever, or a bounce with no Big Bang.
- Age of a flat universe with matter and Λ: (2 / 3√Ω<sub>Λ</sub>) asinh(√(Ω<sub>Λ</sub>/Ω<sub>m</sub>)) / H<sub>0</sub>, about 13.8 billion years for ours.
- Our universe: flat, 13.8 billion years old, speeding up, expanding forever.

</div>
