---
title: "The first stars and reionisation"
seoTitle: "What was reionisation? The first stars and cosmic dawn"
summary: "After the dark ages, the first stars' ultraviolet light ionised the gas between galaxies again. Quasars and the CMB date it: half by z ≈ 7.7, done by z ≈ 6."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "Why did the universe go dark after the CMB was released?"
    choices: ["There were no stars yet, and the CMB's glow cooled and stretched into the infrared","Dark matter blocked the light","The atoms absorbed all the CMB"]
    ans: 0
    why: "With no stars, the only light was the leftover glow, which redshifted out of visible wavelengths within a few million years. These are the dark ages."
  - q: "What is a Gunn-Peterson trough?"
    choices: ["A valley in the cosmic web","A stretch of a quasar's spectrum, just blueward of Lyman-alpha, where neutral hydrogen along the way absorbs all the light","A gap in the CMB"]
    ans: 1
    why: "Lyman-alpha absorption is so strong that even 1 neutral atom in 10,000 blocks the light. Complete troughs appear in quasars beyond z ≈ 6, so reionisation was finishing then."
  - q: "What does the CMB's optical depth τ ≈ 0.054 tell us?"
    choices: ["The CMB is 5.4% dimmer than expected because of dust","About 5% of CMB photons were scattered by free electrons after reionisation, which puts its midpoint near z ≈ 7.7","The universe is 5.4 billion years old"]
    ans: 1
    why: "The earlier reionisation happened, the more free electrons the light passed and the more was scattered. Planck's small τ means reionisation was fairly late."
sources:
  - "J. E. Gunn and B. A. Peterson (1965), On the density of neutral hydrogen in intergalactic space, ApJ 142, 1633 https://doi.org/10.1086/148444"
  - "T. Abel, G. L. Bryan and M. L. Norman (2002), The formation of the first star in the universe, Science 295, 93 https://doi.org/10.1126/science.1063991"
  - "R. H. Becker et al. (2001), Evidence for reionization at z ~ 6: detection of a Gunn-Peterson trough in a z = 6.28 quasar, AJ 122, 2850 https://doi.org/10.1086/324231"
  - "X. Fan et al. (2006), Constraining the evolution of the ionizing background and the epoch of reionization with z ~ 6 quasars. II. A sample of 19 quasars, AJ 132, 117 https://doi.org/10.1086/504836"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "V. Bromm and N. Yoshida (2011), The first galaxies, Annual Review of Astronomy and Astrophysics 49, 373 https://doi.org/10.1146/annurev-astro-081710-102608"
---

**Module 10 · about 16 minutes.** Read first: [10.1 The seeds of structure](/learn/courses/cosmology/seeds-of-structure/) and [6.9 Recombination](/learn/courses/cosmology/recombination/). After recombination the universe was full of neutral gas and had no stars. Then the first lumps collapsed, the first stars switched on, and their light stripped the electrons off the hydrogen between galaxies once more. By the end you will be able to tell the story of cosmic dawn and explain the two ways we date it.

<div class="bigidea">For a hundred million years or more there were no stars: the dark ages. When the first stars and galaxies lit up, their ultraviolet light blew growing bubbles of ionised gas that merged until, about a billion years after the Big Bang, all the hydrogen between galaxies was ionised again.</div>

## 1. The dark ages

When the CMB was released, its light was a warm orange glow at about 3,000 K. As space stretched, that glow cooled into the infrared within a few million years ([Lesson 4.5](/learn/courses/cosmology/cosmological-redshift/)). There were no stars, so to human eyes the universe went dark. These are the **dark ages**: a universe of neutral hydrogen and helium gas, slowly falling into the dark matter's growing wells. The only signal it gives off is a faint radio line from hydrogen at 21 cm, which astronomers are trying to catch ([Lesson 12.7](/learn/courses/cosmology/dark-ages-21cm/)).

## 2. The first stars

The first places to collapse were the rare high peaks ([Lesson 10.1](/learn/courses/cosmology/seeds-of-structure/)): small dark matter halos of about 100,000 to a million suns, around redshift 20 to 30, some 100 to 200 million years after the start. Their gas had no carbon, oxygen or dust (only hydrogen, helium and a trace of lithium from [the first three minutes](/learn/courses/cosmology/big-bang-nucleosynthesis/)), so it could cool only through a few molecules of hydrogen, H<sub>2</sub>, down to about 200 K. Warm gas needs a lot of mass before gravity beats its pressure (the Jeans mass of [Lesson 10.2](/learn/courses/cosmology/gravitational-instability/)), so computer models made by Tom Abel, Greg Bryan and Michael Norman in 2002, and by Volker Bromm and colleagues, suggest the first stars were mostly massive: tens to hundreds of times the Sun.

Astronomers call them **Population III** stars (Population I are young, metal-rich stars like the Sun; Population II are old, metal-poor ones; III came first and had no metals at all). Massive stars live only a few million years ([how stars shine](/learn/courses/astronomy/how-stars-shine/)). Their supernovae spread the first heavy elements, so every later star was born with some metals. No Population III star has yet been seen for certain: the hunt goes on with the James Webb Space Telescope.

## 3. Bubbles of light

Hot, massive stars pour out ultraviolet light. A photon with more than 13.6 eV of energy can knock the electron off a hydrogen atom ([spectral lines](/learn/courses/astronomy/spectral-lines/)):

```math
\mathrm{H} + \gamma\,(E > 13.6\ \mathrm{eV}) \;\longrightarrow\; \mathrm{p} + e^{-}
```

