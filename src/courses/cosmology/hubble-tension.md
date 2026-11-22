---
title: "The Hubble tension"
seoTitle: "What is the Hubble tension? 67 vs 73 explained"
summary: "The early universe says the expansion rate is 67.4 km/s/Mpc; the local distance ladder says 73. The measurements, the checks with JWST, the proposed fixes, and why nobody knows yet."
minutes: 17
updated: 2026-11-22
quiz:
  - q: "Planck gives H0 = 67.4 ± 0.5 and SH0ES gives 73.04 ± 1.04 km/s/Mpc. Roughly how many sigma apart are they?"
    choices: ["About 5","About 1","About 50"]
    ans: 0
    why: "The gap is 5.6; the combined uncertainty is √(0.5² + 1.04²) ≈ 1.15. 5.6 ÷ 1.15 ≈ 4.9, close to physicists' 5 sigma bar."
  - q: "What did JWST's sharp images of Cepheids in supernova host galaxies show?"
    choices: ["The Cepheids were all in the wrong galaxies","The Hubble constant is exactly 67.4","The Hubble Space Telescope's Cepheid measurements were not spoiled by crowding from nearby stars, so that explanation for the tension failed"]
    ans: 2
    why: "Crowding was a favourite suspect: blurred neighbours could make Cepheids look brighter. JWST's sharper infrared view gave the same answers (Riess et al. 2024)."
  - q: "Why do many proposed fixes change the universe before recombination?"
    choices: ["Because the early universe is easy to change","Because nothing happened after recombination","A smaller sound horizon, seen at the CMB's fixed angle, means a closer CMB and so a higher H0, without spoiling later data much"]
    ans: 2
    why: "The CMB measures an angle very precisely. Shrink the ruler by 7 to 8% and the inferred H0 rises to about 73. The hard part is doing that without upsetting everything else."
sources:
  - "A. G. Riess et al. (2022), A comprehensive measurement of the local value of the Hubble constant with 1 km/s/Mpc uncertainty from the Hubble Space Telescope and the SH0ES team, ApJL 934, L7 https://doi.org/10.3847/2041-8213/ac5c5b"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "A. G. Riess et al. (2024), JWST observations reject unrecognized crowding of Cepheid photometry as an explanation for the Hubble tension at 8σ confidence, ApJL 962, L17 https://doi.org/10.3847/2041-8213/ad1ddd"
  - "W. L. Freedman et al. (2019), The Carnegie-Chicago Hubble Program. VIII. An independent determination of the Hubble constant based on the tip of the red giant branch, ApJ 882, 34 https://doi.org/10.3847/1538-4357/ab2f73"
  - "W. L. Freedman et al. (2025), Status report on the Chicago-Carnegie Hubble Program (CCHP): measurement of the Hubble constant using the Hubble and James Webb Space Telescopes, arXiv:2408.06153 https://arxiv.org/abs/2408.06153"
  - "K. C. Wong et al. (2020), H0LiCOW XIII. A 2.4% measurement of H0 from lensed quasars, MNRAS 498, 1420 https://doi.org/10.1093/mnras/stz3094"
  - "D. W. Pesce et al. (2020), The Megamaser Cosmology Project. XIII. Combined Hubble constant constraints, ApJL 891, L1 https://doi.org/10.3847/2041-8213/ab75f0"
  - "L. Verde, T. Treu and A. G. Riess (2019), Tensions between the early and late Universe, Nature Astronomy 3, 891 https://doi.org/10.1038/s41550-019-0902-0"
  - "V. Poulin, T. L. Smith, T. Karwal and M. Kamionkowski (2019), Early dark energy can resolve the Hubble tension, PRL 122, 221301 https://doi.org/10.1103/PhysRevLett.122.221301"
  - "E. Di Valentino et al. (2021), In the realm of the Hubble tension: a review of solutions, Classical and Quantum Gravity 38, 153001 https://doi.org/10.1088/1361-6382/ac086d"
---

**Module 12 · about 17 minutes.** Read first: [12.1 ΛCDM](/learn/courses/cosmology/lambda-cdm/) and [2.6 The cosmic distance ladder](/learn/courses/cosmology/distance-ladder/). You met the Hubble tension briefly in [Lesson 4.2](/learn/courses/cosmology/hubble-law/). Here is the full story: the two ways of measuring the expansion rate, every serious check made so far, and the ideas for new physics. By the end you will be able to read the measurement chart, work out how many sigma apart two results are, and explain why the favourite fixes act before the CMB was released.

