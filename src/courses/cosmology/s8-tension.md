---
title: "The S8 tension: is the universe too smooth?"
seoTitle: "What is the S8 tension? Is the universe too smooth?"
summary: "Weak lensing surveys found matter a few per cent less clumpy than the CMB predicts. What S8 measures, how lensing weighs it, and why the 2025 KiDS-Legacy result suggests the gap may be closing."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "What does σ8 describe?"
    choices: ["How lumpy matter is today: the typical density contrast in spheres of radius 8 h⁻¹ Mpc (roughly 12 Mpc)","The speed of sound in the early universe","The number of galaxies in the sky"]
    ans: 0
    why: "σ8 is the spread of matter density from place to place, smoothed over spheres of radius 8 h⁻¹ Mpc and worked out with linear theory. Bigger means lumpier."
  - q: "Why do weak lensing surveys quote S8 = σ8 √(Ωm/0.3) rather than σ8 alone?"
    choices: ["Because σ8 cannot be defined","Lensing responds to both the amount and the lumpiness of matter, so more matter that is less clumpy looks almost the same as less matter that is more clumpy; S8 is the combination it pins down","Because 0.3 is the age of the universe"]
    ans: 1
    why: "The constraints form a curved band in the Ωm-σ8 plane. S8 runs along that band and is measured to a few per cent."
  - q: "What did the KiDS-Legacy analysis (2025) find?"
    choices: ["S8 ≈ 0.5, a huge tension","S8 ≈ 0.815, in agreement with the Planck prediction, suggesting the earlier gap may have come from the data analysis rather than new physics","No lensing at all"]
    ans: 1
    why: "With more sky, better redshift calibration and improved methods, the final KiDS result moved up to within about 1σ of Planck. Other surveys are still finishing their final analyses."
sources:
  - "M. Asgari et al. (2021), KiDS-1000 cosmology: cosmic shear constraints and comparison between two point statistics, A&A 645, A104 https://doi.org/10.1051/0004-6361/202039070"
  - "C. Heymans et al. (2021), KiDS-1000 cosmology: multi-probe weak gravitational lensing and spectroscopic galaxy clustering constraints, A&A 646, A140 https://doi.org/10.1051/0004-6361/202039063"
  - "DES Collaboration (T. M. C. Abbott et al.) (2022), Dark Energy Survey Year 3 results: cosmological constraints from galaxy clustering and weak lensing, Physical Review D 105, 023520 https://doi.org/10.1103/PhysRevD.105.023520"
  - "R. Dalal et al. (2023), Hyper Suprime-Cam Year 3 results: cosmology from cosmic shear power spectra, Physical Review D 108, 123519 https://doi.org/10.1103/PhysRevD.108.123519"
  - "A. H. Wright et al. (2025), KiDS-Legacy: cosmological constraints from cosmic shear with the complete Kilo-Degree Survey, arXiv:2503.19441 https://arxiv.org/abs/2503.19441"
  - "V. Ghirardini et al. (2024), The SRG/eROSITA all-sky survey: cosmology constraints from cluster abundances in the western Galactic hemisphere, A&A 689, A298"
  - "A. Amon and G. Efstathiou (2022), A non-linear solution to the S8 tension?, MNRAS 516, 5355 https://doi.org/10.1093/mnras/stac2429"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
---

**Module 12 · about 15 minutes.** Read first: [12.2 The Hubble tension](/learn/courses/cosmology/hubble-tension/) and [3.8 Gravitational lensing](/learn/courses/cosmology/gravitational-lensing/). The Hubble tension is about how fast the universe expands. This one is about how lumpy it has become. The CMB, read with ΛCDM, predicts how much matter should have clumped by today; galaxy surveys can measure it. For several years the measured universe came out a little too smooth. By the end you will be able to say what S<sub>8</sub> is, how lensing measures it, and why the latest results suggest the puzzle may be easing.

<div class="bigidea">Gravity has had 13.8 billion years to pull the CMB's tiny ripples into a cosmic web. ΛCDM predicts how lumpy that web should be today. Weak lensing surveys found it a few per cent smoother, a 2 to 3 sigma gap; the newest analyses have mostly closed it.</div>

