---
title: "Could gravity be wrong instead? MOND and friends"
seoTitle: "What is MOND? Modified gravity vs dark matter, explained"
summary: "MOND changes Newton's law at very weak pulls instead of adding dark matter. It predicts galaxy rotation well but struggles with clusters, the Bullet Cluster and the CMB."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "In MOND, when does gravity differ from Newton's law?"
    choices: ["When the pull is weaker than about a0 = 1.2 × 10⁻¹⁰ m/s², as far out in galaxies", "Only near black holes", "Only on Earth"]
    ans: 0
    why: "Below a0, MOND's pull is about √(g_N a0), stronger than Newton's g_N. In the Solar System pulls are far above a0, so MOND and Newton agree there."
  - q: "What does MOND predict for the flat speed of a galaxy with visible mass M?"
    choices: ["v⁴ = G M a0: the baryonic Tully-Fisher relation", "v = 0", "v grows forever with distance"]
    ans: 0
    why: "Setting v²/r = √(G M a0)/r gives v⁴ = G M a0, independent of r: flat curves, and mass ∝ v⁴, which galaxies follow closely."
  - q: "Which observation is hardest for MOND without any unseen matter?"
    choices: ["Galaxy clusters and the Bullet Cluster, plus the CMB peaks", "Rotation curves of spiral galaxies", "The orbits of the planets"]
    ans: 0
    why: "Even with MOND, clusters need about twice the mass we see, and the Bullet Cluster's mass is offset from its gas. The CMB's high third peak needs something that acts like dark matter."
sources:
  - "M. Milgrom (1983), A modification of the Newtonian dynamics as a possible alternative to the hidden mass hypothesis, ApJ 270, 365 https://doi.org/10.1086/161130"
  - "S. S. McGaugh, F. Lelli and J. M. Schombert (2016), Radial acceleration relation in rotationally supported galaxies, Physical Review Letters 117, 201101 https://doi.org/10.1103/PhysRevLett.117.201101"
  - "B. Famaey and S. S. McGaugh (2012), Modified Newtonian dynamics (MOND): observational phenomenology and relativistic extensions, Living Reviews in Relativity 15, 10 https://doi.org/10.12942/lrr-2012-10"
  - "J. D. Bekenstein (2004), Relativistic gravitation theory for the modified Newtonian dynamics paradigm, Physical Review D 70, 083509 https://doi.org/10.1103/PhysRevD.70.083509"
  - "C. Skordis and T. Złośnik (2021), New relativistic theory for modified Newtonian dynamics, Physical Review Letters 127, 161302 https://doi.org/10.1103/PhysRevLett.127.161302"
  - "I. Banik et al. (2024), Strong constraints on the gravitational law from Gaia DR3 wide binaries, MNRAS 527, 4573 https://doi.org/10.1093/mnras/stad3393"
---

**Module 8 · about 16 minutes.** Read first: [8.2 Rotation curves](/learn/courses/cosmology/rotation-curves/) and [8.3 The Bullet Cluster](/learn/courses/cosmology/bullet-cluster/). Every piece of evidence for dark matter is gravitational: things move as if there were more mass. There is another possibility: the mass is all there, and our law of gravity is wrong where gravity is very weak. This lesson takes that idea seriously. By the end you will be able to explain what MOND changes, where it works brilliantly and where it struggles.

<div class="bigidea">MOND says Newton's law changes when the pull of gravity is extremely weak. With one new constant, it predicts the rotation of galaxies from their stars and gas alone. But on bigger scales, it still needs some unseen matter.</div>

## 1. Milgrom's idea

In 1983 the Israeli physicist **Mordehai Milgrom** noticed something about rotation curves. They do not stop following Newton at a particular *distance*; they stop at a particular *pull*. Wherever the acceleration produced by the visible matter drops below about

```math
a_0 \approx 1.2 \times 10^{-10}\ \text{m/s}^2
```

the stars move faster than Newton allows. That is a tiny acceleration: it would take a car about 7,000 years to go from 0 to 100 km/h. Milgrom proposed **MOND**, Modified Newtonian Dynamics: below a<sub>0</sub>, the real pull is not Newton's *g*<sub>N</sub> but

```math
g = \sqrt{g_N\, a_0} \quad (g_N \ll a_0), \qquad g = g_N \quad (g_N \gg a_0)
```

<div class="meaning">

