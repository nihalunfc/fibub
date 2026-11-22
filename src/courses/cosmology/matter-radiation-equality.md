---
title: "When matter took over from light"
seoTitle: "Matter-radiation equality: when matter took over from light"
summary: "About 51,000 years after the start, at redshift 3,400, matter began to outweigh radiation. Why the relic neutrinos must be counted, how the expansion changed gear, and why dark matter clumps could only start growing after this moment."
minutes: 13
updated: 2026-11-22
quiz:
  - q: "Matter and radiation had equal densities at a redshift of about:"
    choices: ["1,090","3,400","0.3"]
    ans: 1
    why: "1 + z = Ωm / Ωr ≈ 0.31 / 9.1 × 10⁻⁵ ≈ 3,400. z ≈ 1,090 is when atoms formed; z ≈ 0.3 is when dark energy overtook matter."
  - q: "If you forgot the relic neutrinos and counted only the light, equality would come out:"
    choices: ["Too late, at z ≈ 1,000","Too early, at z ≈ 5,700","Unchanged"]
    ans: 1
    why: "Neutrinos add 69% to the radiation. Without them radiation looks weaker, so matter seems to take over sooner (at higher z)."
  - q: "Why does equality matter for the growth of galaxies?"
    choices: ["Galaxies formed at equality","While radiation rules, dark matter clumps barely grow; after equality they grow in step with the universe","Radiation makes clumps grow faster"]
    ans: 1
    why: "Radiation drives a fast expansion but does not clump itself, so it stalls the growth of dark matter clumps (the Mészáros effect). After equality the clumps grow as a."
sources:
  - "P. Mészáros (1974), The behaviour of point masses in an expanding cosmological substratum, A&A 37, 225"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "B. Ryden (2017), Introduction to Cosmology, 2nd edition, Cambridge University Press https://doi.org/10.1017/9781316651087"
  - "P. J. E. Peebles (1980), The Large-Scale Structure of the Universe, Princeton University Press"
  - "J. J. Bennett, G. Buldgen, P. F. de Salas, M. Drewes, S. Gariazzo, S. Pastor and Y. Y. Y. Wong (2021), Towards a precision calculation of N_eff in the Standard Model II: neutrino decoupling in the presence of flavour oscillations and finite-temperature QED, JCAP 04 (2021) 073 https://doi.org/10.1088/1475-7516/2021/04/073"
---

**Module 6 · about 13 minutes.** Read first: [5.5 How matter, radiation and dark energy thin out](/learn/courses/cosmology/matter-radiation-dark-energy/) and [6.5 Neutrinos let go](/learn/courses/cosmology/cosmic-neutrinos/). Radiation thins as 1/a⁴ and matter as 1/a³, so at some moment they were equal. Here we pin that moment down and see why it was a turning point for everything that came later. By the end you will be able to calculate when it happened and explain what it did to the growth of structure.

<div class="bigidea">For its first 51,000 years the universe was ruled by light and neutrinos. Then matter took over. Only from then on could clumps of dark matter grow steadily, the start of the long road to galaxies.</div>

## 1. Counting the radiation properly

Radiation today is two things: the photons of the cosmic microwave background, and the relic neutrinos from Lesson 6.5. The photons' share of the critical density is Ω<sub>γ</sub> ≈ 5.4 × 10<sup>−5</sup>. Each kind of neutrino adds 7/8 × (4/11)<sup>4/3</sup> ≈ 0.227 of that (7/8 because they are fermions, (4/11)<sup>4/3</sup> because they are colder), as long as it is moving close to the speed of light, which was true for all of them back then:

```math
\Omega_r = \Omega_\gamma\left[1 + \tfrac{7}{8}\left(\tfrac{4}{11}\right)^{4/3} N_\text{eff}\right] \approx 1.69\,\Omega_\gamma \approx 9.1\times10^{-5}
```

Radiation falls as 1/a⁴ and matter as 1/a³, so they were equal when Ω<sub>r</sub>/a⁴ = Ω<sub>m</sub>/a³:

```math
a_\text{eq} = \frac{\Omega_r}{\Omega_m}, \qquad 1 + z_\text{eq} = \frac{\Omega_m}{\Omega_r} \approx \frac{0.31}{9.1\times10^{-5}} \approx 3{,}400
```

<div class="meaning">

<dl>
<dt>Ω<sub>γ</sub>, Ω<sub>r</sub></dt><dd>today's shares of the critical density in photons, and in all radiation (photons plus the three relic neutrino kinds)</dd>
<dt>N<sub>eff</sub></dt><dd>the effective number of neutrino kinds, 3.044 in the Standard Model (Lesson 6.5)</dd>
<dt>Ω<sub>m</sub></dt><dd>matter today: dark matter plus atoms, about 0.31</dd>
<dt>a<sub>eq</sub>, z<sub>eq</sub></dt><dd>the size and redshift when matter and radiation were equal</dd>
<dt>Physical meaning</dt><dd>Going back in time, radiation grows one power of (1 + z) faster than matter. Today matter wins by 3,400 to 1, so going back by a factor 3,400 in size makes them equal.</dd>
</dl>

