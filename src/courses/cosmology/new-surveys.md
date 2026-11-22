---
title: "Euclid, Rubin and Roman: the next maps"
seoTitle: "Euclid, Rubin and Roman telescopes: what they will map"
summary: "Three new survey machines will map billions of galaxies: ESA's Euclid in space, the Vera C. Rubin Observatory in Chile and NASA's Roman telescope. What each measures and why cosmology needs all three."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "Why do weak lensing surveys need so many galaxies?"
    choices: ["Each galaxy's own shape varies by about 25%, while lensing stretches it by only about 1%, so millions of shapes must be averaged","Because most galaxies are fake","To count every galaxy in the universe"]
    ans: 0
    why: "Random shapes average out as 1/√N. To beat a 25% scatter down to well below 1%, you need thousands of galaxies per patch of sky, and billions over the whole survey."
  - q: "What makes the Vera C. Rubin Observatory different from Euclid?"
    choices: ["It is in space","It only observes the Moon","It is a large ground telescope that photographs the whole southern sky every few nights for ten years, going very deep and catching things that change"]
    ans: 2
    why: "Rubin's 8.4 m mirror and 3.2-gigapixel camera trade the sharpness of space for depth, colour and time. Euclid is sharper and sees infrared from space, but cannot revisit as often."
  - q: "Why build three surveys that measure similar things?"
    choices: ["Because countries could not agree","Because each telescope only works for a year","They use different instruments with different hidden errors; if they agree, the result is trustworthy, and combining them breaks degeneracies"]
    ans: 2
    why: "The S8 and dark energy puzzles hinge on per-cent-level systematics. Cross-checking space and ground, optical and infrared, is the best defence."
sources:
  - "Euclid Collaboration (Y. Mellier et al.) (2025), Euclid. I. Overview of the Euclid mission, A&A 697, A1, arXiv:2405.13491 https://arxiv.org/abs/2405.13491"
  - "R. Laureijs et al. (2011), Euclid Definition Study Report, arXiv:1110.3193 https://arxiv.org/abs/1110.3193"
  - "Ž. Ivezić et al. (2019), LSST: from science drivers to reference design and anticipated data products, ApJ 873, 111 https://doi.org/10.3847/1538-4357/ab042c"
  - "D. Spergel et al. (2015), Wide-Field InfrarRed Survey Telescope-Astrophysics Focused Telescope Assets WFIRST-AFTA 2015 Report, arXiv:1503.03757 https://arxiv.org/abs/1503.03757"
  - "ESA, Euclid mission pages https://www.esa.int/Science_Exploration/Space_Science/Euclid"
  - "NSF-DOE Vera C. Rubin Observatory https://rubinobservatory.org/"
  - "NASA, Nancy Grace Roman Space Telescope https://science.nasa.gov/mission/roman-space-telescope/"
---

**Module 12 · about 15 minutes.** Read first: [10.8 Mapping millions of galaxies](/learn/courses/cosmology/galaxy-surveys/), which tells the story of SDSS, BOSS and DESI. This lesson is about the next generation, now starting: ESA's Euclid satellite, the Vera C. Rubin Observatory on a Chilean mountain, and NASA's Nancy Grace Roman Space Telescope. By the end you will be able to say what each one adds, why they are built to overlap, and roughly how much sky, how many galaxies and how much data are involved.

<div class="bigidea">The open questions of Lessons 12.1 to 12.3 hinge on per-cent-level measurements of how the universe expanded and how its lumps grew. Three new machines will map billions of galaxies in complementary ways, each able to catch the others' mistakes.</div>

## 1. What is left to measure

The tensions and the DESI hint ([Lesson 9.6](/learn/courses/cosmology/desi-dark-energy/)) come down to two histories: how fast space expanded at each time, and how fast matter clumped. Different physics changes them differently. If dark energy varies, the expansion history shifts. If gravity is not quite Einstein's, or neutrinos are heavier, the growth of lumps shifts while the expansion barely does. So surveys measure both:

- **Positions and redshifts** of galaxies give the BAO ruler at each distance ([Lesson 10.7](/learn/courses/cosmology/baryon-acoustic-oscillations/)) and, from the way galaxies fall towards clusters, the growth rate.
- **Shapes** of galaxies give weak lensing ([Lesson 12.3](/learn/courses/cosmology/s8-tension/)): the total amount and lumpiness of matter, dark included.
- **Supernovae** and **galaxy clusters** add distances and the number of the biggest lumps.

Lensing is a game of averages. Galaxies come in all shapes, with a random spread of about 25% in how stretched they look; lensing adds only about 1%:

```math
\sigma_\text{shear} \approx \frac{\sigma_e}{\sqrt{N}}
```

<div class="meaning">

<dl>
<dt>σ<sub>e</sub></dt><dd>the natural scatter of galaxy shapes, about 0.25 to 0.3</dd>
<dt>N</dt><dd>the number of galaxies averaged in a patch of sky</dd>
<dt>σ<sub>shear</sub></dt><dd>how precisely the lensing stretch in that patch is known</dd>
<dt>Physical meaning</dt><dd>To measure a 1% stretch to 10% accuracy, you need σ<sub>shear</sub> ≈ 0.001, so N ≈ (0.26/0.001)² ≈ 70,000 galaxies. Precision grows only as the square root of the number of galaxies: hence billions of them.</dd>
</dl>

</div>

## 2. Euclid: sharp shapes from space