<dl>
<dt>g<sub>N</sub></dt><dd>the pull Newton's law gives from the visible mass: G M / r²</dd>
<dt>a<sub>0</sub></dt><dd>MOND's one new constant of nature, about 1.2 × 10⁻¹⁰ m/s², found from galaxies</dd>
<dt>g</dt><dd>the pull that actually acts. Between the two limits a smooth "interpolating function" joins them</dd>
<dt>Physical meaning</dt><dd>Where gravity is strong (the Sun's pull on the Earth is about 50 million times a<sub>0</sub>), nothing changes. Where it is extremely weak, gravity fades with distance as 1/r instead of 1/r², so it stays strong enough to keep outer stars fast.</dd>
</dl>

</div>

Far out in a galaxy, put g = v²/r = √(G M a<sub>0</sub>) / r. The r cancels:

```math
v^{4} = G\,M\,a_0
```

The speed no longer depends on distance: a **flat rotation curve**, from the visible mass alone.

<div class="problem" data-problem="mond-radius"></div>

## 2. Where MOND shines

That last equation says a galaxy's mass in stars and gas grows as its rotation speed to the fourth power. Galaxies follow this **baryonic Tully-Fisher relation** remarkably tightly, over a factor of more than 10,000 in mass, the cousin of the distance tool in [Lesson 2.5](/learn/courses/cosmology/galaxy-rulers/). In 2016 Stacy McGaugh, Federico Lelli and James Schombert plotted, for 153 galaxies, the pull observed at each point against the pull expected from the stars and gas. All 2,693 points fell on one tight curve, with a<sub>0</sub> as the only number.

<figure class="fig" data-fig="mond"><figcaption>Acceleration view: the pull observed in galaxies against the pull expected from their stars and gas, both in m/s² (the points are made-up, scattered about the measured curve). Newton says they should be equal (dashed). They are, at strong pulls; below a<sub>0</sub> the observed pull is stronger. Move a<sub>0</sub> to see how one number sets the bend. Rotation curve view: one galaxy's rotation curve, Newton against MOND, with no dark matter.</figcaption></figure>

MOND made real predictions in advance. It said that faint, spread-out "low surface brightness" galaxies, where the pull is below a<sub>0</sub> almost everywhere, should show the biggest gap between visible and dynamical mass, before such curves were measured; that turned out right. In the dark matter picture this tight link between visible matter and rotation has to come out of how galaxies form, and simulations are still working to reproduce it in detail.

<div class="problem" data-problem="mond-flat-speed"></div>

## 3. Where MOND struggles

- **Clusters.** Apply MOND to galaxy clusters and the visible mass (galaxies plus hot gas) still falls short by about a factor of 2. MOND needs extra unseen matter there, for example massive neutrinos.
- **The Bullet Cluster** (Lesson 8.3). The lensing mass sits with the galaxies, away from the gas that holds most of the atoms. A modified law of gravity alone cannot move the pull away from the mass.
- **The CMB and the growth of structure** (Lesson 8.4). The high third peak and the growth of lumps from such small ripples need something that clumps like dark matter before recombination.
- **Gravitational waves.** In 2017 gravitational waves and light from the same neutron star merger, 130 million light-years away, arrived within 2 seconds of each other. That ruled out many relativistic versions of MOND in which the two travel differently.

MOND by itself is only a rule for slow motions; to deal with light bending and the universe as a whole it needs a relativistic theory, as Newton's gravity needed Einstein's. Jacob Bekenstein built the first, **TeVeS**, in 2004; it is now ruled out by the 2017 gravitational waves. In 2021 Constantinos Skordis and Tom Złośnik built **AeST**, which fits the CMB peaks, but does so with an extra field that behaves like dark matter in the early universe.

A recent test uses **wide binary stars**, pairs so far apart that their pull on each other is below a<sub>0</sub>. In 2023 one study using the Gaia satellite claimed a MOND-like boost; others, including a 2024 analysis by Indranil Banik and colleagues, found Newton's law works and MOND does not. The debate continues.

<div class="history">

<ul class="timeline">
<li><b>1983</b> Milgrom publishes MOND in three papers.</li>
<li><b>1984</b> Bekenstein and Milgrom turn it into a proper theory of Newtonian-style gravity (AQUAL).</li>
<li><b>2004</b> Bekenstein's TeVeS, the first relativistic version.</li>
<li><b>2006</b> The Bullet Cluster lensing map.</li>
<li><b>2016</b> McGaugh, Lelli and Schombert's radial acceleration relation.</li>
<li><b>2017</b> GW170817: gravitational waves and light arrive together, ruling out TeVeS-like theories.</li>
<li><b>2021</b> AeST fits the CMB.</li>
</ul>

An odd coincidence: a<sub>0</sub> is close to c H<sub>0</sub> / 2π ≈ 1 × 10⁻¹⁰ m/s². Nobody knows whether that means anything.

</div>

<div class="myth">

**"Scientists just ignore the alternatives to dark matter."** MOND has been tested for over forty years in hundreds of papers, and its successes in galaxies are taken seriously; any full theory of dark matter has to explain them. But the same evidence that MOND is tested on, clusters, lensing, the CMB and structure, is explained by cold dark matter with one set of numbers. That is why cold dark matter is the mainstream picture, and why MOND remains a minority view that keeps everyone honest.

</div>

<div class="keypoints">

- MOND (Milgrom 1983) changes Newton's law below a<sub>0</sub> ≈ 1.2 × 10⁻¹⁰ m/s²: there the pull is √(g<sub>N</sub> a<sub>0</sub>).
- It predicts flat rotation curves and the baryonic Tully-Fisher relation, v⁴ = G M a<sub>0</sub>, from visible matter alone.
- It needs unseen mass in clusters (about 2 times), cannot explain the Bullet Cluster's offset, and needs a dark-matter-like ingredient for the CMB.
- Relativistic versions: TeVeS (ruled out by GW170817) and AeST (fits the CMB with a dark-matter-like field). Cold dark matter remains the mainstream picture.

</div>
