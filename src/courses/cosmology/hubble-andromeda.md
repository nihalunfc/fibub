---
title: Hubble proves Andromeda is another galaxy
seoTitle: How Hubble measured the distance to Andromeda
summary: 'In 1923 Edwin Hubble found a Cepheid star in the Andromeda nebula and used it to measure its distance. Follow his measurement step by step, and see why his answer was too small.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: What did Hubble need to measure about the Cepheid in Andromeda?
    choices: ['Its pulsing period and how bright it looks', 'Its colour and size', 'Its parallax']
    ans: 0
    why: The period gives the true brightness through Leavitt's law; comparing it with the apparent brightness gives the distance.
  - q: A Cepheid with a longer period is...
    choices: ['more powerful', 'less powerful', 'the same power, just slower']
    ans: 0
    why: Leavitt's law: the longer the period, the more luminous the Cepheid.
  - q: Why was Hubble's 1925 distance to Andromeda (about 900,000 light-years) too small?
    choices: ['The calibration of Cepheids was off: there are two types, and he used the wrong one''s brightness', 'Andromeda has moved away since then', 'His telescope was out of focus']
    ans: 0
    why: In 1952 Walter Baade showed there are two kinds of Cepheids with different brightnesses. Correcting for that roughly doubled the distances to galaxies.
sources:
  - 'E. P. Hubble (1925), Cepheids in spiral nebulae, Publications of the American Astronomical Society 5, 261'
  - 'H. S. Leavitt and E. C. Pickering (1912), Periods of 25 variable stars in the Small Magellanic Cloud, Harvard College Observatory Circular 173'
  - 'W. Baade (1956), The period-luminosity relation of the Cepheids, PASP 68, 5'
  - 'Astronomy course on fibub: variable stars and Leavitt''s law https://fibub.com/learn/courses/astronomy/variable-stars/'
---

**Module 2 · about 15 minutes.** By the end you will be able to follow Hubble's measurement of the distance to Andromeda, use a period-luminosity rule to find a galaxy's distance yourself, and explain why the first answer was too small.

<div class="bigidea">One pulsing star, photographed night after night on glass plates, turned the Milky Way from "the universe" into one galaxy among billions.</div>

## 1. The star on plate H335H

On the night of 5-6 October 1923, Edwin Hubble took a long photograph of the Andromeda nebula with the 2.5-metre Hooker telescope on Mount Wilson, California. He marked three spots he thought were new stars (novae) with an "N". Comparing with older plates, he found that one of them was not a nova at all: it brightened and faded again and again. He crossed out the "N" and wrote "VAR!", for variable.

It was a **Cepheid**, a type of pulsing giant star. Henrietta Leavitt had discovered in 1912 that a Cepheid's period reveals its true power. The physics of why Cepheids pulse and how Leavitt found her law is in the [Astronomy course](/learn/courses/astronomy/variable-stars/). Here we follow how Hubble used it.

## 2. The measurement, step by step

<div class="steps" data-fig="cepheid-distance">
<div class="step"><p><b>Watch the star.</b> Night after night, measure how bright it looks. A Cepheid brightens quickly, then fades slowly, over and over. (The curve here is made up, but shaped like a real Cepheid's.)</p></div>
<div class="step"><p><b>Time one cycle.</b> From peak to peak takes about 31 days. Hubble's star had a period of 31.4 days.</p></div>
<div class="step"><p><b>Use Leavitt's law.</b> Slower Cepheids are more powerful. A 31-day Cepheid has an absolute magnitude of about −5.3: about 10,000 times the Sun's power.</p></div>
<div class="step"><p><b>Compare.</b> It looks like magnitude 19.2, very faint. The difference m − M ≈ 24.5 means it is about 790,000 parsecs, or 2.6 million light-years away. (Hubble's own calibration gave about 900,000 light-years; see section 3.)</p></div>
</div>

```math
M = -2.4\,(\log_{10} P - 1) - 4.1
```

<div class="meaning">

<dl>
<dt>P</dt><dd>the pulse period in days</dd>
<dt>log₁₀ P</dt><dd>the power of ten of the period: 1 for 10 days, 2 for 100 days</dd>
<dt>M</dt><dd>the true brightness as an absolute magnitude (more negative is more powerful)</dd>
<dt>−2.4</dt><dd>the slope: each tenfold longer period makes the star 2.4 magnitudes (about 9 times) more powerful</dd>
</dl>

This is a rounded modern version of the rule in visible light. The real calibration is one of the most carefully studied numbers in astronomy, because the whole distance scale of the universe hangs on it.

</div>

<div class="problem" data-problem="cepheid-distance"></div>

## 3. Why the first answer was too small

Hubble announced his result on 1 January 1925: Andromeda was about 900,000 light-years away, far beyond Shapley's giant Milky Way. The Great Debate (Lesson 1.7) was over.

But his number was too small by more than half. In 1952 Walter Baade, using the new 5-metre Palomar telescope, found that there are **two types of Cepheids**. The ones used to calibrate Leavitt's law (in star clusters of our own galaxy) are a fainter type than the ones in Andromeda's spiral arms. Correcting for this made Andromeda, and every other galaxy, about twice as far away. Overnight, the universe doubled in size.

<div class="meaning">

**Systematic errors.** Hubble's measurement was careful; his random errors were small. His mistake was a **systematic error**: something wrong with the method itself that shifts every answer the same way. Systematic errors are the cosmologist's worst enemy, because repeating the measurement doesn't reveal them. Lesson 12.2 shows that the biggest argument in cosmology today, the Hubble tension, may be partly about exactly this.

</div>

<div class="history">

**Henrietta Swan Leavitt (1868-1921)** worked as a "computer" at Harvard College Observatory, measuring stars on photographic plates for 30 cents an hour. Studying 1,777 variable stars in the Magellanic Clouds, she noticed that brighter Cepheids pulsed more slowly. Because all the stars in each Cloud are at about the same distance, brighter-looking meant truly more powerful. Her law became the first great yardstick of the universe. Hubble said she deserved a Nobel Prize; she died before she could be nominated.

</div>

<div class="myth">

**"Andromeda is moving away like other galaxies."** It is one of the few galaxies moving **towards** us, at about 110 km/s, because it and the Milky Way are bound together by gravity. They are expected to merge in several billion years (recent studies give it roughly even odds within 10 billion years).

</div>

<div class="keypoints">

- In 1923 Hubble found a Cepheid in the Andromeda nebula on a photographic plate.
- Its period (31.4 days) gave its true power through Leavitt's law; comparing with its faintness gave the distance.
- His 1925 result, about 900,000 light-years, proved Andromeda is a separate galaxy.
- A systematic error (two types of Cepheids, found in 1952) meant the true distance is about 2.5 million light-years.

</div>