**Euclid**, from the European Space Agency, launched on 1 July 2023 and works from 1.5 million km away, like JWST. Its 1.2-metre telescope feeds a visible-light camera of about 600 megapixels, built to measure galaxy shapes sharply, and a near-infrared instrument that takes pictures and spectra. Over about six years it is imaging roughly 14,000 square degrees, a third of the sky, measuring the shapes of more than a billion galaxies and the redshifts of tens of millions.

In space there is no air to blur the shapes, which is exactly what lensing needs. In March 2025 Euclid released its first "quick" data (Q1): 63 square degrees, already with millions of galaxies. Its first full data release for cosmology was planned for late 2026.

## 3. Rubin: the whole southern sky, again and again

The **Vera C. Rubin Observatory**, on Cerro Pachón in Chile, is named after Vera Rubin, whose galaxy rotation curves made the case for dark matter ([Lesson 8.2](/learn/courses/cosmology/rotation-curves/)). It has an 8.4-metre mirror and the largest digital camera ever built for astronomy: 3.2 billion pixels, each image covering the area of about 45 full Moons. It released its "First Look" images on 23 June 2025, and its ten-year **Legacy Survey of Space and Time (LSST)** was due to begin in late 2025.

Every few nights Rubin photographs the whole sky visible from Chile, in six colours, for ten years. Stacked, the images go deeper than any wide survey before, reaching about 20 billion galaxies. Repeating them catches everything that changes: millions of supernovae (distances, [Lesson 2.4](/learn/courses/cosmology/type-ia-supernovae/)), variable stars (one early study is in [this discovery](/blog/discoveries/mira-period-luminosity-rubin-zy-ngc-6822-distance/)), asteroids, and lensed quasars that flicker with time delays (H<sub>0</sub>, [Lesson 12.2](/learn/courses/cosmology/hubble-tension/)).

<div class="problem" data-problem="new-surveys-data"></div>

## 4. Roman: Hubble's sharpness, a hundred times the view

NASA's **Nancy Grace Roman Space Telescope** is named after NASA's first chief astronomer, often called the "mother of Hubble". It has a 2.4-metre mirror, the same size as Hubble's, but its 300-megapixel infrared camera sees an area about 100 times larger in each picture. Its surveys will map galaxies' shapes and redshifts deep in the infrared, and find thousands of distant Type Ia supernovae, out to times when the universe was a few billion years old: a direct test of whether dark energy changes. NASA's commitment was to launch by May 2027, with the team working towards a launch as early as autumn 2026; as of late 2025 it was built and in final testing, so check NASA's page for its current status.

## 5. Better together

<figure class="fig" data-fig="new-surveys"><figcaption>Sky surveys compared. Area of sky against depth (how faint, and so how far, they reach), with approximate headline numbers; and when each runs. Rubin's ten-year survey is both wide and deep. Dates after 2025 are plans.</figcaption></figure>

The three are designed to overlap on purpose. Euclid's sharp space images calibrate Rubin's shapes; Rubin's six colours give Euclid's galaxies better redshift estimates; Roman goes deeper in the infrared over a smaller area. Teams already plan joint analyses. Around them, other projects fill in: spectroscopic surveys (DESI's extension, 4MOST in Chile, PFS in Hawaii), NASA's **SPHEREx** (launched March 2025, mapping the whole sky in 102 colours to test inflation), China's planned **Xuntian** space telescope, the **Square Kilometre Array** in radio ([Lesson 12.7](/learn/courses/cosmology/dark-ages-21cm/)) and new CMB telescopes.

<div class="problem" data-problem="new-surveys-galaxies"></div>

<div class="history">

**From photographic plates to petabytes.**

<ul class="timeline">
<li><b>2000</b> SDSS starts the first big digital sky survey.</li>
<li><b>2013</b> The Dark Energy Survey begins; KiDS and HSC follow.</li>
<li><b>2021</b> DESI begins its five-year survey.</li>
<li><b>2023</b> Euclid launches on 1 July.</li>
<li><b>2025</b> Euclid Q1 data (March); SPHEREx launches (March); Rubin's First Look (June); LSST due to start.</li>
<li><b>2026-2027</b> Euclid's first cosmology release (planned); Roman's launch (planned, by May 2027).</li>
</ul>

</div>

<div class="myth">

**"Three surveys measuring the same thing is a waste of money."** The puzzles in this module are a few per cent in size, the same size as the subtle errors in each instrument: blurring by air, colour-based redshift mistakes, detector quirks. Two instruments with different weaknesses that agree are far more convincing than one twice as big. The S<sub>8</sub> story ([Lesson 12.3](/learn/courses/cosmology/s8-tension/)) shows why: the gap moved when the redshift calibration improved.

</div>

<div class="keypoints">

- Surveys measure two histories, expansion (BAO, supernovae) and growth (lensing, galaxy motions), to test dark energy, gravity and neutrinos.
- Euclid (ESA, launched 1 July 2023): sharp shapes from space over about 14,000 square degrees; Q1 data March 2025.
- Rubin (Chile, First Look June 2025): 8.4 m mirror, 3.2-gigapixel camera, the southern sky every few nights for ten years, about 20 billion galaxies.
- Roman (NASA, launch planned by May 2027, possibly from autumn 2026): Hubble-sharp infrared images over 100 times the area; distant supernovae.
- They are built to overlap so that each can catch the others' hidden errors.

</div>