<div class="meaning">

<dl>
<dt>H, p, e⁻</dt><dd>a hydrogen atom, a proton and a free electron</dd>
<dt>13.6 eV</dt><dd>the energy that holds hydrogen's electron in place: ultraviolet light of wavelength shorter than 91.2 nm</dd>
<dt>Physical meaning</dt><dd>Recombination in reverse: <b>re</b>-ionisation. Each galaxy ionises a bubble around itself; the bubble grows as long as the galaxy makes more ionising photons than the gas can use up by recombining.</dd>
</dl>

</div>

<figure class="fig" data-fig="first-stars-reionisation"><figcaption>A toy model of reionisation. Press Play or drag the time. Galaxies (dots) switch on first in the densest spots, then everywhere; their ionised bubbles grow, overlap and merge until no neutral fog is left. The bubble growth is tuned so that half the volume is ionised at z ≈ 7.7, as Planck finds, and the last neutral patches vanish near z ≈ 6, as quasar spectra show.</figcaption></figure>

Most of the ionising light seems to have come from swarms of small galaxies, with quasars helping only near the end. JWST is now finding many small, bright galaxies at z &gt; 10 ([Lesson 12.4](/learn/courses/cosmology/jwst-early-galaxies/)), and the exact budget of photons is an active question.

## 4. Two clocks for reionisation

**Quasar troughs.** Distant quasars are brilliant beacons. On the way to us their light passes through intergalactic hydrogen, and any neutral hydrogen absorbs at the Lyman-alpha wavelength, 121.6 nm, in its own rest frame. Light that started bluer is redshifted onto 121.6 nm somewhere along the path, so it is absorbed there. Lyman-alpha absorption is so strong that even one neutral atom in ten thousand blocks it completely. In 1965 James Gunn and Bruce Peterson predicted a black **trough** blueward of the quasar's Lyman-alpha line if the gas were neutral. Quasars nearby show only a "forest" of thin lines. In 2001 Robert Becker and colleagues found the first complete trough, in an SDSS quasar at z = 6.28, and Xiaohui Fan and colleagues (2006) showed the neutral fraction rising steeply beyond z ≈ 6: reionisation was just finishing.

```math
\lambda_{\rm obs} = 121.6\ \mathrm{nm} \times (1 + z)
```

<div class="problem" data-problem="first-stars-reionisation-trough"></div>

**The CMB.** Once reionised, the free electrons scatter a small fraction of the CMB's photons, slightly blurring its ripples and adding a large-scale polarisation pattern ([Lesson 7.7](/learn/courses/cosmology/cmb-polarisation/)). The fraction is the **optical depth** τ:

```math
\tau = \sigma_T\, c \int n_e(t)\, dt
```

<div class="meaning">

<dl>
<dt>σ<sub>T</sub></dt><dd>the Thomson cross-section, the effective target area a free electron offers to light (6.65 × 10⁻²⁹ m²)</dd>
<dt>n<sub>e</sub></dt><dd>the number of free electrons per cubic metre, which falls as space expands</dd>
<dt>∫ ... dt</dt><dd>add up along the light's journey since reionisation</dd>
<dt>Physical meaning</dt><dd>τ is the chance that a CMB photon was scattered after reionisation. Earlier reionisation means denser electrons for longer, so bigger τ. Planck 2018 measured τ = 0.054 ± 0.007: half ionised at z ≈ 7.7 ± 0.7, about 650 to 700 million years after the start.</dd>
</dl>

</div>

<div class="problem" data-problem="first-stars-reionisation-tau"></div>

<div class="history">

<ul class="timeline">
<li><b>1965</b> Gunn and Peterson: quasar spectra show the gas between galaxies is ionised.</li>
<li><b>2001</b> The first complete Gunn-Peterson trough, at z = 6.28.</li>
<li><b>2002</b> Simulations of the first star forming in a mini-halo (Abel, Bryan and Norman; Bromm, Coppi and Larson).</li>
<li><b>2003-12</b> WMAP's first measurement of τ suggests early reionisation, around z ≈ 17; later WMAP data bring it down to about 10.</li>
<li><b>2016-18</b> Planck measures τ ≈ 0.054: reionisation is later, midpoint z ≈ 7.7.</li>
<li><b>2018-22</b> The EDGES experiment claims a 21 cm signal from the first stars at z ≈ 17; India's SARAS 3 radiometer finds no sign of it.</li>
</ul>

</div>

<div class="myth">

**"Reionisation made the universe foggy again."** It did the opposite for most light. Neutral hydrogen blocks ultraviolet light; ionised gas spread so thin barely does. The free electrons scatter only about 5% of the CMB's photons. Before reionisation, the universe was opaque to ultraviolet; afterwards, transparent. Recombination cleared the fog for the CMB; reionisation cleared it for starlight.

</div>

<div class="keypoints">

- After recombination came the dark ages: neutral gas, no stars, lasting until about 100 to 200 million years after the start.
- The first (Population III) stars formed in mini-halos at z ≈ 20 to 30, from metal-free gas cooled by H<sub>2</sub>; they were probably massive.
- Their ultraviolet light (above 13.6 eV) ionised growing bubbles that merged: reionisation.
- Quasar Gunn-Peterson troughs show it finishing at z ≈ 6, about a billion years after the start.
- The CMB's τ = 0.054 puts the midpoint at z ≈ 7.7.

</div>
