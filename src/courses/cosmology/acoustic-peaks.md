---
title: "Sound waves in the early universe"
seoTitle: "Acoustic peaks in the CMB: sound waves, explained"
summary: "Before the universe became transparent, light and atoms rang with sound waves in the gravity wells of dark matter. Frozen at recombination, they left peaks in the CMB power spectrum that reveal the shape of space and how much ordinary and dark matter there is."
minutes: 18
updated: 2026-11-22
quiz:
  - q: "What made the sound waves in the early universe ring?"
    choices: ["Gravity pulled the light-and-atom fluid into dark matter wells, and the pressure of the light pushed it back out","Explosions of the first stars","Electrons orbiting atoms"]
    ans: 0
    why: "Gravity and pressure take turns, like a mass bouncing on a spring. Squeezed fluid is hotter, stretched fluid cooler."
  - q: "The first peak sits at ℓ ≈ 220, spots about 1° across. What does its position mainly tell us?"
    choices: ["The temperature of the CMB","That space is flat: in curved space the same sound horizon would look bigger or smaller","The age of the Sun"]
    ans: 1
    why: "The physical size of the sound horizon is known from physics. How big it looks depends on the geometry of space between us and it, and the measured size matches flat space."
  - q: "Why are the odd-numbered peaks (1st, 3rd) boosted compared with the even ones when there are more atoms?"
    choices: ["Atoms are hotter than light","Atoms block the light","Atoms add weight to the fluid, so it falls deeper into the wells: squeezes get stronger, stretches weaker"]
    ans: 2
    why: "Like a heavier ball on a spring hanging lower, the baryon-loaded fluid oscillates about a deeper balance point. The odd peaks are squeezes, the even ones stretches."
sources:
  - "W. Hu and M. White (2004), The cosmic symphony, Scientific American 290(2), 44 https://doi.org/10.1038/scientificamerican0204-44"
  - "W. Hu and N. Sugiyama (1995), Anisotropies in the cosmic microwave background: an analytic approach, ApJ 444, 489 https://doi.org/10.1086/175624"
  - "P. J. E. Peebles and J. T. Yu (1970), Primeval adiabatic perturbation in an expanding universe, ApJ 162, 815 https://doi.org/10.1086/150713"
  - "J. Silk (1968), Cosmic black-body radiation and galaxy formation, ApJ 151, 459 https://doi.org/10.1086/149449"
  - "P. de Bernardis et al. (2000), A flat universe from high-resolution maps of the cosmic microwave background radiation, Nature 404, 955 https://doi.org/10.1038/35010035"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
---

**Module 7 · about 18 minutes.** Read first: [7.4 Tiny ripples in the first light](/learn/courses/cosmology/cmb-anisotropies/). The CMB's power spectrum has a row of peaks, like the harmonics of a musical instrument. They are the echoes of sound waves that rang through the whole universe for its first 380,000 years. By the end you will be able to explain where the peaks come from and what each one tells us.

<div class="bigidea">The young universe rang like a bell. Sound waves in the hot fog were frozen when it cleared, and the sizes of the frozen waves tell us the shape of space and what the universe is made of.</div>

## 1. A universe full of sound

Before recombination, light could not travel far before bouncing off a free electron, and the electrons dragged the nuclei along with them. So light and ordinary matter (cosmologists call the nuclei and electrons **baryons**) moved together as one fluid. Light pushes on what it hits, so this fluid had a huge pressure. Dark matter, which ignores light, did not join in: it simply sat in its slightly denser clumps, making gravity wells.

Now picture a ball on a spring. Gravity pulls the fluid into a dark matter well and squeezes it. Squeezed, it heats up and its pressure rises, until the pressure pushes it back out. It overshoots, stretches and cools, then gravity pulls it back in. Squeeze, stretch, squeeze: a sound wave.

<div class="steps" data-fig="acoustic-peaks">
<div class="step">The fluid of light and atoms sits in a gravity well made by dark matter. Gravity pulls it in; the light's pressure resists being squeezed.</div>
<div class="step">Gravity wins at first: the fluid falls in and is squeezed. Squeezed fluid is hotter.</div>
<div class="step">The pressure pushes back, the fluid overshoots and is stretched, cooler. Then it falls back in: it rings, like a ball on a spring.</div>
<div class="step">The atoms add weight. The balance point sits deeper in the well, so the squeezes become stronger than the stretches.</div>
<div class="step">At recombination the light flies free, the pressure is gone, and the wave stops wherever it was: frozen into the CMB.</div>
<div class="step">Waves of different sizes ring at different rates. When the fog clears, a big wave has just squeezed once (1st peak), one half its size has squeezed and stretched (2nd peak), one a third the size has squeezed again (3rd peak).</div>
</div>

The sound travelled fast, because the fluid was mostly light:

```math
c_s = \frac{c}{\sqrt{3\,(1 + R)}}, \qquad R = \frac{3\rho_b}{4\rho_\gamma}
```

<div class="meaning">

