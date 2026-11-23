---
title: "The seeds of structure"
seoTitle: "How did galaxies form from a smooth universe? The seeds"
summary: "The young universe was smooth to 1 part in 100,000. How tiny ripples of every size, grown by gravity, became every galaxy, cluster and void we see today."
minutes: 14
updated: 2026-11-22
quiz:
  - q: "How smooth was the universe when the cosmic microwave background was released?"
    choices: ["Smooth to about 1 part in 100,000","Perfectly smooth","As lumpy as today"]
    ans: 0
    why: "The CMB's temperature varies by only about 1 part in 100,000 from place to place. Those tiny differences mark slightly denser and thinner regions: the seeds."
  - q: "What does a density contrast δ = 0.01 mean?"
    choices: ["The region is 100 times denser than average","The region is 1% denser than the average","The region holds 1% of all matter"]
    ans: 1
    why: "δ = (ρ − ρ̄)/ρ̄. δ = 0.01 means 1% above average. A lump collapses into a halo once δ (in the simple growing picture) reaches about 1."
  - q: "Why do the first galaxies form in clumps rather than evenly?"
    choices: ["Gravity only works in some places","Galaxies are thrown together by the Big Bang","They form on the rare highest peaks, which sit on top of bigger ripples and so cluster together"]
    ans: 2
    why: "A small ripple riding on a big swell reaches the collapse threshold first. Big swells are where clusters later form, so the first galaxies are born close together."
sources:
  - "E. R. Harrison (1970), Fluctuations at the threshold of classical cosmology, Physical Review D 1, 2726 https://doi.org/10.1103/PhysRevD.1.2726"
  - "Ya. B. Zel'dovich (1972), A hypothesis, unifying the structure and the entropy of the Universe, MNRAS 160, 1P https://doi.org/10.1093/mnras/160.1.1P"
  - "G. F. Smoot et al. (1992), Structure in the COBE differential microwave radiometer first-year maps, ApJ 396, L1 https://doi.org/10.1086/186504"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "J. M. Bardeen, J. R. Bond, N. Kaiser and A. S. Szalay (1986), The statistics of peaks of Gaussian random fields, ApJ 304, 15 https://doi.org/10.1086/164143"
---

**Module 10 · about 14 minutes.** Read first: [8.4 Dark matter in the first light](/learn/courses/cosmology/dark-matter-cmb/). When the first light was set free, the universe was an almost perfectly even gas. Today it is full of galaxies, clusters and huge empty voids. This module tells how one became the other. By the end of this lesson you will be able to describe the seeds that everything grew from, measure them with one number, and say why gravity makes them grow.

<div class="bigidea">Every galaxy, cluster and void started as a ripple in density of about 1 part in 100,000. Gravity is unstable: denser places pull in more matter and get denser still, so the ripples grew into everything we see.</div>

## 1. Almost smooth

The cosmic microwave background, released at [recombination](/learn/courses/cosmology/recombination/) about 380,000 years after the start, has the same temperature in every direction to about 1 part in 100,000 ([Lesson 7.4](/learn/courses/cosmology/cmb-anisotropies/)). Slightly warmer and cooler patches mark slightly denser and thinner regions of matter. Picture a perfectly calm lake with ripples a centimetre high on a surface a kilometre wide: that is how smooth the young universe was.

Cosmologists measure a ripple with the **density contrast**, already met in [Lesson 8.4](/learn/courses/cosmology/dark-matter-cmb/):

```math
\delta(\mathbf{x}) = \frac{\rho(\mathbf{x}) - \bar\rho}{\bar\rho}
```

<div class="meaning">

<dl>
<dt>ρ(x)</dt><dd>the density of matter at a place x</dd>
<dt>ρ̄</dt><dd>the average density of matter in the whole universe at that time</dd>
<dt>δ</dt><dd>how far above (positive) or below (negative) average the place is, as a fraction. δ can never be less than −1, which is completely empty</dd>
<dt>Physical meaning</dt><dd>One number for "how lumpy". Early on, |δ| was about 10⁻⁵ for the gas and some tens of times more for dark matter. Today, a galaxy's halo has δ of a few hundred, and the middle of a void about −0.8.</dd>
</dl>

</div>

## 2. Ripples of every size

The ripples were not one neat wave but a jumble of waves of every size added together, like the surface of a choppy sea. Cosmologists describe the jumble by its **power spectrum**: how strong the ripples are on each size scale. Two facts, both measured by the CMB and by galaxy maps, matter most:

- **Nearly the same strength on every scale.** In 1970 Edward Harrison, and independently Yakov Zel'dovich and (with Jer Yu) Jim Peebles, argued that the simplest seeds would have about the same strength at every size, measured as each wave entered the horizon. Planck finds almost exactly that: the spectral index is n<sub>s</sub> = 0.965 ± 0.004, where 1 would be perfectly even. Slightly stronger on large scales, a clue from the very first instant.
- **Random, like noise.** The ripples behave as a *Gaussian random field*: at any point δ follows a bell curve, and the bumps are placed at random, with no pattern beyond their strength on each scale.