## 1. Measuring lumpiness

Imagine dropping a ball about 80 million light-years across at random places in the universe and weighing the matter inside each time. Sometimes you land in a cluster, sometimes in a void. The spread of the results, as a fraction of the average, measures how lumpy matter is. Cosmologists use spheres of radius 8 h<sup>−1</sup> Mpc (about 12 Mpc, or 39 million light-years; h = H<sub>0</sub>/100) and call the spread **σ<sub>8</sub>**. By convention it is worked out from the simple linear growth of ripples ([Lesson 10.2](/learn/courses/cosmology/gravitational-instability/)), so it is a clean number to compare with theory.

The CMB fixes the starting ripples (A<sub>s</sub>, n<sub>s</sub>) and the ingredients that make them grow. Planck 2018, with ΛCDM, predicts σ<sub>8</sub> = 0.811 ± 0.006 today. Galaxy surveys measure the lumps directly, and the most direct way to weigh *all* matter, dark included, is lensing.

## 2. Weak lensing weighs the web

Light from distant galaxies is bent by all the matter it passes ([Lesson 3.8](/learn/courses/cosmology/gravitational-lensing/)). Far from big clusters the effect is tiny: background galaxies are stretched by about 1%, which you could never see in one galaxy, since galaxies have all sorts of shapes. But neighbouring galaxies are stretched in the same direction. Average the shapes of millions of galaxies and the faint, coherent pattern appears: a map of the matter in front. This is **cosmic shear**.

Lensing has one blind spot. More matter that is less clumpy bends light almost exactly like less matter that is more clumpy. So lensing pins down a combination:

```math
S_8 = \sigma_8 \sqrt{\frac{\Omega_m}{0.3}}
```

<div class="meaning">

<dl>
<dt>σ<sub>8</sub></dt><dd>how lumpy matter is today (spread of density in 8 h<sup>−1</sup> Mpc spheres)</dd>
<dt>Ω<sub>m</sub></dt><dd>how much matter there is, as a share of the critical density</dd>
<dt>0.3</dt><dd>a reference value, chosen so S<sub>8</sub> ≈ σ<sub>8</sub> for typical universes</dd>
<dt>Physical meaning</dt><dd>The strength of the lensing signal grows with both the amount of matter and its lumpiness, roughly as σ<sub>8</sub>Ω<sub>m</sub><sup>0.5</sup>. S<sub>8</sub> is the combination lensing measures best. Planck's ΛCDM prediction is S<sub>8</sub> = 0.832 ± 0.013.</dd>
</dl>

</div>

<figure class="fig" data-fig="s8-tension-2"><figcaption>Top: the Ω<sub>m</sub>-σ<sub>8</sub> plane. Lensing pins a curved band (DES Y3 2022 and KiDS-Legacy 2025 shown, ±1σ); the CMB pins a small spot (Planck 2018). Move your point along a band: S<sub>8</sub> barely changes. Bottom: an illustrative patch of matter whose contrast follows your σ<sub>8</sub>.</figcaption></figure>

<div class="problem" data-problem="s8-tension-s8"></div>

## 3. The gap, and how it changed

Three big lensing surveys reported in 2021-2023: the **Kilo-Degree Survey** (KiDS, about 1,000 square degrees, from Chile), the **Dark Energy Survey** (DES, about 4,000 square degrees in its Year 3 analysis) and Japan's **Hyper Suprime-Cam** survey (HSC). All three came out lower than Planck, between 0.76 and 0.78: a 2 to 3σ tension, depending on the survey and method. Counts of galaxy clusters seen by Planck had pointed the same way since 2013.

Then the picture shifted. In 2025 the final **KiDS-Legacy** analysis, with the whole survey (about 1,350 square degrees), a much better calibration of the galaxies' redshifts and improved methods, found S<sub>8</sub> ≈ 0.815: within about 1σ of Planck. Lensing of the CMB itself, measured by Planck and the Atacama Cosmology Telescope, also agrees with Planck's prediction. And the eROSITA X-ray survey of galaxy clusters (2024) even came out slightly *higher*.

