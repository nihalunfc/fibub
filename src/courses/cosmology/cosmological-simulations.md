---
title: "Universes in a computer"
seoTitle: "How do cosmological simulations work? N-body explained"
summary: "How cosmologists grow a universe in a computer: particles, gravity on a grid, softening and expanding boxes, from Millennium to IllustrisTNG, with a live model."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "In a cosmological N-body simulation, what is one 'particle'?"
    choices: ["One real dark matter particle","One star","A cloud of dark matter, often millions to billions of suns, standing in for countless real particles"]
    ans: 2
    why: "No computer could follow every real particle. Each simulation particle is a sample of the matter, with mass equal to the box's total matter divided by the number of particles."
  - q: "Why do simulations use 'softening'?"
    choices: ["To stop two particles passing very close from flinging each other off at huge speeds, which real smooth matter would not do","To make the pictures look smoother","To include dark energy"]
    ans: 0
    why: "Each particle is really a smooth cloud, so gravity between two of them is weakened at very small distances, about the size of the cloud."
  - q: "Which part of a galaxy simulation is least certain?"
    choices: ["Newton's law of gravity","The 'subgrid' recipes for star formation, supernovae and black holes, which happen on scales smaller than the simulation can resolve","The starting ripples, which are measured by the CMB"]
    ans: 1
    why: "Gravity and the starting conditions are well known. Star formation and feedback must be described by approximate recipes, tuned so the simulation matches some observed galaxies."
sources:
  - "E. Holmberg (1941), On the clustering tendencies among the nebulae. II. A study of encounters between laboratory models of stellar systems by a new integration procedure, ApJ 94, 385 https://doi.org/10.1086/144344"
  - "M. Davis, G. Efstathiou, C. S. Frenk and S. D. M. White (1985), The evolution of large-scale structure in a universe dominated by cold dark matter, ApJ 292, 371 https://doi.org/10.1086/163168"
  - "J. Barnes and P. Hut (1986), A hierarchical O(N log N) force-calculation algorithm, Nature 324, 446 https://doi.org/10.1038/324446a0"
  - "V. Springel et al. (2005), Simulations of the formation, evolution and clustering of galaxies and quasars, Nature 435, 629 https://doi.org/10.1038/nature03597"
  - "M. Vogelsberger et al. (2014), Properties of galaxies reproduced by a hydrodynamic simulation, Nature 509, 177 https://doi.org/10.1038/nature13316"
  - "J. Schaye et al. (2015), The EAGLE project: simulating the evolution and assembly of galaxies and their environments, MNRAS 446, 521 https://doi.org/10.1093/mnras/stu2058"
  - "V. Springel et al. (2018), First results from the IllustrisTNG simulations: matter and galaxy clustering, MNRAS 475, 676 https://doi.org/10.1093/mnras/stx3304"
---

**Module 10 · about 16 minutes.** Read first: [10.6 How galaxies form](/learn/courses/cosmology/galaxy-formation/). Gravity's equations are simple, but following billions of masses pulling on each other is impossible by hand. Since the 1980s, cosmologists have grown whole universes in computers, from the measured ripples to today's web of galaxies. By the end you will be able to explain how a simulation works, what its particles and boxes mean, and what simulations can and cannot tell us.

<div class="bigidea">Start a box of particles with the ripples the CMB shows, let it expand with the universe, and let every particle pull on every other. Out comes a cosmic web like the real one: the strongest test that cold dark matter and gravity can build the universe we see.</div>

## 1. The N-body idea

Fill a box with N particles of dark matter. Work out the pull on each from all the others, nudge the speeds (a **kick**), move the particles a little (a **drift**), and repeat thousands of times. That is an N-body simulation. The pull on particle i is Newton's law, added up over every other particle j, with one change:

```math
\mathbf{a}_i = \sum_{j \neq i} \frac{G\, m_j\, (\mathbf{x}_j - \mathbf{x}_i)}{\left(|\mathbf{x}_j - \mathbf{x}_i|^{2} + \varepsilon^{2}\right)^{3/2}}
```

<div class="meaning">

<dl>
<dt>a<sub>i</sub></dt><dd>the acceleration of particle i</dd>
<dt>m<sub>j</sub>, x<sub>j</sub></dt><dd>the mass and position of each other particle</dd>
<dt>ε</dt><dd>the softening length. Without it, two particles passing very close would pull infinitely hard and fling each other apart. Each particle stands for a smooth cloud, so gravity is softened at distances below ε (a few kiloparsecs or less)</dd>
<dt>Physical meaning</dt><dd>Newton's inverse-square law (<a href="/learn/courses/astronomy/newtons-gravity/">Newton's gravity</a>), summed over everything. Newton is enough: the particles move far slower than light, and the expansion is handled separately (section 2).</dd>
</dl>

</div>