Where did they come from? The leading idea is that they are quantum jitters from the first tiny fraction of a second, stretched to enormous sizes by cosmic inflation. That story belongs to [Lesson 11.3](/learn/courses/cosmology/quantum-seeds/); here we take the seeds as given and watch them grow.

<div class="steps" data-fig="seeds-of-structure">
<div class="step">400 bits of matter along a line through space, spread almost perfectly evenly. The density graph is flat: at true scale, the ripples are 1 part in 100,000, far too small to see.</div>
<div class="step">Magnify the density 60,000 times and the ripples appear: big swells and small wiggles of every size, added together at random. These are the seeds.</div>
<div class="step">Gravity acts. Each bit of matter drifts towards denser neighbours. Dense places get denser and thin places thinner: the rich get richer.</div>
<div class="step">Eventually streams of matter cross: lumps collapse into dense knots, the future halos and galaxies, and the gaps between empty out into voids.</div>
</div>

## 3. How much matter went into each lump

A galaxy is tiny compared with the region it came from. Gather all the matter of a halo and spread it out at the cosmic average density: the ball it fills is the patch of the early universe that became the galaxy. Its radius (in comoving units, measured as if today) follows from mass = density × volume:

```math
M = \frac{4\pi}{3} R^{3}\, \Omega_m \rho_c \quad\Longrightarrow\quad R = \left(\frac{3M}{4\pi\, \Omega_m \rho_c}\right)^{1/3}
```

<div class="meaning">

<dl>
<dt>M</dt><dd>the mass of the galaxy's halo, or cluster</dd>
<dt>Ω<sub>m</sub>ρ<sub>c</sub></dt><dd>the average density of matter today: 31% of the critical density (<a href="/learn/courses/cosmology/critical-density/">Lesson 5.3</a>), about 4 × 10¹⁰ suns per cubic megaparsec</dd>
<dt>R</dt><dd>the comoving radius of the patch that collapsed to make it</dd>
<dt>Physical meaning</dt><dd>Mass tells you which ripples mattered: a Milky Way halo grew from a patch about 2 Mpc in radius, a big cluster from one about 20 Mpc. Each kind of object is made by the ripples of its own size.</dd>
</dl>

</div>

<div class="problem" data-problem="seeds-of-structure-region"></div>

## 4. The highest peaks go first

Because small ripples ride on top of big swells, a small ripple sitting on a big crest reaches the collapse threshold before the same ripple sitting in a trough. So the first objects form on the rarest high peaks, and those peaks are bunched together on the big crests, where great clusters will later grow. James Bardeen, Dick Bond, Nick Kaiser and Alex Szalay worked out the statistics of these peaks in 1986. It explains why the first stars ([Lesson 10.5](/learn/courses/cosmology/first-stars-reionisation/)) and the brightest early quasars sit in what later become the densest regions of the universe.

<div class="problem" data-problem="seeds-of-structure-peaks"></div>

<div class="history">

<ul class="timeline">
<li><b>1946</b> Evgeny Lifshitz shows that in an expanding universe small lumps grow only slowly, as a power of time, not explosively: there must have been seeds from the start.</li>
<li><b>1970-72</b> Harrison, Peebles and Yu, and Zel'dovich propose seeds of the same strength on every scale.</li>
<li><b>1986</b> Bardeen, Bond, Kaiser and Szalay describe how the peaks of random ripples cluster.</li>
<li><b>1992</b> COBE detects the ripples in the CMB, at about 1 part in 100,000 (George Smoot and colleagues).</li>
<li><b>2013-18</b> Planck measures n<sub>s</sub> = 0.965: slightly stronger on large scales, not exactly even.</li>
</ul>

</div>

<div class="myth">

**"The spots in the CMB map are baby galaxies."** The spots Planck shows are about a degree across, which is hundreds of megaparsecs today: far bigger than any galaxy. They are the large ripples. The small ripples that made individual galaxies were there too, but too small for CMB telescopes to see, and they were partly smoothed out in the gas. What the CMB proves is that ripples existed, with the size and pattern needed.

</div>

<div class="keypoints">

- At recombination, matter was smooth to about 1 part in 100,000; the density contrast δ = (ρ − ρ̄)/ρ̄ measures how lumpy.
- The ripples came in every size at random (a Gaussian random field), almost equally strong on every scale: n<sub>s</sub> = 0.965.
- Gravity is unstable: denser regions pull in more and grow, so the ripples became halos, galaxies and voids.
- Each object grew from a patch of its own size: a Milky Way halo from a ball about 2 Mpc in radius (comoving).
- The rarest high peaks collapse first, and cluster together. The seeds themselves probably came from inflation (Lesson 11.3).

</div>