<figure class="fig" data-fig="s8-tension"><figcaption>Published S<sub>8</sub> values with ±1σ error bars: the CMB prediction (blue, shaded band), weak lensing surveys (orange) and galaxy clusters from eROSITA (pink). The gap that opened in 2021-2023 is much smaller in the 2025 KiDS-Legacy result.</figcaption></figure>

<div class="problem" data-problem="s8-tension-smoother"></div>

So, as of late 2025, the S<sub>8</sub> tension looks like it may be easing: the leading suspects are now the hard parts of the measurement rather than new physics. DES's final six-year analysis and the first results from Euclid and Rubin ([Lesson 12.5](/learn/courses/cosmology/new-surveys/)) will decide.

## 4. What could make the universe smoother?

If a real gap survives, these are the candidates, from most to least ordinary:

- **Hard measurement details.** Galaxy redshifts estimated from colours alone (photometric redshifts) can be biased; galaxies can line up with each other naturally (intrinsic alignments), mimicking a small part of the lensing signal. KiDS-Legacy's shift came largely from better redshifts.
- **Gas blown out of galaxies.** Feedback from supermassive black holes can push gas out of halos and smooth matter on small scales. Lensing is most sensitive to small scales, where this "baryonic feedback" matters most (Amon and Efstathiou, 2022). This is ordinary astrophysics, but hard to model.
- **Heavier neutrinos.** Fast neutrinos refuse to clump and smooth out small lumps. But the neutrino mass limits from DESI ([Lesson 12.1](/learn/courses/cosmology/lambda-cdm/)) leave little room.
- **New dark physics.** Dark matter that interacts weakly or slowly decays, or gravity that differs slightly on large scales.

The two tensions are linked. Early dark energy, the favourite fix for the Hubble tension, makes matter slightly *lumpier*, which would make an S<sub>8</sub> gap worse. A good new idea must fix one without breaking the other.

<div class="history">

**A decade of "slightly too smooth".**

<ul class="timeline">
<li><b>2013</b> Planck's counts of galaxy clusters come out lower than its own CMB predicts; the CFHTLenS lensing survey also points low.</li>
<li><b>2017</b> KiDS-450: about 2σ lower than Planck.</li>
<li><b>2021</b> KiDS-1000: S<sub>8</sub> = 0.759, about 3σ low.</li>
<li><b>2022</b> DES Year 3: 0.776 ± 0.017.</li>
<li><b>2023</b> HSC Year 3: 0.776; DES and KiDS combined: 0.790.</li>
<li><b>2025</b> KiDS-Legacy: 0.815, consistent with Planck.</li>
</ul>

</div>

<div class="myth">

**"A lower S<sub>8</sub> means there is less matter in the universe."** S<sub>8</sub> mixes two things: how much matter there is and how clumpy it is. A low S<sub>8</sub> could mean less matter, or the same matter spread more evenly. Other data (the CMB, BAO, supernovae) fix Ω<sub>m</sub> ≈ 0.31 separately, which is why the question becomes "is σ<sub>8</sub> too low?"

</div>

<div class="keypoints">

- σ<sub>8</sub> measures how lumpy matter is today; ΛCDM fitted to the CMB predicts 0.811, or S<sub>8</sub> = 0.832 ± 0.013.
- Weak lensing averages the tiny stretching of millions of galaxy shapes and measures S<sub>8</sub> = σ<sub>8</sub>√(Ω<sub>m</sub>/0.3).
- KiDS, DES and HSC (2021-2023) found 0.76 to 0.78, a 2 to 3σ tension.
- KiDS-Legacy (2025) found about 0.815, consistent with Planck; CMB lensing and eROSITA clusters agree with or exceed the prediction. The tension may be easing.
- Possible causes of any real gap: redshift and alignment systematics, gas blown out by black holes, heavier neutrinos, or new dark physics.

</div>
