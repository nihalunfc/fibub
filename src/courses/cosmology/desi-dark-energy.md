---
title: "DESI and new hints about dark energy"
seoTitle: "DESI results: is dark energy weakening? Explained"
summary: "DESI's galaxy maps, with the CMB and supernovae, hint that dark energy may be weakening. What it measured, what 2.8 to 4.2 sigma means, and why it is not proof."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "What do the DESI 2025 results combined with the CMB and supernovae suggest?"
    choices: ["w0 above −1 and wa below 0: dark energy that may be weakening today","Dark energy is exactly a cosmological constant, proven","Dark energy does not exist"]
    ans: 0
    why: "The best fits sit away from (−1, 0) by about 2.8 to 4.2 sigma, depending on which supernova sample is used. A hint that needs more data."
  - q: "What does DESI measure to learn about dark energy?"
    choices: ["The temperature of the CMB","The brightness of nearby stars","The baryon acoustic oscillation ruler in maps of millions of galaxies and quasars, giving distances and expansion rates at many redshifts"]
    ans: 2
    why: "The ruler, about 490 million light-years long today, is seen at different redshifts; its apparent size gives the expansion history."
  - q: "Why do physicists call the DESI result a hint and not a discovery?"
    choices: ["Because DESI is a small telescope","It is below the usual 5 sigma standard, and its strength depends on which supernova sample is used","Because nobody has checked the data"]
    ans: 1
    why: "3 to 4 sigma results have faded before. A signal that changes with the choice of supernovae could partly come from how those samples are calibrated."
sources:
  - "DESI Collaboration (2024), DESI 2024 VI: cosmological constraints from the measurements of baryon acoustic oscillations, arXiv:2404.03002 https://arxiv.org/abs/2404.03002"
  - "DESI Collaboration (2025), DESI DR2 results II: measurements of baryon acoustic oscillations and cosmological constraints, arXiv:2503.14738 https://arxiv.org/abs/2503.14738"
  - "Dark Energy Spectroscopic Instrument (DESI), Lawrence Berkeley National Laboratory https://www.desi.lbl.gov/"
  - "E. V. Linder (2003), Exploring the expansion history of the universe, Physical Review Letters 90, 091301 https://doi.org/10.1103/PhysRevLett.90.091301"
---

**Module 9 · about 15 minutes.** Read first: [9.4 The equation of state w](/learn/courses/cosmology/equation-of-state/). For 25 years every test agreed that dark energy behaves like Einstein's constant. Then, in April 2024, a new galaxy survey reported the first serious hint that it might be changing. By the end you will be able to read the DESI plot, say what the numbers mean, and explain why scientists are excited but careful.

<div class="bigidea">DESI measured the expansion history with a ruler printed into the galaxy distribution. Combined with other data, it slightly prefers dark energy that is fading today over a perfect constant. Not proof yet: a hint worth watching.</div>

## 1. What DESI is

The **Dark Energy Spectroscopic Instrument** sits on the 4-metre Mayall Telescope at Kitt Peak, Arizona. Five thousand small robots each point an optical fibre at one galaxy or quasar, rearranging themselves between exposures, so the instrument records 5,000 spectra at once and gets each object's redshift. It saw first light in 2019 and began its five-year survey in May 2021. Its first-year results (2024) used about 6 million galaxies and quasars; the three-year results (2025) nearly 15 million, reaching back about 11 billion years.

## 2. A ruler in the sky

In the young universe, sound waves rippled through the hot gas until it turned transparent (Lesson 7.5). They left a preferred spacing between lumps of matter, about 150 megaparsecs (roughly 490 million light-years) today: a slight excess of galaxy pairs at that separation. This is the **baryon acoustic oscillation** (BAO) scale, explored in [Lesson 10.7](/learn/courses/cosmology/baryon-acoustic-oscillations/).

Its true length is set by early physics, which the CMB pins down. So measuring how big it looks, across and along the line of sight, at each redshift gives the distance to that redshift and the expansion rate H(z) then. That is a direct map of the expansion history, the thing dark energy controls. Supernovae add precise *relative* distances at low redshift, and the CMB anchors the early universe.

## 3. The results

Fitting the two-number dark energy of Lesson 9.4, w(a) = w<sub>0</sub> + w<sub>a</sub>(1 − a), to DESI plus the CMB plus supernovae gives best fits with **w<sub>0</sub> above −1** and **w<sub>a</sub> below 0**:

<figure class="fig" data-fig="desi-dark-energy"><figcaption>The w₀-wₐ plane. The star is a cosmological constant. The crosses are the published best fits with ±1σ bars from DESI's 2025 analysis (DESI + CMB + one of three supernova samples); the real allowed regions are tilted ellipses, not shown. Move the circle to see what each point means for w over time.</figcaption></figure>

Read the picture in words: today dark energy would be a little weaker than a constant (w ≈ −0.7 to −0.85), and long ago it would have been **phantom-like**, w below −1, crossing −1 around redshift 0.4, roughly 4 billion years ago. Its density would have peaked then and be falling slowly now.

<div class="problem" data-problem="desi-dark-energy-w"></div>

How strongly do the data prefer this over a constant? It depends on which supernova sample is included:

<ul class="timeline">
<li><b>April 2024 (first year, arXiv 2404.03002):</b> 2.5σ with the Pantheon+ supernovae, 3.5σ with Union3, 3.9σ with DES-SN5YR.</li>
<li><b>March 2025 (three years, arXiv 2503.14738):</b> 2.8σ, 3.8σ and 4.2σ for the same three samples; DESI with the CMB alone, no supernovae, gives 3.1σ.</li>
</ul>

<div class="meaning">

<dl>
<dt>σ (sigma)</dt><dd>how many standard deviations the measurement sits from the expected value (here, a cosmological constant)</dd>
<dt>3σ</dt><dd>a fluke this big happens by chance about once in 370 tries</dd>
<dt>5σ</dt><dd>about once in 2 million tries (counting both directions): the usual standard for claiming a discovery</dd>
<dt>Physical meaning</dt><dd>Sigma measures luck, not mistakes. A small error in calibration that nobody has spotted can produce a large sigma that is not real.</dd>
</dl>

</div>

<div class="problem" data-problem="desi-dark-energy-crossing"></div>

## 4. Hint, not discovery

There are good reasons to be careful, and the DESI team says so itself:

- **Below 5σ.** Results at 3 to 4σ have gone away before in physics, as more data or better calibration arrived.
- **It moves with the supernovae.** The strength changes from 2.8σ to 4.2σ depending on which supernova sample is used. Some researchers have argued that part of the signal could come from how those samples are calibrated rather than from dark energy.
- **The two numbers are a shortcut.** w<sub>0</sub>-w<sub>a</sub> is a convenient description, not a theory. Crossing w = −1 is hard to produce with simple quintessence (Lesson 9.4), so if the signal is real, the physics may be more interesting than a single rolling field.
- **What comes next.** DESI's full five-year data, Euclid, the Vera C. Rubin Observatory and the Roman Space Telescope (Lesson 12.5) will measure the same history with different methods and different mistakes. If the hint grows past 5σ in all of them, it will be one of the biggest discoveries in physics since dark energy itself. If it fades, Λ survives another test.

<div class="history">

**A quick history of DESI.**

<ul class="timeline">
<li><b>2019</b> First light on the Mayall Telescope.</li>
<li><b>May 2021</b> The main five-year survey begins.</li>
<li><b>4 April 2024</b> First-year BAO results: the first hint of evolving dark energy.</li>
<li><b>19 March 2025</b> Three-year (DR2) results: the hint strengthens slightly.</li>
<li><b>2026 onwards</b> Full survey and an extension; Euclid and Rubin data arrive.</li>
</ul>

</div>

<div class="myth">

**"DESI proved that dark energy is fading and Einstein was wrong."** No. The best fits lean that way at 2.8 to 4.2σ, with the exact number depending on the supernova data used. That is a hint that could strengthen or vanish. Treat any headline that says "proved" with care; the numbers in this lesson may change as new results come in.

</div>

<div class="keypoints">

- DESI maps millions of galaxies and quasars (nearly 15 million by 2025) and measures the BAO ruler at many redshifts, giving the expansion history.
- Combined with the CMB and supernovae, it prefers w<sub>0</sub> &gt; −1 and w<sub>a</sub> &lt; 0: dark energy that was phantom-like long ago and is weakening today.
- The preference is 2.8σ to 4.2σ (2025), depending on the supernova sample; 3.1σ for DESI and CMB alone.
- 5σ is the discovery standard. This is a hint, not a discovery, and it may change.
- Euclid, Rubin, Roman and DESI's full survey will test it in the next few years.

</div>
