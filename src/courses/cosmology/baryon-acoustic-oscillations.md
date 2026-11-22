---
title: "Baryon acoustic oscillations: a ruler in the sky"
seoTitle: "What are baryon acoustic oscillations (BAO)? A cosmic ruler"
summary: "Early sound waves froze at 147 Mpc, so galaxies are slightly more likely to be that far apart. How this cosmic ruler was found in 2005 and what it measures."
minutes: 17
updated: 2026-11-22
quiz:
  - q: "Why did the sound waves stop at about 147 Mpc?"
    choices: ["When light let go of the gas (around 380,000 years), the pressure that drove the waves vanished and the gas shell stalled","They hit the edge of the universe","Dark energy stopped them"]
    ans: 0
    why: "The waves were driven by the pressure of light. Once light and gas parted, at the drag epoch (z ≈ 1060), the gas stopped moving out. The distance it had reached, stretched to today, is the ruler."
  - q: "How is the BAO bump found in a galaxy survey?"
    choices: ["By photographing a single ring of galaxies","By measuring one galaxy's redshift very precisely","By counting pairs of galaxies at every separation and finding an excess near 147 Mpc"]
    ans: 2
    why: "Countless shells overlap, so no single ring is visible. Only the statistics of millions of pairs (the correlation function) show the small extra chance of a 147 Mpc separation."
  - q: "What does the BAO ruler measured along the line of sight tell us?"
    choices: ["The expansion rate H(z) at that redshift","The temperature of the CMB","The mass of the galaxies"]
    ans: 0
    why: "Along the line of sight, 147 Mpc spans a redshift interval Δz = r_d H(z)/c, so Δz measures H(z). Across the sky, the angle measures the distance."
sources:
  - "P. J. E. Peebles and J. T. Yu (1970), Primeval adiabatic perturbation in an expanding universe, ApJ 162, 815 https://doi.org/10.1086/150713"
  - "R. A. Sunyaev and Ya. B. Zel'dovich (1970), Small-scale fluctuations of relic radiation, Astrophysics and Space Science 7, 3 https://doi.org/10.1007/BF00653471"
  - "D. J. Eisenstein et al. (2005), Detection of the baryon acoustic peak in the large-scale correlation function of SDSS luminous red galaxies, ApJ 633, 560 https://doi.org/10.1086/466512"
  - "S. Cole et al. (2005), The 2dF Galaxy Redshift Survey: power-spectrum analysis of the final data set and cosmological implications, MNRAS 362, 505 https://doi.org/10.1111/j.1365-2966.2005.09318.x"
  - "D. J. Eisenstein, H.-J. Seo and M. White (2007), On the robustness of the acoustic scale in the low-redshift clustering of matter, ApJ 664, 660"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
---

**Module 10 · about 17 minutes.** Read first: [7.5 Sound waves in the early universe](/learn/courses/cosmology/acoustic-peaks/). The early universe rang with sound. Those sound waves left a mark in the CMB, and the same waves left a second mark in where galaxies are today: a preferred distance between them. By the end you will be able to explain where that distance comes from, how it was found, and how it measures the expansion of the universe.

<div class="bigidea">Every lump in the early universe sent out a sound wave that froze, 380,000 years later, at a radius that is now 147 megaparsecs. So today a galaxy is slightly more likely to have a neighbour 147 Mpc away than 120 or 180: a ruler of known length, written across the whole sky.</div>

## 1. One lump's sound wave

Take a single small lump in the early universe, made of everything: dark matter, gas and light. The gas and light were locked together ([Lesson 8.4](/learn/courses/cosmology/dark-matter-cmb/)), and the light gave the mixture a huge pressure. Squeezed in the lump, that pressure pushed outwards and sent a spherical sound wave racing away, like the ring from a pebble dropped in a pond, but in three dimensions. Dark matter feels no pressure, so it stayed behind in the middle.

