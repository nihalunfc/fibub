---
title: 'The cosmic distance ladder: how every rung holds up the next'
seoTitle: 'The cosmic distance ladder explained simply'
summary: 'From radar in the Solar System to supernovae billions of light-years away: how each distance method is calibrated by the one below, how the errors stack up, and why it matters for the age of the universe.'
minutes: 13
updated: 2026-11-22
quiz:
  - q: Why is it called a "ladder"?
    choices: ["Because telescopes are stacked on top of each other","Each method is calibrated using distances from the method below it","Because the distances go up in equal steps"]
    ans: 1
    why: Parallax calibrates Cepheids, Cepheids calibrate supernovae, and so on. Each rung rests on the one beneath.
  - q: Three rungs have errors of 1%, 1% and 3%. Roughly what is the total?
    choices: ["About 3.3%","5%","1%"]
    ans: 0
    why: Independent errors add in quadrature, √(1 + 1 + 9) ≈ 3.3%. The biggest error dominates.
  - q: Why does a 1% error in distances matter to cosmology?
    choices: ["It does not matter at all","It changes the speed of light","It becomes about a 1% error in the expansion rate and the age of the universe"]
    ans: 2
    why: The Hubble constant is speed divided by distance, so every percent of distance error passes straight into it, and into the age worked out from it.
sources:
  - 'Gaia Collaboration (2023), Gaia Data Release 3: summary of the content and survey properties, A&A 674, A1 https://doi.org/10.1051/0004-6361/202243940'
  - 'W. L. Freedman and B. F. Madore (2010), The Hubble constant, Annual Review of Astronomy and Astrophysics 48, 673 https://doi.org/10.1146/annurev-astro-082708-101829'
  - 'NASA Science: Measuring the universe (distance ladder) https://science.nasa.gov/universe/'
---

**Module 2 · about 13 minutes.** By the end you will be able to name the main rungs of the cosmic distance ladder, say what each one is calibrated by, and work out how errors add up as you climb.

<div class="bigidea">No single method can measure the whole universe. So astronomers chain methods together, each one checked against the one below, like rungs of a ladder.</div>

## 1. The rungs

Every distance in this module rests on the one before it. Here is the chain, from close to far:

<ul class="timeline">
<li><b>Radar and spacecraft</b> (minutes to hours of light): bounce radio off Venus, time signals from probes. This fixes the size of Earth's orbit, the astronomical unit, to better than a metre.</li>
<li><b>Parallax</b> (up to tens of thousands of light-years): the yearly wobble of nearby stars as Earth goes round the Sun. Explained in the <a href="/learn/courses/astronomy/parallax/">Astronomy course</a>. The Gaia spacecraft measured over a billion stars this way.</li>
<li><b>Cepheids and red giants</b> (up to about 100 million light-years): <a href="/learn/courses/astronomy/variable-stars/">Cepheid variables</a> and the "tip of the red giant branch" (the brightest red giants have a fixed top brightness). Calibrated with parallax in our own galaxy and with the maser galaxy NGC 4258.</li>
<li><b>Type Ia supernovae and galaxy spin</b> (up to billions of light-years): calibrated in galaxies where Cepheids or red giants have been measured.</li>
<li><b>The Hubble flow</b>: far enough out, the expansion of the universe itself carries galaxies away with speed proportional to distance (Module 4).</li>
</ul>

<figure class="fig" data-fig="distance-ladder"><figcaption>The rungs of the distance ladder on a scale from the Solar System to billions of light-years. Each rung overlaps the next, which is what lets one calibrate the other. Move the sliders to see how each rung's error feeds into the final answer.</figcaption></figure>

## 2. Errors climb the ladder too

Any mistake in a low rung is carried up to every rung above it. If the parallax distances were all 2% too big, the Cepheids would be calibrated 2% too bright, the supernovae too, and every far distance would be 2% off.

When the errors are independent (one has nothing to do with the other), they do not simply add. They add **in quadrature**: square them, add them, take the square root.

```math
\sigma_{\text{total}} = \sqrt{\sigma_1^{2} + \sigma_2^{2} + \sigma_3^{2}}
```

<div class="meaning">

<dl>
<dt>σ (sigma)</dt><dd>the uncertainty of each rung, as a percentage</dd>
<dt>Physical meaning</dt><dd>Independent errors partly cancel, so the total is less than the plain sum. But the largest error dominates: halving a small one barely helps, halving the biggest one helps a lot.</dd>
</dl>

</div>

<div class="problem" data-problem="ladder-error"></div>

## 3. Why it matters

The distance ladder's last job is to measure **the Hubble constant**: how fast the universe is expanding today. That number sets the scale and age of the whole universe. A 1% distance error is a 1% error in the expansion rate and in the age.

Today the ladder gives an expansion rate of about 73 km/s per megaparsec. A completely different method, reading the early universe from the cosmic microwave background (Module 7), predicts about 67-68. The gap is larger than either side's stated errors. Either a rung has a hidden problem, or our picture of the universe is missing something. That puzzle, the **Hubble tension**, is one of the biggest open questions in cosmology (Lesson 12.2).

<div class="myth">

**"Astronomers just guess the distances to galaxies."** Every far distance is tied, step by checked step, back to radar timing in the Solar System and geometry of nearby stars. The ladder is tested by overlapping rungs and by independent checks such as masers and lens delays (Lesson 2.5).

</div>

<div class="history">

**When the ladder broke.** In 1929 Hubble's distances were too small by a factor of about 7, because two kinds of Cepheid had been mixed up and some "stars" were really glowing gas clouds. His universe came out about 2 billion years old, younger than the Earth's rocks. Walter Baade fixed the Cepheid mix-up in 1952, and the universe roughly doubled in size overnight.

</div>

<div class="keypoints">

- The distance ladder chains methods: radar, parallax, Cepheids and red giants, supernovae and galaxy spin, then the Hubble flow.
- Each rung is calibrated by the rung below, so errors are carried upwards.
- Independent errors add in quadrature, and the biggest one dominates.
- The ladder measures today's expansion rate, about 73 km/s per megaparsec, which disagrees with the early-universe value: the Hubble tension.

</div>
