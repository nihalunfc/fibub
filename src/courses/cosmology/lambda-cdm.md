---
title: "ΛCDM: the standard model of cosmology"
seoTitle: "What is Lambda-CDM? The standard model of cosmology"
summary: "Six numbers and a few assumptions describe the whole universe, from the first minutes to today's galaxy maps. What ΛCDM explains, what it assumes, and what it still cannot."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "What do the letters in ΛCDM stand for?"
    choices: ["Λ for dark energy as Einstein's cosmological constant, CDM for cold dark matter","Large Cosmic Dark Mass","Λ for light, CDM for the cosmic microwave background"]
    ans: 0
    why: "The name lists the two ingredients that make it different from the 1980s picture: a cosmological constant and slow-moving (cold) dark matter. Atoms, light and neutrinos are in it too."
  - q: "Which of these does ΛCDM NOT explain?"
    choices: ["The pattern of peaks in the CMB","The amount of deuterium made in the first minutes","What dark matter and dark energy actually are"]
    ans: 2
    why: "ΛCDM describes how dark matter and dark energy behave, with numbers that fit, but it says nothing about what they are made of. That is physics still to be found."
  - q: "Why do cosmologists trust a model with only six free numbers?"
    choices: ["Because it was voted on","Because nobody has tested it","Because six numbers, fitted to the CMB, then correctly predict many other measurements made in completely different ways"]
    ans: 2
    why: "The same six numbers predict galaxy clustering, lensing, supernova distances and the light elements. A fit that keeps predicting new data is a strong model; where it fails (Lessons 12.2 and 12.3) is where to look for new physics."
sources:
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "G. Efstathiou, W. J. Sutherland and S. J. Maddox (1990), The cosmological constant and cold dark matter, Nature 348, 705 https://doi.org/10.1038/348705a0"
  - "J. P. Ostriker and P. J. Steinhardt (1995), The observational case for a low-density Universe with a non-zero cosmological constant, Nature 377, 600 https://doi.org/10.1038/377600a0"
  - "P. Bull et al. (2016), Beyond ΛCDM: problems, solutions, and the road ahead, Physics of the Dark Universe 12, 56 https://doi.org/10.1016/j.dark.2016.02.001"
  - "E. Abdalla et al. (2022), Cosmology intertwined: a review of the particle physics, astrophysics, and cosmology associated with the cosmological tensions and anomalies, Journal of High Energy Astrophysics 34, 49 https://doi.org/10.1016/j.jheap.2022.04.002"
---