<div class="steps" data-fig="baryon-acoustic-oscillations">
<div class="step">A single lump, a little denser than average, of dark matter, gas and light together. The graph shows where each ingredient is, by distance from the lump (in today's units).</div>
<div class="step">The pressure of light drives the gas and light outwards as a spherical sound wave, at more than half the speed of light. Dark matter stays near the middle.</div>
<div class="step">At about 380,000 years the universe cools enough for atoms to form, and light lets go of the gas. The light streams away (it is now the CMB). With no pressure left, the gas shell stalls: 147 Mpc in today's units.</div>
<div class="step">Gravity now mixes things up. The gas falls back towards the dark matter in the middle, and dark matter is pulled out onto the gas shell, until both have the same shape.</div>
<div class="step">The result: a big lump in the middle and a small bump in the matter at 147 Mpc. Galaxies later form in both places, so pairs 147 Mpc apart are a little more common.</div>
</div>

The real universe had countless lumps of every size, each with its own shell, all overlapping. You cannot see any single ring. But every one of them has the same radius, and that shows up when you count pairs.

## 2. How long is the ruler?

The radius the wave reached is the **sound horizon at the drag epoch**: how far sound could travel from the beginning until the gas was released from the light (z<sub>d</sub> ≈ 1060, slightly after the CMB's own release because there are so many more photons than atoms):

```math
r_d = \int_{z_d}^{\infty} \frac{c_s(z)}{H(z)}\, dz, \qquad c_s = \frac{c}{\sqrt{3\,(1+R)}}, \quad R = \frac{3\rho_b}{4\rho_\gamma}
```

<div class="meaning">

<dl>
<dt>c<sub>s</sub></dt><dd>the speed of sound in the gas-and-light mixture: c/√3 ≈ 0.58c for light alone, slowed by the weight of the atoms</dd>
<dt>R</dt><dd>how much the atoms (baryons, density ρ<sub>b</sub>) weigh down the light (ρ<sub>γ</sub>); about 0.6 at recombination</dd>
<dt>H(z)</dt><dd>the expansion rate at each redshift; dividing by it turns speed into comoving distance covered (as in <a href="/learn/courses/cosmology/cosmological-distances/">Lesson 5.8</a>)</dd>
<dt>Physical meaning</dt><dd>The ruler's length depends only on well-understood physics before 380,000 years: the amounts of atoms, dark matter and radiation, all measured by the CMB. Planck 2018 gives r<sub>d</sub> = 147.1 ± 0.3 Mpc, about 480 million light-years today.</dd>
</dl>

</div>

The same sound waves make the peaks in the CMB ([Lesson 7.5](/learn/courses/cosmology/acoustic-peaks/)). There the ruler is seen at one distance, 13.8 billion years back. In galaxies, it can be seen at any distance we can map: a ruler laid down across the universe at every epoch.

## 3. Finding it: counting pairs

The tool is the **two-point correlation function** ξ(r): how much more likely than random it is to find two galaxies a distance r apart.

```math
dP = \bar{n}^{2}\, \left[1 + \xi(r)\right]\, dV_1\, dV_2
```

<div class="meaning">

<dl>
<dt>dP</dt><dd>the chance of finding one galaxy in a small volume dV<sub>1</sub> and another in dV<sub>2</sub>, a distance r apart</dd>
<dt>n̄</dt><dd>the average number of galaxies per unit volume</dd>
<dt>ξ(r)</dt><dd>the excess. In practice: count the pairs at each separation in the real map (DD) and in a random map with no clustering (RR), and ξ ≈ DD/RR − 1</dd>
<dt>Physical meaning</dt><dd>ξ is large at small r (galaxies cluster) and falls towards zero at large r, except for a small bump near 147 Mpc: the acoustic peak. In real galaxies the bump is only a few parts in 1,000.</dd>
</dl>

</div>

<figure class="fig" data-fig="baryon-acoustic-oscillations-2"><figcaption>A toy map of galaxies (the bump is exaggerated many times compared with the real universe). Nobody can pick out the shells by eye. Count every pair by separation and compare with a random sky: an excess appears at 147 Mpc. With 600 galaxies it is lost in noise; with 15,000 it stands out. Real surveys need hundreds of thousands to millions.</figcaption></figure>

In 2005 two teams found it at once. Daniel Eisenstein and the SDSS team measured ξ(r) for 46,748 luminous red galaxies and saw the bump at about 100 h⁻¹ Mpc (147 Mpc for h = 0.674). Shaun Cole and the 2dFGRS team saw the matching gentle wiggles in the power spectrum, the same signal viewed in waves instead of distances. Jim Peebles and Jer Yu, and Rashid Sunyaev and Yakov Zel'dovich, had predicted it in 1970.

## 4. What the ruler measures

Measured **across the sky**, the ruler spans an angle θ = r<sub>d</sub>/D<sub>M</sub>(z), which gives the comoving distance D<sub>M</sub>(z) to that redshift. Measured **along the line of sight**, 147 Mpc spans a small range of redshift, Δz = r<sub>d</sub>H(z)/c, which gives the expansion rate H(z) itself.

<div class="problem" data-problem="baryon-acoustic-oscillations-angle"></div>

<div class="problem" data-problem="baryon-acoustic-oscillations-dz"></div>

Measuring both at many redshifts maps the history of the expansion, which is exactly what is needed to study dark energy. BAO is a standard **ruler**, a cousin of the standard candles of [Lesson 2.2](/learn/courses/cosmology/standard-candles/), and it works best together with them: supernovae give precise relative distances, BAO pins their scale. It is also robust: galaxies have moved only about 10 Mpc since the bump froze, which smears it slightly but hardly shifts it (Eisenstein, Seo and White 2007), and the smearing can be partly undone. The BAO has since been measured with galaxies out to z ≈ 1 and beyond, in the light of quasars, and in the hydrogen "forest" in quasar spectra at z ≈ 2.3 (BOSS, 2013). DESI's BAO measurements and their hint that dark energy may be changing are the subject of [Lesson 9.6](/learn/courses/cosmology/desi-dark-energy/).

<div class="history">

<ul class="timeline">
<li><b>1970</b> Peebles and Yu, and Sunyaev and Zel'dovich, predict the acoustic signal in the CMB and in matter.</li>
<li><b>1998</b> Eisenstein and Wayne Hu work out the signal's shape precisely; with Max Tegmark, they propose galaxy surveys use it as a ruler.</li>
<li><b>2005</b> Detected in SDSS galaxies (Eisenstein et al.) and in the 2dF Galaxy Redshift Survey (Cole et al.).</li>
<li><b>2013</b> BOSS measures BAO in the Lyman-alpha forest of quasars at z ≈ 2.3.</li>
<li><b>2024-25</b> DESI measures the BAO scale to a fraction of a percent, combining all its redshifts (Lesson 9.6).</li>
</ul>

</div>

<div class="myth">

**"BAO is a giant ring of galaxies you can see in the sky."** Every lump made its own shell, and billions of shells overlap. In a map you see a web, not rings. The ruler exists only as a statistic: a slightly higher chance, a few parts in 1,000, of a 147 Mpc separation, found by counting millions of pairs.

</div>

<div class="keypoints">

- Each early lump sent out a sound wave in the gas-and-light mixture; dark matter stayed in the middle.
- When light let go of the gas (z ≈ 1060), the wave stalled at the sound horizon r<sub>d</sub> ≈ 147 Mpc (about 480 million light-years) in today's units.
- Galaxies are slightly more likely to be 147 Mpc apart: a bump in the correlation function ξ(r).
- First detected in 2005 by SDSS (Eisenstein et al.) and 2dFGRS (Cole et al.).
- Across the sky it measures distance D<sub>M</sub>(z); along the line of sight, the expansion rate H(z).

</div>
