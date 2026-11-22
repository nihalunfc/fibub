---
title: "Gravity makes lumps: the Jeans scale"
seoTitle: "What is the Jeans length? Gravity vs pressure in cosmology"
summary: "Why big lumps collapse and small ones ring like sound: the Jeans length, why dark matter clumps first, how lumps grow (δ ∝ a), and why dark energy stalls them."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "A cloud of gas is smaller than its Jeans length. What happens to a slightly dense lump in it?"
    choices: ["It collapses at once","Pressure pushes back faster than gravity pulls in, so it oscillates as a sound wave","It explodes"]
    ans: 1
    why: "Below the Jeans length, a sound wave crosses the lump before gravity can pull it in, and the pressure bounces it back."
  - q: "In a universe of matter only, how does a small density contrast δ grow?"
    choices: ["In step with the scale factor: δ ∝ a","Exponentially fast","It does not grow at all"]
    ans: 0
    why: "The expansion drags against the collapse, so growth is slow: double the size of the universe, double δ. That is δ ∝ a ∝ t^(2/3)."
  - q: "Why did dark matter begin clumping before ordinary matter?"
    choices: ["It is heavier per particle","It was made earlier","It feels no pressure from light, so its Jeans length is essentially zero"]
    ans: 2
    why: "Before recombination, gas was locked to light with an enormous pressure, giving a Jeans length bigger than a supercluster. Dark matter ignored the light and kept clumping."
sources:
  - "J. H. Jeans (1902), The stability of a spherical nebula, Philosophical Transactions of the Royal Society A 199, 1 https://doi.org/10.1098/rsta.1902.0012"
  - "S. M. Carroll, W. H. Press and E. L. Turner (1992), The cosmological constant, Annual Review of Astronomy and Astrophysics 30, 499 https://doi.org/10.1146/annurev.aa.30.090192.002435"
  - "P. Mészáros (1974), The behaviour of point masses in an expanding cosmological substratum, A&A 37, 225 https://ui.adsabs.harvard.edu/abs/1974A&A....37..225M"
  - "P. J. E. Peebles (1980), The Large-Scale Structure of the Universe, Princeton University Press"
---

**Module 10 · about 16 minutes.** Read first: [10.1 The seeds of structure](/learn/courses/cosmology/seeds-of-structure/). Gravity pulls a dense lump inwards; pressure pushes back. Which wins depends on the lump's size. By the end you will be able to work out the dividing size, the Jeans length, explain why dark matter clumped first, and say how fast lumps grow in an expanding universe and why that growth is now stalling.

<div class="bigidea">Big lumps are ruled by gravity and collapse; small ones are ruled by pressure and ring like sound. The dividing size is the Jeans length. Dark matter has no pressure, so it clumps on every scale.</div>

## 1. A tug of war

Squeeze a patch of gas a little and two things happen. Its extra mass pulls inwards a little harder (gravity), and its pressure rises and pushes back outwards. Pressure acts at the speed of sound: a push crosses a lump of size λ in a time λ/c<sub>s</sub>. Gravity acts on the free-fall time, about 1/√(Gρ), which does not depend on size at all. So for small lumps the sound wave gets across first and the lump bounces back; for big lumps gravity wins before the pressure can respond. In 1902 James Jeans worked out the balance point for a gas cloud in space:

```math
\lambda_J = c_s \sqrt{\frac{\pi}{G\rho}}, \qquad M_J = \frac{\pi}{6}\,\rho\,\lambda_J^{3}
```

<div class="meaning">

<dl>
<dt>λ<sub>J</sub></dt><dd>the Jeans length: lumps bigger than this collapse, smaller ones oscillate</dd>
<dt>c<sub>s</sub></dt><dd>the speed of sound, which rises with temperature (c<sub>s</sub> = √(γkT/μm<sub>p</sub>) for a gas)</dd>
<dt>ρ, G</dt><dd>the density doing the pulling, and Newton's constant</dd>
<dt>M<sub>J</sub></dt><dd>the Jeans mass: the mass inside a ball one Jeans length across. Books differ by factors of a few in how they define it; the size it gives is what matters</dd>
<dt>Physical meaning</dt><dd>Hotter gas (faster sound) means only bigger lumps can collapse; denser gas means gravity is quicker, so smaller lumps can. It is a race between a sound wave and a fall.</dd>
</dl>

</div>

<figure class="fig" data-fig="gravitational-instability"><figcaption>Jeans's tug of war for gas just after recombination (z ≈ 1000). Slide the size of a lump past the Jeans length and it switches from ringing (blue, a sound wave) to growing (orange). Heat the gas and the Jeans length grows. Switch to cold dark matter: no pressure, no Jeans length, everything grows. (This is Jeans's picture for a static gas; in an expanding universe the growth is slower, but the dividing line is the same.)</figcaption></figure>

## 2. Before and after the light let go

Until [recombination](/learn/courses/cosmology/recombination/), the gas was locked to light, and the light's pressure made the sound speed enormous: about c/√3, more than half the speed of light. The Jeans length was then about the size of the horizon, and the Jeans mass of the gas was larger than the biggest galaxy clusters. Lumps of gas could not grow; they rang as the sound waves seen in the CMB ([Lesson 7.5](/learn/courses/cosmology/acoustic-peaks/)).