**Module 12 · about 16 minutes.** Read first: [7.8 Reading the universe's recipe from the CMB](/learn/courses/cosmology/universe-recipe/). You have now met every ingredient of the universe one at a time: atoms, light, neutrinos, dark matter, dark energy, and the first ripples. This lesson puts them together into one model, the one every cosmologist uses, and then looks honestly at where it creaks. By the end you will be able to say what each of its six numbers controls, list what the model explains and what it does not, and see where the rest of this module is heading.

<div class="bigidea">ΛCDM is a short recipe: general relativity, a smooth universe, six measured numbers and a handful of fixed assumptions. It explains almost everything we have measured about the universe as a whole, and it is silent on what its two biggest ingredients are.</div>

## 1. The model in one sentence

**ΛCDM** (say "lambda C D M") says: the universe obeys Einstein's general relativity ([Module 3](/learn/courses/cosmology/curved-spacetime/)); on large scales it is the same everywhere and in every direction ([Lesson 4.8](/learn/courses/cosmology/cosmological-principle/)); it is filled with radiation, three kinds of light neutrino, ordinary matter, cold dark matter and a cosmological constant Λ; space is flat; and it began hot and dense, with tiny ripples that were almost the same strength on every scale. Everything else follows from the Friedmann equation ([Lesson 5.2](/learn/courses/cosmology/friedmann-equation/)) with those contents:

```math
H^2(z) = H_0^2 \left[ \Omega_r (1+z)^4 + \Omega_m (1+z)^3 + \Omega_\Lambda \right]
```

<div class="meaning">

<dl>
<dt>H(z)</dt><dd>the expansion rate when the light we see at redshift z set out</dd>
<dt>Ω<sub>r</sub>, Ω<sub>m</sub>, Ω<sub>Λ</sub></dt><dd>today's shares of radiation (about 0.00009), matter (0.315: atoms plus dark matter) and dark energy (0.685); they add to 1 because space is flat</dd>
<dt>(1 + z)<sup>4</sup>, (1 + z)<sup>3</sup>, 1</dt><dd>how each thins out as space grows: radiation fastest, matter next, Λ not at all (<a href="/learn/courses/cosmology/matter-radiation-dark-energy/">Lesson 5.5</a>)</dd>
<dt>Physical meaning</dt><dd>One line holds the whole history: radiation ruled first, matter took over about 50,000 years in, and dark energy took over in the last few billion years. Each term wins in its own era.</dd>
</dl>

</div>

Think of it like a recipe card for a cake. The card names the ingredients and the oven (gravity). Six measured quantities on the card say how much of each and how lumpy the batter started. You cannot change the card to fit each new slice; the same card must produce every slice.

## 2. Six knobs, and what each one sets

The six numbers are the ones read from the CMB in [Lesson 7.8](/learn/courses/cosmology/universe-recipe/). Here the question is different: which measurements does each knob control? Pick a knob below. Lines show what it mainly sets, and the text says what happens when you turn it up.

<figure class="fig" data-fig="lambda-cdm"><figcaption>The six knobs of ΛCDM (Planck 2018 values) and the measurements each one mainly controls. Tap a knob or a button. To turn the knobs and watch a universe change, use the <a href="/learn/courses/cosmology/build-a-universe/">universe builder from Lesson 5.10</a>.</figcaption></figure>

Notice two things. Most measurements depend on more than one knob, which is why many kinds of data are needed to untangle them. And H<sub>0</sub>, the age and Ω<sub>Λ</sub> are not knobs at all: in flat ΛCDM they are worked out from the six. That is why the Hubble tension ([Lesson 12.2](/learn/courses/cosmology/hubble-tension/)) is a test of the whole model and not just a disagreement about one number.

Some things are fixed by assumption rather than measured: space is exactly flat, dark energy is exactly constant (w = −1), there are three kinds of neutrino with a total mass of about 0.06 eV, and there are no gravitational waves from inflation. Each of these can be freed up and tested. So far, every one is consistent with the data, though two are under pressure (section 4).

<div class="problem" data-problem="lambda-cdm-photons"></div>

## 3. The story ΛCDM tells

Press play to run the whole history of the universe on one axis. The time axis is logarithmic: each tick is a factor of a trillion in time, so the first second gets as much room as the last 13.8 billion years.

<div class="steps" data-fig="lambda-cdm-2">
<div class="step">Inflation (Module 11): in a tiny fraction of a second, space grows enormously and quantum jitters are stretched into the seeds of every galaxy. ΛCDM does not include inflation itself; it starts from the ripples inflation leaves behind (Aₛ and nₛ).</div>
<div class="step">The first second and the first three minutes (Module 6): quarks become protons and neutrons, neutrinos let go, and nucleosynthesis makes hydrogen, helium and a little deuterium and lithium. The amount depends on Ω<sub>b</sub>h², one of the six knobs.</div>
<div class="step">Matter overtakes radiation at about 50,000 years; at 380,000 years atoms form and the light goes free as the CMB (Modules 6 and 7). Its peaks fix most of the six numbers.</div>
<div class="step">The dark ages and cosmic dawn (Lessons 10.5 and 12.7): no stars for about 100 million years. Then the first stars switch on and, by about a billion years, their light has ionised the gas between galaxies again (the knob τ).</div>
<div class="step">Dark matter's gravity pulls the ripples into a cosmic web of halos, filaments and voids; galaxies form inside the halos (Modules 8 and 10). How lumpy it gets is σ₈, worked out from the knobs.</div>
<div class="step">In the last few billion years dark energy takes over and the expansion speeds up (Module 9). Today: 13.8 billion years, 2.7 K, and astronomers asking whether the recipe is complete.</div>
</div>

The scorecard is remarkable. With the same six numbers, ΛCDM matches: the CMB's temperature and polarisation patterns down to tiny angles; the amounts of deuterium and helium made in the first minutes ([Lesson 6.6](/learn/courses/cosmology/big-bang-nucleosynthesis/)); the BAO ruler in galaxy maps at many distances ([Lesson 10.7](/learn/courses/cosmology/baryon-acoustic-oscillations/)); the supernova distances that revealed acceleration ([Lesson 9.1](/learn/courses/cosmology/accelerating-universe/)); the bending of the CMB's light by matter along the way; the ages of the oldest stars (younger than 13.8 billion years, as they must be); and the overall look of the cosmic web in computer simulations ([Lesson 10.9](/learn/courses/cosmology/cosmological-simulations/)).

<div class="problem" data-problem="lambda-cdm-neutrinos"></div>

## 4. What it does not explain

A good model is clear about its limits. ΛCDM's are big:

- **What dark matter is.** It is 85% of all matter and behaves exactly as the model needs, but no laboratory has caught a particle ([Lesson 8.8](/learn/courses/cosmology/dark-matter-today/)).
- **What dark energy is**, and why its density is so small: the vacuum-energy puzzle, off by a huge factor ([Lesson 9.3](/learn/courses/cosmology/vacuum-energy/)). DESI's 2024-2025 hint that dark energy may be weakening would mean it is not a constant at all ([Lesson 9.6](/learn/courses/cosmology/desi-dark-energy/)).
- **Where the first ripples came from.** Inflation is the favourite explanation, but it is an extra layer, not part of ΛCDM ([Lesson 11.2](/learn/courses/cosmology/cosmic-inflation/)).
- **Why there is matter at all** and almost no antimatter ([Lesson 11.5](/learn/courses/cosmology/matter-antimatter/)).
- **Loose ends**: too little lithium-7 in old stars compared with the prediction ([Lesson 6.7](/learn/courses/cosmology/lithium-problem/)); puzzles on the scale of small galaxies; and a few odd features on the largest angles of the CMB, each a 2 to 3 sigma oddity that may be chance.
- **Neutrino mass.** Experiments on Earth show the three masses add up to at least about 0.06 eV. DESI's 2025 data, with the CMB, put the upper limit at about 0.064 eV: uncomfortably close, and a squeeze worth watching.
- **The tensions.** The expansion rate measured nearby is about 8% faster than ΛCDM predicts from the CMB ([Lesson 12.2](/learn/courses/cosmology/hubble-tension/)), and for some years matter looked a little smoother than predicted ([Lesson 12.3](/learn/courses/cosmology/s8-tension/)).

The rest of this module is about these cracks and the instruments built to widen or close them: JWST's early galaxies (12.4), the giant surveys Euclid, Rubin and Roman (12.5), gravitational-wave sirens (12.6) and radio maps of the dark ages (12.7).

<div class="history">

**How the model got its name.**

<ul class="timeline">
<li><b>1980s</b> The favourite model is matter only, mostly cold dark matter, with Ω<sub>m</sub> = 1 ("standard CDM").</li>
<li><b>1990</b> Efstathiou, Sutherland and Maddox show galaxy clustering fits better with a cosmological constant: an early ΛCDM.</li>
<li><b>1995</b> Ostriker and Steinhardt make the case for a "concordance" universe, about one third matter and two thirds Λ.</li>
<li><b>1998</b> Supernovae show the expansion is speeding up (<a href="/learn/courses/cosmology/accelerating-universe/">Lesson 9.1</a>): Λ is real.</li>
<li><b>2003</b> WMAP turns the CMB into a precision tool; six numbers fit it.</li>
<li><b>2013-2018</b> Planck pins most of the six to better than 1%.</li>
<li><b>2020s</b> Tensions and the DESI hint: is the recipe complete?</li>
</ul>

</div>

<div class="myth">

**"With enough free numbers you can fit anything, so ΛCDM proves nothing."** ΛCDM has only six, fitted to one kind of data, the CMB. With those six fixed, it then predicted measurements nobody had made yet: the BAO bump in galaxy maps (found in 2005), the detailed polarisation pattern of the CMB, and how much the CMB's light is bent by lensing. Models with many knobs cannot do that. This is also why the tensions matter: a model that predicts this much can be caught out.

</div>

<div class="keypoints">

- ΛCDM = general relativity + a smooth universe + radiation, neutrinos, atoms, cold dark matter and a cosmological constant, in flat space, starting from nearly scale-free ripples.
- Six numbers (Ω<sub>b</sub>h², Ω<sub>c</sub>h², θ<sub>*</sub>, τ, A<sub>s</sub>, n<sub>s</sub>) fix it; H<sub>0</sub> = 67.4, the age 13.8 billion years and Ω<sub>Λ</sub> = 0.685 are worked out from them.
- It explains the CMB, the light elements, BAO, supernova distances, lensing and the cosmic web with one set of numbers.
- It does not explain what dark matter and dark energy are, where the ripples came from, or why matter beat antimatter.
- Its cracks: the Hubble tension, the S₈ question, the DESI dark-energy hint, lithium, and a tight squeeze on neutrino mass.

</div>
