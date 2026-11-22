---
title: "Quantum jitters become galaxies"
seoTitle: "How quantum fluctuations seeded galaxies during inflation"
summary: "The galaxies around us grew from quantum jitters in the inflaton field, stretched across the sky by inflation. How they froze, why they are slightly stronger on big scales, and how Planck checked it."
minutes: 17
updated: 2026-11-22
quiz:
  - q: "Why did the quantum jitters stop jittering?"
    choices: ["The universe cooled and they condensed into atoms","Inflation stretched each wave beyond the horizon, so its two ends could no longer affect each other and it froze in place","They were absorbed by dark matter"]
    ans: 1
    why: "A wave can only oscillate if its parts can push on each other. Once it is longer than the horizon, nothing can change it until, long after inflation, the horizon grows past it again."
  - q: "What does n_s = 0.965 tell us?"
    choices: ["The universe is 96.5% flat","The ripples are slightly stronger on large scales than on small ones, as slow-roll inflation predicts","96.5% of the ripples are quantum"]
    ans: 1
    why: "n_s = 1 would mean every size is equally strong. The small 'red tilt' reflects the inflaton speeding up slowly as it rolls, and Planck rules out exactly 1 by about 8 standard deviations."
  - q: "Which of these did inflation predict and observations confirm?"
    choices: ["That the CMB has no ripples at all","That galaxies formed before stars","Ripples on scales bigger than the horizon at the time of the CMB, seen in the pattern linking its temperature and polarisation"]
    ans: 2
    why: "Without inflation, nothing could make correlations wider than the horizon. WMAP saw exactly the temperature-polarisation pattern that super-horizon ripples produce."
sources:
  - "V. F. Mukhanov and G. V. Chibisov (1981), Quantum fluctuations and a nonsingular universe, JETP Letters 33, 532"
  - "A. H. Guth and S.-Y. Pi (1982), Fluctuations in the new inflationary universe, Physical Review Letters 49, 1110 https://doi.org/10.1103/PhysRevLett.49.1110"
  - "S. W. Hawking (1982), The development of irregularities in a single bubble inflationary universe, Physics Letters B 115, 295 https://doi.org/10.1016/0370-2693(82)90373-2"
  - "J. M. Bardeen, P. J. Steinhardt and M. S. Turner (1983), Spontaneous creation of almost scale-free density perturbations in an inflationary universe, Physical Review D 28, 679 https://doi.org/10.1103/PhysRevD.28.679"
  - "D. N. Spergel and M. Zaldarriaga (1997), Cosmic microwave background polarization as a direct test of inflation, Physical Review Letters 79, 2180 https://doi.org/10.1103/PhysRevLett.79.2180"
  - "Planck Collaboration (2020), Planck 2018 results. X. Constraints on inflation, A&A 641, A10 https://doi.org/10.1051/0004-6361/201833887"
  - "Planck Collaboration (2020), Planck 2018 results. IX. Constraints on primordial non-Gaussianity, A&A 641, A9 https://doi.org/10.1051/0004-6361/201935891"
---

**Module 11 · about 17 minutes.** Read first: [11.2 Cosmic inflation](/learn/courses/cosmology/cosmic-inflation/) and [9.3 The vacuum energy puzzle](/learn/courses/cosmology/vacuum-energy/) (zero-point jitter). The CMB has ripples of 1 part in 100,000 ([Lesson 7.4](/learn/courses/cosmology/cmb-anisotropies/)), and gravity grew them into every galaxy ([Lesson 10.1](/learn/courses/cosmology/seeds-of-structure/)). But where did the ripples come from? Inflation gives a startling answer. By the end you will be able to explain how quantum physics, the science of the very small, made the largest structures in the universe.

<div class="bigidea">Every quantum field jitters. During inflation, that jitter in the inflaton was stretched from far smaller than an atom to larger than the observable universe, and froze. The frozen pattern is the map of slightly denser places that became galaxies.</div>