<dl>
<dt>c<sub>s</sub></dt><dd>the speed of sound in the light-and-atom fluid</dd>
<dt>c/√3</dt><dd>the speed of sound in pure light, 58% of the speed of light</dd>
<dt>R</dt><dd>how heavy the baryons are compared with the light (ρ<sub>b</sub> is their density, ρ<sub>γ</sub> the light's). It grows as the universe expands, and was about 0.6 at recombination</dd>
<dt>Physical meaning</dt><dd>Atoms add weight but no pressure, so they slow the sound down, to about 45% of light speed at recombination. In 380,000 years sound could travel a distance called the <b>sound horizon</b>: about 144 Mpc (470 million light-years) as measured today.</dd>
</dl>

</div>

<div class="problem" data-problem="acoustic-peaks-sound"></div>

## 2. Why there are peaks

Every size of wave was there, all starting together, but small waves ring faster than big ones, just as a short guitar string plays a higher note. At recombination, each wave was caught at some stage of its swing. The waves caught at full squeeze or full stretch have the biggest temperature differences (a stretch is a cold extreme, but just as strong a signal as a hot one). Those caught halfway have almost none. So the power spectrum has peaks at the sizes that were caught at an extreme:

- **1st peak:** the biggest wave that had time to fall in and squeeze once. It is about the size of the sound horizon.
- **2nd peak:** a wave about half as big, caught after one squeeze and one stretch.
- **3rd peak** and beyond: waves caught after more swings.

The sound horizon, 144 Mpc, sits about 13,900 Mpc away. So it covers an angle

```math
\theta_* = \frac{r_s}{D} \approx \frac{144\ \text{Mpc}}{13{,}900\ \text{Mpc}} \approx 0.0104\ \text{rad} \approx 0.6^\circ
```

<div class="meaning">

<dl>
<dt>r<sub>s</sub></dt><dd>the sound horizon at last scattering, measured today (comoving): about 144 Mpc</dd>
<dt>D</dt><dd>the distance to the last-scattering surface, also comoving: about 13,900 Mpc (45 billion light-years)</dd>
<dt>θ<sub>*</sub></dt><dd>the angle the sound horizon covers on the sky. Planck measured it to 0.03%</dd>
<dt>Physical meaning</dt><dd>The peaks are spaced by about π ÷ θ<sub>*</sub> ≈ 300 in ℓ. The first peak sits a little below that, at ℓ ≈ 220 (spots of about 180° ÷ 220 ≈ 0.8°, "about a degree"), because gravity was still pulling while the waves rang. Then come ℓ ≈ 540 and 810.</dd>
</dl>

</div>

<div class="problem" data-problem="acoustic-peaks-spacing"></div>

## 3. Reading the peaks

<figure class="fig" data-fig="acoustic-peaks-2"><figcaption>The power spectrum from a simplified teaching model: the peak positions are worked out from real physics for your recipe, the heights from a tuned toy. The dashed curve is the Planck recipe. Slide the atoms, the dark matter and the curvature of space, and watch the peaks move.</figcaption></figure>

**Position: the shape of space.** We know how big the sound horizon really is, from the sound speed and the time. How big it looks depends on the geometry between us and it ([Lesson 5.4](/learn/courses/cosmology/shape-of-space/)). In a closed universe, lines of sight converge like lines of longitude, which magnifies it: the peaks move to lower ℓ (bigger spots). In an open universe they move to higher ℓ. The measured position, ℓ ≈ 220, fits flat space.

**Odd against even: the atoms.** Baryons add weight, so the fluid swings deeper into the wells. The squeezes (odd peaks) get stronger and the stretches (even peaks) weaker. The first peak is more than twice the height of the second, which measures the density of ordinary matter. It agrees with the amount from Big Bang nucleosynthesis ([Lesson 6.6](/learn/courses/cosmology/big-bang-nucleosynthesis/)), measured in a completely different way.

**The third peak: dark matter.** How deep and steady the wells are depends on dark matter. With little of it, the wells would fade as the fluid fell in, giving the oscillations an extra push and very different heights. A third peak about as tall as the second is the CMB's signature of dark matter ([Lesson 8.4](/learn/courses/cosmology/dark-matter-cmb/)).

**The damping tail.** Light was not perfectly trapped: each photon wandered a short random walk between scatterings, smoothing out the smallest waves. So the peaks fade away beyond ℓ ≈ 1,500. This is called diffusion damping, or Silk damping after Joseph Silk, who worked it out in 1968.

The same sound waves left a mark in the galaxies too: a slight preference for pairs of galaxies 147 Mpc apart (a little more than 144, because the atoms were released from the light a little later). That is the "standard ruler" of [Lesson 10.7](/learn/courses/cosmology/baryon-acoustic-oscillations/).

<div class="history">

**Hearing the echo.** In 1965 Andrei Sakharov showed that sound waves in the early universe would leave a regular pattern. In 1970 Jim Peebles with Jer Yu, and Rashid Sunyaev with Yakov Zeldovich, independently worked out how it would show in the CMB. It took thirty years to measure.

<ul class="timeline">
<li><b>1965</b> Sakharov's oscillations</li>
<li><b>1968</b> Silk: the smallest waves are smoothed away</li>
<li><b>1970</b> Peebles and Yu, Sunyaev and Zeldovich predict the peaks</li>
<li><b>1999</b> The Mobile Anisotropy Telescope (TOCO) in Chile finds the first peak near ℓ ≈ 200</li>
<li><b>2000</b> BOOMERanG, a balloon over Antarctica, and MAXIMA map it: space is flat</li>
<li><b>2003–2013</b> WMAP and Planck measure seven peaks</li>
</ul>

</div>

<div class="myth">

**"You could have heard the Big Bang."** These sound waves had wavelengths of hundreds of thousands of light-years and took tens of thousands of years or more for a single swing, about 50 octaves below the lowest note a human can hear. They were sound in the physicist's sense: pressure waves in a fluid. And there was no air or ear for them.

</div>

<div class="keypoints">

- Before recombination, light and baryons formed one fluid; gravity from dark matter wells and the light's pressure made it oscillate: sound waves at c/√(3(1+R)), about half the speed of light.
- At recombination the waves froze. Waves caught at full squeeze or stretch give the peaks of the power spectrum.
- The sound horizon (about 144 Mpc) spans about 0.6°; the peaks are about 300 apart in ℓ, the first at ℓ ≈ 220 (about 1°).
- Peak position measures the shape of space (flat); odd/even heights measure baryons; the third peak measures dark matter; the damping tail shows photon diffusion.

</div>