</div>

<div class="problem" data-problem="matter-radiation-equality-neutrinos"></div>

The Planck satellite measures z<sub>eq</sub> = 3,387 ± 21. In the rounded model used across this course it is 3,406, about **51,000 years** after the start, when the background was at about **9,300 K** (kT ≈ 0.8 eV): still far too hot for atoms.

## 2. The expansion changes gear

While radiation rules, the universe grows as a ∝ t<sup>1/2</sup>; once matter rules, as a ∝ t<sup>2/3</sup> ([Lesson 5.7](/learn/courses/cosmology/classic-models/)). For a universe of just radiation and matter (dark energy is negligible this early) the Friedmann equation can be solved exactly, which gives the time of equality:

```math
t_\text{eq} = \frac{4\,a_\text{eq}^2}{3\sqrt{\Omega_r}}\left(1 - \frac{1}{\sqrt2}\right)\frac{1}{H_0} \approx 51{,}000\ \text{years}
```

<div class="problem" data-problem="matter-radiation-equality-time"></div>

## 3. Why clumps had to wait

Dark matter does not feel light's push, so you might expect its clumps to grow under gravity from the start. They do not, much. While radiation dominates, the expansion is driven by the radiation, which is spread almost perfectly smoothly (its pressure stops it clumping). A dark matter clump then pulls on itself too weakly compared with how fast the universe is being stretched apart. In 1974 Peter Mészáros showed that while radiation dominates, a clump grows only very slowly, at best in proportion to the logarithm of the universe's size; the steady growing solution rises by just a factor of 2.5 all the way up to equality. After equality, the matter's own gravity runs the expansion, and clumps grow in step with the universe: double the size, double the clump.

<figure class="fig" data-fig="matter-radiation-equality"><figcaption>Top: the share of the universe's energy in radiation and in matter. Bottom: the growth of a dark matter clump already smaller than the horizon, following Mészáros's steady growing solution, δ ∝ 1 + 3a/(2a<sub>eq</sub>). It stalls while radiation rules and then grows as a; the dashed line shows what steady growth with a all along would have given. Slide the amount of matter, or leave out the neutrinos, to move equality.</figcaption></figure>

This stall has visible consequences:

- **The size of the biggest early clumps.** Regions small enough to be inside the horizon before equality had their growth stalled; larger ones did not. This imprints a turnover in the clumpiness of the universe at the scale of the horizon at equality, about 110 megaparsecs (some 360 million light-years) today, seen in galaxy surveys (Module 10).
- **The microwave background.** The heights of the acoustic peaks depend on how much the radiation still mattered at last scattering, so the CMB measures the matter density Ω<sub>m</sub>h² through equality ([Lesson 8.4](/learn/courses/cosmology/dark-matter-cmb/)).

<div class="history">

**Why the neutrinos had to count.** The timing of equality is one of the ways the relic neutrinos are "seen": the CMB measures z<sub>eq</sub> through the shape of its peaks, and the result needs radiation 1.69 times the photons alone, just as three neutrino kinds predict. The stall of growth in the radiation era, found by Mészáros in 1974, became central to the cold dark matter picture of galaxy formation worked out in the early 1980s by Jim Peebles, George Blumenthal, Sandra Faber, Joel Primack, Martin Rees and others.

</div>

<div class="myth">

**"Matter took over when the atoms formed."** These are different events. Matter overtook radiation at z ≈ 3,400, about 51,000 years in, while the universe was still a hot plasma. Atoms formed and the universe became transparent much later, at z ≈ 1,090, about 380,000 years (Lesson 6.9). And dark energy overtook matter later still, at z ≈ 0.3.

</div>

<div class="keypoints">

- Radiation = photons + relic neutrinos: Ω<sub>r</sub> ≈ 1.69 Ω<sub>γ</sub> ≈ 9.1 × 10<sup>−5</sup>.
- Equality: 1 + z<sub>eq</sub> = Ω<sub>m</sub>/Ω<sub>r</sub> ≈ 3,400, about 51,000 years after the start, at about 9,300 K. Without neutrinos it would be about 5,700.
- The expansion changes from a ∝ t<sup>1/2</sup> to a ∝ t<sup>2/3</sup>.
- Before equality dark matter clumps barely grow (Mészáros effect); after it they grow as a. This sets the scale of the biggest early clumps and shapes the CMB peaks.

</div>