## 1. Jitter that cannot stop

In [Lesson 9.3](/learn/courses/cosmology/vacuum-energy/) you saw that a quantum field can never be perfectly still: every wave in it keeps a zero-point jitter. The inflaton is no exception. During inflation, each wave of jitter is caught by the expansion and stretched along with space.

Remember that the horizon, measured on the stretching map, shrinks during inflation (Lesson 11.2). A wave smaller than the horizon wobbles back and forth as usual. Once stretched larger than the horizon, its two ends can no longer affect each other: it cannot wobble, so it **freezes** at whatever size it had. The biggest waves freeze first, the smaller ones later. In each Hubble time the jitter left behind is about:

```math
\delta\phi \approx \frac{H}{2\pi}
```

<div class="meaning">

<dl>
<dt>δφ</dt><dd>the typical size of the frozen jitter in the field (in natural units, where ħ = c = 1)</dd>
<dt>H</dt><dd>the expansion rate during inflation: it sets the size of the horizon, and so the "temperature" of the jitter</dd>
<dt>Physical meaning</dt><dd>H barely changes during inflation, so each new wave freezes with almost the same strength as the last. That is why ripples of every size come out nearly equally strong.</dd>
</dl>

</div>

<figure class="fig" data-fig="quantum-seeds"><figcaption>Waves of quantum jitter on a map that stretches with space. The horizon (top bar) shrinks as space inflates. Each wave jitters until the horizon is smaller than it, then freezes, biggest first. Their sum (bottom) is the seed pattern. Press New jitter: the pattern is random, but its statistics are always the same.</figcaption></figure>

## 2. From a jittery field to lumpy matter

Where the field was kicked a little back up its hill, it reaches the bottom a little later, so that region inflates a little more and ends up with slightly different density after reheating. The size of the effect is set by the delay δt = δφ/φ̇:

```math
\zeta \approx H\,\delta t = H\,\frac{\delta\phi}{\dot\phi}, \qquad \Delta_\zeta^2(k) = A_s\left(\frac{k}{k_*}\right)^{n_s-1}
```

<div class="meaning">

<dl>
<dt>ζ</dt><dd>the "curvature perturbation": how much extra expansion a region got, which becomes its extra density. It stays fixed while the wave is bigger than the horizon</dd>
<dt>Δ<sub>ζ</sub>²(k)</dt><dd>the strength of the ripples for each size (k counts waves per unit length: small k = big ripples)</dd>
<dt>A<sub>s</sub></dt><dd>the measured strength, 2.1 × 10<sup>−9</sup> at k<sub>*</sub> = 0.05 per Mpc. Its square root, about 5 × 10<sup>−5</sup>, is the typical ζ</dd>
<dt>n<sub>s</sub></dt><dd>the tilt: 1 means every size equally strong. Planck: <b>0.965 ± 0.004</b></dd>
<dt>Physical meaning</dt><dd>Ripples of a few parts in 100,000 in the expansion become CMB temperature differences of about 1 in 100,000 (ΔT/T ≈ ζ/5 on large scales) and, after billions of years of gravity, galaxies.</dd>
</dl>

</div>

Why is n<sub>s</sub> a little below 1? As the inflaton rolls it slowly speeds up and H slowly falls, so ripples that froze later (the smaller ones) come out slightly weaker. A tilt like this was predicted in the early 1980s, long before it was measured.

<figure class="fig" data-fig="quantum-seeds-2"><figcaption>The strength of the primordial ripples against their size. Slide the tilt n<sub>s</sub>: at 1 the line is flat; Planck's 0.965 leans gently down towards small ripples.</figcaption></figure>

<div class="problem" data-problem="quantum-seeds-tilt"></div>

## 3. Four fingerprints, all checked

Inflation's simplest versions predict ripples that are:

1. **Nearly scale-invariant, with a red tilt.** Measured: n<sub>s</sub> = 0.965 ± 0.004 (Planck 2018), below 1 by about 8 standard deviations.
2. **Adiabatic.** One pattern for everything: where there is extra dark matter there are proportionally more atoms and photons too, because all came from the same delay in ending inflation. The positions of the acoustic peaks ([Lesson 7.5](/learn/courses/cosmology/acoustic-peaks/)) confirm it; other kinds of ripple are below a few percent.
3. **Gaussian.** Like the heights of many random waves added together: the bell curve. Planck's searches for departures (the "f<sub>NL</sub>" numbers) find none, to high precision.
4. **Bigger than the horizon.** Ripples already existed on scales wider than the horizon when the CMB was released. Only something like inflation can make them. In 2003 WMAP saw the tell-tale pattern: temperature and polarisation anti-correlated at angles of about 1° to 2°, exactly as super-horizon ripples predict.

<div class="problem" data-problem="quantum-seeds-efolds"></div>

## 4. Galaxies are quantum

Follow the chain: a quantum jitter far smaller than a proton is stretched by inflation into a region of slightly more expansion; after reheating it is a region of slightly higher density; it leaves a cool or warm spot in the CMB; gravity pulls more matter into it for billions of years ([Module 10](/learn/courses/cosmology/seeds-of-structure/)); it becomes a galaxy or a cluster of galaxies. The Milky Way's position was decided by quantum chance in the first 10<sup>−35</sup> seconds or so.

One open question: how did quantum possibilities become one definite, classical pattern of lumps? Cosmologists explain it with the enormous stretching and "decoherence" (contact with everything else makes quantum waves behave classically), but the details still prompt debate.

<div class="history">

**Predicted, then found.**

<ul class="timeline">
<li><b>1970-72</b> Edward Harrison, Yakov Zel'dovich, and Jim Peebles with Jer Yu, argue that the seeds of galaxies should be equally strong on all scales, with no theory for where they come from.</li>
<li><b>1981</b> Viatcheslav Mukhanov and Gennady Chibisov in Moscow calculate the quantum ripples in Starobinsky's model, including the slight tilt.</li>
<li><b>1982</b> At a workshop in Cambridge (UK), Hawking, Starobinsky, Guth and So-Young Pi, and Bardeen, Steinhardt and Turner work out the ripples of new inflation.</li>
<li><b>1992</b> COBE finds the ripples in the CMB.</li>
<li><b>2003</b> WMAP sees the super-horizon temperature-polarisation signal.</li>
<li><b>2013-18</b> Planck measures n<sub>s</sub> &lt; 1 with high confidence.</li>
</ul>

</div>

<div class="myth">

**"Quantum effects only matter for tiny things."** Normally true: quantum jitter is invisible in a football. Inflation is the exception: it took jitter on scales of 10<sup>−30</sup> m and stretched it to billions of light-years. The largest patterns in the sky are quantum in origin.

</div>

<div class="keypoints">

- Quantum jitter in the inflaton, about H/2π per Hubble time, is stretched beyond the horizon during inflation and freezes, biggest waves first.
- Regions where inflation ended slightly later got slightly more expansion: ζ ≈ Hδφ/φ̇, about 5 × 10<sup>−5</sup>, which became the CMB's 1-in-100,000 ripples and, through gravity, the galaxies.
- The ripples' strength by size is Δ² = A<sub>s</sub>(k/k<sub>*</sub>)<sup>n<sub>s</sub>−1</sup>, with A<sub>s</sub> ≈ 2.1 × 10<sup>−9</sup> and n<sub>s</sub> = 0.965 ± 0.004: a slight red tilt, as slow roll predicts.
- Confirmed fingerprints: nearly scale-invariant, adiabatic, Gaussian, and present on super-horizon scales (WMAP 2003).
- Mukhanov and Chibisov calculated the quantum origin in 1981; a 1982 Cambridge workshop completed it.

</div>