<div class="bigidea">Measure the universe's expansion rate today from nearby galaxies and you get about 73 km/s/Mpc. Predict it from the infant universe with ΛCDM and you get 67.4. Both sides have been checked and checked again. Either a subtle mistake hides somewhere, or the standard model is missing something.</div>

## 1. Two roads to one number

H<sub>0</sub>, the Hubble constant, is today's expansion rate: how many km/s faster a galaxy recedes for every megaparsec of distance ([Lesson 4.2](/learn/courses/cosmology/hubble-law/)). There are two very different ways to get it.

**The late-universe road: measure it.** Build a distance ladder ([Lesson 2.6](/learn/courses/cosmology/distance-ladder/)). Geometry (parallax, an eclipsing binary in the Large Magellanic Cloud, the maser disc in NGC 4258) sets the distances to nearby Cepheid stars ([Cepheids in the astronomy course](/learn/courses/astronomy/variable-stars/)). Cepheids in galaxies that also hosted a Type Ia supernova calibrate the supernovae ([Lesson 2.4](/learn/courses/cosmology/type-ia-supernovae/)). Supernovae far out in the smooth Hubble flow then give H<sub>0</sub> directly, as speed ÷ distance.

**The early-universe road: predict it.** Fit ΛCDM's six numbers to the CMB ([Lesson 7.8](/learn/courses/cosmology/universe-recipe/)). The sound horizon is a ruler of known size; the CMB shows its angle; together they give the distance to the CMB, and the model turns that into today's expansion rate. This is sometimes called the *inverse* distance ladder: it starts at the far end, 13.8 billion years ago, and works forwards.

It is like two people timing a train. One stands by the track with a stopwatch. The other knows when the train left and its timetable, and works out when it should pass. If they disagree, either a stopwatch is wrong or the train did something the timetable did not say.

## 2. The numbers

The SH0ES team (Riess and colleagues, 2022) used 42 supernovae in galaxies with Cepheids and found **73.04 ± 1.04** km/s/Mpc. Planck's 2018 analysis gives **67.4 ± 0.5**. Below are these and other published results. Pick any two to see how far apart they are.

<figure class="fig" data-fig="hubble-tension"><figcaption>Published H₀ measurements with ±1σ error bars. Blue: predicted from the early universe with ΛCDM (CMB, or BAO with Big Bang nucleosynthesis). Orange: local measurements (Cepheids, red giants, masers, lensed quasars, a gravitational-wave siren). Each is labelled with its year. Choose two to see the gap in sigma.</figcaption></figure>

How far apart is "far apart"? Divide the difference by the combined uncertainty:

```math
n_\sigma = \frac{|H_A - H_B|}{\sqrt{\sigma_A^2 + \sigma_B^2}} = \frac{73.04 - 67.4}{\sqrt{1.04^2 + 0.5^2}} \approx 4.9
```

<div class="meaning">

<dl>
<dt>H<sub>A</sub>, H<sub>B</sub></dt><dd>the two measured values</dd>
<dt>σ<sub>A</sub>, σ<sub>B</sub></dt><dd>their 1σ uncertainties; independent errors add "in quadrature" (squares add), so the combined error is smaller than their plain sum</dd>
<dt>n<sub>σ</sub></dt><dd>how many combined standard deviations separate them. 3σ happens by luck about 1 time in 370; 5σ about 1 time in 1.7 million</dd>
<dt>Physical meaning</dt><dd>At about 5σ, bad luck is no longer a believable explanation. Something real separates the two numbers: an unnoticed error in one method, or physics missing from ΛCDM.</dd>
</dl>

</div>

<div class="problem" data-problem="hubble-tension-sigma"></div>

## 3. Is it a mistake?

The first suspect is always a measurement error. The ladder has been attacked rung by rung:

- **Crowding.** In distant galaxies a Cepheid's light blends with neighbours, which could make it look brighter. In 2023-2024 the SH0ES team observed Cepheids in supernova host galaxies with JWST, whose infrared images are much sharper. The answers matched Hubble's (Riess et al. 2024): crowding is not the explanation.
- **Different stars.** Wendy Freedman's CCHP team built ladders from different stars: the tip of the red giant branch (TRGB, the brightest red giants, which all reach the same peak brightness) and J-region asymptotic giant branch stars (JAGB). Their 2019 TRGB result was 69.8 ± 1.9; their 2024-2025 analysis with JWST gives about 70.4 ± 1.9. That sits between the two sides and agrees with both. The two teams still disagree about why their numbers differ (mainly which supernovae are used and how they are calibrated). As of late 2025 this debate is unsettled.
- **No ladder at all.** Lensed quasars (light taking several paths around a galaxy and arriving at different times; [Lesson 3.8](/learn/courses/cosmology/gravitational-lensing/)) gave 73.3 (H0LiCOW, 2020), but a reanalysis with fewer assumptions about the lens galaxies' mass gave 67.4 with errors big enough to agree with anything (TDCOSMO, 2020). Water masers in orbiting gas discs give 73.9 ± 3.0. One gravitational-wave siren gave 70 (+12, −8) ([Lesson 12.6](/learn/courses/cosmology/standard-sirens/)).

