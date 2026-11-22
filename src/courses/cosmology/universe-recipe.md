---
title: "Reading the universe's recipe from the CMB"
seoTitle: "What the CMB tells us: the six numbers of the universe"
summary: "Six numbers fitted to the CMB describe the whole universe: atoms, dark matter, the sound-horizon angle, reionisation, and the strength and tilt of the first ripples. How each is read from the power spectrum, and what follows: H0 = 67.4, 5% atoms, 13.8 billion years."
minutes: 17
updated: 2026-11-22
quiz:
  - q: "What does the CMB measure most directly about ordinary matter?"
    choices: ["Its percentage of the critical density, Ω_b", "Its physical density, written Ω_b h² = 0.0224", "The number of stars"]
    ans: 1
    why: "The sound waves feel the actual density of atoms, which is proportional to Ω_b h². Turning it into a percentage needs H0 too."
  - q: "Why does the CMB's value of H0 depend on the model?"
    choices: ["Because the CMB is too faint", "Because H0 cannot be measured at all", "The CMB measures the sound-horizon angle very precisely; turning that into H0 needs the physics of the sound horizon and of the expansion since, as given by ΛCDM"]
    ans: 2
    why: "It is an inference: assume the standard model, fit the six numbers, and H0 = 67.4 ± 0.5 follows. Local measurements give about 73, the Hubble tension of Lesson 12.2."
  - q: "Planck finds n_s = 0.965, a little below 1. What does that mean?"
    choices: ["The first ripples were slightly stronger on large scales than on small ones, as simple inflation models predict", "The universe is 96.5% dark", "Space is slightly curved"]
    ans: 0
    why: "n_s = 1 would mean equal strength on every scale. Just below 1 is a small tilt towards large scales, one of inflation's predictions (Module 11)."
sources:
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "D. N. Spergel et al. (2003), First-year Wilkinson Microwave Anisotropy Probe (WMAP) observations: determination of cosmological parameters, ApJS 148, 175 https://doi.org/10.1086/377226"
  - "W. Hu and S. Dodelson (2002), Cosmic microwave background anisotropies, Annual Review of Astronomy and Astrophysics 40, 171 https://doi.org/10.1146/annurev.astro.40.060401.093926"
  - "Particle Data Group (2024), Review of Particle Physics: Cosmological parameters https://pdg.lbl.gov/2024/reviews/rpp2024-rev-cosmological-parameters.pdf"
---

**Module 7 · about 17 minutes.** Read first: [7.7 CMB polarisation](/learn/courses/cosmology/cmb-polarisation/). We have seen what shapes the CMB's ripples. Now turn it round: given the measured ripples, what is the universe made of? By the end you will be able to name the six numbers of the standard model, say how each is read from the CMB, and work out the universe's age and contents from them.

<div class="bigidea">The CMB's peaks and polarisation fix six numbers, and from those six follow the universe's age, expansion rate and contents, to about 1%.</div>

## 1. Six numbers

The standard model of cosmology, **ΛCDM** (Λ for dark energy as a cosmological constant, CDM for cold dark matter; [Lesson 12.1](/learn/courses/cosmology/lambda-cdm/)), describes the CMB with just six numbers. Planck's 2018 values:

<ul class="timeline">
<li><b>Ω<sub>b</sub>h² = 0.0224</b> the density of ordinary matter (atoms)</li>
<li><b>Ω<sub>c</sub>h² = 0.120</b> the density of cold dark matter</li>
<li><b>θ<sub>*</sub> = 0.5965°</b> the angle of the sound horizon on the sky (100θ<sub>*</sub> = 1.0411 in radians), known to 0.03%</li>
<li><b>τ = 0.054</b> how many CMB photons were scattered again after reionisation</li>
<li><b>A<sub>s</sub> = 2.1 × 10<sup>−9</sup></b> the strength of the first ripples</li>
<li><b>n<sub>s</sub> = 0.965</b> their tilt: slightly stronger on large scales than small</li>
</ul>

Here h = H<sub>0</sub> ÷ 100 km/s/Mpc. Why "Ω h²" and not just Ω? Ω is a density divided by the critical density, which grows as H<sub>0</sub>² ([Lesson 5.3](/learn/courses/cosmology/critical-density/)). So Ω h² is simply the actual density in kilograms per cubic metre, times a fixed number. The sound waves feel the actual density, so that is what the CMB measures best.

## 2. How each number is read

- **θ<sub>*</sub>**: the spacing of the peaks ([Lesson 7.5](/learn/courses/cosmology/acoustic-peaks/)). It is the best-measured number in cosmology.
- **Atoms, Ω<sub>b</sub>h²**: the odd peaks against the even ones. More atoms, stronger squeezes, a taller first peak compared with the second. Also how far the damping tail reaches.
- **Dark matter, Ω<sub>c</sub>h²**: the overall height of the first peaks and the third peak. More dark matter means steadier wells and less extra push, so lower peaks; it also sets when matter took over from radiation ([Lesson 6.8](/learn/courses/cosmology/matter-radiation-equality/)).
- **A<sub>s</sub> and τ**: the overall strength of the ripples is A<sub>s</sub> dimmed by e<sup>−2τ</sup>. On their own these two are tangled together; the large-angle polarisation measures τ separately (Lesson 7.7), which untangles them.
- **n<sub>s</sub>**: comparing the strength of the ripples from the largest scales to the smallest, across all the peaks.

Try it yourself. The figure hides a recipe; your job is to read it.