Each "particle" is not a real particle but a sample of the matter: the box's total mass shared out equally. In big simulations each is a cloud of millions to billions of suns.

<div class="problem" data-problem="cosmological-simulations-particle"></div>

## 2. Boxes that expand

A simulation cannot hold the whole universe, so it follows a cube, typically tens to thousands of megaparsecs across, and wraps it around at the edges: a particle leaving through the right face comes back in through the left, so there are no edges and the cube is a fair sample of an endless universe. Positions are measured in **comoving** units that stretch with the universe ([Lesson 5.1](/learn/courses/cosmology/scale-factor/)); the computer only tracks the extra motion caused by lumps, with the expansion rate taken from the Friedmann equation.

The run begins at a redshift of roughly 50 to 130, while the lumps are still small. The starting positions come from a random field with exactly the ripple strengths measured by the CMB and galaxy surveys, displaced with Zel'dovich's straight-line rule ([Lesson 10.4](/learn/courses/cosmology/cosmic-web/)). Nothing about the web is put in by hand.

## 3. Doing the sum quickly

Adding up every pair takes about N²/2 sums per step. For ten billion particles that is far too slow.

<div class="problem" data-problem="cosmological-simulations-cost"></div>

Two tricks cut it to about N log N:

- **Tree codes** (Josh Barnes and Piet Hut, 1986) group far-away particles into boxes and treat each box as one mass, like looking at a distant city as one light.
- **Particle-mesh codes** spread the mass onto a grid and find gravity for the whole grid at once with a fast Fourier transform. Modern codes like GADGET combine both: mesh for long range, tree for short.

<figure class="fig" data-fig="cosmological-simulations"><figcaption>A real particle-mesh simulation running in your browser: 16,384 particles in a 2-D box that wraps at the edges and expands with the universe. Each step: spread the mass onto a 64 × 64 grid, find gravity with a Fourier transform (softened over about a cell), kick, drift. It starts almost smooth; lumps, threads and empty regions grow. "New universe" starts again from different random ripples. (2-D gravity is not quite 3-D gravity, but the method is the one the big simulations use.)</figcaption></figure>

## 4. From dark matter to galaxies

Dark matter alone gives the scaffolding: halos, subhalos and the web, all from gravity and the starting ripples, with no knobs to turn. Galaxies need gas too. **Hydrodynamic** simulations add the gas, with its pressure, shocks and cooling. But stars, supernovae and black holes act on scales far smaller than one simulation cell, so they enter as approximate **subgrid** recipes, tuned to match a few observed facts such as how many galaxies there are of each mass. The best runs then reproduce many other things they were not tuned for, such as the mix of spirals and ellipticals.

- **Millennium Run (2005):** Volker Springel and the Virgo Consortium followed about 10 billion particles (2160³) in a box 500 h⁻¹ Mpc (about 700 Mpc) across, then "painted" galaxies onto its halos with simple models.
- **Illustris (2014)** and **IllustrisTNG (2018):** gas, stars and black holes together in boxes up to about 300 Mpc across.
- **EAGLE (2015):** the Virgo Consortium's galaxy simulation, tuned to the masses and sizes of galaxies today.

<div class="history">

<ul class="timeline">
<li><b>1941</b> Erik Holmberg simulates two colliding galaxies with 74 light bulbs, measuring "gravity" with light meters.</li>
<li><b>1985</b> Davis, Efstathiou, Frenk and White run cold dark matter universes with 32,768 particles: they look like the real galaxy maps.</li>
<li><b>1986</b> Barnes and Hut's tree algorithm.</li>
<li><b>2005</b> The Millennium Run: 10 billion particles.</li>
<li><b>2014-18</b> Illustris, EAGLE and IllustrisTNG grow realistic galaxies with gas and feedback.</li>
</ul>

</div>

<div class="myth">

**"Simulations just show whatever their makers put in."** For dark matter, the only inputs are gravity, the amounts of each ingredient and the starting ripples, all measured independently; the web, the halos and their NFW shape ([Lesson 10.3](/learn/courses/cosmology/dark-matter-halos/)) come out by themselves. Galaxy physics is different: its subgrid recipes are tuned, so a simulation's galaxies are a test only of what was not tuned.

</div>

<div class="keypoints">

- An N-body simulation follows particles that each stand for a cloud of matter, adding up gravity (softened at short range) and stepping forwards: kick, drift, repeat.
- Boxes are comoving and wrap around; the starting positions follow the measured ripples.
- Tree and particle-mesh methods cut the work from N² to about N log N.
- Dark matter-only runs have no tunable knobs; galaxy simulations add gas and tuned subgrid recipes for stars and black holes.
- Landmarks: Davis-Efstathiou-Frenk-White (1985), Millennium (2005, 10 billion particles), Illustris, EAGLE, IllustrisTNG.

</div>