The early side has its own checks. Ground-based CMB telescopes agree with Planck. And galaxy maps (the BAO ruler) combined with the deuterium made in the first minutes give about 68.5, using at most one number from the CMB (its peak spacing), not its detailed ripple pattern.

So the honest summary, as of late 2025: the Cepheid ladder has survived every check thrown at it; some other local methods land in between; and the early-universe side is solid if ΛCDM is right.

## 4. If it is real: what could change?

You cannot simply speed up the universe recently. Galaxy maps and supernovae pin down the *shape* of the expansion history from about 10 billion years ago to today, so a late change would have to hide from them. That pushes most ideas to the other end: change the physics **before** recombination so that the sound horizon is smaller. The CMB measures the ruler's angle to 0.03%; a shorter ruler at the same angle must be closer, and a closer CMB means faster expansion.

<figure class="fig" data-fig="hubble-tension-2"><figcaption>Shrink the sound horizon and see where H₀ lands. The CMB's measured angle stays fixed, so a smaller ruler must be closer, which means a higher H₀. Toy scaling: H₀ × r<sub>d</sub> held at the Planck values.</figcaption></figure>

<div class="problem" data-problem="hubble-tension-ruler"></div>

Candidates include **early dark energy** (an extra field that briefly adds energy around 50,000 years after the start, then fades away), extra light particles ("dark radiation"), and a slightly different electron mass at early times. Each can raise H<sub>0</sub> towards 70-72, but each pays somewhere: early dark energy, for instance, makes matter slightly lumpier, which worsens the S<sub>8</sub> puzzle of [Lesson 12.3](/learn/courses/cosmology/s8-tension/). No fix has become the consensus.

What would settle it? More Cepheids, red giants and supernovae observed with JWST; better parallaxes from the Gaia satellite; lensed supernovae with measured delays (see the [SN Eos discovery](/blog/discoveries/sn-eos-lensed-supernova-macs-j1931/)); dozens of standard sirens; and the next CMB experiments. You can explore how H<sub>0</sub> changes distances and ages yourself with fibub's [cosmology calculator](/science/cosmology-calculator/).

<div class="history">

**From a factor of two to 8%.**

<ul class="timeline">
<li><b>1929</b> Hubble's first value: about 500 km/s/Mpc, wrong by a factor of 7.</li>
<li><b>1970s-1990s</b> The 50 versus 100 argument (Sandage against de Vaucouleurs).</li>
<li><b>2001</b> Hubble Space Telescope Key Project: 72 ± 8.</li>
<li><b>2013</b> Planck's first results point lower, about 67-68.</li>
<li><b>2016-2019</b> SH0ES tightens to about 73-74; the gap grows past 4σ.</li>
<li><b>2022</b> SH0ES: 73.04 ± 1.04, about 5σ from Planck.</li>
<li><b>2024</b> JWST Cepheids confirm Hubble's photometry; CCHP with JWST finds about 70.</li>
</ul>

</div>

<div class="myth">

**"The Hubble tension means the Big Bang theory is wrong."** Both sides assume an expanding universe that began hot and dense about 13 to 14 billion years ago. With H<sub>0</sub> = 73 instead of 67.4 (and the same matter content), the universe would be about a billion years younger: still far older than its oldest stars. The tension is about a missing detail in the recipe, not about the cake.

</div>

<div class="keypoints">

- Early universe + ΛCDM: H<sub>0</sub> = 67.4 ± 0.5 km/s/Mpc (Planck 2018). Local Cepheid ladder: 73.04 ± 1.04 (SH0ES 2022). The gap is about 5σ.
- JWST confirmed Hubble's Cepheid measurements, so crowding is not the cause.
- Red-giant ladders (CCHP) give about 70, between the two; lenses, masers and sirens are not yet precise enough to decide.
- Most proposed fixes shrink the sound horizon before recombination (for example early dark energy); none is accepted, and each causes problems elsewhere.
- As of late 2025: unresolved. Either a hidden error, or new physics.

</div>