<figure class="fig" data-fig="universe-recipe"><figcaption>A parameter-reading game (simplified model). The dots are the power spectrum of a mystery universe, with error bars. Move the three sliders until your curve runs through them, then check the answer. The first mystery is our own universe. Hint: the first-to-second peak ratio gives the atoms, the peak heights the dark matter, and the peak positions then fix H₀.</figcaption></figure>

## 3. What follows

From the six numbers, assuming flat ΛCDM, everything else can be worked out. First, H<sub>0</sub>: the sound horizon is known from the physics (it depends on Ω<sub>b</sub>h² and Ω<sub>c</sub>h²), its angle θ<sub>*</sub> is measured, so its distance follows, and the distance depends on H<sub>0</sub>. Then each Ω:

```math
\Omega_b = \frac{\Omega_b h^2}{h^2} = \frac{0.0224}{0.674^2} = 0.049, \qquad \Omega_c = \frac{0.120}{0.674^2} = 0.264
```

<div class="meaning">

<dl>
<dt>Ω<sub>b</sub>h², Ω<sub>c</sub>h²</dt><dd>the physical densities of atoms and dark matter, measured by the CMB's peaks</dd>
<dt>h</dt><dd>H<sub>0</sub> ÷ 100 km/s/Mpc: 0.674 from Planck</dd>
<dt>Ω<sub>b</sub>, Ω<sub>c</sub></dt><dd>their shares of the critical density: 4.9% atoms, 26.4% dark matter</dd>
<dt>Physical meaning</dt><dd>Matter, with a dash of neutrinos, makes Ω<sub>m</sub> = 0.315. Flat space needs a total of 1, so dark energy is Ω<sub>Λ</sub> = 0.685. Work out the expansion history with these numbers, as in <a href="/learn/courses/cosmology/age-of-universe/">Lesson 4.7</a> (the formula is in the second problem below), and the universe is 13.8 billion years old.</dd>
</dl>

</div>

Planck 2018's main derived numbers:

<ul class="timeline">
<li><b>H<sub>0</sub> = 67.4 ± 0.5</b> km/s/Mpc</li>
<li><b>Ω<sub>m</sub> = 0.315</b> matter, <b>Ω<sub>Λ</sub> = 0.685</b> dark energy</li>
<li><b>Age = 13.80 ± 0.02</b> billion years</li>
<li><b>Curvature</b> Ω<sub>k</sub> = 0.001 ± 0.002 (with galaxy surveys): flat</li>
<li><b>Last scattering</b> at z = 1,090, when the universe was about 380,000 years old</li>
</ul>

<div class="problem" data-problem="universe-recipe-omega"></div>

<div class="problem" data-problem="universe-recipe-age"></div>

## 4. Checks, and cracks

The recipe passes remarkable tests. The density of atoms read from the sound waves at 380,000 years agrees with the amount needed to make the deuterium seen in old gas clouds, which was set in the first three minutes ([Lesson 6.6](/learn/courses/cosmology/big-bang-nucleosynthesis/)). The same sound horizon turns up in the spacing of galaxies billions of years later ([Lesson 10.7](/learn/courses/cosmology/baryon-acoustic-oscillations/)). And the dark energy needed to make space flat matches the acceleration seen in supernovae ([Lesson 9.1](/learn/courses/cosmology/accelerating-universe/)).

There are cracks too. Measuring H<sub>0</sub> nearby, with Cepheids and supernovae, gives about 73 km/s/Mpc, not 67.4: the **Hubble tension** ([Lesson 12.2](/learn/courses/cosmology/hubble-tension/)). Galaxy surveys find matter slightly less clumpy than the CMB recipe predicts ([Lesson 12.3](/learn/courses/cosmology/s8-tension/)). Either something is wrong with a measurement, or the six-number recipe is missing an ingredient. Both possibilities are why cosmology is exciting right now.

<div class="history">

**From "factor of two" to 1%.** In 1990 cosmologists argued whether H<sub>0</sub> was 50 or 100 and whether the universe was 10 or 20 billion years old. WMAP's first-year results in 2003 turned the CMB into a precision tool and gave a "concordance" recipe that agreed with supernovae and galaxy surveys. Planck's final 2018 results pinned most of the six numbers to better than 1%.

</div>

<div class="myth">

**"The CMB measures the Hubble constant directly."** It measures angles and peak heights at z ≈ 1,090. H<sub>0</sub> today follows only after assuming how the universe expanded in between, the ΛCDM model. That is why the gap with local measurements matters so much: if both are right, the model is not.

</div>

<div class="keypoints">

- Six numbers describe the CMB in ΛCDM: Ω<sub>b</sub>h² = 0.0224, Ω<sub>c</sub>h² = 0.120, θ<sub>*</sub> (100θ<sub>*</sub> = 1.0411), τ = 0.054, A<sub>s</sub> = 2.1 × 10<sup>−9</sup>, n<sub>s</sub> = 0.965.
- Peak spacing gives θ<sub>*</sub>; odd/even heights the atoms; peak heights the dark matter; polarisation τ; the overall level and slope A<sub>s</sub> and n<sub>s</sub>.
- Derived: H<sub>0</sub> = 67.4 ± 0.5, 4.9% atoms, 26.4% dark matter, 68.5% dark energy, flat, 13.8 billion years old.
- The recipe agrees with nucleosynthesis, galaxy clustering and supernovae, but disagrees with local H<sub>0</sub> (the Hubble tension).

</div>