When the light let go, the gas was left with its own feeble pressure. At about 3,000 K its sound speed was only about 6 km/s, a drop of more than 20,000 times. The Jeans mass crashed to a few hundred thousand suns, about the mass of a globular star cluster. From then on, almost any lump of gas could fall into the dark matter's wells.

Cold dark matter never had this problem. Its particles do not feel light and move slowly, so it has essentially no pressure and no Jeans length. Its only limit is how far its particles drifted early on before they slowed down; for the most popular candidates that is so short that the smallest dark matter clumps could be as light as the Earth. That is why dark matter's lumps had a head start of hundreds of thousands of years ([Lesson 8.4](/learn/courses/cosmology/dark-matter-cmb/)), and why hot dark matter, whose particles stream out of small lumps, was ruled out ([Lesson 8.5](/learn/courses/cosmology/dark-matter-candidates/)).

<div class="problem" data-problem="gravitational-instability-jeans"></div>

## 3. Growing against the expansion

In a static cloud, a lump bigger than λ<sub>J</sub> grows exponentially fast. In the expanding universe, the stretching of space drags against the collapse, and the growth is far gentler. For a lump much bigger than the Jeans length, the density contrast obeys

```math
\ddot{\delta} + 2H\dot{\delta} = 4\pi G \bar{\rho}\, \delta
```

<div class="meaning">

<dl>
<dt>δ̈, δ̇</dt><dd>how fast the lumpiness speeds up, and how fast it changes</dd>
<dt>2Hδ̇</dt><dd>"Hubble drag": the expansion pulls the lump's matter apart as it gathers, slowing growth. H is the expansion rate (<a href="/learn/courses/cosmology/hubble-law/">Lesson 4.2</a>)</dd>
<dt>4πGρ̄δ</dt><dd>gravity: the extra pull of the lump's extra mass</dd>
<dt>Physical meaning</dt><dd>When matter rules the expansion, the two balance so that δ grows exactly in step with the scale factor: δ ∝ a ∝ t<sup>2/3</sup>. Double the size of the universe, double the lumpiness. When radiation rules (before about 50,000 years), the expansion is too fast and dark matter lumps grow only very slowly (the Mészáros effect). When dark energy rules, growth stalls again.</dd>
</dl>

</div>

From recombination (a ≈ 1/1100) to today, a lump can grow at most about 1,100 times in this way, which is why 1 part in 100,000 in the gas was not enough and dark matter's head start was needed.

## 4. Dark energy puts on the brakes

Once dark energy outweighed matter, about 3.5 billion years ago (the expansion had begun speeding up a little earlier, about 6 billion years ago), the Hubble drag won. Lumps that had not already collapsed stopped growing much. Today, lumps are only about 78% as big as they would be in a universe of matter alone. This **growth suppression** is a separate test of dark energy: it shows up in how many galaxy clusters there are at each redshift, and in how fast matter falls into structures (Lesson 10.8).

<figure class="fig" data-fig="gravitational-instability-2"><figcaption>How lumps grow as the universe grows, in the linear (small δ) picture. Dashed: matter only, δ ∝ a forever. Solid: with dark energy. Move the slider: the less matter, the earlier dark energy takes over and the earlier growth stalls. With Ω<sub>m</sub> = 1 the two lines meet.</figcaption></figure>

<div class="problem" data-problem="gravitational-instability-suppression"></div>

<div class="history">

<ul class="timeline">
<li><b>1902</b> James Jeans finds the critical size for collapse in a gas cloud, for the formation of stars and nebulae.</li>
<li><b>1946</b> Evgeny Lifshitz works out growth in an expanding universe with general relativity: slow, as a power of time.</li>
<li><b>1974</b> Peter Mészáros shows dark matter lumps hardly grow while radiation rules.</li>
<li><b>1980</b> Jim Peebles' book <i>The Large-Scale Structure of the Universe</i> sets out the whole theory of growth.</li>
<li><b>1992</b> Sean Carroll, William Press and Edwin Turner give the handy formula for growth with a cosmological constant used in the problem above.</li>
</ul>

</div>

<div class="myth">

**"Dark matter clumps first because it is heavier."** Weight has nothing to do with it: everything falls the same way in gravity ([Lesson 3.4](/learn/courses/cosmology/equivalence-principle/)). Dark matter clumped first because nothing pushed back. Ordinary matter was held up by the pressure of light until recombination.

</div>

<div class="keypoints">

- Lumps bigger than the Jeans length λ<sub>J</sub> = c<sub>s</sub>√(π/Gρ) collapse; smaller ones oscillate as sound waves.
- Before recombination, light gave the gas a Jeans mass bigger than galaxy clusters; afterwards it fell to about 10⁵ suns.
- Cold dark matter has no pressure and no Jeans length, so it clumps on all scales, from the start of the matter era.
- In an expanding universe, growth is slow: δ ∝ a while matter rules, stalled while radiation rules.
- Dark energy stalls growth again: today lumps are about 78% of their matter-only size.

</div>
